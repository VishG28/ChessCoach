// src/coaching/deepCoach.ts
import Anthropic from '@anthropic-ai/sdk'

export const MODEL_ID = 'claude-sonnet-4-6'

export type CoachingStyle = 'conversational' | 'socratic' | 'tactical'

export const CONVERSATIONAL_SYSTEM = `You are a chess coach for a 300–1000 Elo learner. Be brief and surgical.

For pre-move coaching: 2 sentences maximum. First sentence names the most important thing to look at right now (a threat, a tactic, a candidate move). Second sentence explains why in plain terms. Reference at most one candidate move from the engine's top 5.

For blunder/mistake coaching: 2–3 sentences maximum. First sentence names what was missed (the tactic, the hanging piece, the threat). Second sentence explains the consequence. Optional third sentence offers what to try next time.

Hard rules:
- Never exceed 3 sentences total
- Never list multiple candidate moves with explanations — pick the most important one
- No preambles like "In this position..." or "Looking at the board..."
- No closing encouragements like "Keep it up!" or "Good thinking!"
- Use SAN notation for moves but explain squares plainly when needed
- If the position is quiet and there's nothing critical to say, output one short sentence: "Position is roughly equal. Develop your pieces and look for the right pawn break." — don't force depth where none is needed
- Never just say "this is good/bad" — always state the reason in the same sentence`

export const SOCRATIC_SYSTEM = `You are a chess coach who teaches by asking questions, not giving answers. The student is 300–1000 Elo.

For each turn, ask exactly ONE question that points them toward what to consider. The question should be specific to the position. Examples:
- "What does your opponent's last move threaten?"
- "Which of your pieces is undefended right now?"
- "If you move your knight, what happens to the bishop behind it?"

Hard rules:
- Exactly one question per response
- 15 words maximum
- Never reveal the answer
- Never say "good question" or "think about"
- Question must be answerable from the position alone, not require deep calculation`

export const TACTICAL_SYSTEM = `You are a chess coach focused on calculation. The student is 300–1000 Elo.

For each turn, output exactly ONE line:
- If there is a tactic available (fork, pin, skewer, discovered attack, hanging piece, mate-in-2 or less): "Tactic available. Hint: look at [piece] and [square]." — name the piece and the target square but not the move sequence.
- If there is no tactic: "No tactics. Find the best positional move."

Hard rules:
- One line, never more
- Hint names the relevant piece(s) and square(s) only, never the move
- 20 words maximum`

export const DEEP_DIVE_SYSTEM = `You are a chess coach giving a deeper analysis on request. The student already received a brief coach message and wants more depth.

Expand the analysis to 4–6 sentences covering:
- The strategic theme of the position
- Multiple candidate moves with brief reasoning for each
- What the opponent is likely to do next
- One non-obvious idea a stronger player would consider

Still no preambles. Get straight to substance.`

export const RETROSPECTIVE_SYSTEM = `You are a chess coach reviewing a past move with the student. They want to understand what happened.

3–5 sentences:
- What they played and what the engine preferred
- Why the engine's move was better (name the tactic/idea)
- What happens in the engine's continuation for 2–3 moves
- The lesson — what pattern to recognize next time

No preambles, no encouragement padding.`

export type CoachDepth = 'brief' | 'deep_dive' | 'retrospective'

export function systemPromptFor(style: CoachingStyle, depth: CoachDepth = 'brief'): string {
  if (depth === 'deep_dive') return DEEP_DIVE_SYSTEM
  if (depth === 'retrospective') return RETROSPECTIVE_SYSTEM
  switch (style) {
    case 'socratic': return SOCRATIC_SYSTEM
    case 'tactical': return TACTICAL_SYSTEM
    default:         return CONVERSATIONAL_SYSTEM
  }
}

// Backward-compat alias
export function systemPromptForStyle(style: CoachingStyle): string {
  return systemPromptFor(style, 'brief')
}

export interface CandidateLine {
  san: string
  cp: number
  /** First 6 plies of principal variation in SAN. */
  pvSan: string[]
}

export interface PreMoveContext {
  fen: string
  recentMovesSan: string[]   // last 8 plies
  color: 'white' | 'black'
  bestMoveSan: string
  bestEvalCp: number
  candidates: CandidateLine[]   // up to 5
  pvSan: string[]            // engine's projected continuation
  materialSummary: string    // e.g. "even" / "+2 for white"
  userElo: number
}

