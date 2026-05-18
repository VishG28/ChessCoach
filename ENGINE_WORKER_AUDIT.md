# Engine Worker Architecture Audit — 2026-05-17

## Topology (before)

| Worker site | File:line | UCI / model state | Callers | Queue holder |
|---|---|---|---|---|
| `play` Stockfish worker | `src/engine/engine.ts:78` (constructed inside `Engine` ctor; `useEngine` instantiates at `src/engine/engine.ts:401` with `instanceName: 'play'`) | UCI options set via `Engine.setStrength()` per current `elo`; `MultiPV` is overwritten on every `requestAnalysis` call (`engine.ts:219`) and again on `requestMove` (`engine.ts:186`) | Opponent move pipeline: `PlayPage` → `requestOpponentMove({ engine, ... })` (`src/pages/PlayPage.tsx:416`) → `engine.requestMove(...)` (`src/engine/opponentEngine.ts:86`). Silent coaching eval: `useCoach` → `engine.requestAnalysis({ fen, depth: 12, multipv: 5 })` (`src/coaching/useCoach.ts:119`) — uses the SAME engine instance. | `Engine.queue: Job[]` (`engine.ts:57`) drained serially by `drain()` (`engine.ts:247`). |
| `analysis` Stockfish worker | `src/engine/engine.ts:78` re-entered when `analysisEngine.ts:9` lazily news up `new Engine({ instanceName: 'analysis' })`. The `Engine` class hard-codes `new Worker(WORKER_URL)`, so this is a genuinely independent Worker. | UCI options: `setMultiPV(3)` called once at init (`analysisEngine.ts:13`); never reconfigured per game. | Background per-move post-game analysis: `useGameLogger` → `analyzePosition(fen, 12)` (`src/games/useGameLogger.ts:147-148`). | Separate `Engine.queue` on the analysis instance — independent of the play instance. |
| `maia` ONNX worker | `src/engine/maia.ts:37` (`new Worker(new URL('./maiaWorker.ts', ...))`) — module-level singleton. | Loaded ONNX models per Elo bucket (`maia.ts:32-33`). | `requestMaiaMove` called inside `requestOpponentMove` (`src/engine/opponentEngine.ts:77`) — receives a `reqId`-keyed reply, so its own queue is just a `Map<reqId, PendingRequest>` (`maia.ts:31`). | Maia's `pending` map, NOT the Stockfish UCI queue. Independent. |

Three Workers exist in the codebase. The previously suspected "single worker" pattern is wrong: `analysisEngine` and `engine` already construct distinct workers because each `new Engine(...)` privately calls `new Worker(WORKER_URL)` in its constructor (`engine.ts:78`). However, the **play `Engine` is shared** between two consumers — the opponent move pipeline AND `useCoach` — and that is the actual race / latency hotspot.

## Race condition risks

1. **Coach analysis blocks opponent move (and vice versa) on the play engine.** `useCoach.ts:119` calls `engine.requestAnalysis({ fen, depth: 12, multipv: 5 })` on the SAME `Engine` instance that `PlayPage`/`requestOpponentMove` calls `engine.requestMove(...)` on (`PlayPage.tsx:416-421`, `opponentEngine.ts:86`). Both go through `Engine.queue` (`engine.ts:57`) and are drained one-at-a-time by `drain()` (`engine.ts:247`). When the user moves, `useCoach`'s `useEffect` fires `Promise.all([fetchEval(beforeFen), fetchEval(afterFen)])` (`useCoach.ts:148`) — two analyze jobs are appended. The opponent-move `useEffect` (`PlayPage.tsx:395-500`) then appends a `move` job on the SAME queue. Result: the opponent waits for both depth-12 multipv-5 analyses to finish before it can think.

2. **MultiPV state contamination on the play engine.** `requestAnalysis` issues `setoption name MultiPV value 5` (`engine.ts:219`) which mutates persistent UCI state on the worker. The next `requestMove` resets `currentMultipv = 1` in JS (`engine.ts:186`) but does NOT issue `setoption name MultiPV value 1` to the engine — it relies on the `go` command not requesting multiple lines. In practice Stockfish honours `multipv 1` implicitly here so the bestmove is still correct, but the engine's internal search has wasted state from the prior multipv setting. This is fragile rather than catastrophic.

3. **No race on Maia or analysisEngine.** Each has its own worker and queue. The previously-suspected race "opponent generation can race with silent analysis" does not exist between `play` and `analysis` engines — they are already isolated. The race is between two consumers of the SAME `play` engine.

## Latency analysis

Concrete numbers from the code paths:

- A `useCoach` `Promise.all([fetchEval(beforeFen), fetchEval(afterFen)])` (`useCoach.ts:148`) queues two `analyze` jobs at depth 12, multipv 5. In the play engine's queue these are serialized.
- Immediately after a user move, the opponent-move effect (`PlayPage.tsx:395-500`) tries to enqueue a `move` job at depth 14, movetime 1000ms.
- Because both consumers share `engine.queue`, the opponent move blocks behind ~2 × (depth-12 multipv-5 search) before its own `go` command is even posted to the worker.
- At Stockfish 18 single-threaded WebAssembly, depth-12 multipv-5 is roughly 200–600 ms per call depending on position complexity → opponent move is delayed by ~0.4–1.2 s every turn the coach is active.
- The `humanThinkDelay()` jitter (`PlayPage.tsx:429`) usually masks this, but on rich middlegames or at high Elo where the move itself takes longer, the queue effectively adds 1+ second to felt opponent response time AND starves the coach UI of its eval bar update.

## Recommendation

Split the play engine into two singletons: `opponentEngine` (only opponent moves) and `analysisEngine` (only silent eval / coaching). Each owns its own `Worker`, UCI state, and message queue, so an in-flight analyze cannot stall an opponent move and vice versa. `useGameLogger`'s existing `analyzePosition` already uses the analysis engine — make `useCoach` use the same one. Make `requestOpponentMove` use the dedicated opponent engine. Wire teardown into game-end / unmount so workers are reclaimed.

## Topology (after) — wired by this commit

```
src/engine/workerPool.ts
├── getOpponentEngine()  ──► Engine{instanceName:'opponent'}  ──► private Worker A
│                                                                  (UCI: per-game setStrength via setOpponentElo)
├── getAnalysisEngine()  ──► Engine{instanceName:'analysis'}  ──► private Worker B
│                                                                  (UCI: pinned MultiPV=5, full strength)
└── teardownEngines()    ──► terminates both, clears singletons

Callers:
  opponentEngine.requestOpponentMove          → getOpponentEngine() (via PlayPage opponent flow)
  useCoach.fetchEval                          → getAnalysisEngine()
  useGameLogger.analyzePosition               → analysisEngine.ts (re-export → getAnalysisEngine())
  PlayPage unmount                            → teardownEngines()
```

`src/engine/analysisEngine.ts` is folded into `workerPool.ts`: `analyzePosition` becomes a thin re-export that delegates to `getAnalysisEngine().requestAnalysis(...)`. The existing `useEngine()` hook in `engine.ts` is retained because PlayPage uses it for `setStrength` wiring, the debug overlay, and `engine.recordEngineMoveSan` provenance. After this commit, `useEngine()`'s instance is no longer the live opponent move source — opponent moves come from the pool — so the shared-queue race is eliminated. PlayPage still issues `setStrength` against the pool's opponent engine via the new `setOpponentElo` helper.
