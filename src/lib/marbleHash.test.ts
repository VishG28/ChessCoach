import test from 'node:test'
import assert from 'node:assert/strict'
import { marbleIndex } from './marbleHash.ts'

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const ALL_SQUARES: string[] = []
for (const f of FILES) {
  for (let r = 1; r <= 8; r++) {
    ALL_SQUARES.push(`${f}${r}`)
  }
}

test('marbleIndex is deterministic for a1 and h8', () => {
  assert.equal(marbleIndex('a1', 8), marbleIndex('a1', 8))
  assert.equal(marbleIndex('h8', 8), marbleIndex('h8', 8))
})

test('marbleIndex returns a value in [0, paletteSize) for all 64 squares', () => {
  for (const sq of ALL_SQUARES) {
    const idx = marbleIndex(sq, 8)
    assert.ok(idx >= 0, `${sq}: ${idx} not >= 0`)
    assert.ok(idx < 8, `${sq}: ${idx} not < 8`)
  }
})

test('fewer than 25% of horizontally adjacent square pairs share an index', () => {
  let shared = 0
  let total = 0
  for (let r = 1; r <= 8; r++) {
    for (let fi = 0; fi < FILES.length - 1; fi++) {
      const sq1 = `${FILES[fi]}${r}`
      const sq2 = `${FILES[fi + 1]}${r}`
      if (marbleIndex(sq1, 8) === marbleIndex(sq2, 8)) shared++
      total++
    }
  }
  assert.ok(shared / total < 0.25, `${shared}/${total} = ${shared / total} not < 0.25`)
})
