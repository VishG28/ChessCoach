import { useEffect, useMemo, useRef, useState } from 'react'
import { Chess, type Color } from 'chess.js'
import { toast } from 'sonner'
import type { Engine } from '@/engine/engine'
import type { EngineEval } from '@/engine/types'
import type { UseChessGameResult } from '@/lib/useChessGame'
import { cpLoss, isBlunder } from './blunder'
import {
  findUserCaptures,
  findUserThreats,
  type AvailableCapture,
  type ThreatenedPiece,
} from './threats'

/** Coaching mode: off (no coach), warnings (pre-move only), full (pre + post-move). */
export type CoachMode = 'off' | 'warnings' | 'full'

/** Alert raised when the user's most recent move loses material/evaluation. */
export interface BlunderAlert {
  /** SAN of the move that blundered. */
  san: string
  /** Centipawn loss for the mover. */
  loss: number
  /** Engine's preferred move at the prior position (UCI). */
  better: string
  /** Principal variation from the engine's preferred move (UCI strings, first 4). */
  pv: string[]
  /** FEN before the user's blundering move. */
  fenBefore: string
}

export interface UseCoachOptions {
  game: UseChessGameResult
  engine: Engine | null
  engineReady: boolean
  mode: CoachMode
  /** The user's color. If `null` (analysis mode), the coach is effectively `'off'`. */
  userColor: Color | null
  /** Engine eval search depth — default 10. */
  evalDepth?: number
  /** Called when the user accepts the "take it back" affordance. Should undo 1 ply. */
  onTakeback?: () => void
}

export interface UseCoachResult {
  threats: ThreatenedPiece[]
  captures: AvailableCapture[]
  blunderAlert: BlunderAlert | null
  /** Latest eval of the current position (for the eval bar). `null` until first eval lands. */
  liveEval: EngineEval | null
  /** True when an after-move eval is in flight. */
  thinking: boolean
  /** Clears the current blunder alert (call after the user dismisses or takes back). */
  dismissAlert: () => void
}

const DEFAULT_EVAL_DEPTH = 10

export function useCoach(opts: UseCoachOptions): UseCoachResult {
  const { game, engine, engineReady, mode, userColor } = opts
  const evalDepth = opts.evalDepth ?? DEFAULT_EVAL_DEPTH

  const [threats, setThreats] = useState<ThreatenedPiece[]>([])
  const [captures, setCaptures] = useState<AvailableCapture[]>([])
  const [blunderAlert, setBlunderAlert] = useState<BlunderAlert | null>(null)
  const [liveEval, setLiveEval] = useState<EngineEval | null>(null)
  const [thinking, setThinking] = useState(false)

  // In-memory FEN -> EngineEval cache; survives re-renders via ref.
  const evalCacheRef = useRef<Map<string, EngineEval>>(new Map())
  // Track last toasted blunder san+loss so we don't fire twice for the same alert.
  const lastToastedAlertRef = useRef<string | null>(null)

  // Pre-move scan: threats + captures whenever position or coach config changes.
  useEffect(() => {
    if (mode === 'off' || userColor === null) {
      setThreats([])
      setCaptures([])
      return
    }
    const chess = new Chess(game.fen)
    setThreats(findUserThreats(chess, userColor))
    setCaptures(game.turn === userColor ? findUserCaptures(chess, userColor) : [])
  }, [game.fen, game.turn, mode, userColor])

  // After-move blunder check + live eval maintenance.
  useEffect(() => {
    if (mode === 'off' || userColor === null) {
      setBlunderAlert(null)
      setLiveEval(null)
      setThinking(false)
      return
    }
    if (!engine || !engineReady) return

    const history = game.history
    const lastMove = history[history.length - 1]
    // Only evaluate after the user has moved. After a user move, the FEN's
    // side-to-move is the opponent; equivalently, the last move's color
    // equals userColor.
    const userJustMoved = lastMove !== undefined && lastMove.color === userColor

    // Snapshot for stale-response guards.
    const submittedAtHistoryLen = history.length
    const afterFen = game.fen
    const beforeFen = lastMove?.before

    let cancelled = false

    const isStale = (): boolean =>
      cancelled || submittedAtHistoryLen !== game.history.length

    const cache = evalCacheRef.current

    const fetchEval = async (fen: string): Promise<EngineEval | null> => {
      const cached = cache.get(fen)
      if (cached) return cached
      try {
        const result = await engine.requestEval(fen, evalDepth)
        cache.set(fen, result)
        return result
      } catch {
        return null
      }
    }

    const run = async (): Promise<void> => {
      if (!userJustMoved || beforeFen === undefined) {
        // Nothing to compare against — just refresh the live eval of the
        // current position (so the eval bar stays in sync).
        setThinking(true)
        const current = await fetchEval(afterFen)
        if (isStale()) return
        if (current) setLiveEval(current)
        setThinking(false)
        return
      }

      setThinking(true)
      const [prev, next] = await Promise.all([fetchEval(beforeFen), fetchEval(afterFen)])
      if (isStale()) return
      if (next) setLiveEval(next)
      if (prev && next) {
        const loss = cpLoss(prev, next)
        if (isBlunder(loss)) {
          const alert: BlunderAlert = {
            san: lastMove.san,
            loss,
            better: prev.bestMove,
            pv: prev.pv.slice(0, 4),
            fenBefore: beforeFen,
          }
          setBlunderAlert(alert)
          // Fire toast only once per unique blunder (keyed by san+loss)
          const alertKey = `${alert.san}-${alert.loss}`
          if (lastToastedAlertRef.current !== alertKey) {
            lastToastedAlertRef.current = alertKey
            const lossPawns = (alert.loss / 100).toFixed(1)
            toast.error('Blunder detected', {
              description: `${alert.san} lost ${lossPawns} pawns. Engine prefers ${alert.better}.`,
            })
          }
        } else {
          setBlunderAlert(null)
        }
      }
      setThinking(false)
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [game.fen, game.history, mode, userColor, engine, engineReady, evalDepth])

  const dismissAlert = useMemo(
    () => (): void => {
      setBlunderAlert(null)
    },
    [],
  )

  return {
    threats,
    captures,
    blunderAlert,
    liveEval,
    thinking,
    dismissAlert,
  }
}
