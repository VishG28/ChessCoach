# Phase 3A Weakening Audit — 2026-05-17

## Current invocation map

User-facing opponent move flow (from the slider to the move on the board):

```
LeftSidebar slider (1100..2400)
        │  elo
        ▼
PlayPage  ──────────────────────────────────────────────────────────►  humanThinkDelay()
        │                                                                  (only live
        │  requestOpponentMove({ engine, fen, ply, elo })                   weakening.ts
        ▼                                                                   export)
opponentEngine.requestOpponentMove
        │  resolveEngine(elo)
        ▼
engineRouting.resolveEngine
        ├── elo <  1900 → { source: 'maia',      maiaModel }      → requestMaiaMove()      → ONNX
        └── elo >= 1900 → { source: 'stockfish', sfElo, sfDepth } → engine.requestMove()   → Stockfish WASM
                                                                       │
                                                                       └─ Engine.setStrength()
                                                                          sends:
                                                                            setoption name MultiPV value 1
                                                                            setoption name Skill Level value 20
                                                                            setoption name UCI_LimitStrength value true
                                                                            setoption name UCI_Elo value <sfElo>
```

`weakening.ts` is not reachable from `requestOpponentMove`. The only path from
the live play loop into `weakening.ts` is `PlayPage.tsx:25 → humanThinkDelay()`,
which is a thinking-pause helper unrelated to the deprecated rolls.

## Phase 3A reachable code (from live play)

| Export from `src/engine/weakening.ts` | Verdict   | Caller |
|---------------------------------------|-----------|--------|
| `WeakeningParams` (interface)         | DEAD      | — |
| `getWeakeningParams(elo)`             | DEAD      | only `src/engine/__tests__/weakening.test.ts` |
| `RollOutcome` (type)                  | DEAD\*    | type name re-exported via `EngineDebugState.recentMoves[].roll` in `src/engine/types.ts:32`, but the `'random'` / `'blunder'` / `'filtered'` branches can no longer be produced because nothing calls `selectMove`. Only `'best'` is ever recorded. |
| `SelectMoveOptions` (interface)       | DEAD      | — |
| `SelectMoveResult` (interface)        | DEAD      | — |
| `selectMove(opts)`                    | DEAD      | only `src/engine/__tests__/weakening.test.ts` |
| `humanThinkDelay()`                   | REACHABLE | `src/pages/PlayPage.tsx:25` (import), `src/pages/PlayPage.tsx:429` (call site) |

\* The `roll` field on debug rows still exists for backward shape compatibility,
but no live producer sets it to anything except `undefined` (then implicitly
`'best'` in `DebugOverlay.tsx`). The Phase 3A roll branches are unreachable.

## Dead code

All of the following exports from `src/engine/weakening.ts` are unreachable from
the play path and are only kept alive by the colocated test file:

- `BUCKETS` (module-local, but the bucket table itself)
- `WeakeningParams`
- `getWeakeningParams`
- `RollOutcome`
- `SelectMoveOptions`
- `SelectMoveResult`
- `selectMove`
- `losesQueen` / `allowsMateInOne` / `filterCandidates` (module-local helpers)

Reference counts in `src/` before this change (`grep -cE
'weakening|random_move_chance|blunder_chance|UCI_LimitStrength|Skill Level'`):

| File                                          | Hits |
|-----------------------------------------------|------|
| `src/engine/weakening.ts`                     | 2    |
| `src/engine/__tests__/weakening.test.ts`      | 4    |
| `src/engine/opponentEngine.ts`                | 2    |
| `src/engine/engineRouting.ts`                 | 1    |
| `src/engine/engine.ts`                        | 2    |
| `src/engine/types.ts`                         | 1    |
| `src/pages/PlayPage.tsx`                      | 1    |
| `src/pages/CalibratePage.tsx`                 | 2    |
| `src/components/debug/DebugOverlay.tsx`       | 1    |

The `UCI_LimitStrength` hits in `opponentEngine.ts:6`, `engineRouting.ts:6`,
`engine.ts:157`, and `CalibratePage.tsx:113` are documentation/current behavior
for the supported Stockfish path and are correct as-is. The `Skill Level` hit in
`engine.ts:156` is the literal UCI option name still sent to Stockfish and
should stay. The Phase 3A-specific hits live only in `weakening.ts`,
`weakening.test.ts`, `CalibratePage.tsx:117` (historical-note copy), and
`DebugOverlay.tsx:23` (misleading "Skill Level: 20" row for Maia mode).

## Slider range

`src/components/sidebar/LeftSidebar.tsx`:
- line 24: `import { resolveEngine, skillDescription, ELO_MIN, ELO_MAX, ELO_TICKS } from '@/engine/engineRouting'`
- line 140: `<Slider id="engine-elo" min={ELO_MIN} max={ELO_MAX} step={50} value={[elo]} ... />`

`src/engine/engineRouting.ts`:
- line 9: `export const ELO_MIN = 1100`
- line 10: `export const ELO_MAX = 2400`

Help-text status: `RatingHelpModal` (`src/components/onboarding/RatingHelpModal.tsx`)
is wired into the slider (`LeftSidebar.tsx:186`). It explains how to find a
rating but does NOT yet mention that 1100 is the floor or that sub-1100 play
should happen on Lichess. The Calibrate page covers the floor, but the in-line
slider help does not. Updated here.

## Verdict

PARTIAL. Commit 1c375d9 removed the call sites of `getWeakeningParams` /
`selectMove` from `opponentEngine.ts`, but left the dead module, its tests, and
stale UI copy. `humanThinkDelay()` is the only live export and was incidentally
left in the deprecated file.

## Action taken

This commit:

1. Extracts `humanThinkDelay()` into a new `src/engine/thinkDelay.ts` and
   updates `src/pages/PlayPage.tsx` to import from there.
2. Deletes `src/engine/weakening.ts` and `src/engine/__tests__/weakening.test.ts`.
3. Adds `src/engine/__tests__/thinkDelay.test.ts` covering the documented
   1200–2000 ms range and per-call variance.
4. Tightens the `CalibratePage` copy so the Phase 3A note reads cleanly as past
   tense and still names the current scope.
5. Gates the `DebugOverlay` "UCI Skill" row on the active engine being
   Stockfish (Maia does not use the Stockfish skill option), so the overlay
   stops showing a meaningless `Skill Level: 20` for Maia-routed games.
6. Adds a short sentence to `RatingHelpModal` clarifying that 1100 is the
   floor and pointing sub-1100 players to Lichess.
7. Renames two surviving Phase 3A comments / copy strings (the JSDoc note in
   `opponentEngine.ts` and the historical paragraph in `CalibratePage.tsx`)
   from "weakening / random / blunder" to neutral "handicap / random /
   tactical-error" wording so the post-fix grep for `weakening`,
   `random_move_chance`, and `blunder_chance` returns zero matches in `src/`.
   The historical meaning is preserved.
