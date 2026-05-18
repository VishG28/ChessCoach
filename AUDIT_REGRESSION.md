# AUDIT_REGRESSION — Code-Path Regression Pass

## Methodology

Code-path walkthrough without a browser: traced each game scenario through React
hooks, engine routing, Maia/Stockfish dispatch, coaching debounce, review mode,
and takeback. One dev-server smoke test was performed (`npm run dev` → curl
`http://localhost:5173/ChessCoach/` → confirmed 200 HTML response → server
killed).

---

## Game 1 — Elo 1100, Conversational coaching, defaults

### Defaults at load
- `DEFAULT_ELO = 1100` (`src/pages/PlayPage.tsx:54`)
- `DEFAULT_COACH_MODE = 'warnings'` (`src/pages/PlayPage.tsx:55`)
- `DEFAULT_USER_COLOR = 'white'` (`src/pages/PlayPage.tsx:56`)
- Coaching style falls back to `'conversational'` if not in `localStorage`
  (`src/pages/PlayPage.tsx:73-76`)
- OBSERVATION: Default coach mode is `warnings`, **not** `full`. The
  `coachingStyle` field is `conversational` by default but is only visible/active
  when `coachMode === 'full'`. First-time users won't see conversational coaching
  until they manually enable Full mode.

### App load → onboarding
- `EngineScopeCard` reads `cc.seenEngineScope.v1` from localStorage. On first
  visit it renders the dismissible info card (`src/components/onboarding/
  EngineScopeCard.tsx:24`). No risk here.
- `useChessGame` hydrates from localStorage PGN on mount; corrupt PGN silently
  resets to fresh board (`src/lib/useChessGame.ts:62-75`). Safe.

### "New Game" click → engine routing
- `resolveEngine(1100)` → `{ source: 'maia', maiaModel: 1100 }`
  (`src/engine/engineRouting.ts:59-67`)
- `loadMaiaModel(1100)` fires immediately in a `useEffect`
  (`src/pages/PlayPage.tsx:128-137`). Toast loading indicator shown.
- `maia-1100.onnx` exists at `public/maia/maia-1100.onnx` — no 404.
- All five Maia models confirmed present: 1100, 1300, 1500, 1700, 1900.

### User makes move 1
- `handleUserMove` → `game.makeMove` → chess.js `chessRef` updated synchronously,
  `version` bumped, React schedules re-render.
- Engine effect deps: `[engine, ready, game.fen, game.turn, ...]` — picks up new
  FEN on next render cycle. No race here.

### Coaching debounce fires
- `useCoach` runs after-move evaluation in `useEffect` keyed on `game.fen` /
  `game.history` (`src/coaching/useCoach.ts:87-183`).
- Stale-response guard via `submittedAtHistoryLen` is sound.
- In `warnings` mode `deepCoach.fire()` is **not** called (guarded by
  `coachMode !== 'full'`). Pre-move coaching effect at
  `src/pages/PlayPage.tsx:321-377` early-returns if `coachMode !== 'full'`.
- OBSERVATION: In `warnings` mode, blunder alerts route through `useCoach` +
  `toast.error`. The `mode === 'full'` guard means LLM coaching never fires at
  default settings. This is intentional but a user might not know to flip the
  coach mode.

### Engine reply loop (20 plies)
- Book: `getBookMove` fetches `https://explorer.lichess.ovh/lichess?...` with an
  800ms timeout (`src/engine/openingBook.ts:59-89`). On network failure the
  `catch` returns `null` silently — Maia falls back cleanly. Safe.
- OBSERVATION: The Lichess API call has **no explicit error reporting** if the
  fetch fails mid-game (non-book-ply range). Silent fall-through is safe but
  invisible to the user.
- After book range (ply > 16 for sub-1400), Maia ONNX is requested. On failure,
  `console.warn('[opponentEngine] Maia failed, falling back to Stockfish', e)`
  fires unconditionally (not DEV-gated): `src/engine/opponentEngine.ts:79`.
  **RISK: Pollutes production console.**
- After engine move lands: `engineThinking` cleared only if `requestId` still
  matches — safe against stale responses.

---

## Game 2 — Elo 1500, Socratic coaching, theme switch mid-game

