import { useEffect, useState } from 'react'
import { Chess } from 'chess.js'

const ALLOW_KEY = 'cc.premoves.v1'

export function useAllowPremoves(): [boolean, (b: boolean) => void] {
  const [v, setV] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    const raw = window.localStorage.getItem(ALLOW_KEY)
    return raw === null ? true : raw === 'true'
  })
  useEffect(() => {
    if (typeof window !== 'undefined') window.localStorage.setItem(ALLOW_KEY, String(v))
  }, [v])
  return [v, setV]
}

export interface QueuedPremove {
  from: string
  to: string
}

export interface PremoveQueueApi {
  queued: QueuedPremove | null
  setPremove: (q: QueuedPremove) => void
  cancelPremove: () => void
}

export function usePremoveQueue(): PremoveQueueApi {
  const [queued, setQueued] = useState<QueuedPremove | null>(null)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setQueued(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  return { queued, setPremove: setQueued, cancelPremove: () => setQueued(null) }
}

/** Returns the matching move object if legal in the given FEN, else null. */
export function premoveStillLegal(
  fen: string,
  pre: QueuedPremove,
): { from: string; to: string; promotion?: string } | null {
  try {
    const g = new Chess(fen)
    const result = g.move({ from: pre.from, to: pre.to, promotion: 'q' })
    return result ? { from: pre.from, to: pre.to, promotion: 'q' } : null
  } catch {
    return null
  }
}
