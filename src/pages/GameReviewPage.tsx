import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Download } from 'lucide-react'
import { Chess } from 'chess.js'
import { getGame, updateMove } from '@/games/gameStore'
import type { Game } from '@/games/types'
import { ReviewBoard } from '@/components/review/ReviewBoard'
import { MoveList } from '@/components/review/MoveList'
import { MoveDetails } from '@/components/review/MoveDetails'
import { EvalGraph } from '@/components/review/EvalGraph'
import { NavControls } from '@/components/review/NavControls'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { downloadPgn } from '@/lib/pgn'
import { CoachMessage } from '@/components/coaching/CoachMessage'
import { useDeepCoach } from '@/coaching/useDeepCoach'
import type { LiveCoachMessage } from '@/coaching/useDeepCoach'
import type { PreMoveContext } from '@/coaching/deepCoach'
import { useApiKey } from '@/coaching/apiKey'

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

/** Infer orientation from FEN's side-to-move if needed */
function fenTurn(fen: string): 'w' | 'b' {
  try {
    const chess = new Chess(fen)
    return chess.turn()
  } catch {
    return 'w'
  }
}

export function GameReviewPage() {
  const { id } = useParams<{ id: string }>()
  const [game, setGame] = useState<Game | null | undefined>(undefined)
  const [selectedPly, setSelectedPly] = useState(0)
  const [autoplaying, setAutoplaying] = useState(false)
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const { hasKey } = useApiKey()

  const deepCoach = useDeepCoach({
    style: 'conversational',
    enabled: hasKey,
    onComplete: useCallback((msg: LiveCoachMessage) => {
      // Persist the completed message to the game record
      if (!id) return
      const currentGame = getGame(id)
      if (!currentGame) return
      const ply = selectedPly > 0 ? selectedPly : 1
      const move = currentGame.moves.find((m) => m.ply === ply)
      const existing = move?.coach_messages ?? []
      updateMove(id, ply, {
        coach_messages: [...existing, {
          trigger: msg.trigger,
          style: msg.style,
          depth: msg.depth,
          content: msg.content,
          timestamp: msg.timestamp,
        }],
      })
      // Reload the game to get updated coach_messages
      setGame(getGame(id) ?? null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, selectedPly]),
  })

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

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!game) return
      if (e.key === 'ArrowLeft') {
        setSelectedPly((p) => Math.max(0, p - 1))
        setAutoplaying(false)
      } else if (e.key === 'ArrowRight') {
        setSelectedPly((p) => Math.min(game.moves.length, p + 1))
      } else if (e.key === 'Home') {
        setSelectedPly(0)
        setAutoplaying(false)
      } else if (e.key === 'End') {
        setSelectedPly(game.moves.length)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [game])

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

  // Persisted coach messages for the selected move
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

  // Combine persisted with live deep coach messages for this position
  const allMessages = [...persistedMessages, ...deepCoach.messages.filter((m) => m.fen === currentFen)]

  const handleGetCoaching = () => {
    if (!selectedMove) return
    const fenBefore = selectedMove.fen_before
    const evalBefore = selectedMove.engine_eval_before
    let bestMoveSan = evalBefore?.bestMove ?? ''
    try {
      const chess = new Chess(fenBefore)
      const from = bestMoveSan.slice(0, 2)
      const to = bestMoveSan.slice(2, 4)
      const prom = bestMoveSan.length >= 5 ? (bestMoveSan[4] as 'q' | 'r' | 'b' | 'n') : undefined
      const m = chess.move({ from, to, promotion: prom })
      if (m) bestMoveSan = m.san
    } catch { /* ignore */ }

    const pvSan: string[] = []
    try {
      const pvChess = new Chess(fenBefore)
      for (const uci of (evalBefore?.pv ?? []).slice(0, 5)) {
        const from = uci.slice(0, 2)
        const to = uci.slice(2, 4)
        const prom = uci.length >= 5 ? (uci[4] as 'q' | 'r' | 'b' | 'n') : undefined
        const m = pvChess.move({ from, to, promotion: prom })
        if (!m) break
        pvSan.push(m.san)
      }
    } catch { /* ignore */ }

    const preMoveCtx: PreMoveContext = {
      fen: fenBefore,
      recentMovesSan: game.moves.slice(Math.max(0, selectedPly - 8), selectedPly).map((m) => m.san),
      color: selectedMove.side === 'w' ? 'white' : 'black',
      bestMoveSan: bestMoveSan || '(unknown)',
      bestEvalCp: evalBefore?.cp ?? 0,
      candidatesSan: bestMoveSan ? [{ san: bestMoveSan, cp: evalBefore?.cp ?? 0 }] : [],
      pvSan,
      materialSummary: 'even',
      userElo: game.engineElo,
    }

    deepCoach.fire({
      trigger: 'retrospective',
      depth: 'detail',
      fen: fenBefore,
      preMove: preMoveCtx,
    })
  }

  // Unused but available for debug
  void fenTurn

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

        {/* Right column: move details + move list + coach messages */}
        <div className="flex flex-col gap-4">
          <Card>
            <MoveDetails
              game={game}
              move={selectedMove}
              selectedPly={selectedPly}
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

          {/* Coach messages for the selected move */}
          {selectedMove && (
            <div className="space-y-3">
              {allMessages.map((msg) => (
                <CoachMessage
                  key={msg.id}
                  message={msg}
                  onTellMore={() => {
                    deepCoach.fire({
                      trigger: 'tell_me_more',
                      depth: msg.depth,
                      fen: msg.fen,
                      followUp: 'Go deeper on this position. What else should I notice? Any obscure tactical or strategic ideas I should know about?',
                    })
                  }}
                  onQuieter={() => { /* no-op in review */ }}
                />
              ))}
              {hasKey && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleGetCoaching}
                  disabled={deepCoach.messages.some((m) => m.streaming)}
                >
                  Get coaching for this position
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
