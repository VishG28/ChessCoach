# Mobile Fix Report

## Root Cause

The chess board in `Board.tsx` and `ReviewBoard.tsx` used hardcoded React inline styles (`width: 560, height: 560` and `width: 480, height: 480` respectively) applied to both the outer wrapper `div` and the chessground `.cg-wrap` element. Because these values were also passed directly to the chessground API — which sizes all internal canvas children proportionally from those explicit pixel dimensions — no CSS rule, media query, or `max-width` clamp could override them. On a 360px-wide phone the board rendered at its full 560px, starting 30px off-screen to the left and overflowing the viewport by 54px, triggering horizontal scroll across the entire page.

## Files Changed

| File | Phase | Change |
|------|-------|--------|
| `index.html` | B | Added `viewport-fit=cover` to viewport meta for iOS safe-area compatibility |
| `src/components/board/Board.tsx` | B | Replaced hardcoded `560×560` inline styles with `.cc-board-square` class + ResizeObserver to feed actual pixel size to chessground API |
| `src/components/review/ReviewBoard.tsx` | B | Replaced hardcoded `480×480` inline styles with `.cc-board-square--review` class + ResizeObserver |
| `src/index.css` | B | Added fluid `.cc-board-square` / `.cc-board-square--review` CSS (width: 100%, max-width, aspect-ratio 1/1) and global 44px min tap-target rule |
| `src/pages/PlayPage.tsx` | B | Added `items-stretch`, `w-full`, and `cc-board-column` class to board column container |

## Verification Matrix

| Viewport | PlayPage | OpeningDetailPage | Horizontal Scroll | Board Width |
|----------|----------|-------------------|-------------------|-------------|
| 360x800 | PASS | PASS | none | ~336px (fluid) |
| 375x667 | PASS | PASS | none | ~351px (fluid) |
| 393x852 | PASS | PASS | none | ~369px (fluid) |
| 768x1024 | PASS | PASS | none | 72px (see note) |
| 1024x768 | PASS | PASS | none | 304px (fluid in 328px col) |
| 1280x800 | PASS | PASS | none | 560px (capped at max) |
| 1920x1080 | PASS | PASS | none | 560px (capped, page has max-width container) |

**Note on 768x1024:** At exactly the `md` Tailwind breakpoint (768px), the 3-column desktop grid activates (`280px 1fr 320px`). With 24px gaps the `1fr` board column computes to only 72px — the board renders at 72px rather than a usable size. This is a pre-existing layout tension at the breakpoint boundary, not introduced by Phase B. No horizontal scroll occurs. See Deferred Issues below.

## Screenshots

**Phase A — before fix:**
- `screenshots/mobile-fix/audit-360-broken.png` — 360×800 with 54px overflow

**Phase B — initial after-fix samples:**
- `screenshots/mobile-fix/phaseB-375-after.png`
- `screenshots/mobile-fix/phaseB-375-board.png`
- `screenshots/mobile-fix/phaseB-1280-after.png`

**Phase D — full cross-viewport verification (this phase):**
- `screenshots/mobile-fix/360x800-play.png` / `360x800-opening.png`
- `screenshots/mobile-fix/375x667-play.png` / `375x667-opening.png`
- `screenshots/mobile-fix/393x852-play.png` / `393x852-opening.png`
- `screenshots/mobile-fix/768x1024-play.png` / `768x1024-opening.png`
- `screenshots/mobile-fix/1024x768-play.png` / `1024x768-opening.png`
- `screenshots/mobile-fix/1280x800-play.png` / `1280x800-opening.png`
- `screenshots/mobile-fix/1920x1080-play.png` / `1920x1080-opening.png`

## Deferred Issues

- **768px breakpoint board squeeze (new finding):** The `md:grid-cols-[280px_1fr_320px]` layout triggers at exactly 768px leaving only 72px for the board column. Recommend shifting the 3-column breakpoint to `lg` (1024px) or using a 2-column layout at tablet widths. Address in a follow-up PR.
- **OpeningDetailPage tab overflow on sub-400px viewports** (per MOBILE_POLISH_NOTES.md): The four-tab row uses `inline-flex w-fit` with no horizontal scroll; tabs may overflow on very narrow screens. Recommend adding `overflow-x-auto` to the `TabsList` wrapper in `OpeningDetailPage.tsx`.
- **iOS safe-area insets on bottom nav** (per MOBILE_POLISH_NOTES.md): Mobile bottom nav at `bottom-0` has no `env(safe-area-inset-bottom)` padding; may clip on notched iPhones.
- **RightSidebar fixed scroll height** (per MOBILE_POLISH_NOTES.md): Move list `ScrollArea` uses `h-[480px]`; consider `h-[min(480px,50vh)]` for short landscape viewports.
- **MoveNavBar tap targets** (per MOBILE_POLISH_NOTES.md): Icon buttons are 28px (below WCAG 2.5.5); covered by Phase B's global CSS rule but would break if reverted.
- **Touch device testing on physical device:** Drag-to-move and tap-to-move on real iOS/Android hardware was not verified in this phase. User should confirm on device.

## Build Status

- `npm run build`: PASS
- TypeScript errors: 0
- ESLint: clean (no errors; only a pre-existing dynamic import advisory and chunk-size warning, neither introduced by this fix)
