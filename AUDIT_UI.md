# AUDIT_UI — UI/UX Verification

## Scope
- IN scope: eval bar, move list, coach panel, board arrows, review controls, debug panel, shortcuts, onboarding, rating modal, responsive, a11y.
- OUT of scope (handled in another worktree): piece sets, board themes, coord readability.

## Summary
- 8/11 PASS, 3 PARTIAL, 0 FAIL, 0 NOT_IMPLEMENTED

---

## Findings

### 1. Eval bar
**Status:** PASS

**Evidence:**
- `src/components/sidebar/RightSidebar.tsx:99–125` renders a horizontal bar using `role="meter"` with `aria-label="Position evaluation, White's share"`, `aria-valuemin/max/now`.
- Width is driven by `whitePct` from `evalToWhiteShare()` (`src/lib/evalShare.ts:8`), which uses a logistic function (cp/400).
- `transition-[width] duration-300 ease-out` at line 109 provides live, animated updates.
- Mate score handled in `evalShare.ts:12` (returns 0 or 1).
- `evalCpWhitePov` prop is passed from `PlayPage.tsx:667` using `displayedEvalCpWhitePov`, which switches between live and reviewed-position eval.

---

### 2. Move list — SAN + classifications
**Status:** PARTIAL

**Evidence:**
- The live play sidebar (`RightSidebar.tsx:207`) renders `move.san` in `PlyCell`. No classification glyphs (`?`, `??`, `!`, `!!`, `?!`) are displayed — only a 📖 badge for book moves.
- The review surface (`src/components/review/MoveList.tsx:44–55`) renders `move.san` plus a `ClassDot` component (line 55). The dot is a colored circle keyed to `Classification` values: `best | good | inaccuracy | mistake | blunder` (`src/games/classification.ts`).
- **Gap:** Classification uses color-coded dots, not the traditional chess annotation glyphs (`?`, `??`, `!`, `!!`, `?!`). The spec calls for those symbols; they are absent in both the live sidebar and the review list. The live sidebar (`RightSidebar.tsx`) shows no classification indicator at all.

---

### 3. Coach panel
**Status:** PASS

**Evidence:**
- `src/components/coaching/CoachPanel.tsx:82–199` renders threats as a `<ul>` with bullet list items (line 247), captures as a second `<ul>` (line 289), and blunder alerts in a card.
- `src/components/coaching/CoachMessage.tsx:51–58` defines custom `mdComponents` for `ul`, `ol`, `li` with `list-disc` / `list-decimal` classes, and `<strong>` styled with `--primary`.
- Deep-coach messages render via `ReactMarkdown` with `remarkGfm`, streaming incrementally.
- Mode badge, "thinking…" and "Engine thinking…" indicators present with appropriate styling (lines 117–143).
- `decorate()` at line 26 prefixes bullet lines with ↗ / ⚠ glyphs based on arrow flags.

---

### 4. Board arrows
**Status:** PASS

**Evidence:**
- `src/components/board/BoardArrows.ts` exports `bestMoveShape()` (line 11) using `cc-best` brush and `threatShapes()` (line 26) using `cc-threat` brush.
- Custom brushes registered in `Board.tsx:135–141` with hex colors to avoid canvas OKLch parsing issues.
- `PlayPage.tsx:691–693`: `shapes` is set to `[]` when `isReviewing`, and to `[bestArrow, ...threatArrows]` filtered for non-null otherwise — arrows are correctly hidden during review.
- Both `bestArrow` and `threatArrows` also gate on `arrowsMaster`, `arrowsBest`, `arrowsThreats` user prefs (lines 676–689).

---

### 5. In-game review controls
**Status:** PASS

**Evidence:**
- `src/components/board/MoveNavBar.tsx` renders First (`ChevronsLeft`), Prev (`ChevronLeft`), Next (`ChevronRight`), Last (`ChevronsRight`) buttons with `aria-label`s, plus "Return to Live" button when `isReviewing` is true (line 94).
- `RightSidebar.tsx:149–166` renders the move list where each `PlyCell` is a `<button>` with `onClick={() => onSelectPly(ply)}` — move-list click jumps to position.
- `PlayPage.tsx:610–613` wires keyboard shortcuts via `useShortcut`: `arrowleft`, `arrowright`, `home`, `end`.
- `aria-live="polite"` on the move counter (`MoveNavBar.tsx:67`) announces position changes.

---

### 6. Debug panel
**Status:** PARTIAL

**Evidence:**
- `src/components/debug/DebugOverlay.tsx` shows: Elo slider value, Skill Level, Depth, Movetime, MultiPV, Randomness (lines 22–27), last 5 engine moves with cp/roll (lines 30–63), top MultiPV candidates table (lines 64–88), last opponent move source (lines 89–94), recent UCI commands (lines 96–99).
- Toggled by backtick at `PlayPage.tsx:161`: `useShortcut('`', () => setDebugOpen((v) => !v))`.
- **Missing vs. spec:**
  - "Last 5 evals" as a distinct rolling list — the overlay shows last engine moves but no separate list of the last 5 centipawn evaluations from Stockfish analysis.
  - "Current engine type (Maia/Stockfish)" — `lastOpponentSource` shows the source of the last single opponent move but there is no explicit top-level "current engine type" label. `EngineDebugState` (`src/engine/types.ts:17–40`) has no `engineType` field.
  - "Opening book hits" (count) — only the last opponent source is shown; no cumulative book-hit counter is tracked in `EngineDebugState`.
  - "Coaching cost this session" — `costCounter.tsx` tracks `usd` but it is not wired to `DebugOverlay`. The overlay receives only `engine` and `elo` props (`DebugOverlay.tsx:8–10`).

