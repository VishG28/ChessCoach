# FINAL_REPORT — Critical-Bug-First Verification Audit

## Outcome

- Phase 0 crash fixed (commit `8d31a31`): guarded against stale-FEN moves and unblocked stalled engine effect.
- 0 new P0 items found post-fix.
- 18 P1 / 9 P2 items documented in `REMEDIATION_PLAN.md` for user triage.
- Safety rollback branch: `pre-audit-20260517` → `20116d2`

---

## Commit ledger (this session)

| Hash | Subject | Phase |
|------|---------|-------|
| `8d31a31` | fix(engine): guard against stale-FEN moves and unblock stalled engine effect | Phase 0 |
| `5a9a24f` | docs: Phase 2 triage — REMEDIATION_PLAN.md + all 6 AUDIT_*.md reports | Phase 2 |

---

## Diff stats

- Files changed: 11
- Lines added: 1,270
- Lines removed: 6
- Bundle size: main JS = 1,466 kB raw / 417 kB gzip *(Phase 1E flagged this as exceeding the 500 kB raw spec; tracked as P1 #17)*

---

## Verification log

### `npm run build`: ✓

```
vite v8.0.13 building client environment for production...
✓ 3050 modules transformed.
dist/index.html                                                        0.86 kB │ gzip:     0.48 kB
dist/assets/geist-cyrillic-ext-wght-normal-DjL33-gN.woff2              7.42 kB
dist/assets/jetbrains-mono-vietnamese-wght-normal-Bt-aOZkq.woff2       7.50 kB
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
dist/assets/index-CecHXwra.css                                       110.83 kB │ gzip:    22.32 kB
dist/assets/__vite-browser-external-BMV7dj-r.js                        0.09 kB │ gzip:     0.10 kB
dist/assets/index-197s7fPY.js                                      1,466.09 kB │ gzip:   431.29 kB
✓ built in 725ms
(!) Some chunks are larger than 500 kB after minification.
```

### `npm test`: ✓

```
✔ selectMove filters out moves with cp = -mate
✔ selectMove halves random_move_chance in lost positions
✔ starting position encodes to 112*8*8 floats
✔ starting position: own pawn plane has 8 ones along rank 2
✔ policy index round-trip e2e4
✔ policy index round-trip promotion to queen
✔ sampleFromPolicy returns a legal UCI
✔ rating bucket clamps below 200 to 1000
✔ rating bucket scales mid-range
✔ rating bucket clamps above 2200 to 2500
✔ sampleBookMove returns a move from the candidates
✔ sampleBookMove biases by weight
✔ sampleBookMove returns null on empty book
✔ evalToWhiteShare: returns 0.5 for null
✔ evalToWhiteShare: returns 0.5 for 0 cp
✔ evalToWhiteShare: returns ~0.6 at +100 cp
✔ evalToWhiteShare: returns >0.9 at +1000 cp
✔ evalToWhiteShare: mirrors for negative evals
✔ evalToWhiteShare: returns 1 for white mate
✔ evalToWhiteShare: returns 0 for black mate
✔ marbleIndex is deterministic for a1 and h8
✔ marbleIndex returns a value in [0, paletteSize) for all 64 squares
✔ fewer than 25% of horizontally adjacent square pairs share an index
✔ passes through clean valid key unchanged
✔ strips em-dash silently (converts to ASCII -)
✔ converts smart quotes and en-dash to ASCII
✔ strips invisible Unicode and reports count
✔ trims leading and trailing whitespace including NBSP
✔ strips all whitespace inside key
✔ reports invalid when key does not start with sk-ant-
✔ reports invalid when key is too short
✔ returns empty clean for empty input
ℹ tests 48 | pass 48 | fail 0 | duration_ms 107.685708
```

### Live-site curl (PRE-deploy of Phase-0 fix): HTTP 200

`curl -o /dev/null -s -w "%{http_code}" https://vishg28.github.io/ChessCoach/` → **200**

---

## Top P1 items deferred to user

> **P1 #1 — coaching:** Tell-Me-More does not invoke Deep Dive prompt. `PlayPage.tsx:804` passes `onTellMore` (legacy path) instead of `requestDeepDive`. `handleTellMore` passes `msg.depth` (a `useDeepCoach` CoachDepth enum value: `'quick'|'detail'|'critical'`) into `deepCoach.fire()`, but `systemPromptFor()` in `deepCoach.ts` matches against `'deep_dive'`, so it falls through to the active coaching-style prompt rather than `DEEP_DIVE_SYSTEM`.

> **P1 #2 — coaching:** Post-move coaching threshold is 200 cp, not ≤ 80 cp. `src/coaching/blunder.ts:4` sets `BLUNDER_CP = 200`; `useCoach.ts:153-160` only triggers LLM coaching above that threshold. The spec requires triggering at >80 cp loss OR missed-tactic delta >150 cp. Classification labels in `useExplain.ts:39-44` use 80/150/300 correctly but are labeling-only and not wired to coaching triggers.

> **P1 #5 — engine:** Opening book missing bucket `'0'` and timeout is 800 ms vs 2000 ms spec. `src/engine/openingBook.ts:19-31` maps to `['1000','1200',...,'2500']`; bucket `'0'` is absent. `BOOK_TIMEOUT_MS = 800` at line 42 is 60% shorter than the 2 s spec.

> **P1 #11 — state:** Retrospective review misassigns classifications; never assigns `'good'` (0-49 cp). `GameReviewPage.ts:98` uses an inline threshold ladder that diverges from the live `classify()` function in `src/games/classification.ts` — the `>=50` branch overlaps the `50-99` branch, and the 0-49 range is never matched.

> **P1 #15 — regression:** Premove silently dropped on stale-FEN mismatch. `PlayPage.tsx:478` reads `game.fen` (a React memo not yet flushed after `makeMove` inside the IIFE) to validate premove legality. The premove is validated against the position one ply in the past; if illegal it is silently rejected with no user feedback.

> **P1 #17 — deploy:** Main JS bundle is 1,466 kB raw / 431 kB gzip — nearly 3x the 500 kB spec limit. Vite itself flags the warning at build time. Identified large contributors: chess.js, chessground, Recharts, cmdk. Proposed fix: apply `vite.config.ts` code-splitting via `build.rolldownOptions.output.manualChunks` or dynamic `import()` for Recharts, cmdk, and chessground.

> **P1 #18 — deploy:** ESLint is not part of the build/CI pipeline. Build script `bash scripts/copy-ort.sh && tsc -b && vite build` has no lint step. ESLint error count is unverified.

---

## Deployment status

- Local: Phase-0 fix committed, NOT pushed.
- Awaiting user confirmation before `git push origin emdash/bug-fix-audit-2pn` (which triggers gh-pages deploy via `.github/workflows/deploy.yml`).

---

## Rollback instructions

To revert this session's work entirely:

```bash
git reset --hard 20116d2
# or
git checkout pre-audit-20260517
```
