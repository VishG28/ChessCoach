import type { Game } from '@/games/types'

export function buildPgnFile(game: Game): string {
  const headers = [
    `[Event "Casual"]`,
    `[Site "ChessCoach"]`,
    `[Date "${new Date(game.startedAt).toISOString().slice(0, 10).replace(/-/g, '.')}"]`,
    `[White "${game.userColor === 'white' ? 'Player' : `Stockfish (${game.engineElo})`}"]`,
    `[Black "${game.userColor === 'black' ? 'Player' : `Stockfish (${game.engineElo})`}"]`,
    `[Result "${game.result}"]`,
  ].join('\n')
  return `${headers}\n\n${game.pgn}\n`
}

export function downloadPgn(game: Game): void {
  const blob = new Blob([buildPgnFile(game)], { type: 'application/x-chess-pgn' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `chesscoach-${game.id.slice(0, 8)}.pgn`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
