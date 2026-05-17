import { useEffect, useRef, useState } from 'react'
import type { EngineEval, EngineMove } from './types'

const WORKER_URL = '/engine/stockfish-18-lite-single.js'
const ELO_MIN_UCI = 1320
const ELO_MAX_UCI = 3190
const ELO_SLIDER_MIN = 300
const ELO_SLIDER_MAX = 1319
const SKILL_MAX = 20
const MATE_SCORE = 100000

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function skillFromElo(elo: number): number {
  const span = ELO_SLIDER_MAX - ELO_SLIDER_MIN
  const ratio = (elo - ELO_SLIDER_MIN) / span
  return clamp(Math.round(ratio * SKILL_MAX), 0, SKILL_MAX)
}

function parseUciMove(uci: string): EngineMove {
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
}

type JobMode = 'ready' | 'move' | 'eval'

interface Job {
  mode: JobMode
  commands: string[]
  resolve: (value: EngineMove | EngineEval | void) => void
  reject: (e: Error) => void
}

export class Engine {
  private worker: Worker
  private initPromise: Promise<void> | null = null
  private queue: Job[] = []
  private active: Job | null = null
  private info: InfoSnapshot = { depth: 0, cp: 0, pv: [] }
  private disposed = false

  constructor() {
    this.worker = new Worker(WORKER_URL)
    this.worker.onmessage = (event: MessageEvent<unknown>) => {
      if (typeof event.data !== 'string') return
      for (const line of event.data.split('\n')) {
        const trimmed = line.trim()
        if (trimmed.length > 0) this.handleLine(trimmed)
      }
    }
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
    const commands =
      elo >= ELO_MIN_UCI
        ? [
            'setoption name UCI_LimitStrength value true',
            `setoption name UCI_Elo value ${clamp(Math.round(elo), ELO_MIN_UCI, ELO_MAX_UCI)}`,
          ]
        : [
            'setoption name UCI_LimitStrength value false',
            `setoption name Skill Level value ${skillFromElo(elo)}`,
          ]
    return this.enqueue('ready', [...commands, 'isready']) as Promise<void>
  }

  requestMove(fen: string, movetimeMs: number): Promise<EngineMove> {
    const ms = Math.max(1, Math.round(movetimeMs))
    return this.enqueue('move', [`position fen ${fen}`, `go movetime ${ms}`]) as Promise<EngineMove>
  }

  requestEval(fen: string, depth: number): Promise<EngineEval> {
    const d = Math.max(1, Math.round(depth))
    return this.enqueue('eval', [`position fen ${fen}`, `go depth ${d}`]) as Promise<EngineEval>
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

  private enqueue(mode: JobMode, commands: string[]): Promise<EngineMove | EngineEval | void> {
    return new Promise<EngineMove | EngineEval | void>((resolve, reject) => {
      this.queue.push({ mode, commands, resolve, reject })
      this.drain()
    })
  }

  private drain(): void {
    if (this.disposed || this.active || this.queue.length === 0) return
    this.active = this.queue.shift() ?? null
    if (!this.active) return
    if (this.active.mode !== 'ready') {
      this.info = { depth: 0, cp: 0, pv: [] }
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
      this.finishActive(parseUciMove(best))
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

  private finishActive(value: EngineMove | EngineEval | undefined): void {
    if (!this.active) return
    const job = this.active
    this.active = null
    job.resolve(value)
    this.drain()
  }

  private updateInfo(line: string): void {
    const tokens = line.split(/\s+/)
    const next: InfoSnapshot = { ...this.info, pv: this.info.pv }
    let i = 1
    while (i < tokens.length) {
      const t = tokens[i]
      if (t === 'depth' && i + 1 < tokens.length) {
        const d = Number(tokens[i + 1])
        if (Number.isFinite(d)) next.depth = d
        i += 2
      } else if (t === 'score' && i + 2 < tokens.length) {
        const val = Number(tokens[i + 2])
        if (Number.isFinite(val)) {
          if (tokens[i + 1] === 'cp') {
            next.cp = val
            next.mateIn = undefined
          } else if (tokens[i + 1] === 'mate') {
            next.mateIn = val
            next.cp = val > 0 ? MATE_SCORE - val : -MATE_SCORE - val
          }
        }
        i += 3
      } else if (t === 'pv') {
        next.pv = tokens.slice(i + 1)
        break
      } else {
        i += 1
      }
    }
    this.info = next
  }
}

export function useEngine(): { engine: Engine | null; ready: boolean } {
  const engineRef = useRef<Engine | null>(null)
  const [ready, setReady] = useState(false)
  const [engine, setEngine] = useState<Engine | null>(null)

  useEffect(() => {
    let cancelled = false
    const instance = new Engine()
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
