import test from 'node:test'
import assert from 'node:assert/strict'
import { humanThinkDelay } from '../thinkDelay.ts'

test('humanThinkDelay returns a number within [1200, 2000] ms and varies across calls', () => {
  const samples: number[] = []
  for (let i = 0; i < 100; i++) {
    samples.push(humanThinkDelay())
  }
  for (const ms of samples) {
    assert.equal(typeof ms, 'number')
    assert.ok(Number.isFinite(ms), `expected finite number, got ${ms}`)
  }
  const min = Math.min(...samples)
  const max = Math.max(...samples)
  assert.ok(min >= 1200, `min should be >= 1200, got ${min}`)
  assert.ok(max <= 2000, `max should be <= 2000, got ${max}`)
  const distinct = new Set(samples).size
  assert.ok(distinct >= 5, `expected at least 5 distinct values across 100 calls, got ${distinct}`)
})
