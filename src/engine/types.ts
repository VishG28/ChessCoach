export type Square = string // 'a1'..'h8'; engine returns UCI strings

export interface TopCandidate {
  move: string // UCI move string, e.g. 'e2e4'
  cp: number
  pv: string[]
}

export interface EngineMove {
  from: Square
  to: Square
  promotion?: 'q' | 'r' | 'b' | 'n'
  /** Present when MultiPV > 1 was requested. Sorted by multipv index (best first). */
  topCandidates?: TopCandidate[]
}

export interface EngineDebugState {
  elo: number
  skill: number
  depth: number
  movetime: number
  multipv: number
  randomness: number
  /** Most recent UCI commands sent, oldest first (ring buffer, max 20). */
  lastCommands: string[]
  /** Last 5 engine moves played, oldest first. */
  recentMoves: Array<{
    san?: string
    uci: string
    cp: number
    /** Which branch of selectMove fired for this engine move. */
    roll?: 'best' | 'random' | 'blunder' | 'filtered'
    /** Engine's best-eval (multipv index 1) at the time the move was chosen. */
    cpBest?: number
  }>
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