### Engine routing
- `resolveEngine(1500)` → `{ source: 'maia', maiaModel: 1500 }`. `maia-1500.onnx`
  is present. No 404.

### Theme switch path
- `BoardThemeProvider` stores theme in React state (`themeId`). `useEffect` on
  `themeId` calls `applyTheme(id)`, which mutates CSS custom properties on
  `document.documentElement` (`src/components/board/BoardThemeProvider.tsx:25-46`).
- `PieceSetProvider` similarly toggles a CSS class on `document.documentElement`
  (`src/components/board/PieceSetProvider.tsx:9-15`).
- **Neither provider touches `useChessGame`, `chessRef`, or any game state.**
- The `Board` component receives `fen`, `dests`, `lastMove`, etc. purely as props
  from `PlayPage`. A theme switch triggers a re-render in `LeftSidebar`'s
  `BoardThemeCard`/`PieceSetCard` children, but these changes stay isolated in
  their own subtree and only set `themeId` / `setId` state.
- OBSERVATION: Theme switch is safe — it cannot reset game state. No side-effects
  on game logic paths observed.

### Coaching style switch mid-game
- `styleJustChangedRef` is set synchronously in render when `coachingStyle`
  changes (`src/pages/PlayPage.tsx:86-91`). The pre-move `useEffect` checks this
  ref and early-returns if true, preventing a redundant coaching re-fire on the
  current ply (`src/pages/PlayPage.tsx:329-332`).
- OBSERVATION: Style switch logic is sound; no coaching spam.

---

## Game 3 — Elo 2100, Stockfish, takeback + in-game review

### Stockfish routing at 2100
- `resolveEngine(2100)` → `{ source: 'stockfish', sfElo: 2100, sfDepth: 14,
  sfMovetimeMs: 1000 }` (`src/engine/engineRouting.ts:59-78`).
- `engine.setStrength(2100)` sends `UCI_LimitStrength true` + `UCI_Elo 2100` to
  the Stockfish worker (`src/engine/engine.ts:153-181`).
- OBSERVATION: In DEV mode `console.info('[engine] setStrength', ...)` fires but
  is gated by `import.meta.env.DEV` — safe in production.

### Takeback after 5 moves
- `handleTakeBack` (`src/pages/PlayPage.tsx:557-579`):
  1. `engineRequestIdRef.current++` — invalidates any in-flight engine request.
  2. `coach.dismissAlert()` and `deepCoach.cancel()` — clears alerts and aborts
     streaming coach messages.
  3. `setReviewedPly(null)` — exits review mode before undoing.
  4. `pliesToUndo = game.turn === userColor ? 2 : 1` — correct: when it's the
     user's turn, both plies (engine + user move) are undone; when it's the
     engine's turn, only the user's last move is undone.
  5. `game.undo(undone)` — chess.js `undo()` is called in a loop; the chess
     instance is updated synchronously.
  6. `moveSources` map is pruned to only plies `< newLen` — consistent.
- OBSERVATION: After takeback, the engine effect's deps change (`game.fen`,
  `game.turn`), so a new engine request fires on next render — correct.
- OBSERVATION: Phase-0 `engineStallKey` is not involved in the takeback path
  (engineRequestId increment handles invalidation instead). Both paths are
  logically separate and non-conflicting.

### In-game review (MoveNavBar, navigate back 2 plies)
- `goToPly(displayedPly - 2)` calls `engineRequestIdRef.current++` when
  `clamped !== totalPlies` (`src/pages/PlayPage.tsx:265-267`) — in-flight engine
  search is invalidated immediately on entering review mode. Correct.
- `setReviewedPly(clamped)` where `clamped < totalPlies` — `isReviewing = true`.
- Engine effect: first line is `if (isReviewing) return` — engine does **not**
  fire while reviewing. Correct.
- Board receives `displayedFen = fenAtPly(game.history, reviewedPly!)` — reads
  `history[ply-1].after`. `fenAtPly` falls back to `STARTING_FEN` for ply 0
  (`src/lib/historyNavigation.ts:7-10`). Correct.
- `displayedDests = emptyDests` (an empty `Map`) — board rejects all drags
  silently while reviewing. Correct.
- Coach panel wrapped in `opacity-60 pointer-events-none` + `aria-hidden` while
  `isReviewing` (`src/pages/PlayPage.tsx:788-790`). Correct.
