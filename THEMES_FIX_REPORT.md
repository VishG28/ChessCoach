# Themes Fix — Integration Report

**Branch:** themes-fix
**Date:** 2026-05-17
**Commits:** 3da6ab8, 8a8770b, cf0c6b4, 69ae1c8, de74eb1, cbac15b, 45d709a (+ E integration commit)

---

## Summary

On GitHub Pages, all non-standard piece sets (loco, classic, minimal) showed empty squares because `src/styles/pieceSets.css` used absolute `url('/pieces/...')` paths that Vite does NOT rewrite with the configured `base: '/ChessCoach/'` prefix. The fix migrates all 48 SVGs to ES-module imports so Vite hashes and base-prefixes them automatically, then injects resolved URLs as CSS custom properties at runtime. Additionally, board coordinate labels were unstyled on several themes (low contrast on dark or textured squares), which was corrected with per-theme WCAG-AA validated colors. The marble theme's procedural flat-color tile generation was replaced with inline SVG turbulence textures for genuine stone fidelity. A provenance investigation confirmed the "loco" set is correctly aliased to chessground's fantasy set (no distinct "loco" set exists outside this repository). All 24 theme x piece-set combinations now pass automated verification with zero failed requests.

---

## Root Causes Fixed

See [ASSET_AUDIT.md](ASSET_AUDIT.md) for the full pre-fix network trace.

**Primary:** `src/styles/pieceSets.css` contained 48 `url('/pieces/<set>/<piece>.svg')` rules with absolute paths. Vite only rewrites `url()` references inside CSS when those files are properly imported as assets with Vite's asset pipeline. Absolute paths beginning with `/` are treated as server-root-relative and never base-prefixed.

**Secondary:** `src/styles/pieceSets.ts` used `preview: '/pieces/<set>/wK.svg'` strings (hardcoded absolute paths) for the picker preview images -- same class of bug.

**Affected sets pre-fix:** loco, classic, minimal. Standard appeared to work because chessground ships a cburnett CSS fallback that activates when our CSS rules fail to resolve.

---

## Asset Path Strategy

All 48 piece SVGs were moved from `public/pieces/` to `src/assets/pieces/` and imported as ES modules in `src/styles/pieceSets.module.ts`. Vite processes these imports at build time: it hashes the filenames (e.g. `wK-By60gHvb.svg`), places them under `dist/assets/`, and emits the full base-prefixed URL (`/ChessCoach/assets/wK-By60gHvb.svg`) into the JS bundle. `PieceSetProvider.tsx` reads these Vite-resolved URLs from `PIECE_URLS` and injects them as CSS custom properties (`--cg-piece-wK`, `--cg-piece-bK`, etc.) on `document.documentElement`. `pieceSets.css` then has 12 clean `background-image: var(--cg-piece-*)` rules with no hardcoded paths. This approach is robust against any future `base` path change: renaming the GitHub Pages repo, deploying to a sub-path, or switching to a CDN -- the SVG URLs all follow automatically.

Post-fix: 12 hashed SVG files in `dist/assets/`. Zero piece-related 404s in post-fix network trace.

---

## Coordinate Contrast

See [COORD_CONTRAST_REPORT.md](COORD_CONTRAST_REPORT.md) for per-theme ratio table (all >= 4.5:1 WCAG AA).

**Selector discovery (Phase B):** The plan assumed `cg-board coords coord` but chessground renders `<coords>` as a child of `<cg-container>` (sibling to `<cg-board>`, not a descendant). The correct selector is `cg-container coords coord`. This was discovered empirically by inspecting the live DOM and corrected before committing.

**Implementation:** `BoardThemeProvider.tsx` now sets `data-board-theme` on `<html>` when a theme is applied. `boardThemes.css` uses `:root[data-board-theme='<id>'] cg-container coords coord:nth-child(odd/even)` selectors with validated hex color pairs. Textured themes (wood, marble) also receive a subtle dual-direction `text-shadow` for belt-and-suspenders legibility against variable pixel colors.

---

## Loco Resolution

See [LOCO_INVESTIGATION.md](LOCO_INVESTIGATION.md).

Outcome: **kept fantasy alias** (recommendation (a)). No distinct "loco" chess piece set exists in any known open-source or commercial registry. The name "loco" is a project-internal label; the actual SVGs are Lichess's fantasy set (chunky bold design with thick outlines). The `110% 110%` background-size override in pieceSets.css is intentional to compensate for this set's natural sizing within chessground squares.

---

## Marble Approach

See [MARBLE_AUDIT.md](MARBLE_AUDIT.md).

