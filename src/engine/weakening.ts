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

import { Chess, type Square } from 'chess.js'
import type { TopCandidate } from './types.ts'

const MATE_THRESHOLD = 90000
const QUEEN_BLUNDER_FREE_ELO = 500
const LOST_POSITION_CP = -500

export type RollOutcome = 'best' | 'random' | 'blunder' | 'filtered'

export interface SelectMoveOptions {
  candidates: TopCandidate[]
  randomMoveChance: number
  blunderChance: number
  fenBefore: string
  eloForSanity: number
  evalCp?: number
  rng?: () => number
}

export interface SelectMoveResult {
  uci: string
  roll: RollOutcome
  bestUci: string
  cpPlayed: number
  cpBest: number
}

function losesQueen(fen: string, uci: string): boolean {
  try {
    const c = new Chess(fen)
    const from = uci.slice(0, 2) as Square
    const to = uci.slice(2, 4) as Square
    const piece = c.get(from)
    if (!piece || piece.type !== 'q') return false
    const promo = uci.length >= 5 ? (uci[4] as 'q' | 'r' | 'b' | 'n') : undefined
    if (!c.move({ from, to, promotion: promo })) return false
    const attackers = c.attackers(to, c.turn())
    return Array.isArray(attackers) && attackers.length > 0
  } catch {
    return false
  }
}

function allowsMateInOne(fen: string, uci: string): boolean {
  try {
    const c = new Chess(fen)
    const from = uci.slice(0, 2) as Square
    const to = uci.slice(2, 4) as Square
    const promo = uci.length >= 5 ? (uci[4] as 'q' | 'r' | 'b' | 'n') : undefined
    if (!c.move({ from, to, promotion: promo })) return true
    for (const r of c.moves({ verbose: true })) {
      const probe = new Chess(c.fen())
      probe.move({ from: r.from, to: r.to, promotion: r.promotion })
      if (probe.isCheckmate()) return true
    }
    return false
  } catch {
    return true
  }
}

function filterCandidates(
  cands: TopCandidate[],
  fenBefore: string,
  eloForSanity: number,
): TopCandidate[] {
  return cands.filter((c) => {
    if (Math.abs(c.cp) > MATE_THRESHOLD && c.cp < 0) return false
    if (allowsMateInOne(fenBefore, c.move)) return false
    if (eloForSanity >= QUEEN_BLUNDER_FREE_ELO && losesQueen(fenBefore, c.move)) return false
    return true
  })
}

export function selectMove(opts: SelectMoveOptions): SelectMoveResult {
  const rng = opts.rng ?? Math.random
  const sorted = [...opts.candidates]
  const best = sorted[0]
  const bestUci = best?.move ?? ''
  const cpBest = best?.cp ?? 0

  const safe = filterCandidates(sorted, opts.fenBefore, opts.eloForSanity)
  const pool = safe.length > 0 ? safe : sorted.slice(0, 1)

  const inLostPosition = (opts.evalCp ?? 0) < LOST_POSITION_CP
  const randomChance = inLostPosition ? opts.randomMoveChance * 0.5 : opts.randomMoveChance

  if (pool.length > 1 && rng() < randomChance) {
    const pick = pool[Math.floor(rng() * pool.length)]
    return { uci: pick.move, roll: 'random', bestUci, cpPlayed: pick.cp, cpBest }
  }

  if (pool.length >= 2 && rng() < opts.blunderChance) {
    const cutoff = Math.ceil(pool.length / 2)
    const lower = pool.slice(cutoff)
    if (lower.length > 0) {
      const pick = lower[Math.floor(rng() * lower.length)]
      return { uci: pick.move, roll: 'blunder', bestUci, cpPlayed: pick.cp, cpBest }
    }
  }

  const pick = pool[0]
  return {
    uci: pick.move,
    roll: pick.move === bestUci ? 'best' : 'filtered',
    bestUci,
    cpPlayed: pick.cp,
    cpBest,
  }
}
