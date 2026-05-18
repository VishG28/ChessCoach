import { describe, expect, it } from 'vitest'
import { marbleIndex } from './marbleHash'

const FILES = ['a','b','c','d','e','f','g','h']
const ALL_SQUARES: string[] = []
for (const f of FILES) {
  for (let r = 1; r <= 8; r++) {
    ALL_SQUARES.push(`${f}${r}`)
  }
}

describe('marbleIndex', () => {
  it('is deterministic for a1 and h8', () => {
    expect(marbleIndex('a1', 8)).toBe(marbleIndex('a1', 8))
    expect(marbleIndex('h8', 8)).toBe(marbleIndex('h8', 8))
  })

  it('returns a value in [0, paletteSize) for all 64 squares', () => {
    for (const sq of ALL_SQUARES) {
      const idx = marbleIndex(sq, 8)
      expect(idx).toBeGreaterThanOrEqual(0)
      expect(idx).toBeLessThan(8)
    }
  })

  it('fewer than 25% of horizontally adjacent square pairs share an index', () => {
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
    expect(shared / total).toBeLessThan(0.25)
  })
})
