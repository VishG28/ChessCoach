# AUDIT_DEPLOY — Deployment & Build Verification

## Summary
- 7/10 PASS, 2 PARTIAL, 1 FAIL, 0 NOT_IMPLEMENTED

---

## Findings

### 1. vite.config.ts base
**Status:** PASS
**Evidence:** `vite.config.ts:7` — `base: '/ChessCoach/'` is set correctly.

```ts
// vite.config.ts:6-8
export default defineConfig({
  base: '/ChessCoach/',
```

---

### 2. .github/workflows/deploy.yml
**Status:** PASS
**Evidence:** `.github/workflows/deploy.yml` exists. Key details:
- `deploy.yml:27` — `npm ci --include=optional || npm install --include=optional` (strict with fallback).
- `deploy.yml:28` — `npm run build`.
- `deploy.yml:29-34` — `peaceiris/actions-gh-pages@v3` publishes `./dist` to `gh-pages` branch.
- Trigger: push to `main` or `workflow_dispatch`.

All three spec requirements (npm ci with fallback, build, deploy dist to gh-pages) are met.

---

### 3. Stockfish.wasm path at live URL
**Status:** PASS
**Evidence:** HEAD request to `https://vishg28.github.io/ChessCoach/engine/stockfish-18-lite-single.wasm`

```
HTTP/2 200
content-type: application/wasm
content-length: 7295411
```

7.29 MB wasm file resolves with correct MIME type.

---

### 4. Maia .onnx files at live URLs
**Status:** PASS
**Evidence:** All five shipped models return HTTP 200. Models 1200/1400/1600/1800 are not shipped (404 expected and confirmed for 1200 and 1400).

| URL | Status |
|-----|--------|
| `/maia/maia-1100.onnx` | 200 (3,484,716 bytes) |
| `/maia/maia-1300.onnx` | 200 (3,483,901 bytes) |
| `/maia/maia-1500.onnx` | 200 (3,484,716 bytes) |
| `/maia/maia-1700.onnx` | 200 (3,483,901 bytes) |
| `/maia/maia-1900.onnx` | 200 (3,484,716 bytes) |
| `/maia/maia-1200.onnx` | 404 (not shipped — expected) |
| `/maia/maia-1400.onnx` | 404 (not shipped — expected) |

---

### 5. public/404.html SPA fallback
**Status:** PASS
**Evidence:** `public/404.html` exists (25 lines). Implements the standard GitHub Pages SPA redirect trick: encodes path/search/hash into the query string so React Router can recover the route after hard reload. `pathSegmentsToKeep = 1` at `404.html:11` correctly accounts for the `/ChessCoach` base.

---

### 6. Bundle sizes
**Status:** FAIL
**Evidence:** After `npm run build`:

| Asset | Raw size | Gzip |
|-------|----------|------|
| `index-BaiEWPYC.js` (main bundle) | **1,466.09 kB** | 431.29 kB |
| `index-A-5OZeqv.css` | 109.66 kB | 22.13 kB |
| `maiaWorker-7HmWnDSr.js` | 447.25 kB | (worker, lazy) |
| `ort-wasm-simd-threaded.jsep-CyqnNavA.wasm` | **26,239.90 kB** | 6,244.85 kB |

The main JS bundle is **1,466 kB raw** — nearly 3x the 500 KB spec limit. Vite emits the warning:

```
(!) Some chunks are larger than 500 kB after minification.
```

The ort-wasm file (26 MB) is deployed as a static asset; it is not referenced in `index.html` so it is only fetched when Maia is first used (lazy). The `maiaWorker` (447 kB) is a worker chunk, also not part of initial parse. However, the main JS chunk alone far exceeds 500 KB.

**Verdict:** Main bundle (1,466 kB raw / 431 kB gzip) exceeds the < 500 KB raw spec limit. FAIL.

---

### 7. README.md completeness
**Status:** PARTIAL
**Evidence:** `README.md` (143 lines) covers most required sections:

| Required section | Present? | Notes |
|-----------------|----------|-------|
| Project description | Yes | First paragraph, lines 1-4 |
| Local dev instructions | Yes | Lines 79-86 |
| Deployment section | Yes | Lines 123-131 |
| Privacy section | Yes | Lines 53-61 |
| Engine explanation | Yes | Lines 19-34, covers Maia + Stockfish |
| API key Unicode troubleshooting | Yes | Lines 65-70, em-dash / zero-width space |
| Credits (Stockfish, Maia, Lichess, chessground) | Partial | Lines 73-78 credit Stockfish, Maia, Lichess, onnxruntime-web. `chessground` is listed only in the Architecture section (line 135), not in the Credits section |

**chessground** is missing from the Credits section. Marking PARTIAL.

---

### 8. npm run build — TypeScript & ESLint errors
**Status:** PARTIAL
**Evidence:** Build exits 0 (success). `tsc -b` passes with zero TypeScript errors.

Seven Vite resolver warnings about `node:path` and `node:fs` being externalized from `@anthropic-ai/sdk` (not errors, build still succeeds):

```
[plugin rolldown:vite-resolve] Module "node:path" has been externalized for browser compatibility,
  imported by ".../node_modules/@anthropic-ai/sdk/lib/credentials/types.mjs"
  (and 6 more similar warnings from @anthropic-ai/sdk credential files)
```

ESLint is **not** part of the build script (`bash scripts/copy-ort.sh && tsc -b && vite build`). No `npm run lint` was run; ESLint error count cannot be confirmed from build output alone.

**Verdict:** Zero TypeScript errors confirmed. ESLint not integrated into build — cannot confirm zero ESLint errors. PARTIAL.

---

