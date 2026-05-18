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

test('resolveEngine nearest-100 bucketing covers all 9 Maia models', () => {
  // Each exact-100 Elo in the Maia range should resolve to itself.
  for (const e of [1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800]) {
    const r = resolveEngine(e)
    assert.equal(r.source, 'maia', `Elo ${e} should route to Maia`)
    assert.equal(r.maiaModel, e, `Elo ${e} should pick Maia ${e}`)
  }
  // 1900 is the Stockfish threshold, not a Maia bucket at runtime.
  assert.equal(resolveEngine(1900).source, 'stockfish')
})

test('resolveEngine ties round up (1150 → 1200, 1250 → 1300, etc.)', () => {
  assert.equal(resolveEngine(1150).maiaModel, 1200)
  assert.equal(resolveEngine(1250).maiaModel, 1300)
  assert.equal(resolveEngine(1450).maiaModel, 1500)
  assert.equal(resolveEngine(1750).maiaModel, 1800)
  assert.equal(resolveEngine(1850).maiaModel, 1900)
})

test('resolveEngine off-tick Elos snap to nearest 100', () => {
  assert.equal(resolveEngine(1149).maiaModel, 1100)
  assert.equal(resolveEngine(1251).maiaModel, 1300)
  assert.equal(resolveEngine(1349).maiaModel, 1300)
  assert.equal(resolveEngine(1649).maiaModel, 1600)
  assert.equal(resolveEngine(1751).maiaModel, 1800)
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
