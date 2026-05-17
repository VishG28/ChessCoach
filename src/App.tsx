/**
 * Three-column placeholder layout for the chess training app.
 * Phase 2/3 subagents will replace each panel with real components.
 */
function App() {
  return (
    <div className="min-h-screen flex justify-center bg-[#f7f6f1] px-6 py-8">
      <div className="flex gap-6 w-full max-w-[1180px]">
        <aside className="w-64 shrink-0 rounded-xl border bg-white p-4">
          <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
            Controls
          </h2>
          <p className="mt-2 text-sm text-neutral-400">
            Left sidebar — Elo, color, coach mode, buttons.
          </p>
        </aside>

        <main className="flex-1 flex flex-col items-center gap-4">
          <div
            className="bg-white border rounded-xl flex items-center justify-center text-neutral-400 text-sm"
            style={{ width: 560, height: 560 }}
          >
            Board placeholder (560×560)
          </div>
          <div className="w-[560px] rounded-xl border bg-white p-4 min-h-[120px]">
            <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
              Coach
            </h2>
            <p className="mt-2 text-sm text-neutral-400">
              Coaching panel — threats before move, blunder alerts after.
            </p>
          </div>
        </main>

        <aside className="w-72 shrink-0 rounded-xl border bg-white p-4">
          <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
            Game
          </h2>
          <p className="mt-2 text-sm text-neutral-400">
            Right sidebar — eval bar, move list.
          </p>
        </aside>
      </div>
    </div>
  )
}

export default App
