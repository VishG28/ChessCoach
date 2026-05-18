import test from 'node:test'
import assert from 'node:assert/strict'
import type { Engine } from '../engine.ts'
import {
  __setEngineFactoryForTest,
  getOpponentEngine,
  getAnalysisEngine,
  teardownEngines,
  type EngineFactory,
} from '../workerPool.ts'

/**
 * Web Workers do not exist in Node, and `engine.ts` reads `import.meta.env`
 * at module load — so we mock at the wrapper boundary (the `EngineFactory`
 * the pool consumes) rather than the Worker boundary. Each fake Engine
 * records the messages it would have posted to its underlying Worker, so
 * we can assert per-engine queue isolation.
 */

interface FakeEngine {
  readonly instanceName: string
  readonly sent: string[]
  readonly multipv: number[]
  readonly elos: number[]
  disposed: boolean
  init(): Promise<void>
  setStrength(elo: number): Promise<void>
  setMultiPV(n: number): Promise<void>
  requestMove(opts: { fen: string }): Promise<void>
  requestAnalysis(opts: { fen: string }): Promise<void>
  dispose(): void
}

function createFakeEngine(instanceName: string): FakeEngine {
  return {
    instanceName,
    sent: [],
    multipv: [],
    elos: [],
    disposed: false,
    init() {
      this.sent.push('init')
      return Promise.resolve()
    },
    setStrength(elo: number) {
      this.elos.push(elo)
      this.sent.push(`strength:${elo}`)
      return Promise.resolve()
    },
    setMultiPV(n: number) {
      this.multipv.push(n)
      this.sent.push(`multipv:${n}`)
      return Promise.resolve()
    },
    requestMove(opts: { fen: string }) {
      this.sent.push(`move:${opts.fen}`)
      return Promise.resolve()
    },
    requestAnalysis(opts: { fen: string }) {
      this.sent.push(`analyze:${opts.fen}`)
      return Promise.resolve()
    },
    dispose() {
      this.disposed = true
      this.sent.push('dispose')
    },
  }
}

/** Track every engine the factory constructs so tests can assert on it. */
const createdEngines: FakeEngine[] = []

const fakeFactory: EngineFactory = {
  create(instanceName: string): Engine {
    const fake = createFakeEngine(instanceName)
    createdEngines.push(fake)
    // The pool typechecks against the full Engine surface. The fake satisfies
    // only the subset the pool actually calls, so we widen via `unknown`.
    return fake as unknown as Engine
  },
}

function resetPool(): void {
  // Tear down any existing singletons and clear the creation log so each
  // test starts from a known empty state.
  teardownEngines()
  createdEngines.length = 0
  __setEngineFactoryForTest(fakeFactory)
}

test('getOpponentEngine returns the same instance across calls', () => {
  resetPool()
  const a = getOpponentEngine()
  const b = getOpponentEngine()
  assert.strictEqual(a, b, 'opponent engine must be a singleton')
  assert.equal(createdEngines.length, 1, 'factory should construct exactly one opponent engine')
  assert.equal(
    (a as unknown as FakeEngine).instanceName,
    'opponent',
    'opponent engine should be labelled "opponent"',
  )
})

test('getAnalysisEngine returns the same instance across calls', () => {
  resetPool()
  const a = getAnalysisEngine()
  const b = getAnalysisEngine()
  assert.strictEqual(a, b, 'analysis engine must be a singleton')
  assert.equal(createdEngines.length, 1, 'factory should construct exactly one analysis engine')
  assert.equal(
    (a as unknown as FakeEngine).instanceName,
    'analysis',
    'analysis engine should be labelled "analysis"',
  )
})

test('opponent and analysis engines are distinct instances with separate Workers', () => {
  resetPool()
  const opp = getOpponentEngine() as unknown as FakeEngine
  const ana = getAnalysisEngine() as unknown as FakeEngine
  assert.notStrictEqual(opp, ana, 'opponent and analysis engines must be distinct objects')
  assert.equal(createdEngines.length, 2, 'factory must have produced two engines')
  // Each has its OWN sent-message recorder. This is the "private Worker" guarantee:
  // a message posted to one must never appear on the other's transcript.
  assert.notStrictEqual(opp.sent, ana.sent, 'sent-message arrays must be different objects')
  // Different instanceName labels prove the factory constructed them separately.
  assert.equal(opp.instanceName, 'opponent')
  assert.equal(ana.instanceName, 'analysis')
})

