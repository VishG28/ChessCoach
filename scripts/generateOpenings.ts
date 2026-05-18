/**
 * AI-powered opening generator using Claude claude-sonnet-4-6.
 *
 * Usage:
 *   npx tsx scripts/generateOpenings.ts --batch 1-10
 *   npx tsx scripts/generateOpenings.ts --batch 1-50
 *   npx tsx scripts/generateOpenings.ts --id italian-game
 *
 * Requires ANTHROPIC_API_KEY in environment.
 */

import Anthropic from '@anthropic-ai/sdk'
import { Chess } from 'chess.js'
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { SEEDS, type OpeningSeed } from './openingSeeds.js'
import { openingSchema, type OpeningJson } from '../src/openings/schema.js'

const API_KEY = process.env['ANTHROPIC_API_KEY']
if (!API_KEY) {
  console.error(
    'ERROR: ANTHROPIC_API_KEY environment variable is not set.\n' +
    'Export it before running: export ANTHROPIC_API_KEY=sk-ant-...',
  )
  process.exit(1)
}

const anthropic = new Anthropic({ apiKey: API_KEY })
const OUT_DIR = join(import.meta.dirname, '../src/data/openings')
mkdirSync(OUT_DIR, { recursive: true })

// ── CLI argument parsing ──────────────────────────────────────────────────────

function parseArgs(): OpeningSeed[] {
  const args = process.argv.slice(2)
  const batchIdx = args.indexOf('--batch')
  const idIdx = args.indexOf('--id')

  if (idIdx !== -1) {
    const id = args[idIdx + 1]
    if (!id) { console.error('--id requires an argument'); process.exit(1) }
    const seed = SEEDS.find(s => s.id === id)
    if (!seed) {
      console.error(`Unknown seed id: ${id}`)
      console.error('Available:', SEEDS.map(s => s.id).join(', '))
      process.exit(1)
    }
    return [seed]
  }

  if (batchIdx !== -1) {
    const range = args[batchIdx + 1]
    if (!range) { console.error('--batch requires a range like 1-10'); process.exit(1) }
    const [startStr, endStr] = range.split('-')
    const start = parseInt(startStr!, 10)
    const end = parseInt(endStr ?? startStr!, 10)
    if (isNaN(start) || isNaN(end) || start < 1 || end > SEEDS.length) {
      console.error(`Range must be between 1 and ${SEEDS.length}`)
      process.exit(1)
    }
    return SEEDS.slice(start - 1, end)
  }

  // Default: all seeds
  return SEEDS
}

// ── Lichess Explorer fetch ────────────────────────────────────────────────────

interface LichessMove {
  uci: string
  san: string
  white: number
  draws: number
  black: number
}

async function fetchLichessContext(seed: OpeningSeed): Promise<string> {
  // Convert startingMoves (SAN) to UCI for Lichess API
  const chess = new Chess()
  const uciMoves: string[] = []
  for (const san of seed.startingMoves) {
    try {
      const result = chess.move(san)
      if (!result) break
      uciMoves.push(`${result.from}${result.to}${result.promotion ?? ''}`)
    } catch {
      break
    }
  }

  const url = `https://explorer.lichess.ovh/lichess?variant=standard&speeds=blitz,rapid,classical&ratings=1200,1400,1600&play=${uciMoves.join(',')}`

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return 'No Lichess data available.'

    const data = await res.json() as { moves?: LichessMove[] }
    const moves = data.moves ?? []
    if (moves.length === 0) return 'No popular continuations found in Lichess database.'

    const top5 = moves.slice(0, 5)
    const lines = top5.map(m => {
      const total = m.white + m.draws + m.black
      const pct = total > 0 ? Math.round((m.white / total) * 100) : 0
      return `  ${m.san} (${total.toLocaleString()} games, ${pct}% White wins)`
    })
    return `Top amateur continuations after ${seed.startingMoves.join(' ')}:\n${lines.join('\n')}`
  } catch {
    return 'Lichess data unavailable (timeout or network error).'
  }
}

// ── FEN/UCI correction using chess.js ─────────────────────────────────────────

interface RawMove {
  san: string
  uci?: string
  fen?: string
  explanation: string
}

function rederiveMoves(moves: RawMove[], startFen: string): Array<{ san: string; uci: string; fen: string; explanation: string }> {
  const chess = new Chess(startFen)
  const result: Array<{ san: string; uci: string; fen: string; explanation: string }> = []

  for (const m of moves) {
    try {
      const moveResult = chess.move(m.san)
      if (!moveResult) {
        console.warn(`    Warning: move ${m.san} failed, stopping line`)
        break
      }
      result.push({
        san: moveResult.san,
        uci: `${moveResult.from}${moveResult.to}${moveResult.promotion ?? ''}`,
        fen: chess.fen(),
        explanation: m.explanation,
      })
    } catch {
      console.warn(`    Warning: move ${m.san} threw, stopping line`)
      break
    }
  }

  return result
}

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

function correctOpeningFens(raw: OpeningJson): OpeningJson {
  // Re-derive mainLine FENs/UCIs
  const mainLine = rederiveMoves(raw.mainLine, STARTING_FEN)

  // Re-derive variation FENs/UCIs (each starts from STARTING_FEN)
  const variations = raw.variations.map(v => ({
    ...v,
    moves: rederiveMoves(v.moves, STARTING_FEN),
  }))

  // Re-derive amateur response FENs/UCIs (each starts from STARTING_FEN)
  const commonAmateurResponses = raw.commonAmateurResponses.map(r => ({
    ...r,
    moves: rederiveMoves(r.moves, STARTING_FEN),
  }))

  // Re-derive traps (each starts from STARTING_FEN)
  const trapsToKnow = raw.trapsToKnow.map(t => ({
    ...t,
    moves: rederiveMoves(t.moves, STARTING_FEN),
  }))

  return { ...raw, mainLine, variations, commonAmateurResponses, trapsToKnow }
}

