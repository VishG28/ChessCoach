import { useState, useMemo, useEffect } from 'react'
import { Chess } from 'chess.js'
import { useNavigate } from 'react-router-dom'
import type { Game, MoveEntry } from '@/games/types'
import { CLASS_BG, CLASS_LABEL } from '@/games/classification'
import { Button } from '@/components/ui/button'
import { useApiKey } from '@/coaching/apiKey'
import { useExplain } from '@/coaching/useExplain'
import type { BlunderContext } from '@/coaching/llmCoach'
import { ExplainBox } from '@/components/coaching/ExplainBox'

interface MoveDetailsProps {
  game: Game
  move: MoveEntry | null
  /** ply 0 = no move selected (start position) */
  selectedPly: number
}

function uciToSan(fen: string, uci: string): string {
  try {
    const chess = new Chess(fen)
    const from = uci.slice(0, 2)
    const to = uci.slice(2, 4)
    const promotion = uci.length >= 5 ? (uci[4] as 'q' | 'r' | 'b' | 'n') : undefined
    const result = chess.move({ from, to, promotion })
    return result?.san ?? uci
  } catch {
    return uci
  }
}

export function MoveDetails({ game, move, selectedPly }: MoveDetailsProps) {
  const navigate = useNavigate()
  const { hasKey } = useApiKey()
  const [triggered, setTriggered] = useState(false)

  // Reset explanation state when the selected move changes
  useEffect(() => {
    setTriggered(false)
  }, [selectedPly])

  // Build BlunderContext from the MoveEntry for the explain hook.
  const blunderCtx = useMemo<BlunderContext | null>(() => {
    if (!move || !move.fen_before || !move.engine_eval_before) return null
    const bestMoveUci = move.engine_eval_before.bestMove
    if (!bestMoveUci) return null
    // Convert best-move UCI → SAN
    let bestMoveSan = bestMoveUci
    try {
      const chess = new Chess(move.fen_before)
      const from = bestMoveUci.slice(0, 2)
      const to = bestMoveUci.slice(2, 4)
      const promotion = bestMoveUci.length >= 5 ? (bestMoveUci[4] as 'q' | 'r' | 'b' | 'n') : undefined
      bestMoveSan = chess.move({ from, to, promotion })?.san ?? bestMoveUci
    } catch { /* ignore */ }
    // Convert PV UCIs → SAN (first 4)
    const pvSan: string[] = []
    try {
      const pvChess = new Chess(move.fen_before)
      for (const uci of (move.engine_eval_before.pv ?? []).slice(0, 4)) {
        const from = uci.slice(0, 2)
        const to = uci.slice(2, 4)
        const promotion = uci.length >= 5 ? (uci[4] as 'q' | 'r' | 'b' | 'n') : undefined
        const m = pvChess.move({ from, to, promotion })
        if (!m) break
        pvSan.push(m.san)
      }
    } catch { /* ignore */ }
    return {
      fen_before: move.fen_before,
      user_move: move.san,
      engine_best_move: bestMoveSan,
      engine_pv: pvSan,
      centipawn_loss: move.centipawn_loss ?? 0,
      recent_moves: [],
      user_elo: game.engineElo,
    }
  }, [move, game.engineElo])

  const ruleFallback = useMemo<string | null>(() => {
    if (!move || !move.engine_eval_before) return null
    const bestMoveSan = uciToSan(move.fen_before, move.engine_eval_before.bestMove)
    const lossPawns = ((move.centipawn_loss ?? 0) / 100).toFixed(2)
    return `You played ${move.san}, losing ${lossPawns} pawns. The engine preferred ${bestMoveSan}.`
  }, [move])

  const explain = useExplain({
    ctx: blunderCtx,
    uci: move?.uci ?? null,
    ruleFallback,
    enabled: triggered,
  })

  if (selectedPly === 0 || move === null) {
    return (
      <div className="p-4 text-sm text-zinc-500 italic">
        Select a move to see details.
      </div>
    )
  }

  const isUserMove = move.side === (game.userColor === 'white' ? 'w' : 'b')
  const moverLabel = isUserMove ? 'You played' : 'Engine played'

  const classificationLabel = move.classification ? CLASS_LABEL[move.classification] : null
  const classificationBg = move.classification ? CLASS_BG[move.classification] : 'bg-zinc-100'

  const bestMoveSan = move.engine_eval_before?.bestMove
    ? uciToSan(move.fen_before, move.engine_eval_before.bestMove)
    : null

  const handlePlayFromHere = (): void => {
    const engineColor = game.userColor === 'white' ? 'b' : 'w'
    const params = new URLSearchParams({
      from: move.fen_before,
      engineColor,
    })
    navigate(`/?${params.toString()}`)
  }

  return (
    <div className="p-4 space-y-3 text-sm">
      {/* Mover + classification */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-zinc-500">{moverLabel}:</span>
        <span className="font-semibold font-mono">{move.san}</span>
        {classificationLabel && (
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${classificationBg} text-zinc-700`}
          >
            {classificationLabel}
          </span>
        )}
      </div>

      {/* Engine prefers */}
      {bestMoveSan && bestMoveSan !== move.san && (
        <div className="text-zinc-600">
          Engine prefers:{' '}
          <span className="font-semibold font-mono text-zinc-800">{bestMoveSan}</span>
        </div>
      )}

      {/* CP loss */}
      {move.centipawn_loss !== undefined && (
        <div className="text-zinc-600">
          Centipawn loss:{' '}
          <span className="font-semibold text-zinc-800">{move.centipawn_loss}</span>
        </div>
      )}

      {/* Top alternatives */}
      {move.top_alternatives && move.top_alternatives.length > 0 && (
        <div>
          <div className="text-xs text-zinc-400 mb-1 uppercase tracking-wide">Top lines</div>
          <div className="space-y-1">
            {move.top_alternatives.slice(0, 3).map((alt, i) => {
              const altSan = uciToSan(move.fen_before, alt.move)
              const cpStr = alt.cp >= 0 ? `+${alt.cp}` : `${alt.cp}`
              return (
                <div key={i} className="flex gap-2 text-xs font-mono">
                  <span className="text-zinc-400">{i + 1}.</span>
                  <span className="font-medium text-zinc-800">{altSan}</span>
                  <span className="text-zinc-500">({cpStr})</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Coach message */}
      {move.coach_message && (
        <div className="bg-amber-50 border border-amber-200 rounded p-2 text-xs text-amber-800">
          {move.coach_message}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 pt-1 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePlayFromHere}
          title="Continue from this position"
        >
          Play from here
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTriggered(true)}
          disabled={triggered && explain.loading}
          title="Get an AI explanation of this move"
        >
          Explain this move
        </Button>
      </div>
      {!hasKey && !triggered && (
        <p className="text-xs text-zinc-500 mt-1">
          No API key set —{' '}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('cc:open-api-key'))}
            className="underline"
          >
            add one
          </button>{' '}
          for AI explanations, or click to see rule-based feedback.
        </p>
      )}
      {triggered && (
        <div className="mt-2">
          <ExplainBox
            text={explain.text}
            source={explain.source}
            loading={explain.loading}
            error={explain.error}
            onRegenerate={explain.regenerate}
          />
        </div>
      )}
    </div>
  )
}
