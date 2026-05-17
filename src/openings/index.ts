import londonRaw from '@/data/openings/london.json'
import caroKannRaw from '@/data/openings/caro-kann.json'
import type { Opening } from './types'

export const OPENINGS: Opening[] = [londonRaw as Opening, caroKannRaw as Opening]
export const OPENINGS_BY_ID: Record<string, Opening> = Object.fromEntries(
  OPENINGS.map(o => [o.id, o]),
)
