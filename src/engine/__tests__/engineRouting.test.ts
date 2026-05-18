import test from 'node:test'
import assert from 'node:assert/strict'
import {
  resolveEngine,
  skillDescription,
  ELO_MIN,
  ELO_MAX,
  STOCKFISH_THRESHOLD,
} from '../engineRouting.ts'

test('resolveEngine clamps Elo below floor to 1100 Maia', () => {
  const r = resolveEngine(800)
  assert.equal(r.source, 'maia')
  assert.equal(r.maiaModel, 1100)
  assert.equal(r.modelLabel, 'Maia 1100')
})

test('resolveEngine at 1100 → Maia 1100', () => {
  const r = resolveEngine(ELO_MIN)
  assert.equal(r.source, 'maia')
  assert.equal(r.maiaModel, 1100)
})

test('resolveEngine at 1500 → Maia 1500', () => {
  const r = resolveEngine(1500)
  assert.equal(r.source, 'maia')
  assert.equal(r.maiaModel, 1500)
  assert.equal(r.modelLabel, 'Maia 1500')
})

test('resolveEngine at 1899 → Maia 1900 (highest Maia bucket)', () => {
  const r = resolveEngine(1899)
  assert.equal(r.source, 'maia')
  assert.equal(r.maiaModel, 1900)
})

test('resolveEngine at 1900 → Stockfish depth 10', () => {
  const r = resolveEngine(STOCKFISH_THRESHOLD)
  assert.equal(r.source, 'stockfish')
  assert.equal(r.sfDepth, 10)
  assert.equal(r.sfElo, 1900)
  assert.equal(r.modelLabel, 'Stockfish 1900')
})

test('resolveEngine at 2100 → Stockfish depth 14', () => {
  const r = resolveEngine(2100)
  assert.equal(r.source, 'stockfish')
  assert.equal(r.sfDepth, 14)
  assert.equal(r.sfElo, 2100)
})

test('resolveEngine at 2400 → Stockfish depth 20', () => {
  const r = resolveEngine(ELO_MAX)
  assert.equal(r.source, 'stockfish')
  assert.equal(r.sfDepth, 20)
})

test('resolveEngine above 2400 clamps to 2400 / depth 20', () => {
  const r = resolveEngine(3000)
  assert.equal(r.source, 'stockfish')
  assert.equal(r.sfDepth, 20)
  assert.equal(r.sfElo, 2400)
  assert.equal(r.modelLabel, 'Stockfish 2400')
})

test('resolveEngine Stockfish movetime defaults to 1000ms', () => {
  const r = resolveEngine(2000)
  assert.equal(r.sfMovetimeMs, 1000)
})

test('skillDescription bands', () => {
  assert.equal(skillDescription(1100), 'Intermediate beginner')
  assert.equal(skillDescription(1299), 'Intermediate beginner')
  assert.equal(skillDescription(1300), 'Solid club player')
  assert.equal(skillDescription(1500), 'Strong club player')
  assert.equal(skillDescription(1700), 'Expert')
  assert.equal(skillDescription(1900), 'Master level')
  assert.equal(skillDescription(2100), 'International master')
  assert.equal(skillDescription(2400), 'Grandmaster strength')
})
