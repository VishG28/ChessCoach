export function marbleIndex(square: string, paletteSize: number): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < square.length; i++) {
    h ^= square.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  const file = square.charCodeAt(0) - 97
  const rank = parseInt(square[1] ?? '1', 10) - 1
  h ^= Math.imul(file + 1, 374761393) >>> 0
  h ^= Math.imul(rank + 1, 668265263) >>> 0
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0
  return (h >>> 0) % paletteSize
}
