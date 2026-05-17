import { useState } from 'react'
import { useEngine } from '@/engine/engine'
import type { EngineEval } from '@/engine/types'
import { Board } from '@/components/board/Board'
import { useChessGame } from '@/lib/useChessGame'
import type { Square } from 'chess.js'

/**
 * Three-column placeholder layout for the chess training app.
 * Phase 3 subagents will replace the side panels with real components.
 */
function App() {
  const game = useChessGame()
  const { engine, ready } = useEngine()
  const [evalResult, setEvalResult] = useState<EngineEval | null>(null)
  const [evalError, setEvalError] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const [elo, setElo] = useState(1500)

  const onEval = async () => {
    if (!engine || !ready) return
    setRunning(true)
    setEvalError(null)
    try {
      const result = await engine.requestEval(game.fen, 12)
      setEvalResult(result)
    } catch (e: unknown) {
      setEvalError(e instanceof Error ? e.message : 'eval failed')
    } finally {
      setRunning(false)
    }
  }

  const handleUserMove = (
    from: string,
    to: string,
    promotion?: 'q' | 'r' | 'b' | 'n',
  ): void => {
    game.makeMove({ from: from as Square, to: to as Square, promotion })
  }

  const onEloChange = async (value: number) => {
    setElo(value)
    if (!engine || !ready) return
    try {
      await engine.setStrength(value)
    } catch {
      // ignore in smoke test
    }
  }

  return (
    <div className="min-h-screen flex justify-center bg-[#f7f6f1] px-6 py-8">
      <div className="flex gap-6 w-full max-w-[1180px]">
        <aside className="w-64 shrink-0 rounded-xl border bg-white p-4 space-y-4">
          <div>
            <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
              Controls
            </h2>
            <p className="mt-2 text-sm text-neutral-400">
              Left sidebar — Elo, color, coach mode, buttons.
            </p>
          </div>

          <button
            type="button"
            onClick={game.reset}
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Reset board
          </button>

          <div className="text-xs text-neutral-600 space-y-1">
            <p>
              Turn:{' '}
              <span className="font-mono">
                {game.turn === 'w' ? 'White' : 'Black'}
              </span>
            </p>
            <p>
              Moves: <span className="font-mono">{game.history.length}</span>
            </p>
            {game.isGameOver ? (
              <p className="font-medium text-neutral-800">
                Result: {game.gameResult ?? 'unknown'}
              </p>
            ) : null}
          </div>
        </aside>

        <main className="flex-1 flex flex-col items-center gap-4">
          <Board
            fen={game.fen}
            orientation={game.orientation}
            turn={game.turn}
            userColor={null}
            dests={game.dests}
            lastMove={game.lastMove}
            inCheck={game.inCheck}
            onUserMove={handleUserMove}
          />
          <div className="w-[560px] rounded-xl border bg-white p-4 min-h-[120px]">
            <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
              Coach
            </h2>
            <p className="mt-2 text-sm text-neutral-400">
              Coaching panel — threats before move, blunder alerts after.
            </p>
          </div>
        </main>

        <aside className="w-72 shrink-0 rounded-xl border bg-white p-4 space-y-4">
          <div>
            <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
              Game
            </h2>
            <p className="mt-2 text-sm text-neutral-400">
              Right sidebar — eval bar, move list.
            </p>
          </div>

          <div className="border-t pt-4 space-y-3">
            <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
              Engine smoke test
            </h3>
            <div className="text-xs text-neutral-500">
              status: {ready ? 'ready' : 'loading...'}
            </div>
            <label className="block text-xs text-neutral-600">
              Elo: {elo}
              <input
                type="range"
                min={300}
                max={3190}
                step={10}
                value={elo}
                onChange={(e) => void onEloChange(Number(e.target.value))}
                disabled={!ready}
                className="w-full mt-1"
              />
            </label>
            <button
              type="button"
              onClick={() => void onEval()}
              disabled={!ready || running}
              className="px-3 py-1.5 text-xs rounded border bg-neutral-50 hover:bg-neutral-100 disabled:opacity-50"
            >
              {running ? 'Evaluating...' : 'Eval starting position'}
            </button>
            {evalError && (
              <pre className="text-xs text-red-600 whitespace-pre-wrap">{evalError}</pre>
            )}
            {evalResult && (
              <pre className="text-xs text-neutral-700 whitespace-pre-wrap break-all">
                {JSON.stringify(evalResult, null, 2)}
              </pre>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

export default App