---

### 7. Keyboard shortcuts
**Status:** PARTIAL

**Evidence:**
- `PlayPage.tsx:598–613` wires: `mod+n` (new game), `mod+z` (take back), `f` (flip board), `mod+e` (API key modal), `arrowleft/right/home/end` (review nav), `` ` `` (debug overlay).
- `CommandPalette.tsx:28` wires `mod+k`.
- `ShortcutCheatsheet.tsx:27` wires `?` to open cheatsheet.
- The cheatsheet (`ShortcutCheatsheet.tsx:10–22`) lists all spec'd shortcuts including Esc.
- **Missing:** `Escape` is not registered via `useShortcut` anywhere in the codebase. Radix UI `Dialog` handles Escape natively via `DialogPrimitive.Root`, so modal dismissal via Esc does work for dialogs. However, there is no explicit `useShortcut('escape', ...)` for non-modal Esc contexts. The `Board.tsx:149–152` ESC handler cancels drag/premove via a raw `document.addEventListener('keydown')` and is not reflected in the cheatsheet. The cheatsheet documentation therefore overstates what `useShortcut` explicitly handles.

---

### 8. Onboarding card
**Status:** PASS

**Evidence:**
- `src/components/onboarding/EngineScopeCard.tsx` renders on first visit, gated by `localStorage` key `cc.seenEngineScope.v1` (lines 5–10).
- Explains Maia 1100–1900, Stockfish for stronger players, and redirects sub-1100 users to Lichess.
- Rendered at top of `PlayPage.tsx:702` above the grid.
- Dismissed by "Got it" button (line 55) which persists to localStorage.

---

### 9. "What's my rating?" modal
**Status:** PASS

**Evidence:**
- `src/components/onboarding/RatingHelpModal.tsx` renders a Radix `Dialog` with `DialogTitle` "Finding your rating" and `DialogDescription` "How to pick a fair Elo for the bot."
- Content includes: Chess.com / Lichess rating guidance, start-at-1100 advice, win/loss adjustment rules (lines 24–41).
- Props: `open`, `onOpenChange` — caller-controlled visibility.

---

### 10. Mobile responsive
**Status:** PARTIAL

**Evidence:**
- `RootLayout.tsx:17` adds `pb-16 md:pb-0` to accommodate the mobile bottom nav (`line 26`: `md:hidden` fixed bar with `aria-label="Mobile navigation"`).
- `PlayPage.tsx:703`: layout switches from `grid-cols-1` to `grid-cols-[280px_1fr_320px]` at `md` breakpoint. Sidebars stack above/below the board on mobile.
- **Gap — fixed board size:** `Board.tsx:249, 253` hardcodes `width: 560, height: 560` in inline styles. There is no responsive scaling — the board will overflow horizontally on screens narrower than ~620px (560px + padding), violating the "board scales" requirement.
- **Gap — drawers:** The spec requires "single-column with drawers" on mobile. The sidebars collapse to stacked `<aside>` blocks in single-column flow; no Drawer or Sheet components exist anywhere in the codebase. Users must scroll past sidebars to reach the board.
- **Gap — 44px tap targets:** Button sizes are `h-7` (sm, 28px), `h-8` (default, 32px), `h-9` (lg, 36px), `icon-sm` is `size-7` (28px) (`button.tsx:23–34`). All are below 44px. The MoveNavBar uses `icon-sm`. No `min-h-11` override is applied for mobile touch.

---

### 11. Accessibility
**Status:** PARTIAL

**Evidence:**
- **Eval bar:** `role="meter"` with full `aria-value*` attributes (`RightSidebar.tsx:102–106`). PASS.
- **Nav buttons:** All MoveNavBar buttons have `aria-label` (`MoveNavBar.tsx:47, 57, 78, 88, 99`). PASS.
- **Move counter:** `aria-live="polite"` present (`MoveNavBar.tsx:67`). PASS.
- **Focus rings:** `button.tsx:8` includes `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50`; `index.css:195` applies `outline-ring/50` globally. Focus rings present on all interactive elements. PASS.
- **Mobile nav:** `RootLayout.tsx:27` has `aria-label="Mobile navigation"` on `<nav>`. PASS.
- **Coach messages:** No `aria-live` region on `CoachPanel` or `CoachMessage`. New messages appear silently to screen readers. This is the primary a11y gap for the coaching feature.
- **Board squares:** Chessground does not natively expose `aria-label` on individual squares. `Board.tsx` adds no ARIA overlay — keyboard navigation between squares is not supported.

---

## Other Observations

- `DebugOverlay` does not accept or display coaching cost; `CostCounterProvider` / `useCostCounter` exists (`src/coaching/costCounter.tsx`) but is not wired to the overlay.
- The cheatsheet lists Esc but the shortcut is handled by Radix and a raw DOM listener, not `useShortcut` — creating a documentation inconsistency.
- Live game move list (`RightSidebar.tsx`) shows no classification indicator whatsoever; `MoveEntry.classification` is populated by the game logger but `PlyCell` renders only `move.san`.
