export type Classification = 'best' | 'good' | 'inaccuracy' | 'mistake' | 'blunder'

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
}
