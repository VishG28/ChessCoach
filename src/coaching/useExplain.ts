import { useEffect, useState } from 'react'
import { useApiKey } from './apiKey'
import { explainBlunder, type BlunderContext } from './llmCoach'
import { getCached, setCached } from './explanationCache'

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

export function useExplain({ ctx, uci, ruleFallback, enabled }: Args): UseExplainResult {
  const { apiKey, llmEnabled } = useApiKey()
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
    // 2. Try LLM if conditions are right
    if (apiKey && llmEnabled) {
      const controller = new AbortController()
      setLoading(true)
      setError(null)
      explainBlunder(ctx, apiKey, controller.signal)
        .then((t) => {
          setText(t)
          setSource('llm')
          setCached(ctx.fen_before, uci, t)
          setLoading(false)
        })
        .catch((e: unknown) => {
          if (controller.signal.aborted) return
          const msg = e instanceof Error ? e.message : 'Unknown error'
          setError(msg)
          setLoading(false)
          // Fall back to rule
          if (ruleFallback) {
            setText(ruleFallback)
            setSource('rule')
          } else {
            setText(null)
            setSource(null)
          }
        })
      return () => controller.abort()
    }
    // 3. No key or LLM disabled → rule fallback
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
  }, [enabled, ctx?.fen_before, uci, apiKey, llmEnabled, bust])

  return { text, source, loading, error, regenerate: () => setBust((b) => b + 1) }
}
