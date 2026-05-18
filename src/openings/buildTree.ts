import type { Opening, OpeningNode } from './types'

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

export function buildOpeningTree(o: Opening): {
  tree: OpeningNode
  startFen: string
  userColor: 'white' | 'black'
} {
  const userColor: 'white' | 'black' = o.side === 'black' ? 'black' : 'white'
  const startFen = STARTING_FEN

  const root: OpeningNode = {
    id: `${o.id}:root`,
    fen: startFen,
    san: '',
    uci: '',
    explanation: o.description,
    children: [],
  }

  // Build main-line chain
  let cursor = root
  for (let i = 0; i < o.mainLine.length; i++) {
    const m = o.mainLine[i]
    const node: OpeningNode = {
      id: `${o.id}:main-${i}`,
      fen: m.fen,
      san: m.san,
      uci: m.uci,
      explanation: m.explanation,
      children: [],
    }
    cursor.children.push(node)
    cursor = node
  }

  // Merge variations as children branching from the position whose next child SAN matches triggerMove
  for (const variation of o.variations) {
    let parent: OpeningNode | null = root
    // Walk the main line until we find a node whose first child has the trigger SAN
    while (parent && parent.children.length > 0) {
      const next: OpeningNode = parent.children[0]!
      if (next.san === variation.triggerMove) break
      parent = next
    }
    if (!parent) continue

    // Attach variation moves as sibling branches under parent
    let vc = parent
    for (let i = 0; i < variation.moves.length; i++) {
      const m = variation.moves[i]
      const node: OpeningNode = {
        id: `${o.id}:${variation.id}-${i}`,
        fen: m.fen,
        san: m.san,
        uci: m.uci,
        explanation: m.explanation,
        children: [],
      }
      // Only attach as a new child if it doesn't duplicate an existing child
      const existing = vc.children.find(c => c.san === m.san)
      if (existing) {
        vc = existing
      } else {
        vc.children.push(node)
        vc = node
      }
    }
  }

  return { tree: root, startFen, userColor }
}
