/**
 * Unified opponent move strategy.
 *
 * The engine source is resolved from Elo only (see `engineRouting.ts`):
 *   • 1100 ≤ elo < 1900  → Maia neural net
 *   • elo ≥ 1900          → Stockfish with UCI_LimitStrength + UCI_Elo
 *
 * Order of operations:
 *   1. Opening book (Lichess explorer) when within the book ply limit.
 *   2. Maia neural network when the resolved source is Maia.
 *   3. Stockfish best move at calibrated depth when the resolved source is
 *      Stockfish (or as fallback when Maia load/predict fails).
 *
 * The Phase 3A weakening rolls (random/blunder injection) have been removed —
 * Stockfish above 1900 is trusted to deliver the rated strength via UCI.
 */

import { getBookMove } from './openingBook'
import { requestMaiaMove, maiaModelName } from './maia'
import { resolveEngine } from './engineRouting'
import type { Engine } from './engine'
import type { MoveSource } from '@/games/types'

/**
 * @deprecated Engine source is now resolved from Elo. Kept exported only for
 * legacy meta/logging surfaces that still reference the type name.
 */
export type OpponentMode = 'stockfish' | 'maia'

export interface OpponentMoveResult {
  uci: string
  source: MoveSource
  engineModel: string
  bookWeight?: number
}

export interface OpponentMoveOptions {
  engine: Engine
  fen: string
  /** 1-based count of plies played so far. */
  ply: number
  elo: number
}

const STOCKFISH_BOOK_MAX_PLY = 24       // 12 full moves
const MAIA_LOW_ELO_BOOK_MAX_PLY = 16    // 8 full moves for sub-1400

export async function requestOpponentMove(
  opts: OpponentMoveOptions,
): Promise<OpponentMoveResult> {
  const { engine, fen, ply, elo } = opts
  const resolved = resolveEngine(elo)

  const bookPlyLimit =
    resolved.source === 'maia'
      ? elo < 1400
        ? MAIA_LOW_ELO_BOOK_MAX_PLY
        : 0
      : STOCKFISH_BOOK_MAX_PLY

  if (ply <= bookPlyLimit) {
    const book = await getBookMove(fen, elo, ply)
    if (book) {
      return {
        uci: book.uci,
        source: 'book',
        engineModel:
          resolved.source === 'maia' ? maiaModelName(elo) : 'stockfish-18',
        bookWeight: book.weight,
      }
    }
  }

  if (resolved.source === 'maia') {
    try {
      const uci = await requestMaiaMove(fen, elo)
      return { uci, source: 'maia', engineModel: maiaModelName(elo) }
    } catch (e) {
      console.warn('[opponentEngine] Maia failed, falling back to Stockfish', e)
    }
  }

  const depth = resolved.sfDepth ?? 14
  const movetime = resolved.sfMovetimeMs ?? 1000
  const engineMove = await engine.requestMove({ fen, depth, movetime, multipv: 1 })
  const uci = `${engineMove.from}${engineMove.to}${engineMove.promotion ?? ''}`
  return {
    uci,
    source: 'stockfish',
    engineModel: 'stockfish-18',
  }
}
