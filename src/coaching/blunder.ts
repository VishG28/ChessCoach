import type { EngineEval } from '@/engine/types'

/** Centipawn loss threshold above which a move is classified as a blunder. */
export const BLUNDER_CP = 200

/**
 * Centipawn loss from the mover's perspective.
 *
 * `EngineEval.cp` is "side-to-move at the FEN evaluated" — positive means
 * the side-to-move is winning. So:
 *   - `prevEval` was the position BEFORE the move (side to move = mover)
 *   - `newEval` was evaluated AFTER the move (side to move = opponent)
 *
 * After the move, the mover's score is `-newEval.cp` (flipped to mover's POV).
 * Loss = `prevEval.cp - (-newEval.cp) = prevEval.cp + newEval.cp`.
 *
 * Returns a non-negative number when the move is a loss for the mover.
 * A negative return means the mover improved (engine missed something or
 * opponent will probably reciprocate).
 */
export function cpLoss(prevEval: EngineEval, newEval: EngineEval): number {
  return prevEval.cp + newEval.cp
}

/** True when a centipawn loss exceeds the blunder threshold. */
export function isBlunder(loss: number): boolean {
  return loss > BLUNDER_CP
}