**Phase D used Option 2 (procedural SVG)** -- no external texture images were required. The original `buildMarbleSvg` function (64 flat-colored `<rect>` elements) was replaced with an SVG that uses radial gradients for base stone color variation plus an `<feTurbulence baseFrequency="0.05" numOctaves="4"/>` filter for veining noise. Light squares render as warm Carrara-style ivory; dark squares render as sage-green Verde Alpi-style stone. The `src/assets/themes/marble/light.svg` and `dark.svg` files are imported as ES modules (same Vite asset pipeline as piece SVGs) and injected as `--cc-marble-light`/`--cc-marble-dark` CSS variables. No external HTTP requests are ever made for board textures.

---

## Verification Matrix

See [THEME_PIECE_MATRIX.md](THEME_PIECE_MATRIX.md).

| Theme \ Piece | Standard | Loco | Classic | Minimal |
|---|---|---|---|---|
| Classic   | PASS | PASS | PASS | PASS |
| Green     | PASS | PASS | PASS | PASS |
| Marble    | PASS | PASS | PASS | PASS |
| Wood      | PASS | PASS | PASS | PASS |
| Bubblegum | PASS | PASS | PASS | PASS |
| Midnight  | PASS | PASS | PASS | PASS |

All 24 combinations pass. 32 pieces rendered, 12 distinct background-image URLs, 0 failed requests per cell.

---

## Bundle Delta

| Asset | Baseline (gzip) | Post-fix (gzip) | Delta |
|---|---|---|---|
| `index-*.js` | 431.25 kB | 450.71 kB | +19.46 kB (+4.5%) |
| `index-*.css` | 22.13 kB | 22.59 kB | +0.46 kB (+2.1%) |

Raw sizes: JS 1527.90 kB (was 1466.03 kB), CSS 112.34 kB (was 109.66 kB).

The JS delta comes from: (a) 48 ES-module SVG imports now bundled inline as base64 data-URIs in the JS chunk, (b) marble SVG turbulence textures (~2 kB each). The CSS delta is from coord contrast rules (12 selectors x 6 themes) plus marble texture CSS.

---

## Files Touched

Output of `git diff --stat main...themes-fix`:

```
 ASSET_AUDIT.md                                | 176 ++++++
 COORD_CONTRAST_REPORT.md                      |  69 +++
 LOCO_INVESTIGATION.md                         |  67 ++
 MARBLE_AUDIT.md                               | 159 +++++
 docs/screenshots/coords/ (12 screenshots)     | binary
 docs/screenshots/marble-after.png             | binary
 docs/screenshots/marble-before.png            | binary
 package-lock.json                             | 849 +++---
 package.json                                  |   5 +-
 scripts/asset-audit.mjs                       |  20 +
 scripts/contrast-check.mjs                    |  45 ++
 scripts/coord-screenshots.mjs                 |  53 ++
 src/assets/pieces/ (48 SVGs moved)            | rename
 src/assets/themes/marble/dark.svg             |  32 +
 src/assets/themes/marble/light.svg            |  32 +
 src/components/board/BoardThemeProvider.tsx   |  27 +-
 src/components/board/PieceSetProvider.tsx     |   6 +
 src/styles/boardThemes.css                    |  99 ++-
 src/styles/pieceSets.css                      |  83 +--
 src/styles/pieceSets.module.ts                |  75 +++
 src/styles/pieceSets.test.ts                  |  15 +
 src/styles/pieceSets.ts                       |  38 +-
 vitest.config.ts                              |  16 +
 81 files changed, 1337 insertions(+), 529 deletions(-)
```

---

## Out-of-Scope Items Observed

These issues were noticed but NOT fixed in this worktree (scope guardrail enforced):

1. **Large JS bundle warning** -- Vite reports `index-*.js` exceeds 500 kB after minification. Root cause is the ONNX runtime and Maia worker being bundled into the main chunk. Recommendation: code-split `maiaWorker` with dynamic `import()` or move to a separate entry point.

2. **`node:fs` / `node:path` externalization warnings** -- `@anthropic-ai/sdk` imports Node.js built-ins that Vite externalizes for browser compatibility. These appear as build warnings, not errors; runtime behavior is unaffected. Should be addressed by configuring Vite's `resolve.conditions` or switching to the SDK's browser export.

3. **Standard piece set fallback dependency** -- Pre-fix, Standard worked only because chessground's internal cburnett fallback CSS activated when our rules 404'd. Post-fix, Standard uses our deterministic ES-module path. Users who had the old build cached may see a flash on first load until the new assets resolve from cache.

4. **No dark/light mode theming for marble textures** -- The marble SVG textures use fixed color palettes regardless of the app's light/dark mode toggle. A future enhancement could adapt the marble light texture's warmth for dark-mode users.
