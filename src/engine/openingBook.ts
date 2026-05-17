export interface BookMove {
  uci: string
  san: string
  white: number
  draws: number
  black: number
}

export interface BookResponse {
  moves: BookMove[]
}

export interface BookPick {
  uci: string
  san: string
  weight: number
}

const RATING_BUCKETS: ReadonlyArray<{ at: number; bucket: string }> = [
  { at: 200,  bucket: '1000' },
  { at: 400,  bucket: '1000' },
  { at: 600,  bucket: '1200' },
  { at: 800,  bucket: '1200' },
  { at: 1000, bucket: '1400' },
  { at: 1200, bucket: '1400' },
  { at: 1400, bucket: '1600' },
  { at: 1600, bucket: '1800' },
  { at: 1800, bucket: '2000' },
  { at: 2000, bucket: '2200' },
  { at: 2200, bucket: '2500' },
]

export function getRatingBucket(elo: number): string {
  const clamped = Math.max(200, Math.min(2200, elo))
  const closest = RATING_BUCKETS.reduce((prev, curr) =>
    Math.abs(curr.at - clamped) < Math.abs(prev.at - clamped) ? curr : prev,
  )
  return closest.bucket
}

const bookCache = new Map<string, BookResponse | null>()
const BOOK_TIMEOUT_MS = 800
const MIN_TOTAL_GAMES = 50
const MIN_MOVE_GAMES = 20
const MAX_BOOK_PLY = 24  // 12 full moves

export async function getBookMove(
  fen: string,
  userElo: number,
  ply: number,
): Promise<BookPick | null> {
  if (ply > MAX_BOOK_PLY) return null
  const bucket = getRatingBucket(userElo)
  const cacheKey = `${fen}|${bucket}`
  if (bookCache.has(cacheKey)) {
    const cached = bookCache.get(cacheKey)
    return cached ? sampleBookMove(cached, Math.random) : null
  }
  try {
    const url = `https://explorer.lichess.ovh/lichess?variant=standard&speeds=blitz,rapid&ratings=${bucket}&fen=${encodeURIComponent(fen)}&moves=10`
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), BOOK_TIMEOUT_MS)
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeout)
    if (!res.ok) return null
    const data = (await res.json()) as {
      white: number
      draws: number
      black: number
      moves: BookMove[]
    }
    const totalGames = data.white + data.draws + data.black
    if (totalGames < MIN_TOTAL_GAMES) {
      bookCache.set(cacheKey, null)
      return null
    }
    const validMoves = data.moves.filter(
      (m) => m.white + m.draws + m.black >= MIN_MOVE_GAMES,
    )
    if (validMoves.length === 0) {
      bookCache.set(cacheKey, null)
      return null
    }
    const book: BookResponse = { moves: validMoves }
    bookCache.set(cacheKey, book)
    return sampleBookMove(book, Math.random)
  } catch {
    return null
  }
}

export function sampleBookMove(
  book: BookResponse,
  rng: () => number,
): BookPick | null {
  if (book.moves.length === 0) return null
  const total = book.moves.reduce((s, m) => s + m.white + m.draws + m.black, 0)
  if (total === 0) return null
  let r = rng() * total
  for (const m of book.moves) {
    const count = m.white + m.draws + m.black
    r -= count
    if (r <= 0) return { uci: m.uci, san: m.san, weight: count / total }
  }
  const fallback = book.moves[0]
  return { uci: fallback.uci, san: fallback.san, weight: 0 }
}
