import { useEffect, useRef, useState } from 'react'
import type { Color, Square } from 'chess.js'
import { Board } from '@/components/board/Board'
import { CoachPanel } from '@/components/coaching/CoachPanel'
import {
  LeftSidebar,
  type CoachMode,
  type UserColor,
} from '@/components/sidebar/LeftSidebar'
import { RightSidebar } from '@/components/sidebar/RightSidebar'
import { useCoach } from '@/coaching/useCoach'
import { useEngine } from '@/engine/engine'
import { useChessGame } from '@/lib/useChessGame'

const DEFAULT_ELO = 800
const DEFAULT_COACH_MODE: CoachMode = 'warnings'
const DEFAULT_USER_COLOR: UserColor = 'white'

function movetimeFromElo(elo: number): number {
  const t = Math.max(0, Math.min(1, (elo - 300) / (2000 - 300)))
  return Math.round(120 + t * 1100)
}

function resolveUserColor(choice: UserColor): 'white' | 'black' {
  if (choice === 'random') return Math.random() < 0.5 ? 'white' : 'black'
  return choice
}

function App() {
  const game = useChessGame()
  const { engine, ready } = useEngine()

  const [elo, setElo] = useState(DEFAULT_ELO)
  const [colorChoice, setColorChoice] = useState<UserColor>(DEFAULT_USER_COLOR)
  const [coachMode, setCoachMode] = useState<CoachMode>(DEFAULT_COACH_MODE)

  const userColor: Color = game.orientation === 'white' ? 'w' : 'b'

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

  // Engine plays the opposite color. Use a request-id ref to discard stale
  // bestmoves if the position changes (takeback, new game) mid-search.
  const engineRequestIdRef = useRef(0)
  useEffect(() => {
    if (!engine || !ready) return
    if (game.isGameOver) return
    const engineColor: Color = userColor === 'w' ? 'b' : 'w'
    if (game.turn !== engineColor) return

    const requestId = ++engineRequestIdRef.current
    const movetime = movetimeFromElo(elo)

    void (async () => {
      try {
        const move = await engine.requestMove(game.fen, movetime)
        if (engineRequestIdRef.current !== requestId) return
        game.makeMove({
          from: move.from as Square,
          to: move.to as Square,
          promotion: move.promotion,
        })
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
    <div className="min-h-screen flex justify-center bg-[#f7f6f1] px-6 py-8">
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
    </div>
  )
}

export default App
