export type Classification = 'best' | 'good' | 'inaccuracy' | 'mistake' | 'blunder'

export type MoveSource = 'user' | 'book' | 'stockfish' | 'maia'

export interface CoachMessageRecord {
  trigger: 'pre_move' | 'post_move' | 'tell_me_more' | 'retrospective'
  style: 'conversational' | 'socratic' | 'tactical'
  depth: 'quick' | 'detail' | 'critical'
  content: string
  timestamp: number
}

export interface MoveAlternative {
  move: string // UCI
  cp: number
  pv: string[]
}

export interface MoveEntry {
  ply: number
  san: string
  uci: string
  fen_before: string
  fen_after: string
  timestamp: number
  /** Side that played this move ('w' = white played, 'b' = black played) */
  side: 'w' | 'b'
  engine_eval_before?: { cp: number; bestMove: string; pv: string[] }
  engine_eval_after?: { cp: number; bestMove: string; pv: string[] }
  /** From the perspective of the side that moved. Positive = lost evaluation. */
  centipawn_loss?: number
  classification?: Classification
  coach_message?: string
  top_alternatives?: MoveAlternative[]
  /** Per-move coaching messages from the deep coach. Backward-compat: generated from legacy coach_message on load. */
  coach_messages?: CoachMessageRecord[]
  /** Provenance of the move. 'user' for the human, 'book'/'stockfish'/'maia' for the engine side. */
  source?: MoveSource
  /** Identifier of the engine/model that produced this move (e.g. 'stockfish-18', 'maia-1300'). */
  engineModel?: string
  /** For book moves: the 0..1 frequency weight in the Lichess explorer for the chosen line. */
  bookWeight?: number
}

export type GameResult = '1-0' | '0-1' | '1/2-1/2' | 'ongoing'

export interface Game {
  id: string
  startedAt: number
  endedAt?: number
  result: GameResult
  userColor: 'white' | 'black'
  engineElo: number
  coachMode: 'off' | 'warnings' | 'full'
  pgn: string
  moves: MoveEntry[]
  /** Engine family used to generate opponent moves. */
  engine?: 'stockfish' | 'maia'
  /** Specific model identifier (e.g. 'stockfish-18', 'maia-1300'). */
  engineModel?: string
  /** When true, coaching messages persist after the game ends. */
  keepCoaching?: boolean
}
