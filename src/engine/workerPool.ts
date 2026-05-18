/**
 * Engine worker pool: isolated singletons for opponent moves and silent analysis.
 *
 * Background: the play `Engine` (created by `useEngine()` in `engine.ts`) used to
 * be shared by both the opponent move pipeline (`requestOpponentMove`) and the
 * coaching eval (`useCoach.fetchEval`). Because `Engine` serializes all jobs on a
 * single `queue`, a coaching analyse request would block the next opponent move
 * (and vice versa). See `ENGINE_WORKER_AUDIT.md` for the full analysis.
 *
 * This module exposes two lazy singletons:
 *   - `getOpponentEngine()` — drives opponent moves. Reconfigurable strength via
 *     `setOpponentElo`.
 *   - `getAnalysisEngine()` — drives silent eval / coaching analysis. Pinned to
 *      MultiPV=5; never reconfigured during a session.
 *
 * Each singleton owns its own private `Worker`, its own UCI state machine, and
 * its own message queue, so a slow analysis can never stall a move request.
 *
 * `teardownEngines()` terminates both workers and resets the singletons so the
 * next `get*` call re-initializes from scratch (used on PlayPage unmount).
 */

import type { Engine } from './engine'

/**
 * Factory contract for creating Engine instances. The default factory
 * constructs the real `Engine` class from `./engine.ts`, which depends on
 * `import.meta.env.BASE_URL` and `new Worker(WORKER_URL)` — both Vite-only.
 *
 * Tests inject a mock factory via `__setEngineFactoryForTest()` so the pool's
 * pooling / teardown semantics can be verified under `node --test`, where
 * `import.meta.env` and `Worker` are not available.
 */
export interface EngineFactory {
  create(instanceName: string): Engine
}

let engineFactory: EngineFactory | null = null

/**
 * Resolve the active factory, lazily importing the real one if none has been
 * injected. Must be awaited before the first `get*Engine()` call in
 * production code (PlayPage does this via `ensurePoolReady()`).
 */
async function resolveFactory(): Promise<EngineFactory> {
  if (engineFactory) return engineFactory
  // Lazy dynamic import so test environments that inject a factory before
  // first use never touch `./engine.ts` (which references `import.meta.env`
  // at module load and would crash under `node --test`).
  const mod = await import('./engine')
  const EngineCls = mod.Engine
  engineFactory = {
    create(instanceName: string): Engine {
      return new EngineCls({ instanceName })
    },
  }
  return engineFactory
}

/**
 * Replace the engine factory. Intended for tests only. Pass `null` to clear
 * the override and fall back to the default Vite-backed factory on the next
 * `get*Engine()` call (after `ensurePoolReady()` resolves it).
 */
export function __setEngineFactoryForTest(factory: EngineFactory | null): void {
  engineFactory = factory
}

interface PoolEntry {
  engine: Engine
  initPromise: Promise<void>
}

let opponent: PoolEntry | null = null
let analysis: PoolEntry | null = null

/**
 * The opponent engine: dedicated to `requestOpponentMove`. Reconfigured per
 * game via `setOpponentElo`. Owns its private Worker and message queue.
 *
 * Throws if no factory has been resolved yet. App callers should ensure
 * `await ensurePoolReady()` has been called once at startup.
 */
export function getOpponentEngine(): Engine {
  if (opponent) return opponent.engine
  if (!engineFactory) {
    throw new Error(
      '[workerPool] getOpponentEngine() called before factory resolved. ' +
        'Call `await ensurePoolReady()` at startup, or inject a factory via __setEngineFactoryForTest.',
    )
  }
  const engine = engineFactory.create('opponent')
  const initPromise = engine.init()
  opponent = { engine, initPromise }
  return engine
}

/**
 * The analysis engine: dedicated to `useCoach.fetchEval` and
 * `useGameLogger.analyzePosition`. Pinned to MultiPV=5 at init; never
 * reconfigured. Owns its private Worker and message queue.
 *
 * Throws if no factory has been resolved yet.
 */
export function getAnalysisEngine(): Engine {
  if (analysis) return analysis.engine
  if (!engineFactory) {
    throw new Error(
      '[workerPool] getAnalysisEngine() called before factory resolved. ' +
        'Call `await ensurePoolReady()` at startup, or inject a factory via __setEngineFactoryForTest.',
    )
  }
  const engine = engineFactory.create('analysis')
  const initPromise = engine.init().then(() => engine.setMultiPV(5))
  analysis = { engine, initPromise }
  return engine
}

/**
 * One-shot async resolver that loads the real Engine factory if it hasn't
 * been pre-injected. Call this once on app startup (e.g. inside PlayPage's
 * mount effect) before invoking any `get*Engine()`.
 */
export async function ensurePoolReady(): Promise<void> {
  await resolveFactory()
}

/**
 * Await both engines' initialization. Constructs the singletons if they
 * haven't been constructed yet.
 */
export async function awaitPoolInit(): Promise<void> {
  if (!engineFactory) await resolveFactory()
  getOpponentEngine()
  getAnalysisEngine()
  await Promise.all([opponent?.initPromise, analysis?.initPromise])
}

/**
 * Apply a strength setting to the opponent engine only. The analysis engine
 * is intentionally NOT touched — it stays at full strength so the coach
 * gives objective evaluations regardless of the user's chosen opponent Elo.
 */
export async function setOpponentElo(elo: number): Promise<void> {
  const engine = getOpponentEngine()
  await opponent?.initPromise
  await engine.setStrength(elo)
}

/**
 * Terminate both workers cleanly and reset the singletons. The next
 * `get*Engine()` call will spin up fresh Engine instances with fresh Workers.
 *
 * Wired into PlayPage's unmount effect.
 */
export function teardownEngines(): void {
  if (opponent) {
    try {
      opponent.engine.dispose()
    } catch {
      // Worker may already be terminated; swallow.
    }
    opponent = null
  }
  if (analysis) {
    try {
      analysis.engine.dispose()
    } catch {
      // Worker may already be terminated; swallow.
    }
    analysis = null
  }
}
