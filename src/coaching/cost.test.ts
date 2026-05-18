import test from 'node:test'
import assert from 'node:assert/strict'
import {
  PRICING,
  estimateCost,
  estimateCostWithoutCache,
  formatUSD,
  type UsageRecord,
} from './cost.ts'

test('estimateCost returns 0 for an empty usage record', () => {
  const usage: UsageRecord = { input_tokens: 0, output_tokens: 0 }
  assert.equal(estimateCost(usage), 0)
})

test('estimateCost prices plain input + output correctly', () => {
  // 1M input + 1M output = $3 + $15 = $18
  const usage: UsageRecord = { input_tokens: 1_000_000, output_tokens: 1_000_000 }
  assert.equal(estimateCost(usage), PRICING.inputPerMTok + PRICING.outputPerMTok)
})

test('estimateCost charges cache writes at the 25% premium and cache reads at the 90% discount', () => {
  // 1M cache_creation = $3.75, 1M cache_read = $0.30
  const usage: UsageRecord = {
    input_tokens: 0,
    output_tokens: 0,
    cache_creation_input_tokens: 1_000_000,
    cache_read_input_tokens: 1_000_000,
  }
  const expected = PRICING.cacheWritePerMTok + PRICING.cacheReadPerMTok
  assert.equal(estimateCost(usage), expected)
})

test('estimateCost sums all four token buckets without double counting', () => {
  // 1000 of each → (1000 * 3 + 1000 * 15 + 1000 * 3.75 + 1000 * 0.3) / 1e6
  const usage: UsageRecord = {
    input_tokens: 1000,
    output_tokens: 1000,
    cache_creation_input_tokens: 1000,
    cache_read_input_tokens: 1000,
  }
  const expected =
    (1000 * PRICING.inputPerMTok +
      1000 * PRICING.outputPerMTok +
      1000 * PRICING.cacheWritePerMTok +
      1000 * PRICING.cacheReadPerMTok) /
    1_000_000
  assert.ok(Math.abs(estimateCost(usage) - expected) < 1e-12)
})

test('estimateCost treats negative inputs as zero (defensive clamp)', () => {
  const usage: UsageRecord = {
    input_tokens: -100,
    output_tokens: -50,
    cache_creation_input_tokens: -1,
    cache_read_input_tokens: -1,
  }
  assert.equal(estimateCost(usage), 0)
})

test('estimateCostWithoutCache reprices cached tokens as standard input', () => {
  // 1000 input + 1000 cache_write + 1000 cache_read = 3000 "as input" → 3000 * 3 / 1e6
  const usage: UsageRecord = {
    input_tokens: 1000,
    output_tokens: 0,
    cache_creation_input_tokens: 1000,
    cache_read_input_tokens: 1000,
  }
  const expected = (3000 * PRICING.inputPerMTok) / 1_000_000
  assert.ok(Math.abs(estimateCostWithoutCache(usage) - expected) < 1e-12)
})

test('estimateCostWithoutCache >= estimateCost when there are cache reads (caching saves money)', () => {
  const usage: UsageRecord = {
    input_tokens: 200,
    output_tokens: 100,
    cache_creation_input_tokens: 0,
    cache_read_input_tokens: 5000,
  }
  assert.ok(estimateCostWithoutCache(usage) > estimateCost(usage))
})

test('formatUSD formats with 4 decimals and a leading $', () => {
  assert.equal(formatUSD(0), '$0.0000')
  assert.equal(formatUSD(0.00123), '$0.0012')
  assert.equal(formatUSD(1.5), '$1.5000')
})

test('formatUSD guards against NaN, Infinity, and negatives', () => {
  assert.equal(formatUSD(Number.NaN), '$0.0000')
  assert.equal(formatUSD(Number.POSITIVE_INFINITY), '$0.0000')
  assert.equal(formatUSD(-1), '$0.0000')
})