test('analysis engine is pinned to MultiPV=5 at init', async () => {
  resetPool()
  getAnalysisEngine()
  // Allow the chained init().then(setMultiPV(5)) to settle.
  await new Promise((r) => setTimeout(r, 0))
  const ana = createdEngines[0]
  assert.deepEqual(ana.multipv, [5], 'analysis engine must call setMultiPV(5) once at init')
})

test('opponent engine does NOT call setMultiPV at init', async () => {
  resetPool()
  getOpponentEngine()
  await new Promise((r) => setTimeout(r, 0))
  const opp = createdEngines[0]
  assert.deepEqual(opp.multipv, [], 'opponent engine init must not touch MultiPV')
})

test('interleaved moves and analyses stay on their own engine queues', async () => {
  resetPool()
  const opp = getOpponentEngine() as unknown as FakeEngine & {
    requestMove: (o: { fen: string }) => Promise<void>
    requestAnalysis: (o: { fen: string }) => Promise<void>
  }
  const ana = getAnalysisEngine() as unknown as FakeEngine & {
    requestMove: (o: { fen: string }) => Promise<void>
    requestAnalysis: (o: { fen: string }) => Promise<void>
  }

  // Fire 10 interleaved jobs across both engines.
  const jobs: Promise<void>[] = []
  for (let i = 0; i < 5; i++) {
    jobs.push(opp.requestMove({ fen: `M${i}` }))
    jobs.push(ana.requestAnalysis({ fen: `A${i}` }))
  }
  await Promise.all(jobs)

  // The opponent engine should ONLY see move:* sends; the analysis engine
  // should ONLY see analyze:* sends. Any cross-contamination here would
  // indicate the pool incorrectly shared a worker / queue.
  const oppMoves = opp.sent.filter((s) => s.startsWith('move:'))
  const oppAnalyses = opp.sent.filter((s) => s.startsWith('analyze:'))
  const anaMoves = ana.sent.filter((s) => s.startsWith('move:'))
  const anaAnalyses = ana.sent.filter((s) => s.startsWith('analyze:'))

  assert.equal(oppMoves.length, 5, 'opponent engine should have received 5 move requests')
  assert.equal(oppAnalyses.length, 0, 'opponent engine must not receive analyze requests')
  assert.equal(anaMoves.length, 0, 'analysis engine must not receive move requests')
  assert.equal(anaAnalyses.length, 5, 'analysis engine should have received 5 analysis requests')

  // Order within each engine should be preserved (queue is FIFO).
  assert.deepEqual(
    oppMoves,
    ['move:M0', 'move:M1', 'move:M2', 'move:M3', 'move:M4'],
    'opponent queue should preserve move order',
  )
  assert.deepEqual(
    anaAnalyses,
    ['analyze:A0', 'analyze:A1', 'analyze:A2', 'analyze:A3', 'analyze:A4'],
    'analysis queue should preserve analysis order',
  )
})

test('teardownEngines disposes both and the next get* returns fresh instances', () => {
  resetPool()
  const opp1 = getOpponentEngine() as unknown as FakeEngine
  const ana1 = getAnalysisEngine() as unknown as FakeEngine
  assert.equal(createdEngines.length, 2)

  teardownEngines()
  assert.equal(opp1.disposed, true, 'opponent engine must be disposed on teardown')
  assert.equal(ana1.disposed, true, 'analysis engine must be disposed on teardown')

  // Next calls must construct brand new instances (fresh Workers).
  const opp2 = getOpponentEngine() as unknown as FakeEngine
  const ana2 = getAnalysisEngine() as unknown as FakeEngine
  assert.equal(createdEngines.length, 4, 'four engines should have been constructed in total')
  assert.notStrictEqual(opp1, opp2, 'second opponent engine must be a different instance')
  assert.notStrictEqual(ana1, ana2, 'second analysis engine must be a different instance')
  assert.equal(opp2.disposed, false, 'fresh opponent engine must not be disposed')
  assert.equal(ana2.disposed, false, 'fresh analysis engine must not be disposed')
})

test('teardownEngines is safe to call when no engines have been constructed', () => {
  resetPool()
  // No get*Engine() calls before teardown — must not throw.
  teardownEngines()
  teardownEngines() // idempotent
  assert.equal(createdEngines.length, 0, 'teardown alone should not construct any engines')
})

test('getOpponentEngine throws a clear error if no factory is available', () => {
  // Wipe and DO NOT inject a factory.
  teardownEngines()
  __setEngineFactoryForTest(null)
  assert.throws(
    () => getOpponentEngine(),
    /factory resolved/,
    'should refuse to construct opponent engine without a factory',
  )
  // Restore the test factory so subsequent tests in any order remain green.
  __setEngineFactoryForTest(fakeFactory)
})
