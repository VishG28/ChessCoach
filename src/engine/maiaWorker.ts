import * as ort from 'onnxruntime-web'
import { fenToMaiaInput, sampleFromPolicy, getLegalUcisForPolicy } from './maiaEncoding'

// GitHub Pages can't set COOP/COEP, so SharedArrayBuffer/threading is unavailable.
// Force single-threaded SIMD WASM; the same threaded-named binary runs single-
// threaded when numThreads = 1 (ORT 1.17+).
ort.env.wasm.numThreads = 1
ort.env.wasm.simd = true
ort.env.wasm.proxy = false
ort.env.wasm.wasmPaths = `${import.meta.env.BASE_URL}ort/`

interface LoadMsg {
  type: 'load'
  modelUrl: string
  modelKey: number
}
interface PredictMsg {
  type: 'predict'
  fen: string
  modelKey: number
  reqId: number
}
type In = LoadMsg | PredictMsg

const sessions = new Map<number, ort.InferenceSession>()

const post = (data: unknown): void => {
  ;(self as unknown as Worker).postMessage(data)
}

self.onmessage = async (e: MessageEvent<In>): Promise<void> => {
  const msg = e.data
  if (msg.type === 'load') {
    if (sessions.has(msg.modelKey)) {
      post({ type: 'loaded', modelKey: msg.modelKey })
      return
    }
    try {
      const session = await ort.InferenceSession.create(msg.modelUrl, {
        executionProviders: ['wasm'],
        graphOptimizationLevel: 'all',
      })
      sessions.set(msg.modelKey, session)
      post({ type: 'loaded', modelKey: msg.modelKey })
    } catch (err) {
      post({ type: 'load_error', modelKey: msg.modelKey, error: String(err) })
    }
    return
  }
  if (msg.type === 'predict') {
    const session = sessions.get(msg.modelKey)
    if (!session) {
      post({ type: 'predict_error', reqId: msg.reqId, error: 'model not loaded' })
      return
    }
    try {
      const input = fenToMaiaInput(msg.fen)
      const tensor = new ort.Tensor('float32', input, [1, 112, 8, 8])
      const inputName = session.inputNames[0]
      const results = await session.run({ [inputName]: tensor })
      // Prefer the named '/output/policy' output; fall back to first output.
      const policyOutputName =
        session.outputNames.find((n) => n.includes('policy')) ?? session.outputNames[0]
      const policy = results[policyOutputName].data as Float32Array
      const { whitePerspectiveUcis, backMap } = getLegalUcisForPolicy(msg.fen)
      const policyUci = sampleFromPolicy(policy, whitePerspectiveUcis, 1)
      const boardUci = backMap.get(policyUci) ?? policyUci
      post({ type: 'prediction', reqId: msg.reqId, uci: boardUci })
    } catch (err) {
      post({ type: 'predict_error', reqId: msg.reqId, error: String(err) })
    }
  }
}
