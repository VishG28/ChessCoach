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

const summaryModules = import.meta.glob<{ default: Opening }>(
  '../data/openings/*.json',
  { eager: true },
)

const lazyModules = import.meta.glob<{ default: Opening }>(
  '../data/openings/*.json',
)

export const OPENING_SUMMARIES: OpeningSummary[] = Object.values(summaryModules)
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
  const entry = Object.entries(lazyModules).find(([p]) => p.endsWith(`/${id}.json`))
  if (!entry) throw new Error(`Unknown opening: ${id}`)
  const mod = await entry[1]()
  return parseOpening(mod.default) as unknown as Opening
}

/** Back-compat shim used by OpeningsPage/useOpeningTrainer. */
export const OPENINGS: Opening[] = []
export const OPENINGS_BY_ID: Record<string, Opening> = {}
