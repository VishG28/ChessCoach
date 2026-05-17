import { useEffect, useRef, useState } from 'react'
import type { Color, Square } from 'chess.js'
import { useLocation } from 'react-router-dom'
import { Board } from '@/components/board/Board'
import { CoachPanel } from '@/components/coaching/CoachPanel'
import {
  LeftSidebar,
  type CoachMode,
  type UserColor,
} from '@/components/sidebar/LeftSidebar'
import { RightSidebar } from '@/components/sidebar/RightSidebar'
import { DebugOverlay } from '@/components/debug/DebugOverlay'
import { useCoach } from '@/coaching/useCoach'
import { useEngine, parseUciMove } from '@/engine/engine'
import { useChessGame } from '@/lib/useChessGame'
import {
  depthFromElo,
  movetimeFromElo,
  randomnessFromElo,
  useMultiPV,
} from '@/engine/eloCurves'
import type { TopCandidate } from '@/engine/types'
import { useGameLogger } from '@/games/useGameLogger'

const DEFAULT_ELO = 800
const DEFAULT_COACH_MODE: CoachMode = 'warnings'
const DEFAULT_USER_COLOR: UserColor = 'white'

function resolveUserColor(choice: UserColor): 'white' | 'black' {
  if (choice === 'random') return Math.random() < 0.5 ? 'white' : 'black'
  return choice
}

function weightedPick<T>(items: T[], weights: number[]): T {
  const total = weights.slice(0, items.length).reduce((a, b) => a + b, 0)
  let r = Math.random() * total
  for (let i = 0; i < items.length; i++) {
    r -= weights[i] ?? 0
    if (r <= 0) return items[i]
  }
  return items[items.length - 1]
}

