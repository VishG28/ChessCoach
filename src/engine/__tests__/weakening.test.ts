import test from 'node:test'
import assert from 'node:assert/strict'
import { getWeakeningParams, humanThinkDelay } from '../weakening.ts'

test('Elo 300 uses depth 1, multipv 10, high random_move_chance', () => {
  const p = getWeakeningParams(300)
  assert.equal(p.depth, 1)
  assert.equal(p.multipv, 10)
  assert.equal(p.useUciLimit, false)
  assert.ok(p.randomMoveChance >= 0.55 && p.randomMoveChance <= 0.65)
})

test('Elo 800 falls in the 800-1000 bucket', () => {
  const p = getWeakeningParams(800)
  assert.equal(p.depth, 4)
  assert.equal(p.multipv, 5)
  assert.equal(p.useUciLimit, false)
})

test('Elo 1500 uses UCI_LimitStrength and depth 10', () => {
  const p = getWeakeningParams(1500)
  assert.equal(p.useUciLimit, true)
  assert.equal(p.uciElo, 1500)
  assert.equal(p.depth, 10)
})

test('Elo 2000 has no random injection', () => {
  const p = getWeakeningParams(2000)
  assert.equal(p.randomMoveChance, 0)
  assert.equal(p.blunderChance, 0)
})

test('humanThinkDelay returns a value in [1200, 2000]', () => {
  for (let i = 0; i < 50; i++) {
    const ms = humanThinkDelay()
    assert.ok(ms >= 1200 && ms <= 2000)
  }
})
