// src/coaching/costCounter.tsx
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  estimateCost,
  estimateCostWithoutCache,
  formatUSD,
  type UsageRecord,
} from './cost'

export interface CostTotals {
  /** Running USD spent across this session, after cache savings. */
  usd: number
  /** Hypothetical USD if no caching had been applied — used to surface "Saved". */
  usdWithoutCache: number
  /** Total uncached input tokens billed. */
  inputTokens: number
  /** Total output tokens billed. */
  outputTokens: number
  /** Total tokens billed at the cache-write rate. */
  cacheCreationTokens: number
  /** Total tokens billed at the cache-read rate. */
  cacheReadTokens: number
  /** Number of coaching calls aggregated into these totals. */
  callCount: number
}

interface CostCounterValue extends CostTotals {
  /**
   * Add a single coaching call's usage record. Updates all aggregated counters
   * in one race-free batch.
   */
  record: (usage: UsageRecord) => void
  /**
   * @deprecated Prefer `record(usage)`. Adds a raw USD amount for back-compat
   * with callers that pre-computed cost themselves (e.g. before cache support).
   */
  add: (deltaUsd: number) => void
  reset: () => void
}

const CostCounterContext = createContext<CostCounterValue | null>(null)

const ZERO_TOTALS: CostTotals = {
  usd: 0,
  usdWithoutCache: 0,
  inputTokens: 0,
  outputTokens: 0,
  cacheCreationTokens: 0,
  cacheReadTokens: 0,
  callCount: 0,
}

export function useCostCounter(): CostCounterValue {
  const ctx = useContext(CostCounterContext)
  if (!ctx) throw new Error('useCostCounter must be used within CostCounterProvider')
  return ctx
}

export function CostCounterProvider({ children }: { children: ReactNode }) {
  // Mirror state into a ref so concurrent record() / add() calls don't lose
  // increments if React batches multiple updates between renders.
  const ref = useRef<CostTotals>({ ...ZERO_TOTALS })
  const [totals, setTotals] = useState<CostTotals>(ZERO_TOTALS)

  const flush = useCallback(() => {
    setTotals({ ...ref.current })
  }, [])

  const record = useCallback(
    (usage: UsageRecord) => {
      const next: CostTotals = {
        usd: ref.current.usd + estimateCost(usage),
        usdWithoutCache: ref.current.usdWithoutCache + estimateCostWithoutCache(usage),
        inputTokens: ref.current.inputTokens + Math.max(0, usage.input_tokens),
        outputTokens: ref.current.outputTokens + Math.max(0, usage.output_tokens),
        cacheCreationTokens:
          ref.current.cacheCreationTokens +
          Math.max(0, usage.cache_creation_input_tokens ?? 0),
        cacheReadTokens:
          ref.current.cacheReadTokens + Math.max(0, usage.cache_read_input_tokens ?? 0),
        callCount: ref.current.callCount + 1,
      }
      ref.current = next
      flush()
    },
    [flush],
  )

  const add = useCallback(
    (deltaUsd: number) => {
      if (!Number.isFinite(deltaUsd) || deltaUsd <= 0) return
      ref.current = {
        ...ref.current,
        usd: ref.current.usd + deltaUsd,
        usdWithoutCache: ref.current.usdWithoutCache + deltaUsd,
      }
      flush()
    },
    [flush],
  )

  const reset = useCallback(() => {
    ref.current = { ...ZERO_TOTALS }
    setTotals(ZERO_TOTALS)
  }, [])

  return (
    <CostCounterContext.Provider value={{ ...totals, record, add, reset }}>
      {children}
    </CostCounterContext.Provider>
  )
}

/**
 * Compact summary string used by sidebars/footers.
 * Example: "$0.0123 · cache writes 1234 · reads 5678 · saved $0.0456".
 */
export function summarizeTotals(totals: CostTotals): string {
  const saved = Math.max(0, totals.usdWithoutCache - totals.usd)
  return [
    formatUSD(totals.usd),
    `cache writes ${totals.cacheCreationTokens}`,
    `reads ${totals.cacheReadTokens}`,
    `saved ${formatUSD(saved)}`,
  ].join(' · ')
}
