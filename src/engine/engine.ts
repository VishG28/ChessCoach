import { useEffect, useRef, useState } from 'react'
import type { EngineDebugState, EngineEval, EngineMove, TopCandidate } from './types'
import { resolveEngine, STOCKFISH_THRESHOLD } from './engineRouting'

const WORKER_URL = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/engine/stockfish-18-lite-single.js`
const MATE_SCORE = 100000
const RECENT_MOVES_MAX = 5
const LAST_COMMANDS_MAX = 20

export interface EngineOptions {
  /** A label for logs / debug. Defaults to 'play'. */
  instanceName?: string
}

export interface AnalysisResult {
  eval: EngineEval
  candidates: TopCandidate[]
}

export function parseUciMove(uci: string): EngineMove {
  const promo = uci.length >= 5 ? uci[4] : undefined
  const move: EngineMove = { from: uci.slice(0, 2), to: uci.slice(2, 4) }
  if (promo === 'q' || promo === 'r' || promo === 'b' || promo === 'n') {
    move.promotion = promo
  }
  return move
}

interface InfoSnapshot {
  depth: number
  cp: number
  mateIn?: number
  pv: string[]
  multipv: number
}

type JobMode = 'ready' | 'move' | 'eval' | 'analyze'

interface Job {
  mode: JobMode
  commands: string[]
  resolve: (value: EngineMove | EngineEval | AnalysisResult | void) => void
  reject: (e: Error) => void
}

export interface RequestMoveOptions {
  fen: string
  depth: number
  movetime: number
  multipv?: number
}

export class Engine {
  private worker: Worker
  private readonly name: string
  private initPromise: Promise<void> | null = null
  private queue: Job[] = []
  private active: Job | null = null
  private info: InfoSnapshot = { depth: 0, cp: 0, pv: [], multipv: 1 }
  private disposed = false

  private debugState: EngineDebugState = {
    elo: 0,
    skill: 0,
    depth: 0,
    movetime: 0,
    multipv: 1,
    randomness: 0,
    lastCommands: [],
    recentMoves: [],
  }
  private debugListeners = new Set<(s: EngineDebugState) => void>()
  private currentMultipv = 1
  private candidates: Map<number, TopCandidate> = new Map()

  constructor(opts: EngineOptions = {}) {
    this.name = opts.instanceName ?? 'play'
    this.worker = new Worker(WORKER_URL)
    this.worker.onmessage = (event: MessageEvent<unknown>) => {
      if (typeof event.data !== 'string') return
      for (const line of event.data.split('\n')) {
        const trimmed = line.trim()
        if (trimmed.length > 0) this.handleLine(trimmed)
      }
    }
    if (import.meta.env.DEV) {
      console.info('[engine:' + this.name + '] created')
    }
  }

  getDebugState(): EngineDebugState {
    return {
      ...this.debugState,
      lastCommands: [...this.debugState.lastCommands],
      recentMoves: this.debugState.recentMoves.map((m) => ({ ...m })),
    }
  }

  onDebug(fn: (s: EngineDebugState) => void): () => void {
    this.debugListeners.add(fn)
    return () => {
      this.debugListeners.delete(fn)
    }
  }

  recordEngineMoveSan(uci: string, san: string): void {
    // Patch the most recent recentMoves entry whose uci matches and san is not yet set
    const moves = this.debugState.recentMoves.map((m) =>
      m.uci === uci && m.san === undefined ? { ...m, san } : m,
    )
    this.updateDebug({ recentMoves: moves })
  }

  recordRoll(
    uci: string,
    roll: 'best' | 'random' | 'blunder' | 'filtered',
    cpBest: number,
  ): void {
    const moves = this.debugState.recentMoves.map((m) =>
      m.uci === uci && m.roll === undefined ? { ...m, roll, cpBest } : m,
    )
    this.updateDebug({ recentMoves: moves })
  }

  recordOpponentSource(source: 'book' | 'stockfish' | 'maia'): void {
    this.updateDebug({ lastOpponentSource: source })
  }

  private updateDebug(patch: Partial<EngineDebugState>): void {
    this.debugState = { ...this.debugState, ...patch }
    const snapshot = this.getDebugState()
    for (const fn of this.debugListeners) fn(snapshot)
  }

  init(): Promise<void> {
    if (this.initPromise) return this.initPromise
    this.initPromise = (async () => {
      await this.enqueue('ready', ['uci'])
      await this.enqueue('ready', ['isready'])
      await this.enqueue('ready', ['ucinewgame', 'isready'])
    })() as Promise<void>
    return this.initPromise
  }

  setStrength(elo: number): Promise<void> {
    const r = resolveEngine(elo)
    const useUciLimit = r.source === 'stockfish'
    const uciElo = r.sfElo ?? STOCKFISH_THRESHOLD
    const depth = r.sfDepth ?? 14
    const movetime = r.sfMovetimeMs ?? 1000
    const multipv = 1
    const skill = 20

    const cmds: string[] = [
      `setoption name MultiPV value ${multipv}`,
      `setoption name Skill Level value ${skill}`,
      `setoption name UCI_LimitStrength value ${useUciLimit}`,
    ]
    if (useUciLimit) {
      cmds.push(`setoption name UCI_Elo value ${uciElo}`)
    }
    cmds.push('isready')

    this.currentMultipv = multipv

    const updatedCommands = [...this.debugState.lastCommands, ...cmds].slice(-LAST_COMMANDS_MAX)
    this.updateDebug({
      elo,
      skill,
      depth,
      movetime,
      multipv,
      randomness: 0,
      lastCommands: updatedCommands,
    })

    if (import.meta.env.DEV) {
      console.info('[engine] setStrength', { elo, source: r.source, depth, movetime, multipv, useUciLimit, uciElo })
    }

    return this.enqueue('ready', cmds) as Promise<void>
  }

  requestMove(opts: RequestMoveOptions): Promise<EngineMove> {
    const { fen, depth, movetime, multipv = 1 } = opts
    this.currentMultipv = multipv
    this.candidates.clear()

    const d = Math.max(1, Math.round(depth))
    const t = Math.max(50, Math.round(movetime))

    const moveCmds = [`position fen ${fen}`, `go depth ${d} movetime ${t}`]
    const updatedCommands = [...this.debugState.lastCommands, ...moveCmds].slice(-LAST_COMMANDS_MAX)
    this.updateDebug({ lastCommands: updatedCommands })

    return this.enqueue('move', moveCmds) as Promise<EngineMove>
  }

  requestEval(fen: string, depth: number): Promise<EngineEval> {
    const d = Math.max(1, Math.round(depth))
    return this.enqueue('eval', [`position fen ${fen}`, `go depth ${d}`]) as Promise<EngineEval>
  }

  setMultiPV(n: number): Promise<void> {
    const cmds = [`setoption name MultiPV value ${n}`, 'isready']
    this.currentMultipv = n
    if (import.meta.env.DEV) {
      console.info('[engine:' + this.name + '] setMultiPV', n)
    }
    return this.enqueue('ready', cmds) as Promise<void>
  }

  requestAnalysis(opts: { fen: string; depth: number; multipv: number }): Promise<AnalysisResult> {
    const { fen, depth, multipv } = opts
    this.currentMultipv = multipv
    this.candidates.clear()
    const d = Math.max(1, Math.round(depth))
    const cmds = [
      `setoption name MultiPV value ${multipv}`,
      `position fen ${fen}`,
      `go depth ${d}`,
    ]
    if (import.meta.env.DEV) {
      console.info('[engine:' + this.name + '] requestAnalysis', { fen, depth, multipv })
    }
    return this.enqueue('analyze', cmds) as Promise<AnalysisResult>
  }

  dispose(): void {
    if (this.disposed) return
    this.disposed = true
    const err = new Error('engine disposed')
    if (this.active) this.active.reject(err)
    this.active = null
    for (const job of this.queue) job.reject(err)
    this.queue = []
    this.worker.terminate()
  }

  private enqueue(mode: JobMode, commands: string[]): Promise<EngineMove | EngineEval | AnalysisResult | void> {
    return new Promise<EngineMove | EngineEval | AnalysisResult | void>((resolve, reject) => {
      this.queue.push({ mode, commands, resolve, reject })
      this.drain()
    })
  }

  private drain(): void {
    if (this.disposed || this.active || this.queue.length === 0) return
    this.active = this.queue.shift() ?? null
    if (!this.active) return
    if (this.active.mode !== 'ready') {
      this.info = { depth: 0, cp: 0, pv: [], multipv: 1 }
      if (this.active.mode === 'move' || this.active.mode === 'analyze') {
        this.candidates.clear()
      }
    }
    for (const cmd of this.active.commands) this.worker.postMessage(cmd)
  }

  private handleLine(line: string): void {
    if (!this.active) return
    if (this.active.mode === 'ready') {
      if (line === 'uciok' || line === 'readyok') this.finishActive(undefined)
      return
    }
    if (line.startsWith('info ')) {
      this.updateInfo(line)
      return
    }
    if (!line.startsWith('bestmove ')) return
    const best = line.split(/\s+/)[1] ?? '0000'
    if (best === '(none)' || best === '0000') {
      const job = this.active
      this.active = null
      job.reject(new Error('no legal move'))
      this.drain()
      return
    }
    if (this.active.mode === 'move') {
      const engineMove = parseUciMove(best)

      if (this.currentMultipv > 1 && this.candidates.size > 0) {
        // Build topCandidates sorted by multipv index ascending (best first)
        const sorted = Array.from(this.candidates.entries())
          .sort(([a], [b]) => a - b)
          .map(([, cand]) => cand)
        engineMove.topCandidates = sorted
      }

      // Record move in debug ring buffer
      const cp = this.candidates.get(1)?.cp ?? this.info.cp
      const recentMoves = [
        ...this.debugState.recentMoves,
        { uci: best, cp },
      ].slice(-RECENT_MOVES_MAX)
      this.updateDebug({ recentMoves })

      this.finishActive(engineMove)
    } else if (this.active.mode === 'analyze') {
      const topEval: EngineEval = {
        cp: this.candidates.get(1)?.cp ?? this.info.cp,
        bestMove: best,
        pv: this.candidates.get(1)?.pv ?? this.info.pv,
        depth: this.info.depth,
        ...(this.info.mateIn !== undefined ? { mateIn: this.info.mateIn } : {}),
      }
      const sorted = Array.from(this.candidates.entries())
        .sort(([a], [b]) => a - b)
        .map(([, cand]) => cand)
      const result: AnalysisResult = {
        eval: topEval,
        candidates: sorted,
      }
      this.updateDebug({ lastAnalysis: sorted })
      this.finishActive(result)
    } else {
      const result: EngineEval = {
        cp: this.info.cp,
        bestMove: best,
        pv: this.info.pv,
        depth: this.info.depth,
        ...(this.info.mateIn !== undefined ? { mateIn: this.info.mateIn } : {}),
      }
      this.finishActive(result)
    }
  }

  private finishActive(value: EngineMove | EngineEval | AnalysisResult | undefined): void {
    if (!this.active) return
    const job = this.active
    this.active = null
    job.resolve(value)
    this.drain()
  }

  private updateInfo(line: string): void {
    const tokens = line.split(/\s+/)
    const next: InfoSnapshot = { ...this.info, pv: [...this.info.pv] }
    let i = 1
    let hasDepth = false
    let hasScore = false
    let hasPv = false

    while (i < tokens.length) {
      const t = tokens[i]
      if (t === 'depth' && i + 1 < tokens.length) {
        const d = Number(tokens[i + 1])
        if (Number.isFinite(d)) {
          next.depth = d
          hasDepth = true
        }
        i += 2
      } else if (t === 'multipv' && i + 1 < tokens.length) {
        const m = Number(tokens[i + 1])
        if (Number.isFinite(m)) next.multipv = m
        i += 2
      } else if (t === 'score' && i + 2 < tokens.length) {
        const val = Number(tokens[i + 2])
        if (Number.isFinite(val)) {
          if (tokens[i + 1] === 'cp') {
            next.cp = val
            next.mateIn = undefined
            hasScore = true
          } else if (tokens[i + 1] === 'mate') {
            next.mateIn = val
            next.cp = val > 0 ? MATE_SCORE - val : -MATE_SCORE - val
            hasScore = true
          }
        }
        i += 3
      } else if (t === 'pv') {
        next.pv = tokens.slice(i + 1)
        hasPv = true
        break
      } else {
        i += 1
      }
    }

    this.info = next

    // When MultiPV > 1 (or analyze mode), record the candidate for this multipv index
    const isAnalyzeMode = this.active?.mode === 'analyze'
    if ((this.currentMultipv > 1 || isAnalyzeMode) && hasDepth && hasScore && hasPv && next.pv.length > 0) {
      this.candidates.set(next.multipv, {
        move: next.pv[0],
        cp: next.cp,
        pv: next.pv,
      })
    }
  }
}

export function useEngine(): { engine: Engine | null; ready: boolean } {
  const engineRef = useRef<Engine | null>(null)
  const [ready, setReady] = useState(false)
  const [engine, setEngine] = useState<Engine | null>(null)

  useEffect(() => {
    let cancelled = false
    const instance = new Engine({ instanceName: 'play' })
    engineRef.current = instance
    setEngine(instance)
    instance
      .init()
      .then(() => {
        if (!cancelled) setReady(true)
      })
      .catch(() => {
        if (!cancelled) setReady(false)
      })
    return () => {
      cancelled = true
      instance.dispose()
      engineRef.current = null
    }
  }, [])

  return { engine, ready }
}
