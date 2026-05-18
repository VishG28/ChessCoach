/**
 * Engine routing — single source of truth for which opponent engine and
 * which configuration is used for a given user Elo.
 *
 * Scope (2026-05-17): Maia drives 1100–1899, Stockfish drives 1900+ via
 * UCI_LimitStrength. Below 1100 is unsupported (the slider clamps).
 */

export const ELO_MIN = 1100
export const ELO_MAX = 2400
export const STOCKFISH_THRESHOLD = 1900
export const SF_UCI_ELO_MIN = 1320
export const SF_UCI_ELO_MAX = 2850
export const SF_DEFAULT_MOVETIME_MS = 1000

export type MaiaModelElo = 1100 | 1300 | 1500 | 1700 | 1900

export interface ResolvedEngine {
  source: 'maia' | 'stockfish'
  modelLabel: string
  maiaModel?: MaiaModelElo
  sfElo?: number
  sfDepth?: number
  sfMovetimeMs?: number
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n))
}

/**
 * Mirrors `selectMaiaModel` in `./maia`. Inlined here so this module stays
 * importable from Node test runners (the Maia facade reads
 * `import.meta.env.BASE_URL` at module load, which is Vite-only).
 */
function bucketMaiaModel(elo: number): MaiaModelElo {
  if (elo < 1200) return 1100
  if (elo < 1400) return 1300
  if (elo < 1600) return 1500
  if (elo < 1800) return 1700
  return 1900
}

/**
 * Stockfish search depth as a piecewise-linear function of Elo.
 *   1900 → 10, 2100 → 14, 2400 → 20
 * Outside [1900, 2400] is clamped to the nearest endpoint.
 */
function stockfishDepthForElo(elo: number): number {
  const e = clamp(elo, STOCKFISH_THRESHOLD, ELO_MAX)
  if (e <= 2100) {
    const t = (e - 1900) / (2100 - 1900)
    return Math.round(10 + t * (14 - 10))
  }
  const t = (e - 2100) / (2400 - 2100)
  return Math.round(14 + t * (20 - 14))
}

export function resolveEngine(elo: number): ResolvedEngine {
  const clamped = clamp(Math.round(elo), ELO_MIN, ELO_MAX)
  if (clamped < STOCKFISH_THRESHOLD) {
    const maiaModel = bucketMaiaModel(clamped)
    return {
      source: 'maia',
      modelLabel: `Maia ${maiaModel}`,
      maiaModel,
    }
  }
  const sfElo = clamp(clamped, SF_UCI_ELO_MIN, SF_UCI_ELO_MAX)
  const sfDepth = stockfishDepthForElo(clamped)
  return {
    source: 'stockfish',
    modelLabel: `Stockfish ${clamped}`,
    sfElo,
    sfDepth,
    sfMovetimeMs: SF_DEFAULT_MOVETIME_MS,
  }
}

interface SkillBand {
  maxElo: number
  label: string
}

const SKILL_BANDS: ReadonlyArray<SkillBand> = [
  { maxElo: 1300, label: 'Intermediate beginner' },
  { maxElo: 1500, label: 'Solid club player' },
  { maxElo: 1700, label: 'Strong club player' },
  { maxElo: 1900, label: 'Expert' },
  { maxElo: 2100, label: 'Master level' },
  { maxElo: 2400, label: 'International master' },
  { maxElo: Infinity, label: 'Grandmaster strength' },
]

export function skillDescription(elo: number): string {
  const band = SKILL_BANDS.find((b) => elo < b.maxElo) ?? SKILL_BANDS[SKILL_BANDS.length - 1]
  return band.label
}

export const ELO_TICKS: ReadonlyArray<number> = [1100, 1300, 1500, 1700, 1900, 2100, 2400]
