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

// Lichess Opening Explorer accepts a fixed set of rating buckets for the
// `ratings` query parameter. Verified against the public spec at
// https://github.com/lichess-org/api/blob/master/doc/specs/tags/openingexplorer/lichess.yaml
// and the upstream Rust enum `RatingGroup` in lichess-org/lila-openingexplorer
// (src/model/lichess.rs). Each bucket represents the floor of a 200-Elo band
// (with the final bucket covering 2500+). Sending an arbitrary integer like
// 1100 is silently bucketed by the server, so we pre-bucket to avoid relying
// on undocumented coercion.
export const LICHESS_RATING_BUCKETS: ReadonlyArray<number> = [
  0, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2500,
] as const

/**
 * Map an arbitrary Elo to the nearest valid Lichess Opening Explorer bucket.
 *
 * Lichess uses a fixed bucket set (see `LICHESS_RATING_BUCKETS`), not every
 * 100 Elo. We pick the highest bucket whose floor is <= elo, mirroring the
 * server-side `RatingGroup::select_avg` semantics.
 */
export function mapEloToLichessBucket(elo: number): number {
  if (!Number.isFinite(elo) || elo <= 0) return LICHESS_RATING_BUCKETS[0]
  let chosen = LICHESS_RATING_BUCKETS[0]
  for (const bucket of LICHESS_RATING_BUCKETS) {
    if (elo >= bucket) chosen = bucket
  }
  return chosen
}

/**
 * @deprecated Use {@link mapEloToLichessBucket}. Retained for backwards
 * compatibility with existing tests and call sites that want a string value.
 */
export function getRatingBucket(elo: number): string {
  return String(mapEloToLichessBucket(elo))
}

const BOOK_TIMEOUT_MS = 2000
const MIN_TOTAL_GAMES = 50
const MIN_MOVE_GAMES = 20
const MAX_BOOK_PLY = 24 // 12 full moves
const LICHESS_SPEEDS = 'blitz,rapid'
const LICHESS_ENDPOINT = 'https://explorer.lichess.ovh/lichess'

// Lichess asks integrators to identify themselves. Per-session, this is a
// constant; we bake the repo URL in so server-side operators can route
// inquiries back to us.
const USER_AGENT = 'chess-coach/1.0 (+https://github.com/VishG28/ChessCoach)'

// Per-session cache keyed by `${fen}|${bucket}|${speeds}`. We store the
// in-flight promise (not the resolved value) so concurrent callers for the
// same position share a single network request. Resets on page reload — no
// localStorage persistence by design.
const bookCache = new Map<string, Promise<BookResponse | null>>()

/**
 * Fetch and sample an opening-book move from Lichess. Returns null when the
 * position has insufficient data, the request times out, or any error occurs.
 *
 * Cancel-on-position-change policy: we let in-flight requests complete and
 * cache them. The opponent engine is the only caller and re-issues only when
 * it's the engine's turn, so request churn is naturally bounded. If a stale
 * request resolves after the position changed, the cache hit on the new
 * position dominates and the stale result is simply not consumed.
 */
export async function getBookMove(
  fen: string,
  userElo: number,
  ply: number,
): Promise<BookPick | null> {
  if (ply > MAX_BOOK_PLY) return null
  const bucket = mapEloToLichessBucket(userElo)
  const cacheKey = `${fen}|${bucket}|${LICHESS_SPEEDS}`
  const cached = bookCache.get(cacheKey)
  if (cached) {
    const resolved = await cached
    return resolved ? sampleBookMove(resolved, Math.random) : null
  }
  const promise = fetchBook(fen, bucket)
  bookCache.set(cacheKey, promise)
  // If the fetch itself rejects unexpectedly, evict the cache entry so the
  // next call retries instead of being permanently null.
  promise.catch(() => bookCache.delete(cacheKey))
  const book = await promise
  return book ? sampleBookMove(book, Math.random) : null
}

async function fetchBook(
  fen: string,
  bucket: number,
): Promise<BookResponse | null> {
  const url =
    `${LICHESS_ENDPOINT}?variant=standard` +
    `&speeds=${LICHESS_SPEEDS}` +
    `&ratings=${bucket}` +
    `&fen=${encodeURIComponent(fen)}` +
    `&moves=10` +
    `&topGames=0` +
    `&recentGames=0`
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), BOOK_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': USER_AGENT },
    })
    if (!res.ok) return null
    const data = (await res.json()) as {
      white: number
      draws: number
      black: number
      moves: BookMove[]
    }
    const totalGames = data.white + data.draws + data.black
    if (totalGames < MIN_TOTAL_GAMES) return null
    const validMoves = data.moves.filter(
      (m) => m.white + m.draws + m.black >= MIN_MOVE_GAMES,
    )
    if (validMoves.length === 0) return null
    return { moves: validMoves }
  } catch {
    // AbortError on timeout, network errors, or JSON parse failures all
    // fall through to engine. Opponent moves must never block on book latency.
    return null
  } finally {
    clearTimeout(timeout)
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

// Test-only: clear the per-session cache so unit tests are isolated.
export function __resetBookCacheForTests(): void {
  bookCache.clear()
}
