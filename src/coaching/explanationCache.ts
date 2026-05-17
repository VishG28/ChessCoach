interface CacheEntry {
  text: string
  model: string
  timestamp: number
}
const KEY = 'cc.llm.cache.v1'
const MAX_ENTRIES = 500

type Cache = Record<string, CacheEntry>

function read(): Cache {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Cache) : {}
  } catch {
    return {}
  }
}

function write(c: Cache): void {
  try {
    const keys = Object.keys(c)
    if (keys.length > MAX_ENTRIES) {
      const sorted = keys.sort((a, b) => c[a].timestamp - c[b].timestamp)
      const prune = sorted.slice(0, keys.length - MAX_ENTRIES)
      for (const k of prune) delete c[k]
    }
    localStorage.setItem(KEY, JSON.stringify(c))
  } catch {
    /* full or unavailable */
  }
}

function cacheKey(fen: string, uci: string): string {
  return `${fen}|${uci}`
}

export function getCached(fen: string, uci: string): string | undefined {
  return read()[cacheKey(fen, uci)]?.text
}

export function setCached(fen: string, uci: string, text: string): void {
  const c = read()
  c[cacheKey(fen, uci)] = { text, model: 'claude-sonnet-4-6', timestamp: Date.now() }
  write(c)
}
