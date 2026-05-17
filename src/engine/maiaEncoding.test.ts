import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  fenToMaiaInput,
  policyIndexToUci,
  uciToPolicyIndex,
  sampleFromPolicy,
} from './maiaEncoding.ts'

test('starting position encodes to 112*8*8 floats', () => {
  const input = fenToMaiaInput('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
  assert.equal(input.length, 112 * 8 * 8)
})

test('starting position: own pawn plane has 8 ones along rank 2', () => {
  const input = fenToMaiaInput('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
  // Plane 0 = own pawns. Each plane is 64 floats laid out by square index.
  let pawnCount = 0
  for (let i = 0; i < 64; i++) if (input[i] === 1) pawnCount++
  assert.equal(pawnCount, 8)
})

test('policy index round-trip e2e4', () => {
  const idx = uciToPolicyIndex('e2e4')
  assert.ok(idx >= 0 && idx < 1858, `idx=${idx}`)
  assert.equal(policyIndexToUci(idx), 'e2e4')
})

test('policy index round-trip promotion to queen', () => {
  const idx = uciToPolicyIndex('e7e8q')
  assert.ok(idx >= 0 && idx < 1858, `idx=${idx}`)
  assert.equal(policyIndexToUci(idx), 'e7e8q')
})

test('sampleFromPolicy returns a legal UCI', () => {
  const legal = ['e2e4', 'd2d4', 'g1f3']
  const logits = new Float32Array(1858)
  // Skew toward e2e4
  logits[uciToPolicyIndex('e2e4')] = 10
  logits[uciToPolicyIndex('d2d4')] = 1
  logits[uciToPolicyIndex('g1f3')] = 1
  const picked = sampleFromPolicy(logits, legal, 1)
  assert.ok(legal.includes(picked))
})
