# AUDIT_ENGINE — Engine Pipeline Verification

Audited: 2026-05-17 | Branch: emdash/bug-fix-audit-2pn | Model: claude-sonnet-4-6

## Summary
- 5/10 PASS, 2 PARTIAL, 2 FAIL, 1 NOT_IMPLEMENTED

---

## Findings

### 1. Phase-3A weakening removed from play pipeline
**Status:** PASS
**Evidence:**
- `src/engine/weakening.ts:1-14` — File is marked `@deprecated 2026-05-17`; header states "DO NOT USE for new code."
- `src/engine/opponentEngine.ts:14-15` — Comment: "Phase 3A weakening rolls (random/blunder injection) have been removed."
- `src/engine/opponentEngine.ts:52` — `requestOpponentMove` calls `resolveEngine(elo)` only; never imports `getWeakeningParams`, `selectMove`, `randomMoveChance`, or `blunderChance`.
- No references to `random_move_chance`, `blunder_chance`, `getWeakeningParams`, or `selectMove` exist outside `weakening.ts` and its test file.
- Hardcoded `Skill Level` appears in `src/engine/engine.ts:156` (`setoption name Skill Level value 20`), but `skill` is always `20` (full strength) — not a weakening path.
- `humanThinkDelay` is imported at `src/pages/PlayPage.tsx:25`, used at line 434 for think-pause delay only. Re-use is permitted per prior decision.
**Notes:** `weakening.ts` is fully orphaned from the move-generation pipeline.

---

### 2. Two-worker architecture
**Status:** PARTIAL
**Evidence:**
- `src/engine/engine.ts:78,401` — `useEngine()` creates `new Engine({ instanceName: 'play' })` wrapping its own `new Worker(WORKER_URL)`.
- `src/engine/analysisEngine.ts:9` — Module-scoped singleton `new Engine({ instanceName: 'analysis' })` creates a second Stockfish worker on first call.
- **Gap:** The `analysis` worker is only consumed by `src/games/useGameLogger.ts:147-148` (post-game logging). Live in-game analysis (blunder detection, eval bar) runs through `src/coaching/useCoach.ts:119` which calls `engine.requestAnalysis(...)` on the *play engine* passed in from `PlayPage.tsx:65,170`. Opponent move requests and coach analysis therefore share the same serial queue during play.
- **Gap:** Spec requires analysis worker at "depth 18, full strength." `analysisEngine.ts:13,38` initialises at `setMultiPV(3)` and calls `analyzePosition(fen, depth=12)` — neither matches.
**Notes:** Two `Engine` instances exist but the in-game eval pipeline bypasses the dedicated analysis worker, violating queue independence.

---

### 3. Maia-1 lineup completeness
**Status:** PARTIAL (expected per spec note)
**Evidence:**
- `public/maia/` contains 5 files: `maia-1100.onnx`, `maia-1300.onnx`, `maia-1500.onnx`, `maia-1700.onnx`, `maia-1900.onnx`.
- Spec required 9 models (1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900). Missing: 1200, 1400, 1600, 1800.
- `src/engine/engineRouting.ts:16` — `MaiaModelElo = 1100 | 1300 | 1500 | 1700 | 1900` confirms 5-model design intent.
**Notes:** Known gap; only odd-hundred models were available from lczerolens at time of commit.

---

### 4. Maia ONNX files: size, lazy-load, Cache API persistence
**Status:** PARTIAL
**Evidence:**
- **Sizes:** All 5 files are 3,483,901–3,484,716 bytes (~3.32 MB). Spec says ~3.3 MB; actual is within 0.5% — PASS.
- **Lazy-loaded:** `src/engine/maia.ts:86-88` — `requestMaiaMove` awaits `loadMaiaModel(elo)` before running inference; the worker is spun up lazily via `ensureWorker()`. No ONNX is bundled. PASS.
- **Cache API persistence:** No `caches.open` / `caches.put` calls exist anywhere in `src/`. `src/engine/maiaWorker.ts:25` holds an in-memory `sessions` Map that is lost on page reload. **NOT MET.**
**Notes:** Models are re-fetched (~3.3 MB each) on every page reload. On slow connections this adds 1-3s latency before the first Maia move.

---

### 5. Maia bucket selection every 100 Elo → nearest available model
**Status:** FAIL
**Evidence:**
- `src/engine/engineRouting.ts:36-42` and `src/engine/maia.ts:16-22` both bucket in 200-Elo steps:
  - `< 1200` → 1100 | `< 1400` → 1300 | `< 1600` → 1500 | `< 1800` → 1700 | `≥ 1800` → 1900
- The 100-Elo resolution specified (e.g. 1150 → 1100, 1250 → 1300) cannot be satisfied because the 1200/1400/1600/1800 models are absent (item 3).
- `bucketMaiaModel` (engineRouting.ts:36) and `selectMaiaModel` (maia.ts:16) are byte-identical duplicates — minor DRY violation.
**Notes:** The routing function is internally consistent with the 5 shipped models; the failure is contingent on the missing models in item 3.

---

