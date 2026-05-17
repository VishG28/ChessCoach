export type Square = string // 'a1'..'h8'; engine returns UCI strings

export interface EngineMove {
  from: Square
  to: Square
  promotion?: 'q' | 'r' | 'b' | 'n'
}

export interface EngineEval {
  /** Centipawn score from the perspective of the side to move at the evaluated FEN.
   *  Positive = side-to-move is better. Mate scores clamp to ±100000. */
  cp: number
  /** UCI bestmove like 'e2e4' or 'e7e8q' */
  bestMove: string
  /** Principal variation, UCI move strings */
  pv: string[]
  /** Search depth actually reached */
  depth: number
  /** Set when a mate was found. Positive = mate for side to move in N. */
  mateIn?: number
}

export type StrengthMode = 'uci_elo' | 'skill_level'

export interface StrengthSetting {
  mode: StrengthMode
  /** Elo for uci_elo mode (>= 1320), or the synthetic elo slider value for skill_level mode */
  elo: number
  /** Skill Level 0..20, present only when mode === 'skill_level' */
  skillLevel?: number
}
