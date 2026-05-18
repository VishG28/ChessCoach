# Bug Reproduction: Invalid Move Crash

## Summary

After every engine move (black's response to the user), the app throws an unhandled
error and the game becomes permanently unplayable. The error manifests as:

```
Invalid move: {"from":"a8","to":"a3"}
```

(Exact squares vary by game; the pattern is always a square-pair that is illegal
on the current board state.)

## Root Cause

### Part 1 — FEN drift (engine gets an outdated position)

The engine effect in `PlayPage.tsx` captures `fenBefore = game.fen` at the start of
an async IIFE. `requestOpponentMove` is then awaited (up to several hundred ms).
If the board changes between capture and apply — most commonly via the "Play from
here" `useEffect` that calls `game.loadFen(fromFen)` on the initial render — the
engine receives the old FEN, calculates a move legal for that position, and tries to
apply it to a now-different board.

Race outline:
- t=0: engine effect fires; `fenBefore` = starting FEN
- t=0: "Play from here" effect also fires; `game.loadFen(customFen)` changes the board
- t=350: engine result arrives; `game.makeMove({from:"a8", to:"a3"})` is called
- chess.js v1 throws because the move is illegal on `customFen`
- `useChessGame.makeMove` catches and returns `null`

### Part 2 — Permanent game stall after null return

`useChessGame.makeMove` catches the chess.js v1 throw and returns `null`. But when
`null` is returned, `bump()` is never called, `game.fen` and `game.turn` never
change, and the engine effect's dependency array never changes. The effect never
re-fires and the game is frozen forever with no visible feedback to the user.

## Secondary Bug

`uciPvToSan()` in `src/coaching/useDeepCoach.ts` used a v0.x-style `if (!move) break`
guard after calling `c.move(...)`. In chess.js v1, an illegal move throws before
returning `null`, so the guard is unreachable dead code. When `coachMode === 'full'`
and the engine PV contains a stale UCI, the unhandled throw bubbles to the call site
in `PlayPage.tsx` which has no surrounding try/catch.

## Affected Code Paths

- `src/pages/PlayPage.tsx` — engine effect apply site (~line 455), "Play from here" effect (~line 138)
- `src/lib/useChessGame.ts` — `makeMove` function that catches and returns null
- `src/coaching/useDeepCoach.ts` — `uciPvToSan` function (secondary bug)

## Steps to Reproduce

1. Open the app at `/` (PlayPage) with default settings (ELO ~1300, any color).
2. Make any legal opening move (e.g. e2–e4).
3. Wait for the engine to respond.
4. The board freezes; the game never advances past the engine's first move.

To reproduce the secondary bug: enable full coach mode, then make a move that puts
a stale PV in the analysis buffer and observe a React error boundary.
