import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  __resetBookCacheForTests,
  getBookMove,
  getRatingBucket,
  LICHESS_RATING_BUCKETS,
  mapEloToLichessBucket,
  sampleBookMove,
} from './openingBook.ts'

test('rating bucket clamps below 1000 to the 0 bucket', () => {
  assert.equal(getRatingBucket(100), '0')
  assert.equal(getRatingBucket(200), '0')
})

test('rating bucket scales mid-range to floor bucket', () => {
  assert.equal(getRatingBucket(800), '0')
  assert.equal(getRatingBucket(1200), '1200')
  assert.equal(getRatingBucket(1800), '1800')
})

test('rating bucket clamps above the highest bucket', () => {
  assert.equal(getRatingBucket(2400), '2200')
  assert.equal(getRatingBucket(3000), '2500')
})

test('mapEloToLichessBucket uses the documented Lichess bucket set', () => {
  assert.deepEqual(
    [...LICHESS_RATING_BUCKETS],
    [0, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2500],
    'bucket set must match the upstream Lichess Opening Explorer spec',
  )
})

test('mapEloToLichessBucket picks the floor bucket for arbitrary Elo', () => {
  // 1100 falls in the [1000, 1200) bucket -> 1000
  assert.equal(mapEloToLichessBucket(1100), 1000)
  // 1500 falls in the [1400, 1600) bucket -> 1400
  assert.equal(mapEloToLichessBucket(1500), 1400)
  // 2400 falls in the [2200, 2500) bucket -> 2200
  assert.equal(mapEloToLichessBucket(2400), 2200)
})

test('mapEloToLichessBucket clamps at boundaries', () => {
  // Sub-1000 -> the 0 bucket (which represents the "low" rating group)
  assert.equal(mapEloToLichessBucket(100), 0)
  assert.equal(mapEloToLichessBucket(999), 0)
  // 1000 exactly hits the second bucket
  assert.equal(mapEloToLichessBucket(1000), 1000)
  // Above 2500 stays at 2500 (the highest bucket)
  assert.equal(mapEloToLichessBucket(3000), 2500)
  assert.equal(mapEloToLichessBucket(2500), 2500)
})

test('mapEloToLichessBucket handles non-finite inputs', () => {
  // Non-finite or non-positive inputs fall back to the lowest bucket. This
  // matches the helper's contract: never throw, always return a valid bucket.
  assert.equal(mapEloToLichessBucket(NaN), 0)
  assert.equal(mapEloToLichessBucket(-100), 0)
  assert.equal(mapEloToLichessBucket(Infinity), 0)
})

test('sampleBookMove returns a move from the candidates', () => {
  const book = {
    moves: [
      { uci: 'e2e4', san: 'e4', white: 100, draws: 50, black: 50 },
      { uci: 'd2d4', san: 'd4', white: 50, draws: 50, black: 100 },
    ],
  }
  const pick = sampleBookMove(book, () => 0.1)
  assert.ok(pick)
  assert.ok(pick.uci === 'e2e4' || pick.uci === 'd2d4')
})

test('sampleBookMove biases by weight', () => {
  const book = {
    moves: [
      { uci: 'e2e4', san: 'e4', white: 900, draws: 0, black: 0 },
      { uci: 'd2d4', san: 'd4', white: 100, draws: 0, black: 0 },
    ],
  }
  let e4 = 0
  for (let i = 0; i < 10000; i++) {
    const pick = sampleBookMove(book, Math.random)
    if (pick?.uci === 'e2e4') e4++
  }
  assert.ok(e4 > 8500 && e4 < 9500, `expected ~9000 e4, got ${e4}`)
})

test('sampleBookMove returns null on empty book', () => {
  assert.equal(sampleBookMove({ moves: [] }, Math.random), null)
})

// ---------------------------------------------------------------------------
// Fetch-level tests with stubbed globalThis.fetch. node:test has no built-in
// mocking framework, so we swap globalThis.fetch around each test and restore
// the original in a try/finally.
// ---------------------------------------------------------------------------

const STARTING_FEN =
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

