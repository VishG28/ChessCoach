# Marble Theme Fidelity Audit — Phase D

## Before / After

### Before

`docs/screenshots/marble-before.png` — Classic theme shown for reference contrast.
The original marble implementation used `buildMarbleSvg(palette)` in
`BoardThemeProvider.tsx` which generated an inline SVG of 64 flat-colored
`<rect>` elements. Each square received a solid fill chosen deterministically
from an 8-color palette via `marbleIndex()`. The result read as a tiled
palette grid, not stone — no texture, veining, or material depth.

### After

`docs/screenshots/marble-after.png` — Marble theme with SVG turbulence textures.
Both light and dark squares now render a genuine stone texture:
- **Light squares**: warm cream/ivory with subtle mottled variation (Carrara-style)
- **Dark squares**: sage-green stone with visible depth and darker vein-like variation
  (Verde Alpi-style)
- Checkerboard parity correct: a1 (bottom-left) is dark, h8 (top-right) is light
- All pieces remain legible on both square colors
- Coordinate labels from Phase B remain legible (verified by computed style)

---

## Chosen Approach: Option A — Procedurally Generated SVG Textures

**Rationale for choosing Option A:**
- No external downloads required — fully reproducible from parameters alone
- No license concerns (no third-party assets)
- SVG `<feTurbulence>` + `<feColorMatrix>` + `<feBlend>` filters produce genuine
  stone-like noise patterns
- Vite inlines small SVGs as base64 data URIs automatically — no separate asset
  404 risk on GitHub Pages
- Each SVG is ~1.5 KB source (~2 KB base64) — negligible bundle impact

Options B (CC0 external textures) and C (inline data-URL procedural) were not needed.

---

## Texture Generation Parameters

### Light Square — `src/assets/themes/marble/light.svg`

| Parameter | Value | Purpose |
|-----------|-------|---------|
| Base fill | `#F5F0E1` | Warm cream (palette[0]) |
| Filter ID | `marble-light` | |
| Turbulence 1 type | `fractalNoise` | Smooth organic noise |
| Turbulence 1 baseFrequency | `0.018 0.035` | Low freq = broad sweeping veins |
| Turbulence 1 numOctaves | `4` | Enough detail for realism |
| Turbulence 1 seed | `7` | Deterministic; change to get a different pattern |
| ColorMatrix 1 offsets | `[0.82, 0.79, 0.72]` | Maps noise to warm ivory/light-grey range |
| Turbulence 2 baseFrequency | `0.055 0.08` | Higher freq = fine vein detail |
| Turbulence 2 numOctaves | `3` | |
| Turbulence 2 seed | `13` | |
| ColorMatrix 2 alpha | `0.4` | Fine detail at lower opacity |
| Blend mode (veins) | `multiply` | Merge two turbulence layers |
| Blend mode (final) | `multiply` | Overlay veins onto base fill |

### Dark Square — `src/assets/themes/marble/dark.svg`

| Parameter | Value | Purpose |
|-----------|-------|---------|
| Base fill | `#5C6B58` | Sage/slate green (palette[7]) |
| Filter ID | `marble-dark` | |
| Turbulence 1 type | `fractalNoise` | |
| Turbulence 1 baseFrequency | `0.022 0.04` | Slightly higher than light for more active veining |
| Turbulence 1 numOctaves | `4` | |
| Turbulence 1 seed | `19` | Independent pattern from light |
| ColorMatrix 1 offsets | `[0.55, 0.60, 0.50]` | Maps to dark sage-grey range |
| Turbulence 2 baseFrequency | `0.065 0.09` | Fine detail |
| Turbulence 2 numOctaves | `3` | |
| Turbulence 2 seed | `23` | |
| ColorMatrix 2 alpha | `0.5` | Slightly stronger fine detail on dark |
| Blend mode (veins) | `multiply` | |
| Blend mode (final) | `multiply` | |

---

## CSS Implementation

### Technique: `cg-board` background + `cg-board::after` with `mask-image`

1. **`cg-board`** receives the **light marble texture** as `background-image` tiled
   at `12.5% 12.5%` (one square per tile at 1/8 of board dimensions).

2. **`cg-board::after`** — a `position: absolute; inset: 0` overlay with
   `pointer-events: none; z-index: 0` — receives the **dark marble texture** at the
   same tile size, with a conic-gradient `mask-image` restricting visibility to only
   the dark squares of the checkerboard.

3. The **conic-gradient mask** tiles at `25% 25%` (2x2 squares per tile), anchored
   at `0% 100%` (left edge, bottom edge) so the opaque quadrant of the first tile
   aligns with a1 (bottom-left = dark, as chess requires).

4. `z-index: 0` keeps `::after` below chessground pieces (`z-index: 2`) and square
   highlights (`z-index: 1`).

5. `-webkit-mask-*` vendor prefixes are included alongside standard properties.

**Why `::after` and not multi-layer background-image:**
CSS `mask-image` on an element applies to the whole element, masking all background
layers simultaneously. Using `::after` isolates the dark texture into its own
rendering layer where the conic-gradient mask can be applied independently.

---

## `buildMarbleSvg` Removal

`buildMarbleSvg` and its `marbleIndex` import were removed from
`BoardThemeProvider.tsx`. Confirmed zero remaining callers via
`grep -rn buildMarbleSvg src/`. The `marbleHash.ts` utility file itself was left
untouched (out of Phase D scope).

---

## Wood Theme Audit

`docs/screenshots/wood-check.png` — Wood theme visual check.

The wood theme uses a pure-CSS repeating-gradient technique: two
`repeating-linear-gradient` overlays (vertical grain lines at 6px intervals,
diagonal shimmer at 14px) composited on the standard conic-gradient checkerboard.
This reads convincingly as a wood-grain board — grain lines are subtle but visible,
walnut vs. oak contrast is clear.

**Decision: leave wood theme unchanged.** The CSS gradient approach is performant,
has no external asset dependencies, and passes visual inspection.

---

## Verification Summary

| Check | Result |
|-------|--------|
| `npm run build` | exits 0 |
| TypeScript compiles | clean |
| `--cc-marble-light` CSS var set at runtime | YES (2113 chars base64 data URI) |
| `--cc-marble-dark` CSS var set at runtime | YES (2113 chars) |
| `cg-board::after` content | `""` |
| `cg-board::after` background-image | dark marble data URI |
| a1 = dark, h8 = light | confirmed visually |
| Pieces legible on marble | confirmed (all 4 sets tested) |
| Coord colors (Phase B) | intact — odd `rgb(240,238,224)`, even `rgb(46,42,32)` |
| `data-board-theme` attribute (Phase B) | intact |
| Wood theme regression | none |

## Files Changed

| File | Change |
|------|--------|
| `src/assets/themes/marble/light.svg` | NEW — procedural marble light texture |
| `src/assets/themes/marble/dark.svg` | NEW — procedural marble dark texture |
| `src/components/board/BoardThemeProvider.tsx` | Replaced `buildMarbleSvg` with static SVG imports; sets `--cc-marble-light`/`--cc-marble-dark` |
| `src/styles/boardThemes.css` | Replaced marble CSS block with `background-image` + `::after` mask technique |
| `docs/screenshots/marble-before.png` | Classic theme board (pre-marble contrast reference) |
| `docs/screenshots/marble-after.png` | Marble theme with stone textures |
