import { useCallback, useRef, useState } from 'react'
import { Chess } from 'chess.js'
import type { Opening, OpeningNode } from './types'
import { OPENINGS } from './index'
import { masteredCount, pickRandomUnmastered, recordAttempt } from './progress'

interface WrongMove {
  from: string
  to: string
  expectedUcis: string[]
}

interface TrainerState {
  opening: Opening
  currentNode: OpeningNode
  wrongMove: WrongMove | null
  lastExplanation: string
  drillMode: boolean
  hintActive: boolean
  /** leaf node id being drilled toward (used to pick engine branches in drill mode) */
  targetLeafId: string | null
  /** whether user made a wrong move during the current attempt */
  hadWrongMove: boolean
}

export interface UseOpeningTrainerReturn {
  opening: Opening
  fen: string
  userToMove: boolean
  currentNode: OpeningNode
  wrongMove: WrongMove | null
  lastExplanation: string
  drillMode: boolean
  hintActive: boolean
  /** destination squares the user may legally play (for hint rendering) */
  correctToSquares: string[]
  /** mastered / total for progress bar */
  progressFraction: { mastered: number; total: number }
  /** dests map for Board component — only book moves allowed */
  dests: Map<string, string[]>
  /** which color the user plays */
  userColor: 'white' | 'black'
  orientation: 'white' | 'black'
  lastMove: [string, string] | null
  selectOpening: (id: string) => void
  tryUserMove: (uci: string) => 'correct' | 'wrong'
  tryAgain: () => void
  showHint: () => void
  setDrillMode: (b: boolean) => void
  goToLine: (leafId: string) => void
}

/** Find the path from root to the node with the given id */
function findPath(root: OpeningNode, targetId: string): OpeningNode[] | null {
  if (root.id === targetId) return [root]
  for (const child of root.children) {
    const sub = findPath(child, targetId)
    if (sub) return [root, ...sub]
  }
  return null
}

/**
 * Build the dests map for Chessground from a list of book children.
 * Only exposes book moves — non-book squares are not draggable.
 */
function buildDests(children: OpeningNode[]): Map<string, string[]> {
  const map = new Map<string, string[]>()
  for (const child of children) {
    if (!child.uci) continue
    const from = child.uci.slice(0, 2)
    const to = child.uci.slice(2, 4)
    const existing = map.get(from) ?? []
    if (!existing.includes(to)) {
      map.set(from, [...existing, to])
    }
  }
  return map
}

/** Pick the engine's next child, respecting the target leaf path in drill mode */
function pickEngineChild(
  node: OpeningNode,
  targetLeafId: string | null,
): OpeningNode | null {
  if (node.children.length === 0) return null
  if (targetLeafId) {
    for (const child of node.children) {
      if (findPath(child, targetLeafId)) return child
    }
  }
  return node.children[Math.floor(Math.random() * node.children.length)] ?? null
}

/**
 * After landing on a node, if the next move belongs to the engine (non-user side),
 * automatically play through engine moves until it's the user's turn or a leaf is reached.
 * Returns the new TrainerState (without setting React state — caller does that).
 */
function advanceEngine(
  node: OpeningNode,
  chess: Chess,
  opening: Opening,
  targetLeafId: string | null,
  hadWrongMove: boolean,
  drillMode: boolean,
  lastMoveRef: React.MutableRefObject<[string, string] | null>,
): TrainerState {
  const userIsWhite = opening.userColor! === 'white'
  const currentTurnIsWhite = chess.turn() === 'w'
  const isUserTurn = userIsWhite === currentTurnIsWhite

  if (node.children.length === 0) {
    // Reached a leaf — record attempt
    recordAttempt(opening.id, node.id, !hadWrongMove)
    return {
      opening,
      currentNode: node,
      wrongMove: null,
      lastExplanation: node.explanation,
      drillMode: false, // auto-exit drill mode when leaf reached
      hintActive: false,
      targetLeafId: null,
      hadWrongMove: false,
    }
  }

  if (isUserTurn) {
    return {
      opening,
      currentNode: node,
      wrongMove: null,
      lastExplanation: node.explanation,
      drillMode,
      hintActive: false,
      targetLeafId,
      hadWrongMove,
    }
  }

  // Engine turn — pick and play a move
  const engineChild = pickEngineChild(node, targetLeafId)
  if (!engineChild) {
    return {
      opening,
      currentNode: node,
      wrongMove: null,
      lastExplanation: node.explanation,
      drillMode,
      hintActive: false,
      targetLeafId,
      hadWrongMove,
    }
  }

  chess.move(engineChild.san)
  lastMoveRef.current = [engineChild.uci.slice(0, 2), engineChild.uci.slice(2, 4)]

  return advanceEngine(engineChild, chess, opening, targetLeafId, hadWrongMove, drillMode, lastMoveRef)
}

