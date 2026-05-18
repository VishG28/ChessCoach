import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Trophy, Frown, Minus, Trash2, Crown } from 'lucide-react'
import { listGames, deleteGame } from '@/games/gameStore'
import type { Game, GameResult } from '@/games/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

function resultIcon(result: GameResult, userColor: 'white' | 'black') {
  if (result === 'ongoing') return <Minus className="w-4 h-4 text-muted-foreground" />
  if (result === '1/2-1/2') return <Minus className="w-4 h-4 text-muted-foreground" />
  const userWon =
    (result === '1-0' && userColor === 'white') ||
    (result === '0-1' && userColor === 'black')
  if (userWon) return <Trophy className="w-4 h-4 text-emerald-600" />
  return <Frown className="w-4 h-4 text-red-500" />
}

function resultLabel(result: GameResult, userColor: 'white' | 'black'): string {
  if (result === 'ongoing') return 'In progress'
  if (result === '1/2-1/2') return 'Draw'
  const userWon =
    (result === '1-0' && userColor === 'white') ||
    (result === '0-1' && userColor === 'black')
  return userWon ? 'Win' : 'Loss'
}

function accuracy(game: Game): string {
  const userSide = game.userColor === 'white' ? 'w' : 'b'
  const userMoves = game.moves.filter((m) => m.side === userSide && m.centipawn_loss !== undefined)
  if (userMoves.length === 0) return '—'
  const avg = userMoves.reduce((s, m) => s + (m.centipawn_loss ?? 0), 0) / userMoves.length
  return `${Math.max(0, Math.min(100, Math.round(100 - avg / 10)))}%`
}

function blunderCount(game: Game): number {
  const userSide = game.userColor === 'white' ? 'w' : 'b'
  return game.moves.filter((m) => m.side === userSide && m.classification === 'blunder').length
}

export function GamesListPage() {
  const navigate = useNavigate()
  const [games, setGames] = useState(() => listGames())

  const handleDelete = (e: React.MouseEvent, id: string): void => {
    e.stopPropagation()
    deleteGame(id)
    setGames(listGames())
  }

  if (games.length === 0) {
    return (
      <main className="max-w-[1180px] mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold mb-6">Games</h1>
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <Crown className="size-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-1">No games yet</p>
          <p className="text-sm text-muted-foreground mb-6">Play your first game to see it here.</p>
          <Button asChild>
            <Link to="/">Play your first game</Link>
          </Button>
        </Card>
      </main>
    )
  }

  return (
    <main className="max-w-[1180px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold mb-6">Games</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game) => {
          const label = resultLabel(game.result, game.userColor)
          const isWin = label === 'Win'
          const isDraw = label === 'Draw'
          const badgeClass = isWin
            ? 'bg-emerald-500 text-white hover:bg-emerald-500'
            : isDraw
              ? 'bg-muted-foreground text-background hover:bg-muted-foreground'
              : 'bg-red-500 text-white hover:bg-red-500'
          return (
            <Card
              key={game.id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => navigate(`/games/${game.id}`)}
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs text-muted-foreground">
                    {new Date(game.startedAt).toLocaleString()}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 text-muted-foreground hover:text-destructive shrink-0"
                    onClick={(e) => handleDelete(e, game.id)}
                    title="Delete game"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={badgeClass}>{label}</Badge>
                  <span className="text-xs text-muted-foreground capitalize">{game.userColor}</span>
                  <span className="text-xs text-muted-foreground">vs Stockfish {game.engineElo}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    {resultIcon(game.result, game.userColor)}
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">Accuracy </span>
                    <span className="font-mono font-medium">{accuracy(game)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">Blunders </span>
                    <span className="font-mono font-medium">{blunderCount(game)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">Moves </span>
                    <span className="font-mono font-medium">{game.moves.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </main>
  )
}
