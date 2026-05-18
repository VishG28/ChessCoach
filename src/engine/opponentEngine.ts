/**
 * Unified opponent move strategy.
 *
 * Order of operations:
 *   1. Opening book (Lichess explorer) when within the book ply limit.
 *   2. Maia neural network if mode === 'maia'.
 *   3. Stockfish with calibrated weakening + blunder/random rolls.
 *
 * If Maia is unavailable (network/load error), the facade falls back to the
 * Stockfish weakening pipeline so the user can keep playing.
 */

import { getBookMove } from './openingBook'
import { requestMaiaMove, maiaModelName } from './maia'
import { getWeakeningParams, selectMove } from './weakening'
import type { Engine } from './engine'
import type { TopCandidate } from './types'
import type { MoveSource } from '@/games/types'

export type OpponentMode = 'stockfish' | 'maia'

export interface OpponentMoveResult {
  uci: string
  source: MoveSource
  engineModel: string
  bookWeight?: number
  rollMeta?: { roll: string; cpPlayed?: number; cpBest?: number }
}

export interface OpponentMoveOptions {
  engine: Engine
  fen: string
  /** 1-based count of plies played so far. */
  ply: number
  elo: number
  mode: OpponentMode
  liveEvalCp?: number
}

const STOCKFISH_BOOK_MAX_PLY = 24       // 12 full moves
const MAIA_LOW_ELO_BOOK_MAX_PLY = 16    // 8 full moves for sub-1400

export async function requestOpponentMove(
  opts: OpponentMoveOptions,
): Promise<OpponentMoveResult> {
  const { engine, fen, ply, elo, mode, liveEvalCp } = opts

  const bookPlyLimit =
    mode === 'maia'
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
        engineModel: mode === 'maia' ? maiaModelName(elo) : 'stockfish-18',
        bookWeight: book.weight,
      }
    }
  }

  if (mode === 'maia') {
    try {
      const uci = await requestMaiaMove(fen, elo)
      return { uci, source: 'maia', engineModel: maiaModelName(elo) }
    } catch (e) {
      console.warn('[opponentEngine] Maia failed, falling back to Stockfish', e)
    }
  }

  const params = getWeakeningParams(elo)
  const engineMove = await engine.requestMove({
    fen,
    depth: params.depth,
    movetime: params.movetime,
    multipv: params.multipv,
  })
  const candidates: TopCandidate[] = engineMove.topCandidates ?? [
    {
      move: `${engineMove.from}${engineMove.to}${engineMove.promotion ?? ''}`,
      cp: 0,
      pv: [],
    },
  ]
  const result = selectMove({
    candidates,
    randomMoveChance: params.randomMoveChance,
    blunderChance: params.blunderChance,
    fenBefore: fen,
    eloForSanity: elo,
    evalCp: liveEvalCp,
  })
  return {
    uci: result.uci,
    source: 'stockfish',
    engineModel: 'stockfish-18',
    rollMeta: { roll: result.roll, cpPlayed: result.cpPlayed, cpBest: result.cpBest },
  }
}
