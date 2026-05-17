import { getWeakeningParams } from './weakening'

export const UCI_ELO_FLOOR = 1320

export function depthFromElo(elo: number): number {
  return getWeakeningParams(elo).depth
}

export function movetimeFromElo(elo: number): number {
  return getWeakeningParams(elo).movetime
}

export function randomnessFromElo(elo: number): number {
  return getWeakeningParams(elo).randomMoveChance
}

export function useMultiPV(elo: number): boolean {
  return getWeakeningParams(elo).multipv > 1
}

/** Legacy: Stockfish Skill Level 0..20. Weakening is now done in selectMove, so this is binary. */
export function skillFromElo(elo: number): number {
  return getWeakeningParams(elo).useUciLimit ? 20 : 0
}
