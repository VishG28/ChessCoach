import { Engine } from '@/engine/engine'
import type { AnalysisResult } from '@/engine/engine'

let instance: Engine | null = null
let initPromise: Promise<void> | null = null

function getInstance(): Engine {
  if (!instance) {
    instance = new Engine({ instanceName: 'analysis' })
    initPromise = instance
      .init()
      .then(async () => {
        await instance!.setMultiPV(3)
      })
      .catch((err: unknown) => {
        if (import.meta.env.DEV) {
          console.warn('[analysisEngine] init failed', err)
        }
        // Reset so next call retries.
        instance = null
        initPromise = null
      })
  }
  return instance
}

async function ensureReady(): Promise<Engine> {
  const e = getInstance()
  await initPromise
  return e
}

/** Run depth-12 multipv-3 background analysis on a FEN.
 *  Returns eval + top 3 candidates from the analysis engine,
 *  which runs in its own Worker so the play engine is never blocked. */
export async function analyzePosition(fen: string, depth = 12): Promise<AnalysisResult> {
  const e = await ensureReady()
  return e.requestAnalysis({ fen, depth, multipv: 3 })
}
