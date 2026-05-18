import type { Move } from 'chess.js'

export const STARTING_FEN =
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

/** FEN of the position AFTER `ply` plies have been played (ply >= 0). */
export function fenAtPly(history: readonly Move[], ply: number): string {
  if (ply <= 0) return STARTING_FEN
  return history[ply - 1]?.after ?? STARTING_FEN
}

/** [from, to] highlight tuple for the move that produced `ply`'s position. */
export function lastMoveAtPly(
  history: readonly Move[],
  ply: number,
): [string, string] | null {
  if (ply <= 0) return null
  const m = history[ply - 1]
  return m ? [m.from, m.to] : null
}
