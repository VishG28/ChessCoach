import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trophy, Frown, Minus, Trash2 } from 'lucide-react'
import { listGames, deleteGame } from '@/games/gameStore'
import type { Game, GameResult } from '@/games/types'
import { Button } from '@/components/ui/button'

function resultIcon(result: GameResult, userColor: 'white' | 'black') {
  if (result === 'ongoing') return <Minus className="w-4 h-4 text-zinc-400" />
  if (result === '1/2-1/2') return <Minus className="w-4 h-4 text-zinc-500" />
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
        <h1 className="text-2xl font-semibold mb-4">Games</h1>
        <p className="text-zinc-500">No games yet — play one to see it here.</p>
      </main>
    )
  }

  return (
    <main className="max-w-[1180px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold mb-6">Games</h1>
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs text-zinc-500 uppercase tracking-wide">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Result</th>
              <th className="px-4 py-3">Opponent</th>
              <th className="px-4 py-3">Color</th>
              <th className="px-4 py-3">Accuracy</th>
              <th className="px-4 py-3">Blunders</th>
              <th className="px-4 py-3">Moves</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr
                key={game.id}
                className="border-b border-zinc-100 hover:bg-zinc-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/games/${game.id}`)}
              >
                <td className="px-4 py-3 text-zinc-700 whitespace-nowrap">
                  {new Date(game.startedAt).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {resultIcon(game.result, game.userColor)}
                    <span className="text-zinc-700">
                      {resultLabel(game.result, game.userColor)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-zinc-600">Stockfish {game.engineElo}</td>
                <td className="px-4 py-3 capitalize text-zinc-600">{game.userColor}</td>
                <td className="px-4 py-3 font-mono text-zinc-700">{accuracy(game)}</td>
                <td className="px-4 py-3 font-mono text-zinc-700">{blunderCount(game)}</td>
                <td className="px-4 py-3 font-mono text-zinc-600">{game.moves.length}</td>
                <td className="px-4 py-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDelete(e, game.id)}
                    title="Delete game"
                    className="text-zinc-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
