import { useEffect, useState } from 'react'
import { Chess } from 'chess.js'
import { useApiKey } from './apiKey'
import type { BlunderContext } from './llmCoach'
import { getCached, setCached } from './explanationCache'
import { streamCoachMessage, type PostMoveContext } from './deepCoach'

export type ExplainSource = 'cache' | 'llm' | 'rule'

export interface UseExplainResult {
  text: string | null
  source: ExplainSource | null
  loading: boolean
  error: string | null
  /** Force a fresh LLM call, bypassing cache. */
  regenerate: () => void
}

interface Args {
  ctx: BlunderContext | null
  /** UCI of the user's move — used as cache key alongside fen_before. */
  uci: string | null
  /** Rule-based message to use when there's no key, LLM disabled, or LLM fails. */
  ruleFallback: string | null
  /** Set true to actually start fetching. False = inert. */
  enabled: boolean
}

function buildPostMoveContext(ctx: BlunderContext): PostMoveContext {
  // Derive fen_after by applying the user's move
  let fenAfter = ctx.fen_before
  try {
    const chess = new Chess(ctx.fen_before)
    const m = chess.move(ctx.user_move)
    if (m) fenAfter = chess.fen()
  } catch { /* ignore */ }

  // Classify based on centipawn loss
  const cpLoss = ctx.centipawn_loss
  const classification: PostMoveContext['classification'] =
    cpLoss >= 300 ? 'blunder'
    : cpLoss >= 150 ? 'mistake'
    : cpLoss >= 80 ? 'inaccuracy'
    : 'missed_tactic'

  return {
    userMoveSan: ctx.user_move,
    classification,
    centipawnLoss: cpLoss,
    fenBefore: ctx.fen_before,
    fenAfter,
    bestMoveSan: ctx.engine_best_move,
    bestPvSan: ctx.engine_pv,
    engineResponsePvSan: [],
    recentMovesSan: ctx.recent_moves,
  }
}

export function useExplain({ ctx, uci, ruleFallback, enabled }: Args): UseExplainResult {
  const { hasKey, getKey } = useApiKey()
  const [text, setText] = useState<string | null>(null)
  const [source, setSource] = useState<ExplainSource | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bust, setBust] = useState(0)

  useEffect(() => {
    if (!enabled || !ctx || !uci) {
      setText(null)
      setSource(null)
      setError(null)
      setLoading(false)
      return
    }
    // 1. Check cache first (unless bust > 0 from regenerate)
    if (bust === 0) {
      const cached = getCached(ctx.fen_before, uci)
      if (cached) {
        setText(cached)
        setSource('cache')
        setError(null)
        setLoading(false)
        return
      }
    }
    // 2. Try LLM via streaming deepCoach if a key is present in memory
    const key = hasKey ? getKey() : null
    if (key) {
      const controller = new AbortController()
      setLoading(true)
      setError(null)

      const postMove = buildPostMoveContext(ctx)

      const run = async (): Promise<void> => {
        try {
          const gen = streamCoachMessage(
            {
              apiKey: key,
              style: 'tactical',
              postMove,
              signal: controller.signal,
            },
            () => { /* cost tracking handled by useDeepCoach if available */ },
          )
          let acc = ''
          while (true) {
            const next = await gen.next()
            if (next.done) break
            acc += next.value
            setText(acc)
          }
          setSource('llm')
          setCached(ctx.fen_before, uci, acc)
          setLoading(false)
        } catch (e: unknown) {
          if (controller.signal.aborted) return
          const msg = e instanceof Error ? e.message : 'Unknown error'
          setError(msg)
          setLoading(false)
          if (ruleFallback) {
            setText(ruleFallback)
            setSource('rule')
          } else {
            setText(null)
            setSource(null)
          }
        }
      }

      void run()
      return () => controller.abort()
    }
    // 3. No key → rule fallback
    if (ruleFallback) {
      setText(ruleFallback)
      setSource('rule')
      setLoading(false)
      setError(null)
    } else {
      setText(null)
      setSource(null)
      setLoading(false)
      setError(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ctx?.fen_before, uci, hasKey, bust])

  return { text, source, loading, error, regenerate: () => setBust((b) => b + 1) }
}
