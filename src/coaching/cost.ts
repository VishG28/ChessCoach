// src/coaching/cost.ts
//
// Pricing math for Anthropic coaching calls.
//
// Pricing reference (per million tokens) — source: https://www.anthropic.com/pricing
// Model: claude-sonnet-4-6.
// TODO: revisit if Sonnet 4.6 pricing changes upstream.
export const PRICING = {
  /** Standard uncached input tokens. */
  inputPerMTok: 3.0,
  /** Cache writes — 25% premium over standard input. */
  cacheWritePerMTok: 3.75,
  /** Cache reads — 90% discount vs standard input. */
  cacheReadPerMTok: 0.3,
  /** Output tokens. */
  outputPerMTok: 15.0,
} as const

export interface UsageRecord {
  input_tokens: number
  output_tokens: number
  cache_creation_input_tokens?: number
  cache_read_input_tokens?: number
}

/**
 * Estimate the USD cost of a single request given its Anthropic usage block.
 * `input_tokens` from the API already excludes cache-creation and cache-read
 * tokens, so all four buckets are additive and never double-counted.
 */
export function estimateCost(usage: UsageRecord): number {
  const input = Math.max(0, usage.input_tokens) * PRICING.inputPerMTok
  const output = Math.max(0, usage.output_tokens) * PRICING.outputPerMTok
  const cacheWrite = Math.max(0, usage.cache_creation_input_tokens ?? 0) * PRICING.cacheWritePerMTok
  const cacheRead = Math.max(0, usage.cache_read_input_tokens ?? 0) * PRICING.cacheReadPerMTok
  return (input + output + cacheWrite + cacheRead) / 1_000_000
}

/**
 * Estimate what the same request would have cost without prompt caching:
 * cache-creation and cache-read tokens are both repriced as standard input.
 * Used to surface "Saved" deltas in the UI.
 */
export function estimateCostWithoutCache(usage: UsageRecord): number {
  const cacheWrite = Math.max(0, usage.cache_creation_input_tokens ?? 0)
  const cacheRead = Math.max(0, usage.cache_read_input_tokens ?? 0)
  const totalAsInput = Math.max(0, usage.input_tokens) + cacheWrite + cacheRead
  const input = totalAsInput * PRICING.inputPerMTok
  const output = Math.max(0, usage.output_tokens) * PRICING.outputPerMTok
  return (input + output) / 1_000_000
}

/** Format a USD amount with 4-decimal precision for small per-call sums. */
export function formatUSD(amount: number): string {
  if (!Number.isFinite(amount) || amount < 0) return '$0.0000'
  return `$${amount.toFixed(4)}`
}

/** Subset of CostCounter totals needed to render a session-cost summary. */
export interface CostTotalsSummary {
  usd: number
  usdWithoutCache: number
  cacheCreationTokens: number
  cacheReadTokens: number
}

/**
 * Compact summary string used by sidebars/footers.
 * Example: "$0.0123 · cache writes 1234 · reads 5678 · saved $0.0456".
 */
export function summarizeTotals(totals: CostTotalsSummary): string {
  const saved = Math.max(0, totals.usdWithoutCache - totals.usd)
  return [
    formatUSD(totals.usd),
    `cache writes ${totals.cacheCreationTokens}`,
    `reads ${totals.cacheReadTokens}`,
    `saved ${formatUSD(saved)}`,
  ].join(' · ')
}
