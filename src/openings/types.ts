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

export interface Opening {
  id: 'london' | 'caro-kann'
  title: string
  /** The color the USER plays. The other color makes book moves automatically. */
  userColor: 'white' | 'black'
  /** Starting FEN — standard chess starting position. */
  startFen: string
  /** Top-level description shown above the tree. */
  description: string
  /** Root has empty san/uci. Its children are the first moves (which side moves first depends on userColor). */
  root: OpeningNode
}

export interface LineProgress {
  attempts: number
  correct_streak: number
  mastered: boolean
  lastPlayed: number
}

/** outer key = opening.id, inner key = leaf node.id */
export type OpeningProgress = Record<string, Record<string, LineProgress>>