// ── Claude call ───────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are creating a chess teaching resource for a 300-1000 Elo player. Generate accurate, beginner-friendly content. Focus on principles and pattern recognition over deep theory. Common amateur responses should reflect what players actually play, not theoretical moves. Output ONLY a single valid JSON object matching the provided schema. No prose, no markdown fences.`

function buildUserPrompt(seed: OpeningSeed, lichessContext: string, validationError?: string): string {
  const base = `Generate the Opening JSON for "${seed.name}" (ECO ${seed.eco}).

Schema:
\`\`\`typescript
interface Opening {
  id: string                    // use: "${seed.id}"
  name: string
  eco: string                   // use: "${seed.eco}"
  popularityRank: number        // 1-50, lower = more popular at amateur level
  category: 'main_lines' | 'underrated'  // use: "${seed.category}"
  side: 'white' | 'black' | 'both'       // use: "${seed.side}"
  startingMoves: string[]       // use: ${JSON.stringify(seed.startingMoves)}
  description: string           // 2-3 sentences for beginners
  whyPlayIt: string             // 2-3 sentences
  keyIdeas: string[]            // exactly 3 items, 1 sentence each
  mainLine: OpeningMove[]       // 5-12 moves, starts from game start through theory
  variations: OpeningVariation[] // 2-4 items
  commonAmateurResponses: AmateurResponse[] // 2-4 items
  trapsToKnow: OpeningTrap[]    // 1-3 items
}
interface OpeningMove { san: string; uci: string; fen: string; explanation: string }
interface OpeningVariation { id: string; name: string; triggerMove: string; moves: OpeningMove[]; explanation: string }
interface AmateurResponse { name: string; description: string; moves: OpeningMove[]; refutation: string }
interface OpeningTrap { name: string; description: string; moves: OpeningMove[]; lesson: string }
\`\`\`

Requirements:
- mainLine begins from the starting position (include the opening moves themselves)
- mainLine should include ${seed.startingMoves.join(' ')} plus 3-5 follow-up moves through key theory
- All FEN values must be correct for the position AFTER that move
- Explanations should be 1-2 sentences aimed at 300-1000 Elo players
- Focus on practical ideas, not deep theory

${lichessContext}

Return ONLY the JSON object. No markdown, no prose.`

  if (validationError) {
    return `${base}\n\nYour previous response had a validation error. Please fix it:\n${validationError}`
  }

  return base
}

// ── Main generation loop ──────────────────────────────────────────────────────

function stripMarkdown(text: string): string {
  return text
    .replace(/^```(?:json|typescript)?\s*\n?/m, '')
    .replace(/\n?```\s*$/m, '')
    .trim()
}

async function generateOpening(seed: OpeningSeed, index: number, total: number): Promise<boolean> {
  const label = `[${index}/${total}] ${seed.id}`
  process.stdout.write(`${label} ... `)

  const lichessContext = await fetchLichessContext(seed)

  let lastError: string | undefined

  for (let attempt = 1; attempt <= 2; attempt++) {
    const userPrompt = buildUserPrompt(seed, lichessContext, lastError)

    let rawText: string
    try {
      const msg = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      })
      const block = msg.content[0]
      if (!block || block.type !== 'text') {
        console.log('FAILED (no text block)')
        return false
      }
      rawText = stripMarkdown(block.text)
    } catch (e) {
      console.log(`FAILED (API error: ${e})`)
      return false
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(rawText)
    } catch (e) {
      lastError = `JSON parse error: ${e}`
      if (attempt === 2) {
        console.log(`FAILED (${lastError})`)
        return false
      }
      continue
    }

    let validated: OpeningJson
    try {
      validated = openingSchema.parse(parsed)
    } catch (e) {
      lastError = `Schema validation error: ${e}`
      if (attempt === 2) {
        console.log(`FAILED (schema: ${lastError})`)
        return false
      }
      continue
    }

    // Correct FENs and UCIs using chess.js
    const corrected = correctOpeningFens(validated)

    const filePath = join(OUT_DIR, `${seed.id}.json`)
    writeFileSync(filePath, JSON.stringify(corrected, null, 2) + '\n', 'utf8')

    const stats = `${corrected.mainLine.length} main moves, ${corrected.variations.length} variations, ${corrected.commonAmateurResponses.length} counters`
    console.log(`ok (${stats})`)
    return true
  }

  return false
}

async function main() {
  const selected = parseArgs()
  console.log(`Generating ${selected.length} opening(s)...\n`)

  let success = 0
  let failure = 0

  for (let i = 0; i < selected.length; i++) {
    const seed = selected[i]!
    const ok = await generateOpening(seed, i + 1, selected.length)
    if (ok) success++
    else failure++
  }

  console.log(`\nGenerated ${success} / ${selected.length} openings successfully.`)
  if (failure > 0) {
    console.log(`Failed: ${failure}. Check logs above for details.`)
    process.exit(1)
  }
}

// Read existing JSON to check if it's a real (non-placeholder) file
function isPlaceholder(id: string): boolean {
  const filePath = join(OUT_DIR, `${id}.json`)
  if (!existsSync(filePath)) return true
  try {
    const raw = JSON.parse(readFileSync(filePath, 'utf8'))
    return typeof raw.description === 'string' && raw.description.startsWith('Placeholder')
  } catch {
    return true
  }
}

// Re-export for testing
export { isPlaceholder, rederiveMoves }

main().catch(e => {
  console.error('Fatal error:', e)
  process.exit(1)
})