export interface PostMoveContext {
  userMoveSan: string
  classification: 'inaccuracy' | 'mistake' | 'blunder' | 'missed_tactic'
  centipawnLoss: number
  fenBefore: string
  fenAfter: string
  bestMoveSan: string
  bestPvSan: string[]
  engineResponsePvSan: string[]
  recentMovesSan: string[]
}

export function renderPreMovePrompt(ctx: PreMoveContext): string {
  const lines = [
    `Position: ${ctx.fen}`,
    `Recent moves: ${ctx.recentMovesSan.join(' ')}`,
    `Playing as ${ctx.color}, my turn.`,
    `Material: ${ctx.materialSummary}. Elo: ${ctx.userElo}.`,
    ``,
    `Top engine candidates:`,
  ]
  ctx.candidates.forEach((c, i) => {
    lines.push(`${i + 1}. ${c.san} (${c.cp}cp) — line: ${c.pvSan.join(' ')}`)
  })
  return lines.join('\n')
}

export function renderPostMovePrompt(ctx: PostMoveContext): string {
  return [
    `I played ${ctx.userMoveSan} — a ${ctx.classification} (${ctx.centipawnLoss}cp loss).`,
    `Engine wanted ${ctx.bestMoveSan} with continuation ${ctx.bestPvSan.slice(0, 4).join(' ')}.`,
    `Position: ${ctx.fenAfter}. Recent: ${ctx.recentMovesSan.slice(-6).join(' ')}.`,
    `What did I miss?`,
  ].join('\n')
}

export interface StreamCoachOptions {
  apiKey: string
  style: CoachingStyle
  /** Coaching depth: brief (default), deep_dive, or retrospective. */
  depth?: CoachDepth
  /** Either pre- or post-move; exactly one populated. */
  preMove?: PreMoveContext
  postMove?: PostMoveContext
  /** Override for "Tell me more" follow-ups. Appended to the user prompt as a second user message. */
  followUp?: string
  signal?: AbortSignal
}

export interface StreamCoachUsage {
  inputTokens: number
  outputTokens: number
}

export interface StreamCoachResult {
  /** Full text once the stream completes. */
  text: string
  usage: StreamCoachUsage
}

/**
 * Yields incremental text chunks as Claude streams its response.
 * Returns a promise that resolves to the final text + usage when the stream is done.
 */
export async function* streamCoachMessage(
  opts: StreamCoachOptions,
  onUsage: (u: StreamCoachUsage) => void,
): AsyncGenerator<string, StreamCoachResult, void> {
  if (!/^[\x00-\x7F]+$/.test(opts.apiKey)) {
    throw new Error(
      'API key contains invalid characters. Re-enter it from console.anthropic.com.',
    )
  }
  const client = new Anthropic({
    apiKey: opts.apiKey,
    dangerouslyAllowBrowser: true,
  })

  const userText = opts.preMove
    ? renderPreMovePrompt(opts.preMove)
    : opts.postMove
      ? renderPostMovePrompt(opts.postMove)
      : ''
  if (!userText) throw new Error('streamCoachMessage requires preMove or postMove context')

  const messages: Anthropic.MessageParam[] = [{ role: 'user', content: userText }]
  if (opts.followUp) {
    messages.push({ role: 'assistant', content: 'Continuing.' })
    messages.push({ role: 'user', content: opts.followUp })
  }

  const depth = opts.depth ?? 'brief'
  const maxTokens = depth === 'deep_dive' ? 500
                : depth === 'retrospective' ? 400
                : 180  // brief
  const stream = client.messages.stream(
    {
      model: MODEL_ID,
      max_tokens: maxTokens,
      system: systemPromptFor(opts.style, depth),
      messages,
    },
    { signal: opts.signal },
  )

  let acc = ''
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      acc += event.delta.text
      yield event.delta.text
    }
  }
  const final = await stream.finalMessage()
  const usage: StreamCoachUsage = {
    inputTokens: final.usage.input_tokens,
    outputTokens: final.usage.output_tokens,
  }
  onUsage(usage)
  return { text: acc, usage }
}

/** Sonnet 4.6 pricing as of plan date: $3 / M input, $15 / M output. */
export function usdCost(u: StreamCoachUsage): number {
  return (u.inputTokens / 1_000_000) * 3 + (u.outputTokens / 1_000_000) * 15
}
