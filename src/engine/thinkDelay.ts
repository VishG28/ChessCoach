/** Returns randomized opponent thinking delay in ms (uniform on [1200, 2000]). */

const THINK_DELAY_MIN_MS = 1200
const THINK_DELAY_MAX_MS = 2000

export function humanThinkDelay(): number {
  return THINK_DELAY_MIN_MS + Math.random() * (THINK_DELAY_MAX_MS - THINK_DELAY_MIN_MS)
}
