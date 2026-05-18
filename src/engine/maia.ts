/**
 * Maia inference facade. Owns a single Web Worker that lazily loads the
 * Maia ONNX model for each Elo bucket on first use.
 */

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

const MAIA_MODELS: Record<number, string> = {
  1100: `${BASE}/maia/maia-1100.onnx`,
  1200: `${BASE}/maia/maia-1200.onnx`,
  1300: `${BASE}/maia/maia-1300.onnx`,
  1400: `${BASE}/maia/maia-1400.onnx`,
  1500: `${BASE}/maia/maia-1500.onnx`,
  1600: `${BASE}/maia/maia-1600.onnx`,
  1700: `${BASE}/maia/maia-1700.onnx`,
  1800: `${BASE}/maia/maia-1800.onnx`,
  1900: `${BASE}/maia/maia-1900.onnx`,
}

const MAIA_BUCKETS: ReadonlyArray<number> = [
  1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900,
]

/**
 * Bucket an Elo to the nearest 100 within [1100, 1900]. Ties round up
 * (e.g. 1150 → 1200) so that integer multiples of 50 land on the higher
 * Maia model.
 */
export function selectMaiaModel(elo: number): number {
  if (elo <= 1100) return 1100
  if (elo >= 1900) return 1900
  let best = MAIA_BUCKETS[0]
  let bestDist = Math.abs(elo - best)
  for (const b of MAIA_BUCKETS) {
    const d = Math.abs(elo - b)
    // `<=` makes ties round up to the higher bucket.
    if (d <= bestDist) {
      best = b
      bestDist = d
    }
  }
  return best
}

interface PendingRequest {
  resolve: (uci: string) => void
  reject: (e: Error) => void
}

let worker: Worker | null = null
let nextReqId = 1
const pending = new Map<number, PendingRequest>()
const loaded = new Set<number>()
const loadPromises = new Map<number, Promise<void>>()

function ensureWorker(): Worker {
  if (worker) return worker
  worker = new Worker(new URL('./maiaWorker.ts', import.meta.url), { type: 'module' })
  worker.onmessage = (e: MessageEvent): void => {
    const msg = e.data as {
      type: string
      reqId?: number
      uci?: string
      error?: string
      modelKey?: number
    }
    if (msg.type === 'loaded' && typeof msg.modelKey === 'number') loaded.add(msg.modelKey)
    if (msg.type === 'prediction' && typeof msg.reqId === 'number') {
      pending.get(msg.reqId)?.resolve(msg.uci ?? '')
      pending.delete(msg.reqId)
    }
    if (msg.type === 'predict_error' && typeof msg.reqId === 'number') {
      pending.get(msg.reqId)?.reject(new Error(msg.error ?? 'predict_error'))
      pending.delete(msg.reqId)
    }
  }
  return worker
}

export function loadMaiaModel(elo: number): Promise<void> {
  const modelKey = selectMaiaModel(elo)
  if (loaded.has(modelKey)) return Promise.resolve()
  const existing = loadPromises.get(modelKey)
  if (existing) return existing
  const w = ensureWorker()
  const url = MAIA_MODELS[modelKey]
  const p = new Promise<void>((resolve, reject) => {
    const handler = (e: MessageEvent): void => {
      const msg = e.data as { type: string; modelKey?: number; error?: string }
      if (msg.modelKey !== modelKey) return
      if (msg.type === 'loaded') {
        w.removeEventListener('message', handler)
        resolve()
      }
      if (msg.type === 'load_error') {
        w.removeEventListener('message', handler)
        reject(new Error(msg.error ?? 'load_error'))
      }
    }
    w.addEventListener('message', handler)
    w.postMessage({ type: 'load', modelUrl: url, modelKey })
  })
  loadPromises.set(modelKey, p)
  return p
}

export async function requestMaiaMove(fen: string, elo: number): Promise<string> {
  const modelKey = selectMaiaModel(elo)
  await loadMaiaModel(elo)
  const w = ensureWorker()
  const reqId = nextReqId++
  return new Promise<string>((resolve, reject) => {
    pending.set(reqId, { resolve, reject })
    w.postMessage({ type: 'predict', fen, modelKey, reqId })
  })
}

export function maiaModelName(elo: number): string {
  return `maia-${selectMaiaModel(elo)}`
}
