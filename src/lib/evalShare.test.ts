import { test } from 'node:test'
import assert from 'node:assert/strict'
import { evalToWhiteShare } from './evalShare.ts'

test('evalToWhiteShare: returns 0.5 for null', () => {
  assert.ok(Math.abs(evalToWhiteShare(null) - 0.5) < 1e-3)
})

test('evalToWhiteShare: returns 0.5 for 0 cp', () => {
  assert.ok(Math.abs(evalToWhiteShare(0) - 0.5) < 1e-3)
})

test('evalToWhiteShare: returns ~0.6 at +100 cp', () => {
  const share = evalToWhiteShare(100)
  assert.ok(share > 0.55 && share < 0.65, `expected ~0.6, got ${share}`)
})

test('evalToWhiteShare: returns >0.9 at +1000 cp', () => {
  assert.ok(evalToWhiteShare(1000) > 0.9)
})

test('evalToWhiteShare: mirrors for negative evals', () => {
  const sum = evalToWhiteShare(-100) + evalToWhiteShare(100)
  assert.ok(Math.abs(sum - 1) < 1e-3, `expected sum=1, got ${sum}`)
})

test('evalToWhiteShare: returns 1 for white mate', () => {
  assert.equal(evalToWhiteShare(null, 3), 1)
})

test('evalToWhiteShare: returns 0 for black mate', () => {
  assert.equal(evalToWhiteShare(null, -3), 0)
})
