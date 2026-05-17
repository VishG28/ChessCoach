import { Chess, type Color, type PieceSymbol, type Square } from 'chess.js'

/** A user piece that an opponent move could capture on the opponent's next ply. */
export interface ThreatenedPiece {
  square: Square
  piece: PieceSymbol
  /** Distinct from-squares of opponent pieces that can capture on `square`. */
  attackedBy: Square[]
}

/** A capture currently available to the user this turn. */
export interface AvailableCapture {
  from: Square
  to: Square
  /** The opponent piece sitting on `to` (or captured en passant). */
  captured: PieceSymbol
  promotion?: 'q' | 'r' | 'b' | 'n'
}

/**
 * Flip the active-color field of a FEN to `color`, leaving everything else
 * intact. Used to ask chess.js "what could the opponent do here?" even when
 * it's the user's turn. En-passant validity may differ in the flipped
 * position, which is acceptable for threat detection.
 */
function flipSideToMove(fen: string, color: Color): Chess {
  const parts = fen.split(' ')
  parts[1] = color
  return new Chess(parts.join(' '))
}

function isCaptureFlag(flags: string): boolean {
  return flags.includes('c') || flags.includes('e')
}

/**
 * Pieces of `userColor` that the opponent can capture on their next move.
 *
 * If it's the user's turn, the FEN is temporarily flipped so chess.js
 * enumerates the opponent's legal moves; otherwise we use the position
 * directly. Captures are grouped by destination square (the user piece
 * under attack) and deduped by attacker origin square.
 */
export function findUserThreats(chess: Chess, userColor: Color): ThreatenedPiece[] {
  const opponent: Color = userColor === 'w' ? 'b' : 'w'
  const probe = chess.turn() === opponent ? chess : flipSideToMove(chess.fen(), opponent)
  const moves = probe.moves({ verbose: true })

  // Group attacker squares by the target square.
  const byTarget = new Map<Square, Set<Square>>()
  for (const m of moves) {
    if (!isCaptureFlag(m.flags)) continue
    const attackers = byTarget.get(m.to)
    if (attackers) {
      attackers.add(m.from)
    } else {
      byTarget.set(m.to, new Set([m.from]))
    }
  }

  const threats: ThreatenedPiece[] = []
  for (const [square, attackerSet] of byTarget) {
    const piece = probe.get(square)
    // Only report threats against user pieces. (En-passant capture targets
    // the pawn behind `to`, not `to` itself; the user pawn under threat
    // usually also appears via a standard capture from an adjacent file,
    // so this is a pragmatic simplification.)
    if (!piece || piece.color !== userColor) continue
    threats.push({
      square,
      piece: piece.type,
      attackedBy: Array.from(attackerSet),
    })
  }
  return threats
}

/**
 * Legal captures available to the user this turn. Returns `[]` when it's
 * not the user's turn.
 */
export function findUserCaptures(chess: Chess, userColor: Color): AvailableCapture[] {
  if (chess.turn() !== userColor) return []
  const moves = chess.moves({ verbose: true })
  const captures: AvailableCapture[] = []
  for (const m of moves) {
    if (!isCaptureFlag(m.flags)) continue
    if (m.captured === undefined) continue
    const entry: AvailableCapture = {
      from: m.from,
      to: m.to,
      captured: m.captured,
    }
    if (
      m.promotion === 'q' ||
      m.promotion === 'r' ||
      m.promotion === 'b' ||
      m.promotion === 'n'
    ) {
      entry.promotion = m.promotion
    }
    captures.push(entry)
  }
  return captures
}