function makeOkResponse(body: unknown): Response {
  return {
    ok: true,
    status: 200,
    json: async () => body,
  } as unknown as Response
}

const SAMPLE_BOOK_BODY = {
  white: 100,
  draws: 100,
  black: 100,
  moves: [
    { uci: 'e2e4', san: 'e4', white: 80, draws: 60, black: 60 },
    { uci: 'd2d4', san: 'd4', white: 20, draws: 40, black: 40 },
  ],
}

test('getBookMove caches per-session: identical FEN hits cache, single fetch', async () => {
  __resetBookCacheForTests()
  const originalFetch = globalThis.fetch
  let callCount = 0
  globalThis.fetch = (async () => {
    callCount++
    return makeOkResponse(SAMPLE_BOOK_BODY)
  }) as typeof fetch
  try {
    const first = await getBookMove(STARTING_FEN, 1500, 2)
    const second = await getBookMove(STARTING_FEN, 1500, 2)
    assert.equal(callCount, 1, 'identical FEN should reuse cached promise')
    assert.ok(first, 'first call should return a book move')
    assert.ok(second, 'second call should also return a book move')
  } finally {
    globalThis.fetch = originalFetch
    __resetBookCacheForTests()
  }
})

test('getBookMove times out at ~2s and resolves to null without throwing', async () => {
  __resetBookCacheForTests()
  const originalFetch = globalThis.fetch
  // Hang forever unless the AbortController fires.
  globalThis.fetch = ((_url: string, init?: RequestInit) =>
    new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => {
        const err = new Error('aborted')
        err.name = 'AbortError'
        reject(err)
      })
    })) as typeof fetch
  try {
    const start = Date.now()
    const result = await getBookMove(STARTING_FEN, 1500, 2)
    const elapsed = Date.now() - start
    assert.equal(result, null, 'timeout should resolve to null')
    assert.ok(
      elapsed >= 1900 && elapsed <= 2400,
      `expected ~2s timeout, got ${elapsed}ms`,
    )
  } finally {
    globalThis.fetch = originalFetch
    __resetBookCacheForTests()
  }
})

test('getBookMove sends Lichess-compliant URL and User-Agent', async () => {
  __resetBookCacheForTests()
  const originalFetch = globalThis.fetch
  let capturedUrl: string | undefined
  let capturedHeaders: Record<string, string> | undefined
  globalThis.fetch = (async (url: string, init?: RequestInit) => {
    capturedUrl = url
    capturedHeaders = init?.headers as Record<string, string> | undefined
    return makeOkResponse(SAMPLE_BOOK_BODY)
  }) as typeof fetch
  try {
    await getBookMove(STARTING_FEN, 1500, 2)
    assert.ok(capturedUrl)
    assert.ok(
      capturedUrl.startsWith('https://explorer.lichess.ovh/lichess?'),
      `expected lichess endpoint, got ${capturedUrl}`,
    )
    // 1500 elo should resolve to the 1400 bucket
    assert.ok(
      capturedUrl.includes('ratings=1400'),
      `expected ratings=1400, got ${capturedUrl}`,
    )
    assert.ok(capturedHeaders)
    assert.ok(
      capturedHeaders['User-Agent']?.startsWith('chess-coach/'),
      `expected chess-coach User-Agent, got ${capturedHeaders['User-Agent']}`,
    )
  } finally {
    globalThis.fetch = originalFetch
    __resetBookCacheForTests()
  }
})

test('getBookMove returns null past MAX_BOOK_PLY without calling fetch', async () => {
  __resetBookCacheForTests()
  const originalFetch = globalThis.fetch
  let called = false
  globalThis.fetch = (async () => {
    called = true
    return makeOkResponse(SAMPLE_BOOK_BODY)
  }) as typeof fetch
  try {
    const result = await getBookMove(STARTING_FEN, 1500, 25)
    assert.equal(result, null)
    assert.equal(called, false, 'should not call fetch past MAX_BOOK_PLY')
  } finally {
    globalThis.fetch = originalFetch
    __resetBookCacheForTests()
  }
})
