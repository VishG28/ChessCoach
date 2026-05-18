import type { Opening } from './types'
import { parseOpening } from './schema'

export interface OpeningSummary {
  id: string
  name: string
  eco: string
  category: 'main_lines' | 'underrated'
  side: 'white' | 'black' | 'both'
  description: string
  popularityRank: number
}

// Single eager glob — bundler decides whether to inline or split by chunk-size
// heuristics. Total JSON payload for 50 placeholder openings is ~80 KB and is
// expected to grow to ~500 KB once real generations land. Eager keeps it
// straightforward; if bundle becomes an issue, switch this glob to lazy and
// reconstruct summaries from a separate metadata file generated at build time.
const openingModules = import.meta.glob<{ default: Opening }>(
  '../data/openings/*.json',
  { eager: true },
)

export const OPENING_SUMMARIES: OpeningSummary[] = Object.values(openingModules)
  .map((mod) => {
    const op = mod.default
    return {
      id: op.id,
      name: op.name,
      eco: op.eco,
      category: op.category,
      side: op.side,
      description: op.description,
      popularityRank: op.popularityRank ?? 99,
    }
  })
  .sort((a, b) => a.popularityRank - b.popularityRank)

export async function loadOpening(id: string): Promise<Opening> {
  const entry = Object.entries(openingModules).find(([p]) => p.endsWith(`/${id}.json`))
  if (!entry) throw new Error(`Unknown opening: ${id}`)
  return parseOpening(entry[1].default) as unknown as Opening
}

/** Back-compat shim used by OpeningsPage/useOpeningTrainer. */
export const OPENINGS: Opening[] = []
export const OPENINGS_BY_ID: Record<string, Opening> = {}
