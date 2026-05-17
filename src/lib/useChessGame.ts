import { useEffect, useMemo, useRef, useState } from 'react'
import { Chess, type Move, type Square } from 'chess.js'
import { loadGame, saveGame, clearGame, type PersistedGame } from '@/lib/storage'

type Color = 'white' | 'black'
type Promotion = 'q' | 'r' | 'b' | 'n'

interface MoveInput {
  from: Square
  to: Square
  promotion?: Promotion
}

export interface UseChessGameResult {
  fen: string
  turn: 'w' | 'b'
  history: Move[]
  lastMove: [Square, Square] | null
  dests: Map<Square, Square[]>
  inCheck: boolean
  isGameOver: boolean
  gameResult: 'white' | 'black' | 'draw' | null
  orientation: Color
  pgn: string
  makeMove: (move: MoveInput) => Move | null
  undo: (plies?: number) => void
  reset: () => void
  loadPgn: (pgn: string) => boolean
  loadFen: (fen: string) => boolean
  setOrientation: (color: Color) => void
}

function computeDests(chess: Chess): Map<Square, Square[]> {
  const dests = new Map<Square, Square[]>()
  const moves = chess.moves({ verbose: true })
  for (const m of moves) {
    const existing = dests.get(m.from)
    if (existing) {
      existing.push(m.to)
    } else {
      dests.set(m.from, [m.to])
    }
  }
  return dests
}

function computeResult(chess: Chess): 'white' | 'black' | 'draw' | null {
  if (!chess.isGameOver()) return null
  if (chess.isCheckmate()) {
    // The side to move is checkmated; the other side wins.
    return chess.turn() === 'w' ? 'black' : 'white'
  }
  return 'draw'
}

export function useChessGame(): UseChessGameResult {
  const chessRef = useRef<Chess>(new Chess())
  const [orientation, setOrientationState] = useState<Color>('white')
  const [version, setVersion] = useState(0)
  const hydratedRef = useRef(false)

  // Hydrate from localStorage on mount.
  useEffect(() => {
    if (hydratedRef.current) return
    hydratedRef.current = true
    const stored = loadGame()
    if (!stored) return
    try {
      chessRef.current.loadPgn(stored.pgn)
      setOrientationState(stored.orientation)
      setVersion((v) => v + 1)
    } catch {
      // Corrupt PGN — fall back to a fresh board.
    }
  }, [])

  const persist = (nextOrientation: Color = orientation): void => {
    const snapshot: PersistedGame = {
      pgn: chessRef.current.pgn(),
      orientation: nextOrientation,
    }
    saveGame(snapshot)
  }

  const bump = (): void => setVersion((v) => v + 1)

  const makeMove = (move: MoveInput): Move | null => {
    const chess = chessRef.current
    // Promotion default: 'q'. chess.js accepts an unused promotion arg
    // for non-promoting moves, so always passing it is safe.
    const promotion: Promotion = move.promotion ?? 'q'
    try {
      const result = chess.move({ from: move.from, to: move.to, promotion })
      if (!result) return null
      persist()
      bump()
      return result
    } catch {
      return null
    }
  }

  const undo = (plies: number = 1): void => {
    const chess = chessRef.current
    for (let i = 0; i < plies; i++) {
      const undone = chess.undo()
      if (!undone) break
    }
    persist()
    bump()
  }

  const reset = (): void => {
    chessRef.current.reset()
    clearGame()
    bump()
  }

  const loadPgn = (pgn: string): boolean => {
    try {
      chessRef.current.loadPgn(pgn)
      persist()
      bump()
      return true
    } catch {
      return false
    }
  }

  const loadFen = (fen: string): boolean => {
    try {
      chessRef.current.load(fen)
      persist()
      bump()
      return true
    } catch {
      return false
    }
  }

  const setOrientation = (color: Color): void => {
    setOrientationState(color)
    persist(color)
  }

  // Derived values — recomputed each time `version` changes.
  const derived = useMemo(() => {
    const chess = chessRef.current
    const history = chess.history({ verbose: true })
    const last = history[history.length - 1]
    const lastMove: [Square, Square] | null = last ? [last.from, last.to] : null
    return {
      fen: chess.fen(),
      turn: chess.turn(),
      history,
      lastMove,
      dests: computeDests(chess),
      inCheck: chess.isCheck(),
      isGameOver: chess.isGameOver(),
      gameResult: computeResult(chess),
      pgn: chess.pgn(),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version])

  return {
    ...derived,
    orientation,
    makeMove,
    undo,
    reset,
    loadPgn,
    loadFen,
    setOrientation,
  }
}
