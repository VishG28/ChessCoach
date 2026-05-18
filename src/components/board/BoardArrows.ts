import { Chess } from 'chess.js'
import type { DrawShape } from 'chessground/draw'
import type { TopCandidate } from '@/engine/types'

const PIECE_VALUE: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 99 }

/**
 * Returns a DrawShape for the engine's top candidate move, or null if no
 * usable candidate. Uses our custom 'cc-best' brush (defined in Board.tsx).
 */
export function bestMoveShape(top: TopCandidate | undefined): DrawShape | null {
  if (!top?.move || top.move.length < 4) return null
  return {
    orig: top.move.slice(0, 2) as DrawShape['orig'],
    dest: top.move.slice(2, 4) as DrawShape['dest'],
    brush: 'cc-best',
  }
}

/**
 * Up to `max` most-dangerous opponent attacks against the user's pieces.
 * "Dangerous" = capturing a high-value piece minus a small penalty for the
 * attacker's own value (so trading a queen for a pawn isn't ranked above a
 * free rook). Returns shapes using the 'cc-threat' brush.
 */
export function threatShapes(
  fen: string,
  userColor: 'white' | 'black',
  max = 2,
): DrawShape[] {
  const them = userColor === 'white' ? 'b' : 'w'
  const fenParts = fen.split(' ')
  if (fenParts[1] === them) {
    // It's already their turn — captures they could play directly.
  } else {
    // Flip side to move so we can enumerate their would-be captures.
    fenParts[1] = them
  }
  const scenarios: { from: string; to: string; score: number }[] = []
  try {
    const g = new Chess(fenParts.join(' '))
    const moves = g.moves({ verbose: true })
    for (const m of moves) {
      if (!m.captured) continue
      const captured = PIECE_VALUE[m.captured] ?? 0
      const attacker = PIECE_VALUE[m.piece] ?? 0
      scenarios.push({ from: m.from, to: m.to, score: captured - attacker * 0.1 })
    }
  } catch {
    return []
  }
  scenarios.sort((a, b) => b.score - a.score)
  return scenarios.slice(0, max).map((s) => ({
    orig: s.from as DrawShape['orig'],
    dest: s.to as DrawShape['dest'],
    brush: 'cc-threat',
  }))
}
