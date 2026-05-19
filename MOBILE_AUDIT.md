# Mobile Board Overflow — Audit Report

**Branch:** emdash/optimize-mobile-4dk  
**Date:** 2026-05-18  
**Auditor:** Phase A sub-agent

---

## 1. Viewport Meta

**File:** `index.html` line 6

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

**Status:** Correct for basic scaling. Missing `viewport-fit=cover` (needed for
iOS safe-area insets) but this is **not the cause** of the board overflow bug.

---

## 2. Board CSS Chain — Every File:Line Affecting Size

### 2a. Primary board component

**File:** `src/components/board/Board.tsx` lines 247-257

```tsx
return (
  // TODO(phase-6-touch): long-press to show attacks
  <div style={{ position: 'relative', width: 560, height: 560 }}>
    <div
      ref={wrapRef}
      className="cg-wrap"
      style={{ width: 560, height: 560 }}
    />
    {failOverlayStyle && <div style={failOverlayStyle} aria-hidden="true" />}
  </div>
)
```

Both the outer wrapper `div` and the chessground `.cg-wrap` div are given
**explicit inline pixel values: `width: 560, height: 560`** (unitless React
pixels → 560 CSS px). Neither has any responsive override. This is the root
sizing constraint.

### 2b. Review board component

**File:** `src/components/review/ReviewBoard.tsx` lines 48-54

```tsx
return (
  <div
    ref={wrapRef}
    className="cg-wrap"
    style={{ width: 480, height: 480 }}
  />
)
```

Same pattern: a fixed 480 px inline size on the `.cg-wrap`. Affects the game
review flow.

### 2c. No other hardcoded board dimensions in `src/`

Grep results:

```
grep -rn "width: *560" src/
  → src/components/board/Board.tsx:249 (outer wrapper)
  → src/components/board/Board.tsx:253 (.cg-wrap)

grep -rn "width: *480" src/
  → src/components/review/ReviewBoard.tsx:52

grep -rn "min-width"  src/  → (no matches)
grep -rn "@media"     src/  → (no matches)
grep -rn "overflow-x" src/  → (no matches)
```

There are **zero `@media` queries** anywhere in `src/`, and **no
`overflow-x`** declarations in source. The CSS files (`src/index.css`,
`src/styles/boardThemes.css`, `src/styles/pieceSets.css`) contain no
board sizing rules — only colour tokens and piece-image references.

### 2d. chessground internal sizing

chessground's API (called in `Board.tsx`'s `useEffect`) receives the same
hardcoded values via `api.set({ width: 560, height: 560, ... })`. The library
scales every internal `<cg-board>` child (ranks, files, pieces, squares)
proportionally to that explicit pixel size, so the overflow propagates into
every descendant element.

---

## 3. Layout Containers at Mobile Breakpoint

**File:** `src/pages/PlayPage.tsx` lines 739-863 (return JSX)

```tsx
<div className="mx-auto w-full max-w-[1280px] px-6 py-8">
  <EngineScopeCard />
  <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr_320px]">

    <aside className="space-y-4 md:sticky md:top-20 md:self-start">
      {/* LeftSidebar */}
    </aside>

    <main className="flex flex-col items-center gap-4">
      {/* CapturedPieces, Board wrapper, etc. */}
      <div className={cn('rounded-lg bg-card p-3 shadow-lg ...')}>
        <Board ... />
      </div>
    </main>

    <aside className="space-y-4 md:sticky md:top-20 md:self-start">
      {/* RightSidebar */}
    </aside>
  </div>
</div>
```

On mobile (`< md` breakpoint):
- The outer div is `w-full` with `px-6` padding — usable width = viewport − 48 px.
- The grid falls back to `grid-cols-1`: sidebars and main stack vertically.
- The `<main>` column is `flex flex-col items-center`, centering its children.
- **There is no `max-width` or `width` constraint on `<main>` that would clamp the
  `<Board>` child.** The board's hardcoded 560 px overflows the available width.

**Measured live at 360 px viewport (Chrome DevTools):**