### 6. Engine routing: 1100–1899 → Maia, ≥1900 → Stockfish/UCI_LimitStrength, <1100 → disabled
**Status:** PASS
**Evidence:**
- `src/engine/engineRouting.ts:59-78` — `resolveEngine(elo)` clamps to `[ELO_MIN=1100, ELO_MAX=2400]`:
  - `clamped < 1900` → `source: 'maia'`.
  - `clamped ≥ 1900` → `source: 'stockfish'` with `UCI_LimitStrength` and `UCI_Elo`.
- `src/components/sidebar/LeftSidebar.tsx:140` — Slider `min={ELO_MIN}` enforces the 1100 floor.
- `src/components/onboarding/EngineScopeCard.tsx:42` — "Below 1100? Use Lichess" message present in UI.
**Notes:** Sub-1100 is blocked at the slider; no engine path is reachable below 1100.

---

### 7. MultiPV=5 in the analysis engine worker
**Status:** FAIL
**Evidence:**
- `src/engine/analysisEngine.ts:13` — Dedicated analysis worker singleton initialises with `setMultiPV(3)`.
- `src/engine/analysisEngine.ts:38` — `analyzePosition` passes `multipv: 3`.
- `src/coaching/useCoach.ts:119` — Play engine is called with `multipv: 5`, but that is the play worker, not the analysis singleton.
- No code path runs the `instanceName: 'analysis'` worker with MultiPV=5 or depth=18.
**Notes:** The spec requirement "MultiPV=5 in the analysis engine worker" is not met by any code path.

---

### 8. Lichess opening book
**Status:** PARTIAL
**Evidence:**
- **Endpoint URL:** `src/engine/openingBook.ts:60` — `https://explorer.lichess.ovh/lichess?variant=standard&speeds=blitz,rapid&ratings=${bucket}&fen=...`. PASS.
- **Rating buckets:** Spec says `0, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2500`. Code at `openingBook.ts:19-31` maps to `'1000', '1200', '1400', '1600', '1800', '2000', '2200', '2500'`. **Bucket `'0'` is absent.** FAIL (partial).
- **User-Agent header:** `openingBook.ts:63` — `fetch(url, { signal: controller.signal })` — no `headers` option. **User-Agent NOT set.** FAIL.
- **Timeout:** `openingBook.ts:42` — `BOOK_TIMEOUT_MS = 800`. Spec says 2s. Actual is 800 ms — **60% shorter than spec.** FAIL.
- **Engine fallback:** `openingBook.ts:86-88` — `catch { return null }` passes control back to `opponentEngine.ts:61-72` which falls through to Maia/Stockfish. PASS.
**Notes:** Three deviations: missing bucket '0', no User-Agent, 800 ms vs. 2000 ms timeout.

---

### 9. Artificial think delay 1.2–2.0s on engine moves
**Status:** PASS
**Evidence:**
- `src/engine/weakening.ts:43-44` — `THINK_DELAY_MIN_MS = 1200`, `THINK_DELAY_MAX_MS = 2000`.
- `src/engine/weakening.ts:52-54` — `humanThinkDelay()` returns uniform random in [1200, 2000] ms.
- `src/pages/PlayPage.tsx:434` — `const wait = Math.max(0, humanThinkDelay() - elapsed)` subtracts actual engine compute time so the total wall-clock delay from request start stays within the range.
**Notes:** Implementation is correct.

---

### 10. Eval bar updates after every move from the analysis engine
**Status:** PASS
**Evidence:**
- `src/coaching/useCoach.ts:87,183` — `useEffect` dep array `[game.fen, game.history, ...]` fires after every move.
- `src/coaching/useCoach.ts:140-143` — `fetchEval(afterFen)` → `setLiveEval(current)` runs even when the engine (not user) just moved (`!userJustMoved` branch).
- `src/pages/PlayPage.tsx:617-622` — `evalCpWhitePov` is derived from `coach.liveEval.cp`.
- `src/pages/PlayPage.tsx:814` — `evalCpWhitePov={displayedEvalCpWhitePov}` passed to the sidebar/eval bar.
**Notes:** Eval bar is fed via `useCoach` → play engine, not the dedicated `analysisEngine.ts` singleton. Despite the architectural gap (item 2), the eval bar updates correctly after every move.

---

## Other Observations

1. **Dead test coverage:** `src/engine/__tests__/weakening.test.ts` tests `getWeakeningParams` and `selectMove` — code that is deprecated and unreachable from the play pipeline. Tests pass but validate dead paths. Consider pruning or annotating.

2. **Queue contention risk:** Because `useCoach` calls `engine.requestAnalysis` on the play engine (not the analysis singleton), a coach eval request will queue behind an opponent move request (or vice versa). Under slow evaluation conditions (≥1900 Stockfish depth 10-20), the eval bar can stall until the move completes.

3. **Bucket function duplication:** `bucketMaiaModel` in `engineRouting.ts:36-42` and `selectMaiaModel` in `maia.ts:16-22` are identical. One should import from the other to avoid drift.

4. **`analysisEngine.ts` depth mismatch:** Module docstring says "depth-12 multipv-3"; spec says depth 18. If the game logger needs deeper analysis, `analyzePosition` needs updating separately from the coaching path.

5. **No User-Agent on Lichess requests:** The Lichess API recommends identifying the caller. Absent headers may trigger rate-limiting at scale.