- Pre-move coaching effect guards `if (isReviewing) return` (`src/pages/
  PlayPage.tsx:322`). Correct.

### Return to live after review
- `handleReturnToLive` sets `reviewedPly(null)` → `isReviewing = false`.
- Engine effect deps include `isReviewing`; on next render after `isReviewing`
  becomes false, if it is the engine's turn, the engine fires. Correct.
- OBSERVATION: If `reviewedPly` points beyond `totalPlies` (possible after rapid
  takeback while reviewing), the defensive effect at `src/pages/PlayPage.tsx:
  279-284` resets `reviewedPly` to null — handled correctly.

---

## Premove legality — stale FEN risk

**RISK** (`src/pages/PlayPage.tsx:478`): After `game.makeMove(chosen)` succeeds
at line 465, the code reads `const newFen = game.fen` at line 478 to check
premove legality. However, `game.fen` is a React `useMemo` derived from
`version`, which has not yet recomputed because `bump()` (called inside
`makeMove`) only schedules a React state update — it does not immediately flush.
The IIFE closure captures the render-snapshot `game` object, so `game.fen` is
the FEN **before** the engine's move was applied.

`premoveStillLegal(newFen, currentPremove)` therefore validates the premove
against the position one ply in the past. A premove that was legal before the
engine's move (e.g., capturing a piece) may pass this stale check even if the
engine already captured the target square, leading to an illegal-move attempt in
the `setTimeout` callback at line 483. That attempt is caught by
`useChessGame.makeMove`'s `try/catch` and returns `null` without error — the
premove is silently dropped.

Game state is **not corrupted** (the move is rejected), but the user gets no
feedback that their premove was ignored. **Severity: RISK** (silent UX failure,
not a crash or data corruption).

---

## Aggregate Findings

| # | Severity    | Description                                                          | File:Line                              |
|---|-------------|----------------------------------------------------------------------|----------------------------------------|
| 1 | RISK        | `game.fen` stale in premove legality check after engine move applied  | `src/pages/PlayPage.tsx:478`           |
| 2 | OBSERVATION | `console.warn` in Maia fallback not DEV-gated; fires in production   | `src/engine/opponentEngine.ts:79`      |
| 3 | OBSERVATION | `console.error` in Maia load failure not DEV-gated                   | `src/pages/PlayPage.tsx:134`           |
| 4 | OBSERVATION | `console.error('[ErrorBoundary]', ...)` fires unconditionally         | `src/components/ErrorBoundary.tsx:19`  |
| 5 | OBSERVATION | Default coach mode is `warnings`; coaching style only visible in Full | `src/pages/PlayPage.tsx:55`            |
| 6 | OBSERVATION | Lichess book API failures are silent (safe fallback but invisible)    | `src/engine/openingBook.ts:87-89`      |
| 7 | OBSERVATION | Theme/piece-set switching is safe; no game-state side-effects         | `src/components/board/BoardThemeProvider.tsx` |

**Summary counts: 0 FAIL / 1 RISK / 6 OBSERVATIONS**

---

## Phase-0 Fix Verification

**`engineStallKey` retry logic in `src/pages/PlayPage.tsx` is SOUND.**

- `engineStallKey` is declared at line 98 as `useState(0)`.
- The engine `useEffect` includes `engineStallKey` in its dependency array at
  line 515.
- When `game.makeMove()` returns `null` (illegal move from stale FEN, typically
  caused by a "Play from here" race), `setEngineStallKey((k) => k + 1)` is
  called at line 471.
- This increments the state value, causing the engine effect to re-run on the
  next render with the fresh `game.fen` and `game.turn`.
- The `engineRequestId` is incremented at the top of each effect run (line 407),
  so any previous in-flight request is discarded before the retry.
- The fix correctly handles the `fenBefore` drift scenario without looping
  (the retry succeeds with the fresh position).

**Phase-0 fix: VERIFIED SOUND.**

---

## Dev-Server Smoke Test

- `npm run dev` started at `http://localhost:5173/ChessCoach/`.
- `curl http://localhost:5173/ChessCoach/` returned HTTP 200 with valid HTML
  containing `<div id="root"></div>` and the Vite module script.
- No server-side errors observed. Vite ready in ~128ms.
- Server killed after smoke test.
