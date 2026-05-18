# AUDIT_STATE — Game State Verification

## Summary
- 6/7 PASS, 0 PARTIAL, 1 FAIL, 0 NOT_IMPLEMENTED

---

## Findings

### 1. Live `chessRef` lifecycle
**Status:** PASS

**Evidence:**
- `src/lib/useChessGame.ts:57` — `chessRef` is initialized with `new Chess()` at hook creation.
- On mount, `useEffect` (lines 63–75) hydrates from `localStorage` via `chessRef.current.loadPgn(stored.pgn)` once (guarded by `hydratedRef.current`).
- Mutation paths are exactly: `makeMove` (line 93), `undo` (line 106 loop), `reset` (line 114), `loadPgn` (line 121), `loadFen` (line 132).
- In `PlayPage.tsx`, user moves go through `handleUserMove` → `game.makeMove` (lines 517–527). Opponent moves go through the engine effect → `game.makeMove` (line 465). No direct writes to `chessRef.current` anywhere in `PlayPage.tsx`.
- Post-fix: the engine effect at `PlayPage.tsx:465–472` wraps `game.makeMove` result and increments `engineStallKey` on null return instead of silently stalling.

**Notes:** Clean. No leaked direct mutations.

---

### 2. Move history schema
**Status:** PASS

**Evidence — `src/games/types.ts:19–43`:**
- `ply: number` (line 20)
- `san: string` (line 21) — SAN
- `fen_before: string` (line 23) — FEN before move
- `fen_after: string` (line 24) — FEN after move
- `engine_eval_before?: { cp; bestMove; pv }` (line 28) — eval before
- `engine_eval_after?: { cp; bestMove; pv }` (line 29) — eval after
- `centipawn_loss?: number` (line 31) — loss delta
- `classification?: Classification` (line 32) — blunder/mistake/inaccuracy/good/best
- `coach_messages?: CoachMessageRecord[]` (line 36) — ephemeral coach messages array (backward-compat from legacy `coach_message` scalar)
- `source?: MoveSource` (line 38) — 'user' | 'book' | 'stockfish' | 'maia'
- `engineModel?: string` (line 39)
- `bookWeight?: number` (line 41) — book-move frequency weight

**Notes:** All required fields present. `think_time` per-move is not a separate field — `timestamp: number` (line 25) serves as absolute time; wall-clock delta can be derived. No explicit `thinkTime` field exists; minor gap but not a functional regression.

---

### 3. Takeback
**Status:** PASS

**Evidence:**
- `PlayPage.tsx:557–578` — `handleTakeBack` computes `pliesToUndo`: if it's currently the user's turn, the last ply was the engine's reply; undo 2 plies. If it's the engine's turn (user's move just made, engine hasn't replied yet), undo 1. Uses `Math.min(pliesToUndo, game.history.length)` as a floor guard.
- `game.undo(undone)` calls `useChessGame.ts:103–111` which loops `chess.undo()` exactly `plies` times, breaking early if `undone` is falsy.
- `engineRequestIdRef.current++` (line 559) invalidates any in-flight engine search before undo.
- `coach.dismissAlert()` and `deepCoach.cancel()` clear UI state.
- `setMoveSources` (lines 570–576) trims the badge map to only entries with index `< newLen`.

**Notes:** Correct 2-ply (user + opponent) removal when it's the user's turn, correct 1-ply removal when it's the engine's turn. State is fully restored.

---

### 4. In-game review (Phase 6)
**Status:** PASS

**Evidence:**
- `PlayPage.tsx:255` — `reviewedPly: number | null` — `null` = live position.
- `displayedPly = reviewedPly ?? totalPlies` (line 257); `isReviewing = reviewedPly !== null` (line 258).
- `goToPly` (lines 260–271): increments `engineRequestIdRef.current` to invalidate in-flight engine search when entering/staying in review mode; sets `reviewedPly` to `null` when at `totalPlies` (returning to live).
- `displayedFen` (lines 634–636) reads `fenAtPly(game.history, reviewedPly!)` from `src/lib/historyNavigation.ts:7–10` — purely derived from stored `Move.after`, no mutation.
- `displayedDests = isReviewing ? emptyDests : game.dests` (line 642) — board is read-only during review.
- Board renders `displayedDests` (line 757); pre-move also disabled: `allowPremoves && !isReviewing` (line 760).
- `MoveNavBar.tsx:94–105`: "Return to Live (after move N)" banner rendered when `isReviewing && totalPlies > 0`.
- Engine effect (line 401): `if (isReviewing) return` — engine paused during review.
- Pre-move coach effect (line 322): `if (isReviewing) return` — coaching paused during review.
- `useEffect` at lines 279–284 clears `reviewedPly` if history shrinks below the reviewed index.

**Notes:** Fully correct. Main game state (`chessRef.current`) is never mutated during review. The banner text at `MoveNavBar.tsx:103` reads "Return to Live (after move {liveMoveNumber})" where `liveMoveNumber = Math.ceil(totalPlies / 2)` (full-move count, not ply count) — spec-compliant.

---

### 5. Game-end detection
**Status:** FAIL (partial — resignation absent)