export function PlayPage() {
  const game = useChessGame()
  const { engine, ready } = useEngine()
  const location = useLocation()

  const [elo, setElo] = useState(DEFAULT_ELO)
  const [colorChoice, setColorChoice] = useState<UserColor>(DEFAULT_USER_COLOR)
  const [coachMode, setCoachMode] = useState<CoachMode>(DEFAULT_COACH_MODE)
  const [debugOpen, setDebugOpen] = useState(false)

  const userColor: Color = game.orientation === 'white' ? 'w' : 'b'

  // Handle "Play from here" redirects from GameReviewPage
  const fromFenAppliedRef = useRef(false)
  useEffect(() => {
    if (fromFenAppliedRef.current) return
    const params = new URLSearchParams(location.search)
    const fromFen = params.get('from')
    const engineColorParam = params.get('engineColor')
    if (!fromFen) return
    fromFenAppliedRef.current = true
    game.loadFen(fromFen)
    if (engineColorParam === 'w') {
      // Engine is white => user plays black
      game.setOrientation('black')
    } else if (engineColorParam === 'b') {
      // Engine is black => user plays white
      game.setOrientation('white')
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Backtick key toggles debug overlay (ignored when typing in inputs)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== '`') return
      const target = e.target as HTMLElement | null
      if (
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable
      ) {
        return
      }
      setDebugOpen((v) => !v)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Push strength to the engine whenever it changes (and once on ready).
  useEffect(() => {
    if (!engine || !ready) return
    void engine.setStrength(elo)
  }, [engine, ready, elo])

  // Coach reads game + engine and produces threats/captures/blunder alerts.
  const coach = useCoach({
    game,
    engine,
    engineReady: ready,
    mode: coachMode,
    userColor,
    evalDepth: 10,
  })

  // Log every move to persistent game storage with background analysis
  useGameLogger({
    game,
    engineElo: elo,
    userColor: userColor === 'w' ? 'white' : 'black',
    coachMode,
    coachMessage: coach.blunderAlert
      ? { ply: game.history.length, text: `Blunder: ${coach.blunderAlert.san} lost ${coach.blunderAlert.loss}cp. Engine prefers ${coach.blunderAlert.better}.` }
      : null,
  })

  // Engine plays the opposite color. Use a request-id ref to discard stale
  // bestmoves if the position changes (takeback, new game) mid-search.
  const engineRequestIdRef = useRef(0)
  useEffect(() => {
    if (!engine || !ready) return
    if (game.isGameOver) return
    const engineColor: Color = userColor === 'w' ? 'b' : 'w'
    if (game.turn !== engineColor) return

    const requestId = ++engineRequestIdRef.current
    const depth = depthFromElo(elo)
    const movetime = movetimeFromElo(elo)
    const multipvEnabled = useMultiPV(elo)
    const multipv = multipvEnabled ? 5 : 1
    const randomness = randomnessFromElo(elo)

    void (async () => {
      try {
        const move = await engine.requestMove({
          fen: game.fen,
          depth,
          movetime,
          multipv,
        })
        if (engineRequestIdRef.current !== requestId) return

        let chosen = move

        // Apply weighted-random candidate selection at low Elo
        if (
          multipvEnabled &&
          move.topCandidates &&
          move.topCandidates.length > 1 &&
          Math.random() < randomness
        ) {
          const cands = move.topCandidates.slice(0, 5) as TopCandidate[]
          const weights = [5, 4, 3, 2, 1].slice(0, cands.length)
          const pick = weightedPick(cands, weights)
          chosen = parseUciMove(pick.move)
        }

        game.makeMove({
          from: chosen.from as Square,
          to: chosen.to as Square,
          promotion: chosen.promotion,
        })

        // Record SAN for the debug overlay after the move is applied
        const lastEntry = game.history[game.history.length - 1]
        const uciStr = `${chosen.from}${chosen.to}${chosen.promotion ?? ''}`
        if (lastEntry && engine) {
          engine.recordEngineMoveSan(uciStr, lastEntry.san)
        }
      } catch {
        // Engine disposed mid-request, or transport error. Silent fail —
        // the position will retry on the next render cycle.
      }
    })()
    // `game` is intentionally omitted: it's a new object every render and
    // including it would loop. The fields we read (fen/turn/isGameOver) are
    // in deps; makeMove is stable in behavior even though its identity isn't.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine, ready, game.fen, game.turn, game.isGameOver, userColor, elo])

  const handleUserMove = (
    from: string,
    to: string,
    promotion?: 'q' | 'r' | 'b' | 'n',
  ): void => {
    game.makeMove({
      from: from as Square,
      to: to as Square,
      promotion,
    })
  }

  const handleNewGame = (): void => {
    engineRequestIdRef.current++ // invalidate any in-flight engine move
    coach.dismissAlert()
    const next = resolveUserColor(colorChoice)
    game.setOrientation(next)
    game.reset()
  }

  const handleTakeBack = (): void => {
    if (game.history.length === 0) return
    engineRequestIdRef.current++ // invalidate any in-flight engine move
    coach.dismissAlert()
    // If it's currently the user's turn, the last ply was the engine's reply
    // to the user's blunder; undo both. If it's the engine's turn, only the
    // user's most recent move has been played; undo just that.
    const pliesToUndo = game.turn === userColor ? 2 : 1
    game.undo(Math.min(pliesToUndo, game.history.length))
  }

  // Eval bar wants White-POV centipawns. EngineEval.cp is from side-to-move
  // POV at the evaluated FEN, which (for liveEval) corresponds to game.turn.
  const evalCpWhitePov =
    coach.liveEval == null
      ? null
      : game.turn === 'w'
        ? coach.liveEval.cp
        : -coach.liveEval.cp
  const mateInWhitePov =
    coach.liveEval?.mateIn == null
      ? null
      : game.turn === 'w'
        ? coach.liveEval.mateIn
        : -coach.liveEval.mateIn

  const activePly = game.history.length - 1

  return (
    <div className="flex justify-center px-6 py-8">
      <div className="flex gap-6 w-full max-w-[1180px]">
        <aside className="w-64 shrink-0">
          <LeftSidebar
            elo={elo}
            onEloChange={setElo}
            color={colorChoice}
            onColorChange={setColorChoice}
            coachMode={coachMode}
            onCoachModeChange={setCoachMode}
            onNewGame={handleNewGame}
            onTakeBack={handleTakeBack}
            canTakeBack={game.history.length > 0}
            engineStatus={ready ? 'ready' : 'loading'}
          />
        </aside>

        <main className="flex-1 flex flex-col items-center gap-4">
          <Board
            fen={game.fen}
            orientation={game.orientation}
            turn={game.turn}
            userColor={userColor === 'w' ? 'white' : 'black'}
            dests={game.dests}
            lastMove={game.lastMove}
            inCheck={game.inCheck}
            onUserMove={handleUserMove}
          />
          <CoachPanel
            mode={coachMode}
            threats={coach.threats}
            captures={coach.captures}
            blunderAlert={coach.blunderAlert}
            thinking={coach.thinking}
            onDismissAlert={coach.dismissAlert}
            onTakeBackBlunder={handleTakeBack}
          />
        </main>

        <aside className="w-72 shrink-0">
          <RightSidebar
            history={game.history}
            evalCpWhitePov={evalCpWhitePov}
            mateIn={mateInWhitePov}
            activePly={activePly >= 0 ? activePly : null}
          />
        </aside>
      </div>

      {debugOpen && engine && <DebugOverlay engine={engine} elo={elo} />}
    </div>
  )
}