function makeInitialChess(opening: Opening): Chess {
  const c = new Chess()
  c.load(opening.startFen!)
  return c
}

export function useOpeningTrainer(): UseOpeningTrainerReturn {
  const firstOpening = OPENINGS[0]!
  const chessRef = useRef<Chess>(makeInitialChess(firstOpening))
  const lastMoveRef = useRef<[string, string] | null>(null)
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [state, setState] = useState<TrainerState>(() => {
    // If engine goes first (user is black), advance engine from root
    return advanceEngine(
      firstOpening.root,
      chessRef.current,
      firstOpening,
      null,
      false,
      false,
      lastMoveRef,
    )
  })

  const selectOpening = useCallback((id: string) => {
    const opening = OPENINGS.find(o => o.id === id)
    if (!opening) return
    const c = makeInitialChess(opening)
    chessRef.current = c
    lastMoveRef.current = null
    const targetLeaf = state.drillMode ? pickRandomUnmastered(opening) : null
    const next = advanceEngine(
      opening.root!,
      c,
      opening,
      targetLeaf?.id ?? null,
      false,
      state.drillMode,
      lastMoveRef,
    )
    setState(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.drillMode])

  const tryUserMove = useCallback((uci: string): 'correct' | 'wrong' => {
    const { currentNode, opening, targetLeafId, hadWrongMove, drillMode } = state
    const matchingChild = currentNode.children.find(c => c.uci === uci)
    if (!matchingChild) {
      setState(prev => ({
        ...prev,
        wrongMove: {
          from: uci.slice(0, 2),
          to: uci.slice(2, 4),
          expectedUcis: currentNode.children.map(c => c.uci),
        },
        hadWrongMove: true,
      }))
      return 'wrong'
    }

    chessRef.current.move(matchingChild.san)
    lastMoveRef.current = [uci.slice(0, 2), uci.slice(2, 4)]

    const next = advanceEngine(
      matchingChild,
      chessRef.current,
      opening,
      targetLeafId,
      hadWrongMove,
      drillMode,
      lastMoveRef,
    )
    setState(next)
    return 'correct'
  }, [state])

  const tryAgain = useCallback(() => {
    const { opening, drillMode } = state
    const c = makeInitialChess(opening)
    chessRef.current = c
    lastMoveRef.current = null
    const targetLeaf = drillMode ? pickRandomUnmastered(opening) : null
    const next = advanceEngine(
      opening.root!,
      c,
      opening,
      targetLeaf?.id ?? null,
      false,
      drillMode,
      lastMoveRef,
    )
    setState(next)
  }, [state])

  const showHint = useCallback(() => {
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current)
    setState(prev => ({ ...prev, hintActive: true }))
    hintTimerRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, hintActive: false }))
    }, 1500)
  }, [])

  const setDrillMode = useCallback((b: boolean) => {
    const { opening } = state
    const targetLeaf = b ? pickRandomUnmastered(opening) : null
    setState(prev => ({ ...prev, drillMode: b, targetLeafId: targetLeaf?.id ?? null }))
  }, [state])

  const goToLine = useCallback((leafId: string) => {
    const { opening } = state
    const c = makeInitialChess(opening)
    chessRef.current = c
    lastMoveRef.current = null
    const next = advanceEngine(opening.root, c, opening, leafId, false, true, lastMoveRef)
    setState({ ...next, drillMode: true, targetLeafId: leafId })
  }, [state])

  // Derived values
  const chess = chessRef.current
  const fen = chess.fen()
  const userIsWhite = state.opening.userColor! === 'white'
  const currentTurnIsWhite = chess.turn() === 'w'
  const userToMove = userIsWhite === currentTurnIsWhite

  const dests = userToMove
    ? buildDests(state.currentNode.children)
    : new Map<string, string[]>()

  const correctToSquares = state.currentNode.children.map(c => c.uci.slice(2, 4))
  const progressFraction = masteredCount(state.opening)

  return {
    opening: state.opening,
    fen,
    userToMove,
    currentNode: state.currentNode,
    wrongMove: state.wrongMove,
    lastExplanation: state.lastExplanation,
    drillMode: state.drillMode,
    hintActive: state.hintActive,
    correctToSquares,
    progressFraction,
    dests,
    userColor: state.opening.userColor!,
    orientation: state.opening.userColor!,
    lastMove: lastMoveRef.current,
    selectOpening,
    tryUserMove,
    tryAgain,
    showHint,
    setDrillMode,
    goToLine,
  }
}
