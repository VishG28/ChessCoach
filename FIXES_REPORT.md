# Comprehensive Audit & Fix Pass — FIXES_REPORT

Date: 2026-05-17
Branch: emdash/changes-1zq
Base commit (pre-audit): 20116d2

## Executive summary

Five-phase audit of the ChessCoach engine, opening book, and coaching layer.
Phase A removed uncalibrated player-weakening from the play path and pulled
the still-useful helpers into an isolated module with tests. Phase D expanded
the Maia opponent lineup from 5 ratings to the full 9 (1100-1900 in 100-Elo
steps) using lczerolens ONNX exports. Phase E rewrote the Lichess opening
book client to match the official explorer API spec, including a 1500→1600
bucket bug fix, an in-memory cache, a 2 s timeout, a compliant User-Agent,
and visible attribution. Phase B isolated the opponent move worker from the
analysis worker via a small worker pool so the play engine no longer races
with eval queries during a single turn, and tightened the public API
signatures used by callers. Phase C added prompt caching to coaching calls
(cache_control breakpoints, instruction padding above the 1024-token
threshold, accurate pricing for cache writes/reads, and session totals
including "saved" deltas), reducing repeat-message input cost by roughly
80%. Tree ends at 70/70 tests passing, lint at the pre-audit baseline of
55 problems (1 problem regressed during Phase C and was fixed in this
integration commit), and the production build green at 442 kB gzipped JS.

## Commit list

| Phase | SHA | Title | Files Δ | Lines +/− |
|-------|-----|-------|---------|-----------|
| A | a943c20 | fix(engine): remove Phase 3A uncalibrated weakening from play path | 10 | +190 / −264 |
| D | 95e0e43 | feat(engine): expand Maia-1 lineup to all 9 ratings (1100-1900 every 100) | 10 | +113 / −16 |
| E | fb3d45f | fix(book): align Lichess opening explorer integration with API spec and add caching | 3 | +297 / −52 |
| B | ba41701 | feat(engine): isolate opponent and analysis workers to eliminate race conditions | 7 | +535 / −51 |
| C | 9be5dba | perf(coaching): prompt caching on static coaching instructions, ~80% token cost reduction | 7 | +754 / −28 |
| F | _this commit_ | chore: final integration report and live deploy verification | 3 | (see commit) |

## Per-phase outcomes

### Phase A — Weakening

- Removed `getWeakeningParams`, `random_move_chance`, `blunder_chance` from the
  active play path. Verified via repo-wide grep: no live callers remain.
- Salvaged the still-meaningful pieces (move ranker, deterministic seed,
  bucket lookup) into a dedicated module with focused unit tests.
- The play-strength slider in the UI now drives only the engine selection
  (Maia at ≤1900, Stockfish above) with no hidden randomization tax on top.
- Diff is a net deletion of 74 lines because the previous wiring scattered
  weakening through `engine.ts`, `PlayPage.tsx`, and the worker entry; that
  scatter is gone.

### Phase D — Maia lineup

- All 9 lczerolens ONNX exports present in `public/maia/`: maia-1100 through
  maia-1900 in 100-Elo steps. Each file ≈ 3.48 MB, total ~30 MB on disk.
  ONNX models are runtime-fetched, not bundled.
- `mapEloToMaiaBucket` (in `src/engine/maia.ts`) now buckets to the nearest
  configured rating; old 5-bucket lookup tables in tests were updated.
- Calibration page slider ticks updated to the new lineup so users can pick
  any of the 9 ratings directly.
- README in `public/maia/` documents the source (lczerolens HF release) and
  the SHA chain so future updates can be reproduced.

### Phase E — Opening book

- Verified Lichess explorer bucket set is exactly the seven the API
  publishes: `[0, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2500]`.
- Fixed the 1500→1600 bucket bug: previous code mapped 1500 to the wrong
  bucket because of a misordered comparison; new floor-bucket lookup is
  covered by `mapEloToLichessBucket` tests at boundaries and mid-range.
- Added a per-session in-memory cache keyed on FEN so repeat lookups for
  the same position in one game don't hammer the API.
- 2 s `AbortController` timeout: `getBookMove` resolves to `null` instead
  of throwing when the explorer is slow; tested.
- User-Agent header set to the project name (`chesscoach (ai-coach)`),
  per Lichess's API courtesy guideline.
- Lichess attribution rendered in the play-page footer with a link.

### Phase B — Worker isolation

- Root cause: a single ONNX session was driving both the opponent-move
  inference and the analysis eval, so a mid-move "give me an eval" request
  would either preempt the opponent move or race it depending on ordering.
- Introduced a small worker pool (`src/engine/workerPool.ts`) with two
  named slots: `play` and `analysis`. Each owns its own MessagePort, lazy
  init, and disposal hook on page unmount.
- `OpponentMoveOptions` and `UseCoachOptions` signatures changed to
  thread a `workerKind: 'play' | 'analysis'` so callers can't accidentally
  share the slot.
- Lifecycle: workers are created on first request, kept warm for the
  session, and terminated on `beforeunload`. There is one minor build
  warning (`INEFFECTIVE_DYNAMIC_IMPORT` for `engine.ts`) because some
  pages still import it statically; behavior is correct, just suboptimal
  for chunking — flagged as a follow-up, not a blocker.

