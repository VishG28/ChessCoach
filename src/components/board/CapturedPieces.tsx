import type { Move } from 'chess.js'

type PieceSymbol = 'p' | 'n' | 'b' | 'r' | 'q' | 'k'

const PIECE_GLYPH: Record<PieceSymbol, string> = {
  q: '♛',
  r: '♜',
  b: '♝',
  n: '♞',
  p: '♟',
  k: '♚',
}

const PIECE_ORDER: PieceSymbol[] = ['q', 'r', 'b', 'n', 'p']

interface CapturedPiecesProps {
  history: Move[]
  side: 'user' | 'opponent'
  userColor: 'white' | 'black'
}

function countCaptures(history: Move[], capturedByColor: 'w' | 'b'): Partial<Record<PieceSymbol, number>> {
  const counts: Partial<Record<PieceSymbol, number>> = {}
  for (const move of history) {
    if (move.color === capturedByColor && move.captured) {
      const piece = move.captured as PieceSymbol
      counts[piece] = (counts[piece] ?? 0) + 1
    }
  }
  return counts
}

export function CapturedPieces({ history, side, userColor }: CapturedPiecesProps) {
  // side='opponent' → opponent captured pieces FROM the user → captured BY the opponent
  // side='user' → user captured pieces FROM the opponent → captured BY the user
  const capturedByColor: 'w' | 'b' =
    side === 'user'
      ? (userColor === 'white' ? 'w' : 'b')
      : (userColor === 'white' ? 'b' : 'w')

  const counts = countCaptures(history, capturedByColor)
  const hasCaptures = PIECE_ORDER.some((p) => (counts[p] ?? 0) > 0)

  if (!hasCaptures) return null

  return (
    <div className="flex items-center gap-0.5 h-5 min-h-5" aria-label={`Pieces captured by ${side}`}>
      {PIECE_ORDER.flatMap((piece) => {
        const count = counts[piece] ?? 0
        if (count === 0) return []
        return Array.from({ length: count }, (_, i) => (
          <span
            key={`${piece}-${i}`}
            className="animate-in fade-in duration-200 text-base leading-none"
            aria-hidden="true"
            style={{ fontSize: '16px' }}
          >
            {PIECE_GLYPH[piece]}
          </span>
        ))
      })}
    </div>
  )
}
