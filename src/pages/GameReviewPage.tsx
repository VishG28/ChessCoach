import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Download } from 'lucide-react'
import { Chess } from 'chess.js'
import { toast } from 'sonner'
import { getGame } from '@/games/gameStore'
import type { Game, MoveEntry } from '@/games/types'
import { ReviewBoard } from '@/components/review/ReviewBoard'
import { MoveList } from '@/components/review/MoveList'
import { MoveDetails } from '@/components/review/MoveDetails'
import { EvalGraph } from '@/components/review/EvalGraph'
import { NavControls } from '@/components/review/NavControls'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { downloadPgn } from '@/lib/pgn'
import { CoachMessage } from '@/components/coaching/CoachMessage'
import type { LiveCoachMessage } from '@/coaching/useDeepCoach'
import {
  type PostMoveContext,
  streamCoachMessage,
} from '@/coaching/deepCoach'
import { useApiKey } from '@/coaching/apiKey'
import { useShortcut } from '@/lib/shortcuts'

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
const AUTOPLAY_INTERVAL_MS = 1000

function fenAtPly(game: Game, ply: number): string {
  if (ply === 0) return STARTING_FEN
  const move = game.moves[ply - 1]
  return move?.fen_after ?? STARTING_FEN
}

function lastMoveAtPly(
  game: Game,
  ply: number,
): [string, string] | null {
  if (ply === 0) return null
  const move = game.moves[ply - 1]
  if (!move) return null
  // Derive from/to from UCI
  return [move.uci.slice(0, 2), move.uci.slice(2, 4)]
}

/** Determine board orientation: user played from which side? */
function boardOrientation(game: Game): 'white' | 'black' {
  return game.userColor
}

/** Convert a single UCI move to SAN at the given FEN, falling back to UCI on error. */
function uciToSan(fen: string, uci: string): string {
  try {
    const chess = new Chess(fen)
    const from = uci.slice(0, 2)
    const to = uci.slice(2, 4)
    const promotion = uci.length >= 5 ? (uci[4] as 'q' | 'r' | 'b' | 'n') : undefined
    return chess.move({ from, to, promotion })?.san ?? uci
  } catch {
    return uci
  }
}

/** Convert a UCI principal variation to SAN, stopping at first illegal move. */
function pvUciToSan(fen: string, pvUci: readonly string[], maxPlies = 6): string[] {
  const out: string[] = []
  try {
    const chess = new Chess(fen)
    for (const uci of pvUci.slice(0, maxPlies)) {
      const from = uci.slice(0, 2)
      const to = uci.slice(2, 4)
      const promotion = uci.length >= 5 ? (uci[4] as 'q' | 'r' | 'b' | 'n') : undefined
      const m = chess.move({ from, to, promotion })
      if (!m) break
      out.push(m.san)
    }
  } catch { /* ignore */ }
  return out
}

/**
 * Build a PostMoveContext from a stored MoveEntry. Falls back to safe defaults
 * for any missing engine eval data — retrospective coaching should still be
 * runnable on partial records.
 */
function buildPostMoveContext(game: Game, move: MoveEntry): PostMoveContext {
  const evalBefore = move.engine_eval_before
  const evalAfter = move.engine_eval_after
  const bestMoveSan = evalBefore?.bestMove
    ? uciToSan(move.fen_before, evalBefore.bestMove)
    : '(unknown)'
  const bestPvSan = evalBefore?.pv ? pvUciToSan(move.fen_before, evalBefore.pv, 6) : []
  const engineResponsePvSan = evalAfter?.pv ? pvUciToSan(move.fen_after, evalAfter.pv, 6) : []
  const recentMovesSan = game.moves
    .slice(Math.max(0, move.ply - 8), move.ply)
    .map((m) => m.san)
  const cpLoss = move.centipawn_loss ?? 0
  const classification: PostMoveContext['classification'] =
    cpLoss >= 200 ? 'blunder' : cpLoss >= 100 ? 'mistake' : cpLoss >= 50 ? 'inaccuracy' : 'inaccuracy'
  return {
    userMoveSan: move.san,
    classification,
    centipawnLoss: cpLoss,
    fenBefore: move.fen_before,
    fenAfter: move.fen_after,
    bestMoveSan,
    bestPvSan,
    engineResponsePvSan,
    recentMovesSan,
  }
}

