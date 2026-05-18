export interface OpeningNode {
  /** Stable id, e.g. 'london:1d4-d5-2Nf3' */
  id: string
  /** FEN of the position AFTER this move (the position the next side is to move from). */
  fen: string
  /** SAN of THIS move from the parent position. Empty string at root. */
  san: string
  /** UCI of THIS move. Empty string at root. */
  uci: string
  /** Display label shown in the tree, optional */
  label?: string
  /** Explanation shown to the user when they reach this node. Aimed at 300-800 Elo. */
  explanation: string
  /** Children = candidate next moves. Empty array = leaf (line complete). */
  children: OpeningNode[]
}

export interface OpeningMove {
  san: string
  uci: string
  /** FEN AFTER the move */
  fen: string
  explanation: string
}

export interface OpeningVariation {
  id: string
  name: string
  /** SAN from main-line position that branches here */
  triggerMove: string
  moves: OpeningMove[]
  explanation: string
}

export interface AmateurResponse {
  name: string
  description: string
  moves: OpeningMove[]
  refutation: string
}

export interface OpeningTrap {
  name: string
  description: string
  moves: OpeningMove[]
  lesson: string
}

export interface Opening {
  id: string
  name: string
  eco: string
  popularityRank: number
  category: 'main_lines' | 'underrated'
  side: 'white' | 'black' | 'both'
  startingMoves: string[]
  description: string
  whyPlayIt: string
  keyIdeas: string[]
  mainLine: OpeningMove[]
  variations: OpeningVariation[]
  commonAmateurResponses: AmateurResponse[]
  trapsToKnow: OpeningTrap[]
  /** Back-compat for current OpeningTree / useOpeningTrainer. Derived via buildOpeningTree. */
  title?: string
  userColor?: 'white' | 'black'
  startFen?: string
  root?: OpeningNode
}

export interface LineProgress {
  attempts: number
  correct_streak: number
  mastered: boolean
  lastPlayed: number
}

/** outer key = opening.id, inner key = leaf node.id */
export type OpeningProgress = Record<string, Record<string, LineProgress>>
