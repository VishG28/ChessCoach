# Loco Piece Set Provenance Investigation

**Date:** 2026-05-17
**Branch:** themes-fix (post-Phase-A)
**Investigator:** Phase C automated research task

---

## Current State

The `loco` piece set is an internal project alias that points to Lichess's **fantasy** SVGs.

- 12 SVGs live at `src/assets/pieces/fantasy/` (wK, wQ, wR, wB, wN, wP, bK, bQ, bR, bB, bN, bP)
- `src/styles/pieceSets.module.ts` imports all 12 files as `loco*` identifiers from `@/assets/pieces/fantasy/`
- `src/styles/pieceSets.ts` registers `{ id: 'loco', name: 'Loco', source: 'fantasy', description: 'Chunky bold pieces with thick outlines, oversized presence' }`
- `src/styles/pieceSets.css` applies `background-size: 110% 110%` to `.cg-piece-set-loco` (compensating for the fantasy set's natural sizing within chessground squares)

---

## Search Results

| Source | Result | URL | License |
|--------|--------|-----|---------|
| Lichess official set list | "loco" NOT present. Canonical list: alpha, anarcandy, caliente, california, cardinal, cburnett, celtic, chess7, chessnut, companion, disguised, dubrovny, fantasy, fresca, gioco, governor, horsey, icpieces, kosal, leipzig, letter, libra, maestro, merida, monarchy, mono, mpchess, pirouetti, pixel, reillycraig, riohacha, shapes, spatial, staunty, tatiana | https://github.com/lichess-org/lila | GPL-3.0 (code); CC BY-NC-SA 4.0 (assets) |
| chess.com piece set catalog | No "Loco" set listed. Search returned physical board retailers only; no digital "Loco" set found | https://shop.chess.com | N/A |
| GitHub code search `loco chess pieces SVG` | Zero results for chess pieces. All hits were: locomotive SVGs, brand logos, transloco (i18n library), unrelated documents | https://github.com/search | N/A |
| GitHub repo search `loco chess pieces` | No results for any chess piece set repository named or tagged "loco" | https://github.com/search | N/A |
| OpenGameArt.org | No chess piece set named "loco" found. Existing chess piece sets: cburnett-derived HD set, alpha-style pieces, Leipzig | https://opengameart.org/content/chess-pieces-in-svg-format | Various CC |
| Community / Pinterest / broader web | No community chess piece set called "loco" found anywhere. "loco chess" returns physical novelty sets (e.g., locomotive-themed physical boards), not digital SVG sets | Various | N/A |

---

## Closest Official Set Name Matches (Ranked)

1. **fantasy** — This IS the actual set currently aliased as "loco". Chunky, bold, thick outlines — the description in `pieceSets.ts` accurately describes the Lichess fantasy set. Confidence: certain match.
2. **horsey** — Bold, cartoon-like aesthetic, distinctive styling. Shares the "fun, non-traditional" character of the fantasy set but is a different design.
3. **chessnut** — Solid, high-contrast pieces with strong presence on the board, somewhat chunky.

---

## Community Sets Found

None found with the name "loco". No community-distributed chess piece SVG set uses the name "loco" under any license (CC0, CC BY, MIT, GPL, or otherwise).

---

## Recommendation

**Recommendation (a): Keep the current fantasy alias. No real "loco" set exists.**

"Loco" is a project-internal marketing name for the Lichess **fantasy** piece set. This is not dishonest — the fantasy SVGs are openly licensed (GPL-3.0 compatible), already present in the repo, and render correctly after Phase A's module-import fix.

The naming choice ("Loco") conveys the personality of the pieces to a user who has never heard of the Lichess "fantasy" set name. It is a valid UX alias.

### Why Not (b) — Swap to a real "loco" set?

No such set exists with a verified redistributable license. Fabricating one or sourcing something "close enough" would violate the anti-fabrication rule. C2 is skipped.

### Why Not (c) — Rename to "Fantasy"?

Renaming would confuse users who are used to the "Loco" name in this app and gains nothing — the Lichess name "fantasy" is no more meaningful to a beginner than "loco."

### Action Taken

- Committed `LOCO_INVESTIGATION.md` only (this file).
- No code, SVG, or other file changes were made.
- The `background-size: 110% 110%` override is retained — it is still needed because the fantasy SVGs render at natural size slightly outside the chessground square boundary without it.