### 9. npm test passes
**Status:** PASS
**Evidence:** All 48 tests pass, 0 failures, duration 159 ms.

```
ℹ tests 48
ℹ pass 48
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 159.352791
```

Test suite covers: engine resolution (Maia/Stockfish), weakening parameters, `selectMove` logic, board encoding, policy index round-trips, `sampleFromPolicy`, rating bucket clamping, opening book sampling, eval graph conversion, marble index coloring, and API key sanitization/validation.

---

### 10. Live site loads
**Status:** PASS
**Evidence:**

```
HTTP/2 200
content-type: text/html; charset=utf-8
content-length: 861
```

`https://vishg28.github.io/ChessCoach/` returns 200.

---

## Build output (last ~50 lines of npm run build)

```
> initialize-1hb@0.0.0 build
> bash scripts/copy-ort.sh && tsc -b && vite build

vite v8.0.13 building client environment for production...
[plugin rolldown:vite-resolve] Module "node:path" has been externalized for browser compatibility,
  imported by ".../node_modules/@anthropic-ai/sdk/lib/credentials/types.mjs"
[plugin rolldown:vite-resolve] Module "node:fs" has been externalized for browser compatibility,
  (x6 additional similar warnings from @anthropic-ai/sdk credential files)

✓ 3050 modules transformed.
dist/index.html                                                        0.86 kB │ gzip:     0.48 kB
dist/assets/geist-cyrillic-ext-wght-normal-DjL33-gN.woff2              7.42 kB
dist/assets/geist-vietnamese-wght-normal-6IgcOCM7.woff2                8.00 kB
dist/assets/jetbrains-mono-greek-wght-normal-Bw9x6K1M.woff2            9.00 kB
dist/assets/jetbrains-mono-cyrillic-wght-normal-D73BlboJ.woff2        12.10 kB
dist/assets/geist-cyrillic-wght-normal-BEAKL7Jp.woff2                 15.08 kB
dist/assets/jetbrains-mono-latin-ext-wght-normal-DBQx-q_a.woff2       15.19 kB
dist/assets/geist-latin-ext-wght-normal-DC-KSUi6.woff2                16.51 kB
dist/assets/geist-latin-wght-normal-BgDaEnEv.woff2                    29.40 kB
dist/assets/jetbrains-mono-latin-wght-normal-B9CIFXIH.woff2           40.40 kB
dist/assets/maiaWorker-7HmWnDSr.js                                   447.25 kB
dist/assets/ort-wasm-simd-threaded.jsep-CyqnNavA.wasm             26,239.90 kB │ gzip: 6,244.85 kB
dist/assets/index-A-5OZeqv.css                                       109.66 kB │ gzip:    22.13 kB
dist/assets/__vite-browser-external-B4u91bnT.js                        0.09 kB │ gzip:     0.10 kB
dist/assets/index-BaiEWPYC.js                                      1,466.09 kB │ gzip:   431.29 kB

✓ built in 819ms

(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
```

Exit code: 0

---

## Test output (last ~30 lines of npm test)

```
✔ resolveEngine clamps Elo below floor to 1100 Maia (0.490541ms)
✔ resolveEngine at 1100 → Maia 1100 (0.066125ms)
✔ resolveEngine at 1500 → Maia 1500 (0.054875ms)
✔ resolveEngine at 1899 → Maia 1900 (highest Maia bucket) (1.14275ms)
✔ resolveEngine at 1900 → Stockfish depth 10 (0.329834ms)
✔ resolveEngine at 2100 → Stockfish depth 14 (0.141291ms)
✔ resolveEngine at 2400 → Stockfish depth 20 (0.265834ms)
✔ resolveEngine above 2400 clamps to 2400 / depth 20 (0.119833ms)
✔ resolveEngine Stockfish movetime defaults to 1000ms (0.125875ms)
✔ skillDescription bands (0.272125ms)
  ... (38 more passing tests)
✔ returns empty clean for empty input (0.064125ms)
ℹ tests 48
ℹ suites 0
ℹ pass 48
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 159.352791
```

---

## Live-site curl results

| URL | HTTP Status |
|-----|-------------|
| `https://vishg28.github.io/ChessCoach/` | **200** |
| `.../engine/stockfish-18-lite-single.wasm` | **200** (7.29 MB, `application/wasm`) |
| `.../maia/maia-1100.onnx` | **200** (3.48 MB) |
| `.../maia/maia-1300.onnx` | **200** (3.48 MB) |
| `.../maia/maia-1500.onnx` | **200** (3.48 MB) |
| `.../maia/maia-1700.onnx` | **200** (3.48 MB) |
| `.../maia/maia-1900.onnx` | **200** (3.48 MB) |
| `.../maia/maia-1200.onnx` | **404** (not shipped — expected) |
| `.../maia/maia-1400.onnx` | **404** (not shipped — expected) |

---

## Other observations

1. **package-lock.json modified by build**: `npm run build` modified `package-lock.json` (minor lockfile drift from the ORT copy script). Restored with `git checkout -- package-lock.json`. Working tree is clean.

2. **ort-wasm-simd-threaded.jsep (26 MB)**: Deployed to `dist/assets/` but not referenced in `index.html`. Only fetched when Maia inference is first triggered. Satisfies the lazy-load requirement, but at 6.2 MB gzip it is a substantial one-time download.

3. **Main bundle code-splitting**: The 1,466 kB main JS bundle could be reduced significantly via dynamic imports for chess.js, chessground, Recharts, or cmdk. Vite flagged this in build output.

4. **ESLint not in build pipeline**: Build script is `bash scripts/copy-ort.sh && tsc -b && vite build`. No ESLint step. To fully verify zero ESLint errors, a separate lint command would be needed.
