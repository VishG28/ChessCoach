export interface WeakeningParams {
  depth: number
  movetime: number
  multipv: number
  randomMoveChance: number
  blunderChance: number
  useUciLimit: boolean
  uciElo: number
}

interface Bucket {
  maxElo: number
  params: Omit<WeakeningParams, 'uciElo'>
}

const BUCKETS: ReadonlyArray<Bucket> = [
  { maxElo: 400,      params: { depth: 1,  movetime: 200,  multipv: 10, randomMoveChance: 0.60, blunderChance: 0.25, useUciLimit: false } },
  { maxElo: 600,      params: { depth: 2,  movetime: 300,  multipv: 8,  randomMoveChance: 0.45, blunderChance: 0.18, useUciLimit: false } },
  { maxElo: 800,      params: { depth: 3,  movetime: 400,  multipv: 6,  randomMoveChance: 0.30, blunderChance: 0.12, useUciLimit: false } },
  { maxElo: 1000,     params: { depth: 4,  movetime: 500,  multipv: 5,  randomMoveChance: 0.18, blunderChance: 0.07, useUciLimit: false } },
  { maxElo: 1320,     params: { depth: 6,  movetime: 700,  multipv: 4,  randomMoveChance: 0.08, blunderChance: 0.03, useUciLimit: false } },
  { maxElo: 1800,     params: { depth: 10, movetime: 800,  multipv: 3,  randomMoveChance: 0.02, blunderChance: 0.0,  useUciLimit: true  } },
  { maxElo: Infinity, params: { depth: 14, movetime: 1000, multipv: 1,  randomMoveChance: 0.0,  blunderChance: 0.0,  useUciLimit: true  } },
]

const UCI_ELO_MIN = 1320
const UCI_ELO_MAX = 3190
const THINK_DELAY_MIN_MS = 1200
const THINK_DELAY_MAX_MS = 2000

export function getWeakeningParams(elo: number): WeakeningParams {
  const bucket = BUCKETS.find((b) => elo < b.maxElo) ?? BUCKETS[BUCKETS.length - 1]
  const uciElo = Math.max(UCI_ELO_MIN, Math.min(UCI_ELO_MAX, Math.round(elo)))
  return { ...bucket.params, uciElo }
}

export function humanThinkDelay(): number {
  return THINK_DELAY_MIN_MS + Math.random() * (THINK_DELAY_MAX_MS - THINK_DELAY_MIN_MS)
}
