import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Download } from 'lucide-react'
import { Chess } from 'chess.js'
import { getGame } from '@/games/gameStore'
import type { Game } from '@/games/types'
import { ReviewBoard } from '@/components/review/ReviewBoard'
import { MoveList } from '@/components/review/MoveList'
import { MoveDetails } from '@/components/review/MoveDetails'
import { EvalGraph } from '@/components/review/EvalGraph'
import { NavControls } from '@/components/review/NavControls'
import { Button } from '@/components/ui/button'
import { downloadPgn } from '@/lib/pgn'

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

  // Unused but available for debug
  void fenTurn

  return (
    <main className="max-w-[1180px] mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/games" className="text-zinc-500 hover:text-zinc-800 text-sm">
            ← Games
          </Link>
          <h1 className="text-xl font-semibold text-zinc-800">
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
      </div>

      <div className="grid grid-cols-[auto_1fr] gap-6 items-start">
        {/* Left column: board + controls + graph + details */}
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
          <div className="bg-white rounded-lg border border-zinc-200 p-3">
            <div className="text-xs text-zinc-400 mb-2 uppercase tracking-wide">Eval</div>
            <EvalGraph
              moves={game.moves}
              selectedPly={selectedPly}
              onSelectPly={handleSelectPly}
            />
          </div>
          <div className="bg-white rounded-lg border border-zinc-200 min-h-[120px]">
            <MoveDetails
              game={game}
              move={selectedMove}
              selectedPly={selectedPly}
            />
          </div>
        </div>

        {/* Right column: move list */}
        <div className="bg-white rounded-lg border border-zinc-200">
          <div className="px-4 py-3 border-b border-zinc-100 text-sm font-medium text-zinc-700">
            Moves
          </div>
          <MoveList
            moves={game.moves}
            selectedPly={selectedPly}
            onSelectPly={handleSelectPly}
          />
        </div>
      </div>
    </main>
  )
}
