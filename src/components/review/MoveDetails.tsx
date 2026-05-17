import { useState, useMemo, useEffect } from 'react'
import { Chess } from 'chess.js'
import { useNavigate } from 'react-router-dom'
import type { Game, MoveEntry } from '@/games/types'
import { CLASS_BG, CLASS_LABEL } from '@/games/classification'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useApiKey } from '@/coaching/apiKey'
import { useExplain } from '@/coaching/useExplain'
import type { BlunderContext } from '@/coaching/llmCoach'
import { ExplainBox } from '@/components/coaching/ExplainBox'

interface RetrospectiveState {
  text: string
  loading: boolean
}

interface MoveDetailsProps {
  game: Game
  move: MoveEntry | null
  /** ply 0 = no move selected (start position) */
  selectedPly: number
  /** True if an API key is configured (gates retrospective coaching CTA). */
  hasApiKey?: boolean
  /** Ephemeral retrospective for the currently selected ply (if requested). */
  retrospective?: RetrospectiveState
  /** Request a fresh retrospective coaching message for the given ply. */
  onRequestRetrospective?: (ply: number) => void
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

export function MoveDetails({
  game,
  move,
  selectedPly,
  hasApiKey,
  retrospective,
  onRequestRetrospective,
}: MoveDetailsProps) {
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
        {move.source === 'book' && (
          <span
            title={`Lichess database, ${Math.round((move.bookWeight ?? 0) * 100)}% frequency`}
            className="text-xs"
            aria-label="book move"
          >
            📖
          </span>
        )}
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

      {/* Top alternatives with mini progress bars */}
      {move.top_alternatives && move.top_alternatives.length > 0 && (
        <div>
          <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Top lines</div>
          <div className="space-y-2">
            {move.top_alternatives.slice(0, 3).map((alt, i) => {
              const altSan = uciToSan(move.fen_before, alt.move)
              const cpStr = alt.cp >= 0 ? `+${alt.cp}` : `${alt.cp}`
              // Map cp to 0–100 progress: 0 cp = 50%, +500 = 100%, -500 = 0%
              const progressPct = Math.max(0, Math.min(100, 50 + alt.cp / 10))
              const barClass = alt.cp >= 0 ? '[&>div]:bg-emerald-500' : '[&>div]:bg-red-500'
              return (
                <div key={i} className="space-y-0.5">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-muted-foreground w-3">{i + 1}.</span>
                    <span className="font-medium">{altSan}</span>
                    <span className="text-muted-foreground ml-auto">{cpStr}</span>
                  </div>
                  <Progress value={progressPct} className={`h-1 ${barClass}`} />
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

      {/* Retrospective coaching (ephemeral; lives only for this view) */}
      {(() => {
        const hasPersisted = (move.coach_messages?.length ?? 0) > 0
        // Don't show empty-state if persisted messages already render below.
        if (hasPersisted && !retrospective) return null
        if (retrospective?.loading) {
          return (
            <div className="rounded-md border border-dashed p-3 text-sm text-muted-foreground flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full border-2 border-muted-foreground/40 border-t-primary animate-spin"
                aria-hidden="true"
              />
              Loading…
            </div>
          )
        }
        if (retrospective && !retrospective.loading) {
          return (
            <div className="rounded-md border border-dashed p-3 text-sm leading-relaxed">
              <RetrospectiveText text={retrospective.text} />
            </div>
          )
        }
        if (!hasPersisted && onRequestRetrospective) {
          return (
            <div className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
              No coaching recorded.
              {hasApiKey ? (
                <button
                  type="button"
                  onClick={() => onRequestRetrospective(move.ply)}
                  className="ml-2 text-primary underline-offset-2 hover:underline"
                >
                  Get coaching for this position
                </button>
              ) : (
                <span className="ml-2 italic">
                  Add an API key to request coaching.
                </span>
              )}
            </div>
          )
        }
        return null
      })()}

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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTriggered(true)}
                  disabled={triggered && explain.loading}
                  title="Get an AI explanation of this move"
                >
                  Explain this move
                </Button>
              </span>
            </TooltipTrigger>
            {!hasKey && (
              <TooltipContent>
                Add your Anthropic API key to enable explanations
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
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

/** Sentence-by-sentence fade-in for retrospective coaching text. */
function RetrospectiveText({ text }: { text: string }) {
  const sentences = text
    .split(/(?<=\.) +/)
    .filter((s) => s.trim().length > 0)
  if (sentences.length === 0) {
    return <span>{text || '…'}</span>
  }
  return (
    <>
      {sentences.map((s, i) => (
        <span
          key={i}
          style={{
            animation: 'cc-fade-in 200ms ease-out forwards',
            animationDelay: `${i * 100}ms`,
            opacity: 0,
            display: 'inline',
          }}
        >
          {s}
          {i < sentences.length - 1 ? ' ' : ''}
        </span>
      ))}
    </>
  )
}