interface RetroEntry {
  text: string
  loading: boolean
}

export function GameReviewPage() {
  const { id } = useParams<{ id: string }>()
  const [game, setGame] = useState<Game | null | undefined>(undefined)
  const [selectedPly, setSelectedPly] = useState(0)
  const [autoplaying, setAutoplaying] = useState(false)
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const { hasKey, getKey } = useApiKey()

  /** Ephemeral retrospective coaching per ply — lives only for the lifetime of this view. */
  const [retro, setRetro] = useState<Map<number, RetroEntry>>(new Map())
  /** Active retrospective request, aborted on unmount or new request. */
  const retroAcRef = useRef<AbortController | null>(null)

  // Cancel any in-flight retrospective on unmount.
  useEffect(() => () => {
    retroAcRef.current?.abort()
    retroAcRef.current = null
  }, [])

  // Load game from storage
  useEffect(() => {
    if (!id) {
      setGame(null)
      return
    }
    const found = getGame(id)
    setGame(found ?? null)
    // Start at last move
    if (found) {
      setSelectedPly(found.moves.length)
    }
  }, [id])

  // Keyboard navigation via shared useShortcut hook
  const maxPly = game?.moves.length ?? 0
  useShortcut('arrowleft', () => {
    if (!game) return
    setSelectedPly((p) => Math.max(0, p - 1))
    setAutoplaying(false)
  })
  useShortcut('arrowright', () => {
    if (!game) return
    setSelectedPly((p) => Math.min(maxPly, p + 1))
  })
  useShortcut('home', () => {
    if (!game) return
    setSelectedPly(0)
    setAutoplaying(false)
  })
  useShortcut('end', () => {
    if (!game) return
    setSelectedPly(maxPly)
  })

  // Autoplay
  useEffect(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current)
      autoplayRef.current = null
    }
    if (autoplaying && game) {
      autoplayRef.current = setInterval(() => {
        setSelectedPly((p) => {
          if (p >= game.moves.length) {
            setAutoplaying(false)
            return p
          }
          return p + 1
        })
      }, AUTOPLAY_INTERVAL_MS)
    }
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current)
    }
  }, [autoplaying, game])

  const handleSelectPly = useCallback((ply: number) => {
    setSelectedPly(ply)
    setAutoplaying(false)
  }, [])

  const handleToggleAutoplay = useCallback(() => {
    setAutoplaying((v) => !v)
  }, [])

  const onRequestRetrospective = useCallback(async (ply: number): Promise<void> => {
    if (!game) return
    const apiKey = getKey()
    if (!apiKey) {
      toast.error('Add an API key first')
      return
    }
    const move = game.moves.find((m) => m.ply === ply)
    if (!move) return

    // Cancel any previous in-flight retrospective.
    retroAcRef.current?.abort()
    const ac = new AbortController()
    retroAcRef.current = ac

    setRetro((prev) => new Map(prev).set(ply, { text: '', loading: true }))

    const ctx = buildPostMoveContext(game, move)
    let acc = ''
    try {
      const gen = streamCoachMessage(
        {
          apiKey,
          style: 'conversational',
          depth: 'retrospective',
          postMove: ctx,
          signal: ac.signal,
        },
        () => { /* cost tracking handled elsewhere */ },
      )
      while (true) {
        const next = await gen.next()
        if (next.done) break
        acc += next.value
        setRetro((prev) => new Map(prev).set(ply, { text: acc, loading: true }))
      }
      setRetro((prev) => new Map(prev).set(ply, { text: acc, loading: false }))
    } catch (e) {
      if (ac.signal.aborted) {
        // Silently drop aborted retrospectives.
        setRetro((prev) => {
          const next = new Map(prev)
          next.delete(ply)
          return next
        })
        return
      }
      const errMsg = e instanceof Error ? e.message : 'Coach error'
      setRetro((prev) => new Map(prev).set(ply, { text: errMsg, loading: false }))
    }
  }, [game, getKey])

  if (game === undefined) {
    return (
      <main className="max-w-[1180px] mx-auto px-6 py-8">
        <p className="text-zinc-500">Loading…</p>
      </main>
    )
  }

  if (game === null) {
    return (
      <main className="max-w-[1180px] mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold mb-4">Game not found</h1>
        <Link to="/games" className="text-blue-600 hover:underline">
          ← Back to games
        </Link>
      </main>
    )
  }

  const totalPlies = game.moves.length
  const currentFen = fenAtPly(game, selectedPly)
  const currentLastMove = lastMoveAtPly(game, selectedPly)
  const orientation = boardOrientation(game)
  const selectedMove = selectedPly > 0 ? (game.moves[selectedPly - 1] ?? null) : null

  // Persisted coach messages for the selected move (pre-Phase-5 games may have these).
  const persistedMessages: LiveCoachMessage[] = (selectedMove?.coach_messages ?? []).map((r) => ({
    id: `${r.trigger}-${r.timestamp}`,
    trigger: r.trigger,
    style: r.style,
    depth: r.depth,
    content: r.content,
    streaming: false,
    timestamp: r.timestamp,
    fen: selectedMove?.fen_before ?? currentFen,
  }))

  return (
    <main className="max-w-[1180px] mx-auto px-6 py-8 space-y-6">
      {/* Metadata bar */}
      <Card>
        <CardContent className="flex items-center justify-between py-3 px-4 gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Link to="/games" className="text-muted-foreground hover:text-foreground text-sm">
              ← Games
            </Link>
            <h1 className="text-lg font-semibold">
              Review — {new Date(game.startedAt).toLocaleString()}
            </h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadPgn(game)}
            title="Export PGN"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Export PGN
          </Button>
        </CardContent>
      </Card>

      {/* Main body: board left, move details right */}
      <div className="grid grid-cols-1 md:grid-cols-[560px_1fr] gap-6 items-start">
        {/* Left column: board + nav controls */}
        <div className="flex flex-col gap-4">
          <ReviewBoard
            fen={currentFen}
            orientation={orientation}
            lastMove={currentLastMove}
          />
          <NavControls
            totalPlies={totalPlies}
            selectedPly={selectedPly}
            autoplaying={autoplaying}
            onFirst={() => handleSelectPly(0)}
            onPrev={() => handleSelectPly(Math.max(0, selectedPly - 1))}
            onNext={() => handleSelectPly(Math.min(totalPlies, selectedPly + 1))}
            onLast={() => handleSelectPly(totalPlies)}
            onToggleAutoplay={handleToggleAutoplay}
          />
          {/* Eval graph below board, full width of left column */}
          <Card>
            <CardContent className="p-3">
              <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Eval</div>
              <EvalGraph
                moves={game.moves}
                selectedPly={selectedPly}
                onSelectPly={handleSelectPly}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right column: move details + move list + persisted coach messages */}
        <div className="flex flex-col gap-4">
          <Card>
            <MoveDetails
              game={game}
              move={selectedMove}
              selectedPly={selectedPly}
              hasApiKey={hasKey}
              retrospective={selectedMove ? retro.get(selectedMove.ply) : undefined}
              onRequestRetrospective={onRequestRetrospective}
            />
          </Card>

          <Card>
            <div className="px-4 py-3 border-b text-sm font-medium">
              Moves
            </div>
            <MoveList
              moves={game.moves}
              selectedPly={selectedPly}
              onSelectPly={handleSelectPly}
            />
          </Card>

          {/* Persisted coach messages (pre-Phase-5 games may have these). */}
          {selectedMove && persistedMessages.length > 0 && (
            <div className="space-y-3">
              {persistedMessages.map((msg) => (
                <CoachMessage key={msg.id} message={msg} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
