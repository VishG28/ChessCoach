import { Chess } from 'chess.js'
import { useNavigate } from 'react-router-dom'
import type { Game, MoveEntry } from '@/games/types'
import { CLASS_BG, CLASS_LABEL } from '@/games/classification'
import { Button } from '@/components/ui/button'

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
          disabled
          title="Add an Anthropic API key in /settings to enable AI explanations"
        >
          Explain this move
        </Button>
      </div>
    </div>
  )
}
