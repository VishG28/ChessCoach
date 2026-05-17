/** Piecewise-linear Elo curves for Stockfish strength calibration. */

type Anchor = readonly [elo: number, value: number]

const SKILL_ANCHORS: readonly Anchor[] = [
  [300, 0],
  [800, 5],
  [1320, 10],
  [2000, 20],
]

const DEPTH_ANCHORS: readonly Anchor[] = [
  [300, 1],
  [500, 2],
  [600, 3],
  [1000, 5],
  [1320, 8],
  [1600, 12],
  [2000, 18],
]

const MOVETIME_ANCHORS: readonly Anchor[] = [
  [300, 100],
  [800, 300],
  [1320, 600],
  [2000, 1500],
]

const RANDOM_ANCHORS: readonly Anchor[] = [
  [300, 0.3],
  [500, 0.15],
  [800, 0],
]

export const UCI_ELO_FLOOR = 1320

function interpolate(anchors: readonly Anchor[], elo: number): number {
  // Clamp to ends
  if (elo <= anchors[0][0]) return anchors[0][1]
  if (elo >= anchors[anchors.length - 1][0]) return anchors[anchors.length - 1][1]

  // Find bracketing pair and linear interpolate
  for (let i = 0; i < anchors.length - 1; i++) {
    const [x0, y0] = anchors[i]
    const [x1, y1] = anchors[i + 1]
    if (elo >= x0 && elo <= x1) {
      const t = (elo - x0) / (x1 - x0)
      return y0 + t * (y1 - y0)
    }
  }

  // Fallback (unreachable due to clamping above)
  return anchors[anchors.length - 1][1]
}

export function skillFromElo(elo: number): number {
  return Math.round(interpolate(SKILL_ANCHORS, elo))
}

export function depthFromElo(elo: number): number {
  return Math.max(1, Math.round(interpolate(DEPTH_ANCHORS, elo)))
}

export function movetimeFromElo(elo: number): number {
  return Math.max(50, Math.round(interpolate(MOVETIME_ANCHORS, elo)))
}

export function randomnessFromElo(elo: number): number {
  return Math.max(0, interpolate(RANDOM_ANCHORS, elo))
}

export function useMultiPV(elo: number): boolean {
  return elo < 800
}
