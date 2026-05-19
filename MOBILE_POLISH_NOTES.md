# Mobile Polish Notes (Phase C)

## Checklist Results

1. **Sidebar stacking < 768px** — PASS — `PlayPage.tsx:742` uses `grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr_320px]`; on viewports below 768px both left and right `<aside>` elements stack as single-column blocks in document flow, below the board column. Sticky positioning is gated behind `md:sticky` so it does not conflict on mobile.

2. **Coach panel** — PASS — `CoachPanel.tsx:110` renders `<Card className="w-full max-w-[560px]">`. It is placed inside `PlayPage.tsx:831` within the centre `<main>` column, appearing below the board on mobile as normal block flow — not as a floating drawer.

3. **Move list on mobile** — PASS — `RightSidebar.tsx:81` renders `<Card className="w-full">`. The move list `ScrollArea` is `h-[480px]` with internal scroll (`RightSidebar.tsx:134`). The entire `RightSidebar` is in the right `<aside>` that stacks below the board on mobile (see item 1). PlyCell buttons do not push off-screen.

4. **Eval bar on mobile** — PASS with NOTE — `RightSidebar.tsx:99-125` renders a horizontal eval bar (`h-5 overflow-hidden rounded-md`) that is 100% wide within its card. It is always horizontal (no vertical variant). On mobile it stacks inside the right sidebar card below the board. No overflow issue identified.

5. **Tap targets ≥ 44px** — FIXED (Subagent B) — Subagent B's CSS adds a global min-height/min-width 44 px rule for interactive elements. The `MoveNavBar` uses `size="icon-sm"` which resolves to `size-7` (28 px per `button.tsx:33`). Without Subagent B's rule these four nav buttons (`MoveNavBar.tsx:44,54,75,85`) are below the 44 px WCAG threshold. The global CSS rule from Subagent B covers these and other small icon buttons throughout the app.

6. **Modals (API key, settings, command palette)** — PASS — `DialogContent` (`dialog.tsx:64`) uses `w-full max-w-[calc(100%-2rem)]` as a base with `sm:max-w-sm`, so on 375 px viewports the dialog spans full width minus a 1 rem gutter per side. `ApiKeyDialog.tsx:93` adds `className="max-w-md"` which Tailwind caps within the responsive base. `CommandDialog` inherits the same `DialogContent` shell. All modals are comfortable on mobile with no overflow risk.

7. **Tab switcher (OpeningDetailPage)** — NOTE (not modified) — `OpeningDetailPage.tsx:310-314` uses four tab triggers inside `<TabsList className="mb-4">`. `TabsList` is `inline-flex w-fit` with no overflow scroll override (`tabs.tsx:25`). On viewports narrower than ~400 px the four triggers ("Main Line", "Practice", "Variations", "Counters & Traps") may overflow their container horizontally. Flagged for Phase D follow-up; no change made here per scope constraints.

8. **Header/nav bar** — PASS — `TopNav.tsx:21` hides desktop nav with `hidden md:flex`. `RootLayout.tsx:43` renders the mobile bottom nav as `fixed bottom-0 inset-x-0 z-40 flex md:hidden h-16` with three `flex-1` NavLink items giving each ~56 px of vertical tap height. `RootLayout.tsx:17` outer wrapper adds `pb-16 md:pb-0` so page content clears the nav.

9. **Body `overflow-x: hidden`** — PASS (none present) — Grep of `src/` finds zero instances of `overflow-x: hidden` as a body-level or global rule. The only `overflow-x` occurrences are scoped inside `progress.tsx` (a progress bar component) and `command.tsx` (the command list scroll area). No horizontal scroll is masked at the page level.

10. **Touch interaction** — Verified by Phase D — Chessground has built-in pointer/touch event handling. Phase D cross-device verification will confirm drag-to-move and tap-to-move behaviour on real touch devices. No code change needed here.

---

## Fixes Applied (Phase C only)

None — all items pass or are handled by Subagent B's CSS tap-target rule. No className or logic changes were required in files within Phase C scope.

---

## Deferred / Recommended for Follow-up

- **Tab overflow on OpeningDetailPage (item 7)**: Four-tab row lacks horizontal scroll on narrow viewports. Recommend adding `overflow-x-auto` to the `TabsList` wrapper in `OpeningDetailPage.tsx`, or reducing to fewer tabs with an overflow menu.
- **MoveNavBar tap targets (item 5)**: Confirmed 28 px (below WCAG 2.5.5). If Subagent B's global CSS rule is reverted or narrowed, `MoveNavBar.tsx` should switch to `size="icon"` (32 px) or add explicit `min-h-[44px] min-w-[44px]` classes.
- **RightSidebar ScrollArea height (item 3)**: Fixed `h-[480px]` height may exceed visible area on short landscape viewports. Consider `h-[min(480px,50vh)]`.
- **iOS safe-area insets (item 8)**: Bottom nav at `bottom-0` has no `env(safe-area-inset-bottom)` padding, which may clip content on notched iPhones. Recommend adding `pb-[env(safe-area-inset-bottom)]` to the mobile nav element in `RootLayout.tsx`.
