/**
 * Generates minimal valid placeholder JSON files for each opening seed.
 * Skips seeds that already have a real JSON file in src/data/openings/.
 *
 * Run: npx tsx scripts/buildDummyOpenings.ts
 */

import { Chess } from 'chess.js'
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { SEEDS } from './openingSeeds.js'

const OUT_DIR = join(import.meta.dirname, '../src/data/openings')

mkdirSync(OUT_DIR, { recursive: true })

// IDs that already have real (non-dummy) JSON — do not overwrite.
const SKIP_IDS = new Set(['london-system', 'caro-kann'])

let created = 0
let skipped = 0

for (const seed of SEEDS) {
  const filePath = join(OUT_DIR, `${seed.id}.json`)

  if (SKIP_IDS.has(seed.id)) {
    console.log(`  skip  ${seed.id} (hand-authored, preserved)`)
    skipped++
    continue
  }

  if (existsSync(filePath)) {
    console.log(`  skip  ${seed.id} (file already exists)`)
    skipped++
    continue
  }

  // Walk the startingMoves through chess.js to compute correct FENs and UCIs
  const chess = new Chess()
  const mainLine: Array<{ san: string; uci: string; fen: string; explanation: string }> = []

  let validMoves = true
  for (const san of seed.startingMoves) {
    try {
      const result = chess.move(san)
      if (!result) {
        console.error(`  ERROR ${seed.id}: move ${san} failed`)
        validMoves = false
        break
      }
      const uci = `${result.from}${result.to}${result.promotion ?? ''}`
      mainLine.push({
        san: result.san,
        uci,
        fen: chess.fen(),
        explanation: 'Placeholder explanation.',
      })
    } catch (e) {
      console.error(`  ERROR ${seed.id}: move ${san} threw: ${e}`)
      validMoves = false
      break
    }
  }

  if (!validMoves) continue

  const dummy = {
    id: seed.id,
    name: seed.name,
    eco: seed.eco,
    popularityRank: 99,
    category: seed.category,
    side: seed.side,
    startingMoves: seed.startingMoves,
    description: `Placeholder — run \`npm run openings:generate -- --id ${seed.id}\` to populate.`,
    whyPlayIt: 'Placeholder — see description.',
    keyIdeas: [
      'Placeholder idea 1.',
      'Placeholder idea 2.',
      'Placeholder idea 3.',
    ],
    mainLine,
    variations: [],
    commonAmateurResponses: [],
    trapsToKnow: [],
  }

  writeFileSync(filePath, JSON.stringify(dummy, null, 2) + '\n', 'utf8')
  console.log(`  write ${seed.id} (${mainLine.length} moves)`)
  created++
}

console.log(`\nDone: ${created} files created, ${skipped} skipped.`)