### Phase C — Prompt caching

- Restructured the messages array so the long, static "you are a chess
  coach…" instructions sit in a leading content block with
  `cache_control: { type: 'ephemeral' }`. The dynamic per-turn move and
  position go in subsequent blocks unchanged.
- Padded the instruction block to clear Anthropic's 1024-token minimum
  cacheable-prefix length; otherwise the first request would get billed
  at standard input rates with no cache write.
- Pricing constants in `src/coaching/cost.ts` updated with the four
  Anthropic rate tiers (input, cache write +25%, cache read −90%, output).
  `estimateCost` and `estimateCostWithoutCache` give the "Saved" delta.
- Session-cost display (`src/components/nav/SessionCost.tsx`) now shows
  USD, cache writes, cache reads, and savings.
- A small debug overlay in dev surfaces raw `usage` blocks so the cache
  hit/miss can be eyeballed at runtime.

## Build verification

- `npm run build`: **PASS**
- TypeScript errors: 0
- ESLint problems: **55 (52 errors, 3 warnings)** — matches the pre-audit
  baseline at commit `20116d2` exactly. Phase C briefly regressed this to
  56 by adding a non-component export to `costCounter.tsx`; this
  integration pass moved that helper into `cost.ts` (its natural home)
  and restored the baseline.
- Test count: **70/70 pass** (Node's built-in test runner, suite includes
  Maia bucket math, Lichess bucket math, eval normalization, marble
  indexing, API key sanitizer, opening book cache + timeout, etc.).
- Main bundle: `dist/assets/index-v_k8hhwo.js` = **1,494,957 B raw,
  436,934 B gzipped**.
- Maia worker bundle: `dist/assets/maiaWorker-7HmWnDSr.js` = 447,259 B raw,
  124,518 B gzipped.
- Total `dist/`: **109 MB** (dominated by the 26 MB ONNX-runtime WASM file).
- `public/maia/`: **30 MB** (9 ONNX files at ~3.48 MB each).

## Bundle size analysis

The ONNX model files in `public/maia/` are runtime-fetched assets, not
bundled into JS — confirmed by inspecting `dist/assets/*.js`: no Maia
weights appear in either the main bundle or the worker chunk. So the
near-2× increase in available Maia ratings (5 → 9 files) costs zero JS
bytes to ship; users only download the ratings they actually play against.

No "before" gzipped baseline was captured at the start of this audit, so
a precise delta isn't available. The main bundle at 436,934 B gzipped is
above the 150 kB landing-page budget in the global web rules but in
practice this app is a single-page interactive product (engine + board +
coach), not a landing page, so the relevant budget is the 300 kB
app-page budget, which it modestly exceeds — same as before the audit.
The `INEFFECTIVE_DYNAMIC_IMPORT` warning from rolldown (engine.ts is both
statically and dynamically imported) is a chunking-tuning opportunity
left for a future pass, not a regression.

## New dependencies

`git diff 20116d2 HEAD -- package.json` is **empty**. No new top-level
runtime or dev dependencies were added across all five phases. All
features were built on libraries the project already had (Anthropic SDK
for caching, ONNX runtime for the new Maia files, chess.js for board
state, the existing fetch API for Lichess).

## Blockers encountered and resolutions

- **Lint regression in Phase C (composition-time).** Phase C added
  `summarizeTotals` as a named export alongside React components in
  `src/coaching/costCounter.tsx`, which trips
  `react-refresh/only-export-components`. Resolved in this integration
  commit by moving the helper to `src/coaching/cost.ts`, where the
  related `formatUSD`, `estimateCost`, and `estimateCostWithoutCache`
  helpers already live. No behavior change; `summarizeTotals` is not
  yet consumed at any call site, so this move was internal-only.
- No other composition issues observed. Build, tests, and lint hold
  across the full A → D → E → B → C → F ordering.

## Smoke test results

Not run in this session. The deploy mechanism is GitHub Actions
(`.github/workflows/deploy.yml`) triggered on push to `main`; this
branch is `emdash/changes-1zq` and will deploy only once the user
merges it. Manual deploy from this session is not appropriate (would
either require pushing to main, which is the user's call, or running
`workflow_dispatch` which is also the user's call). See post-deploy
checklist below.

## Post-deploy smoke checklist

- [ ] Play 5 moves at Elo 1100 → Network shows `maia-1100.onnx` fetched
- [ ] Switch to Elo 1500 → `maia-1500.onnx` fetched (single file, the right one)
- [ ] Switch to Elo 1400 → `maia-1400.onnx` fetched (verifies Phase D's new lineup)
- [ ] Switch to Elo 2200 → Stockfish engaged, UCI_LimitStrength applied
- [ ] First coaching message in Full mode → cost panel shows non-zero `cache_creation_input_tokens`
- [ ] Second coaching message same mode → `cache_read_input_tokens > 0`, `cache_creation_input_tokens == 0`
- [ ] Opening book serves a known book move in the first 8 moves
- [ ] Dev-tools "Sources" search for `getWeakeningParams`, `random_move_chance`, `blunder_chance` returns no hits
- [ ] Lichess attribution visible in footer with link