**Evidence:**
- `useGameLogger.ts:200–237` — `justEnded = isOver && !prevIsGameOverRef.current && currentLen > 0`. On end: `finalizeGame` stores result, then `clearGameCoaching` is called (line 219) unless `keepCoaching` opt-in is set.
- `useChessGame.ts:48–54` — `computeResult` detects checkmate and draw (covers stalemate/repetition/50-move via chess.js `isGameOver()` + `isCheckmate()` branching). Returns `'draw'` for all non-checkmate endings.
- `PlayPage.tsx:529–548` — `handleNewGame` handles **abandonment** explicitly: if `prev.result === 'ongoing'`, calls `finalizeGame(currentGameId, '1/2-1/2', ...)` and `clearGameCoaching`.

**Gap — resignation:** No explicit resignation handler is surfaced to the user (no "Resign" button found in reviewed files). The `GameResult` type in `types.ts:45` supports `'1-0'` / `'0-1'` but no resign pathway was observed.

**Gap — threefold repetition / 50-move / stalemate discrimination:** These are all silently grouped under `'draw'` by `computeResult`. The stored result string is correct (`'1/2-1/2'`), but individual draw causes are not discriminated in the schema or UI.

**Notes:** The ephemeral-coach wipe before save (line 219) fires correctly for natural game ends (checkmate/stalemate/draw via chess.js) and abandonment. Resignation is absent as a user action. Classification of draw subtypes is absent.

---

### 6. PGN export
**Status:** PASS

**Evidence — `src/lib/pgn.ts:1–25`:**
- `buildPgnFile(game)` emits standard PGN headers: Event, Site, Date, White, Black, Result — then appends `game.pgn` (the chess.js-generated move text).
- `downloadPgn` creates a Blob, triggers a DOM anchor click, and revokes the URL.
- `GameReviewPage.tsx:307–313` — "Export PGN" button calls `downloadPgn(game)`.
- `game.pgn` is kept in sync via `setGamePgn(gameId, game.pgn)` after every move (`useGameLogger.ts:196`).

**Notes:** Minor: `buildPgnFile` hardcodes `"Stockfish (${game.engineElo})"` as the engine player label regardless of `game.engine` field value (`pgn.ts:8–9`). Maia games will be mislabeled. Not a regression of the Phase-0 fix.

---

### 7. Past-games review route
**Status:** PASS

**Evidence:**
- `src/pages/GamesListPage.tsx` — route `/games` lists all completed games (via `listGames()` from gameStore) with result, accuracy, blunder count, and move count. Each card navigates to `/games/:id`.
- `src/pages/GameReviewPage.tsx` — move-by-move replay via `selectedPly` state (0 = start, `game.moves.length` = end). `fenAtPly(game, ply)` reads `move.fen_after` from stored `MoveEntry`.
- Eval annotations: `EvalGraph` receives `game.moves` (line 340); `MoveDetails` shows classification, CP loss, best move (via `engine_eval_before`). `MoveList` receives `game.moves`.
- Retrospective coaching available per ply (lines 202–252) via `streamCoachMessage`.
- Keyboard navigation: arrow left/right, Home, End (lines 152–169).
- `downloadPgn` available from review page (line 308).

**Notes:** The `accuracy` helper in `GamesListPage.tsx:29–35` computes `100 - avg_cp_loss / 10`, clamped to [0,100]. This is a custom formula, not standard Lichess accuracy, but consistently applied.

---

## Phase-0 fix sanity-check

**Fix 1 — `PlayPage.tsx:464–472` (engineStallKey retry):**
The fix adds a null-check on `game.makeMove` result: if `applied` is null, `setEngineStallKey((k) => k + 1)`. The `engineStallKey` is in the engine effect's dependency array (line 515). This correctly causes a re-run of the effect with the current `game.fen` / `game.turn` on the next render cycle.

Retry loop safety: the effect is already guarded by `if (game.isGameOver) return` (line 403) and `if (game.turn !== engineColor) return` (line 405). If the move was illegal because the game ended or the turn flipped, those guards will exit cleanly on the retry. No infinite loop risk.

**Fix 2 — `src/coaching/useDeepCoach.ts:21–38` (uciPvToSan per-move try/catch):**
Each PV move is now individually wrapped in try/catch rather than letting chess.js throw propagate to the caller. The `break` on catch correctly truncates the PV at the first illegal move. Surrounding code handles empty `string[]` gracefully. No regression.

**No regressions identified.** Both changes are narrowly scoped guards with correct early exits.

---

## Other observations

1. **`useGameLogger` runs after every render** (`useGameLogger.ts:245` — `useEffect()` with no dependency array). This is intentional (manual `prevHistoryLengthRef` tracking) but unusual and adds per-render overhead. Not introduced by Phase-0.

2. **`GameReviewPage.ts:98` classification fallback gap** — `cpLoss >= 50` maps to `'inaccuracy'` in both the 50–99 and `>= 50` branches. The `good` classification (0–49 cp loss per `classification.ts`) is never assigned during retrospective review. The live logger via `useGameLogger.ts:171` uses the correct `classify()` function. Divergence between live and retrospective display only.

3. **`pgn.ts:8–9`** always labels engine as "Stockfish (ELO)" even for Maia games. Minor cosmetic bug, not introduced by Phase-0.

4. **`useChessGame.ts` does not expose `chessRef` directly** — all external mutation is forced through the typed API, correct encapsulation.