| Property | Value |
|----------|-------|
| `window.innerWidth` | 500 px (360 device + browser chrome) |
| `.cg-wrap` rendered width | 560 px |
| `.cg-wrap` rendered height | 560 px |
| `boardWrapper.left` (relative to viewport) | −30 px (off-screen left) |
| `boardWrapper.right` | 530 px (off-screen right) |
| `scrollWidth − innerWidth` | 54 px overflow |
| `body.overflowX` | `visible` |
| `html.overflowX` | `visible` |

The board is **54 px wider than the viewport**, starts **30 px off-screen to
the left**, and causes horizontal scrolling.

---

## 4. Hypotheses

| # | Hypothesis | Result | Justification |
|---|-----------|--------|---------------|
| H1 | Hardcoded `width: ~560px` on board ancestor causes overflow + horizontal scroll | **PASS** | `Board.tsx` lines 249 & 253 set both outer wrapper and `.cg-wrap` to exactly 560 px inline; measured DOM confirms 560 px rendered width in a 500 px viewport with 54 px overflow. |
| H2 | `.cg-wrap` falling back to a default that exceeds viewport | **PARTIAL** | The overflow is real, but it is not a CSS fallback — it is an explicit inline value passed to both the DOM element and the chessground API; no fallback mechanism is involved. |
| H3 | Viewport meta missing or wrong | **FAIL** | `width=device-width, initial-scale=1.0` is present and correct; missing `viewport-fit=cover` is cosmetic (iOS safe-area) and unrelated to the overflow. |
| H4 | Sidebar flex layout missing `min-width: 0` on children | **FAIL** | PlayPage uses `grid-cols-1` on mobile (not flex), so sidebars stack above/below main and no flex-child shrink issue exists. |
| H5 | `overflow-x: hidden` on body/html masking the real bug | **FAIL** | `grep` finds zero `overflow-x` declarations in `src/`; DevTools confirms both `body` and `html` are `overflow-x: visible` at runtime. |

---

## 5. Root Cause

The chess board renders at a fixed 560 px width (480 px for the review board)
set via hardcoded React inline styles in `src/components/board/Board.tsx` and
`src/components/review/ReviewBoard.tsx`. These values are also passed directly
to the chessground library API, which sizes all internal board children
proportionally. Because there are no `@media` queries, no `max-width` clamps,
and no `min()`/`clamp()` fluid expressions anywhere in the codebase, the board
renders at full 560 px even on a 360 px phone screen, overflowing the viewport
by ~54 px, pushing itself 30 px off the left edge, and triggering horizontal
scroll on the page.

---

## 6. Recommended Fix (outline for Phase B)

Replace the two hardcoded pixel values with a fluid container approach:

1. **Remove the inline `width`/`height` from both `<div>` wrappers in `Board.tsx`.**
2. **Add a fluid outer wrapper** that constrains the board's available width:
   ```tsx
   // Fluid container: fills available column width, never exceeds 560 px
   <div style={{ width: '100%', maxWidth: 560, aspectRatio: '1 / 1' }}>
     <div ref={wrapRef} className="cg-wrap" style={{ width: '100%', height: '100%' }} />
   </div>
   ```
3. **Pass the actual rendered pixel size to chessground** via `ResizeObserver` on
   the wrapper ref, calling `api.set({ width, height })` on change. chessground
   requires explicit pixel dimensions for its canvas-like internal layout.
4. **Apply the same pattern to `ReviewBoard.tsx`** (480 px → fluid with max 480 px).
5. Optionally add `viewport-fit=cover` to the viewport meta for iOS safe-area
   compatibility (unrelated to the overflow bug but good hygiene).

---

## 7. Screenshots

| File | Description |
|------|-------------|
| `screenshots/mobile-fix/audit-360-broken.png` | 360 × 800 viewport — board overflows right/left edges, horizontal scroll present |

The screenshot was captured at 360 px device width. The board is visibly
cropped on both the left and right sides, confirming the 54 px measured overflow.
