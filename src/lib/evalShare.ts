/** Convert centipawn evaluation to White's share (0..1) using a logistic.
 *
 * - cp = null and no mate: returns 0.5 (unknown — center the bar).
 * - mateIn > 0: returns 1 (White mates).
 * - mateIn < 0: returns 0 (Black mates).
 * - otherwise: logistic 1 / (1 + 10^(-cp/400)).
 */
export function evalToWhiteShare(
  cp: number | null,
  mateIn?: number | null,
): number {
  if (mateIn != null) return mateIn > 0 ? 1 : 0
  if (cp == null) return 0.5
  return 1 / (1 + Math.pow(10, -cp / 400))
}

/** Pretty-print the eval as `+0.32`, `-1.40`, or `M3` / `-M3`. */
export function formatEval(
  cp: number | null,
  mateIn?: number | null,
): string {
  if (mateIn != null) {
    if (mateIn === 0) return 'M'
    return mateIn > 0 ? `M${mateIn}` : `-M${Math.abs(mateIn)}`
  }
  if (cp == null) return '—'
  const pawns = cp / 100
  const sign = pawns > 0 ? '+' : pawns < 0 ? '−' : ''
  return `${sign}${Math.abs(pawns).toFixed(2)}`
}
