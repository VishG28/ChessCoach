import test from 'node:test'
import assert from 'node:assert/strict'
import { getWeakeningParams, humanThinkDelay, selectMove } from '../weakening.ts'
import type { TopCandidate } from '../types.ts'

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

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

test('selectMove returns the best move when no rolls are random/blunder', () => {
  const cands: TopCandidate[] = [
    { move: 'e2e4', cp: 30, pv: ['e2e4'] },
    { move: 'd2d4', cp: 25, pv: ['d2d4'] },
  ]
  const out = selectMove({
    candidates: cands,
    randomMoveChance: 0,
    blunderChance: 0,
    fenBefore: START_FEN,
    eloForSanity: 1500,
    rng: () => 0.99,
  })
  assert.equal(out.uci, 'e2e4')
  assert.equal(out.roll, 'best')
})

test('selectMove filters out moves with cp = -mate', () => {
  const cands: TopCandidate[] = [
    { move: 'e2e4', cp: 30, pv: ['e2e4'] },
    { move: 'g2g4', cp: -99999, pv: ['g2g4'] },
  ]
  const out = selectMove({
    candidates: cands,
    randomMoveChance: 1.0,
    blunderChance: 0,
    fenBefore: START_FEN,
    eloForSanity: 800,
    rng: () => 0.0,
  })
  assert.notEqual(out.uci, 'g2g4')
})

test('selectMove halves random_move_chance in lost positions', () => {
  const cands: TopCandidate[] = [
    { move: 'e2e4', cp: -800, pv: ['e2e4'] },
    { move: 'd2d4', cp: -900, pv: ['d2d4'] },
  ]
  const out = selectMove({
    candidates: cands,
    randomMoveChance: 0.6,
    blunderChance: 0,
    fenBefore: START_FEN,
    eloForSanity: 800,
    evalCp: -800,
    rng: () => 0.4,
  })
  // rng=0.4, threshold halved to 0.30, so 0.4 >= 0.30 → no random pick.
  assert.equal(out.roll, 'best')
})
