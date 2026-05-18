import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getRatingBucket, sampleBookMove } from './openingBook.ts'

test('rating bucket clamps below 200 to 1000', () => {
  assert.equal(getRatingBucket(100), '1000')
  assert.equal(getRatingBucket(200), '1000')
})

test('rating bucket scales mid-range', () => {
  assert.equal(getRatingBucket(800), '1200')
  assert.equal(getRatingBucket(1200), '1400')
  assert.equal(getRatingBucket(1800), '2000')
})

test('rating bucket clamps above 2200 to 2500', () => {
  assert.equal(getRatingBucket(2400), '2500')
  assert.equal(getRatingBucket(3000), '2500')
})

test('sampleBookMove returns a move from the candidates', () => {
  const book = {
    moves: [
      { uci: 'e2e4', san: 'e4', white: 100, draws: 50, black: 50 },
      { uci: 'd2d4', san: 'd4', white: 50, draws: 50, black: 100 },
    ],
  }
  const pick = sampleBookMove(book, () => 0.1)
  assert.ok(pick)
  assert.ok(pick.uci === 'e2e4' || pick.uci === 'd2d4')
})

test('sampleBookMove biases by weight', () => {
  const book = {
    moves: [
      { uci: 'e2e4', san: 'e4', white: 900, draws: 0, black: 0 },
      { uci: 'd2d4', san: 'd4', white: 100, draws: 0, black: 0 },
    ],
  }
  let e4 = 0
  for (let i = 0; i < 10000; i++) {
    const pick = sampleBookMove(book, Math.random)
    if (pick?.uci === 'e2e4') e4++
  }
  assert.ok(e4 > 8500 && e4 < 9500, `expected ~9000 e4, got ${e4}`)
})

test('sampleBookMove returns null on empty book', () => {
  assert.equal(sampleBookMove({ moves: [] }, Math.random), null)
})
