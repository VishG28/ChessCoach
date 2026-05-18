# Bug Fix: Invalid Move Crash

## Files Changed

| File | Change |
|------|--------|
| `src/pages/PlayPage.tsx` | Added `engineStallKey` state; detect null return from `makeMove`; retry via stall key |
| `src/coaching/useDeepCoach.ts` | Wrapped per-move `c.move()` in `uciPvToSan` in try/catch for chess.js v1 |

## Fix 1 — Engine stall key (`src/pages/PlayPage.tsx`)

A new `engineStallKey` state counter was added alongside `debugOpen` and
`engineThinking`. It is added to the engine effect's dependency array.

At the apply site (previously line ~456), the return value of `game.makeMove` is now
captured. If `null` is returned (the move was illegal for the current board), the
handler calls `setEngineStallKey(k => k + 1)` and returns early instead of
silently discarding the null. Incrementing `engineStallKey` triggers the engine
effect to re-run immediately with the fresh `game.fen` and `game.turn`, so the
engine re-requests a legal move for the actual current position. The game can
no longer permanently stall.

No changes were made to `useChessGame.makeMove` — it correctly catches chess.js v1
throws and returns null. The stall-key mechanism is the missing second half of that
handling.

## Fix 2 — `uciPvToSan` hardened for chess.js v1 (`src/coaching/useDeepCoach.ts`)

`uciPvToSan` previously relied on `if (!move) break` after calling `c.move(...)`.
In chess.js v1, an illegal move throws before returning null, so that guard was dead
code. Each `c.move(...)` call is now wrapped in try/catch. On an illegal move the
catch block breaks out of the loop, matching the original intent of stopping PV
conversion at the first invalid UCI. Callers (including `PlayPage.tsx`) no longer
need a try/catch wrapper for this function.

## What Was Not Changed

- `src/lib/useChessGame.ts` — `makeMove` already correctly catches and returns null.
- Opening book, Maia encoding, Stockfish UCI handling — all passed hypothesis checks.
- Board themes, piece sets, coordinate readability code — intentionally untouched.

## Verification

- `npm run build` — 0 TypeScript errors; bundle produced successfully.
- `npm test -- --run` — 48/48 tests pass.
