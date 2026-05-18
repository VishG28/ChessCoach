/**
 * Thin facade over the analysis engine in the worker pool. Existing callers
 * (`useGameLogger.analyzePosition`) continue to import from this module; the
 * pool ensures the analysis engine has its own private Worker / UCI state /
 * message queue, isolated from the opponent move pipeline.
 *
 * See `ENGINE_WORKER_AUDIT.md` and `workerPool.ts` for the rationale.
 */

import type { AnalysisResult } from '@/engine/engine'
import { getAnalysisEngine } from '@/engine/workerPool'

/**
 * Run depth-12 multipv-3 background analysis on a FEN. Routes to the
 * dedicated analysis engine in the pool, so it never blocks an in-flight
 * opponent move.
 */
export async function analyzePosition(fen: string, depth = 12): Promise<AnalysisResult> {
  const engine = getAnalysisEngine()
  return engine.requestAnalysis({ fen, depth, multipv: 3 })
}
