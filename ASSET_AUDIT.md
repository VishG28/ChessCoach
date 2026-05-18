# Asset Audit — Piece-Set 404s on GitHub Pages

**Date:** 2026-05-17
**Branch:** themes-fix
**Site:** https://vishg28.github.io/ChessCoach/
**Vite base:** `/ChessCoach/`

---

## 404s Observed (pre-fix)

Captured via `scripts/asset-audit.mjs` against a production build served at `http://localhost:3000/ChessCoach/`:

```json
[
  {
    "url": "http://localhost:3000/pieces/fantasy/wK.svg",
    "status": 404
  },
  {
    "url": "http://localhost:3000/pieces/cburnett/wK.svg",
    "status": 404
  },
  {
    "url": "http://localhost:3000/pieces/merida/wK.svg",
    "status": 404
  },
  {
    "url": "http://localhost:3000/pieces/alpha/wK.svg",
    "status": 404
  }
]
```

The audit script iterates all 4 piece sets and records failed responses. The requests go to `/pieces/<set>/<piece>.svg` (no `/ChessCoach/` prefix) — resolving to the server root — which 404s because the assets live under `/ChessCoach/pieces/`. In practice on the live site each piece set generates up to 12 × 404s (all 12 piece SVGs), but the audit script exercises the king piece as first-load representative.

**Pre-fix 404 count: 4 (one per piece set in audit; full production impact is 36+ 404s across all non-standard sets)**

---

## Asset Files Present in public/

```
public/pieces/alpha/bB.svg
public/pieces/alpha/bK.svg
public/pieces/alpha/bN.svg
public/pieces/alpha/bP.svg
public/pieces/alpha/bQ.svg
public/pieces/alpha/bR.svg
public/pieces/alpha/wB.svg
public/pieces/alpha/wK.svg
public/pieces/alpha/wN.svg
public/pieces/alpha/wP.svg
public/pieces/alpha/wQ.svg
public/pieces/alpha/wR.svg
public/pieces/cburnett/bB.svg
public/pieces/cburnett/bK.svg
public/pieces/cburnett/bN.svg
public/pieces/cburnett/bP.svg
public/pieces/cburnett/bQ.svg
public/pieces/cburnett/bR.svg
public/pieces/cburnett/wB.svg
public/pieces/cburnett/wK.svg
public/pieces/cburnett/wN.svg
public/pieces/cburnett/wP.svg
public/pieces/cburnett/wQ.svg
public/pieces/cburnett/wR.svg
public/pieces/fantasy/bB.svg
public/pieces/fantasy/bK.svg
public/pieces/fantasy/bN.svg
public/pieces/fantasy/bP.svg
public/pieces/fantasy/bQ.svg
public/pieces/fantasy/bR.svg
public/pieces/fantasy/wB.svg
public/pieces/fantasy/wK.svg
public/pieces/fantasy/wN.svg
public/pieces/fantasy/wP.svg
public/pieces/fantasy/wQ.svg
public/pieces/fantasy/wR.svg
public/pieces/merida/bB.svg
public/pieces/merida/bK.svg
public/pieces/merida/bN.svg
public/pieces/merida/bP.svg
public/pieces/merida/bQ.svg
public/pieces/merida/bR.svg
public/pieces/merida/wB.svg
public/pieces/merida/wK.svg
public/pieces/merida/wN.svg
public/pieces/merida/wP.svg
public/pieces/merida/wQ.svg
public/pieces/merida/wR.svg
```

**Total: 48 SVG files (4 sets × 12 pieces)**

---

## Path Construction Patterns

### Broken patterns (cause 404 on GH Pages)

**`src/styles/pieceSets.css` — 48 absolute `url('/...')` rules:**

```
src/styles/pieceSets.css:21:  background-image: url('/pieces/cburnett/wK.svg');
src/styles/pieceSets.css:22:  background-image: url('/pieces/cburnett/wQ.svg');
... (12 rules per set × 4 sets = 48 total)
```

**`src/styles/pieceSets.ts` — 4 absolute `preview: '/...'` strings:**

```
src/styles/pieceSets.ts:16:  preview: '/pieces/cburnett/wK.svg',
src/styles/pieceSets.ts:22:  preview: '/pieces/fantasy/wK.svg',
src/styles/pieceSets.ts:28:  preview: '/pieces/merida/wK.svg',
src/styles/pieceSets.ts:34:  preview: '/pieces/alpha/wK.svg',
```

### Safe patterns (not affected)

Engine and worker files use `import.meta.env.BASE_URL` which Vite correctly replaces with `/ChessCoach/` at build time:

```
src/router.tsx:26:        import.meta.env.BASE_URL.replace(...)
src/engine/maiaWorker.ts:10: ort.env.wasm.wasmPaths = `${import.meta.env.BASE_URL}ort/`
src/engine/engine.ts:5:  `${import.meta.env.BASE_URL.replace(/\/$/, '')}/engine/...`
src/engine/maia.ts:6:    const BASE = import.meta.env.BASE_URL.replace(...)
```

---

## Root Cause

Vite does **not** rewrite absolute `url('/...')` references in CSS or string-literal `<img src>` paths; on a deployment with `base: '/ChessCoach/'`, these resolve to the server root and 404.

---

## Affected Piece Sets

- **loco** (fantasy SVGs) — 12 × 404 per page load
- **classic** (merida SVGs) — 12 × 404 per page load
- **minimal** (alpha SVGs) — 12 × 404 per page load
- **standard** (cburnett SVGs) — 12 × 404, but chessground ships a bundled cburnett fallback that kicks in silently, masking the failure

**Board themes affected:** None. All board themes use CSS variables, runtime data-URL SVGs (marble), or CSS gradients (wood) — no external file paths. Marble visual fidelity (flat tiles vs. stone texture) is a separate concern handled in Phase D.
