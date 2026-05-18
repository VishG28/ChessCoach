# Changelog

## 2026-05-17 — Honest engine scope

### Changed
- Engine slider range is now **1100–2400** (was 300–2000). Default 1100.
- Engine source is auto-selected by Elo:
  - **1100–1899** → Maia neural net (bucket selected by Elo).
  - **1900–2400** → Stockfish with `UCI_LimitStrength=true` and `UCI_Elo` set per slider.
- Stockfish above 1900 now uses a depth cap mapped to Elo: **1900 → depth 10**, **2100 → depth 14**, **2400 → depth 20**.
- Added first-launch onboarding card explaining engine scope and pointing sub-1100 users to Lichess.
- Added "What's my rating?" modal next to the Elo slider.

### Removed
- **Sub-1100 Elo support.** The Phase 3A Stockfish weakening table (`src/engine/weakening.ts`) was not empirically validated — it produced random + sanity-filtered play, not human-like play at low ratings. Use [Lichess.org](https://lichess.org) for sub-1100 matchups.
- **User-facing "Stockfish vs Maia" toggle** (`src/components/coaching/EngineSelector.tsx`). Engine source is now determined by Elo only.
- **`playOne` self-play calibration** on `/calibrate` (it tested a parameter table we no longer ship).
- Dead-code `src/engine/eloCurves.ts`.

### Deprecated
- `src/engine/weakening.ts` is kept for reference but is no longer called by the play pipeline. The `humanThinkDelay()` helper is still used to humanize move latency.

### Reason
Honesty about what we can actually deliver. Sub-1100 play needs ML training on data we don't have. Lichess covers this case well today.
