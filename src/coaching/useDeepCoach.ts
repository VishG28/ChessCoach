// src/coaching/useDeepCoach.ts
import { useCallback, useEffect, useRef, useState } from 'react'
import { Chess, type Square } from 'chess.js'
import {
  type CoachingStyle,
  type PreMoveContext,
  type PostMoveContext,
  type StreamCoachUsage,
  streamCoachMessage,
  usdCost,
} from './deepCoach'
import { useApiKey } from './apiKey'
import { useCostCounter } from './costCounter'

/** Convert a UCI principal variation to SAN, stopping if any move is illegal. */
export function uciPvToSan(fen: string, pvUci: string[], maxPlies = 6): string[] {
  const c = new Chess(fen)
  const out: string[] = []
  for (const uci of pvUci.slice(0, maxPlies)) {
    const from = uci.slice(0, 2) as Square
    const to = uci.slice(2, 4) as Square
    const promotion = uci.length >= 5 ? (uci[4] as 'q' | 'r' | 'b' | 'n') : undefined
    const move = c.move({ from, to, promotion })
    if (!move) break
    out.push(move.san)
  }
  return out
}

/** Convert a single UCI move to SAN at the given FEN, falling back to UCI on error. */
export function uciToSan(fen: string, uci: string): string {
  try {
    const c = new Chess(fen)
    const from = uci.slice(0, 2) as Square
    const to = uci.slice(2, 4) as Square
    const promotion = uci.length >= 5 ? (uci[4] as 'q' | 'r' | 'b' | 'n') : undefined
    return c.move({ from, to, promotion })?.san ?? uci
  } catch {
    return uci
  }
}

const DEBOUNCE_MS = 800
const GLOBAL_RATE_MS = 3000

export type CoachDepth = 'quick' | 'detail' | 'critical'

export interface LiveCoachMessage {
  id: string
  trigger: 'pre_move' | 'post_move' | 'tell_me_more' | 'retrospective'
  style: CoachingStyle
  depth: CoachDepth
  content: string
  /** True while the model is still streaming. */
  streaming: boolean
  /** Persisted timestamp in ms since epoch. */
  timestamp: number
  /** FEN this message was generated for (cache key). */
  fen: string
}

interface UseDeepCoachOpts {
  style: CoachingStyle
  enabled: boolean
  onComplete?: (msg: LiveCoachMessage) => void
}

export interface FireOpts {
  trigger: LiveCoachMessage['trigger']
  depth: CoachDepth
  fen: string
  preMove?: PreMoveContext
  postMove?: PostMoveContext
  followUp?: string
}

export function useDeepCoach({ style, enabled, onComplete }: UseDeepCoachOpts) {
  const { getKey } = useApiKey()
  const { add: addCost } = useCostCounter()
  const [messages, setMessages] = useState<LiveCoachMessage[]>([])
  const cacheRef = useRef<Map<string, LiveCoachMessage>>(new Map())
  const inFlightRef = useRef<AbortController | null>(null)
  const lastCallAtRef = useRef<number>(0)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancel = useCallback((): void => {
    inFlightRef.current?.abort()
    inFlightRef.current = null
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
      debounceRef.current = null
    }
  }, [])

  // Cancel on unmount.
  useEffect(() => () => cancel(), [cancel])

  const runOnce = useCallback(async (opts: FireOpts, apiKey: string): Promise<void> => {
    inFlightRef.current?.abort()
    const ac = new AbortController()
    inFlightRef.current = ac
    lastCallAtRef.current = Date.now()

    const id = `${opts.trigger}-${opts.fen}-${Date.now()}`
    const initial: LiveCoachMessage = {
      id,
      trigger: opts.trigger,
      style,
      depth: opts.depth,
      content: '',
      streaming: true,
      timestamp: Date.now(),
      fen: opts.fen,
    }
    setMessages((prev) => [...prev, initial])

    try {
      const gen = streamCoachMessage(
        {
          apiKey,
          style,
          preMove: opts.preMove,
          postMove: opts.postMove,
          followUp: opts.followUp,
          signal: ac.signal,
        },
        (u: StreamCoachUsage) => addCost(usdCost(u)),
      )
      let acc = ''
      while (true) {
        const next = await gen.next()
        if (next.done) {
          break
        }
        acc += next.value
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, content: acc } : m)))
      }
      const finalMsg: LiveCoachMessage = {
        ...initial,
        content: acc,
        streaming: false,
      }
      setMessages((prev) => prev.map((m) => (m.id === id ? finalMsg : m)))
      if (opts.trigger === 'pre_move') cacheRef.current.set(opts.fen, finalMsg)
      onComplete?.(finalMsg)
    } catch (e) {
      if (ac.signal.aborted) {
        setMessages((prev) => prev.filter((m) => m.id !== id))
        return
      }
      const errMsg = e instanceof Error ? e.message : 'Coach error'
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, content: errMsg, streaming: false } : m)),
      )
    }
  }, [style, addCost, onComplete])

  const fire = useCallback(
    (opts: FireOpts): void => {
      if (!enabled) return
      const key = getKey()
      if (!key) return
      const cached = cacheRef.current.get(opts.fen)
      if (cached && opts.trigger === 'pre_move' && !opts.followUp) {
        // Re-emit the cached message via onComplete but skip the API call.
        onComplete?.(cached)
        return
      }
      const sinceLast = Date.now() - lastCallAtRef.current
      const wait = Math.max(0, GLOBAL_RATE_MS - sinceLast, DEBOUNCE_MS)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        void runOnce(opts, key)
      }, wait)
    },
    [enabled, getKey, onComplete, runOnce],
  )

  return { messages, fire, cancel }
}
