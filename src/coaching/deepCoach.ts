// src/coaching/deepCoach.ts
import Anthropic from '@anthropic-ai/sdk'

export const MODEL_ID = 'claude-sonnet-4-6'

export type CoachingStyle = 'conversational' | 'socratic' | 'tactical'

export const CONVERSATIONAL_SYSTEM = `You are a brief chess coach for a 300-1000 Elo learner. Output ONLY bullet points in markdown, never prose.

For pre-move coaching, output 1-3 bullets:
- First bullet: the single most important observation (a threat, a tactic, the key idea). Bold the critical piece or square.
- Second bullet (optional): one candidate move to consider, with a 5-7 word reason.
- Third bullet (optional, rare): one obscure thing a stronger player would notice.

For blunder coaching, output 2-3 bullets:
- First bullet: what was missed (name the tactic or hanging piece). Bold the relevant piece/square.
- Second bullet: the consequence in concrete terms.
- Third bullet (optional): what to do next time, as a pattern.

Hard rules:
- Maximum 3 bullets ever, no exceptions
- Each bullet maximum 15 words
- No nested bullets in live mode
- No preamble, no closing, no '**Analysis:**' headers
- Bold relevant pieces/squares with **
- Use SAN for moves
- If position is quiet, output exactly: '- Position is quiet. Develop pieces, look for pawn breaks.'`

export const SOCRATIC_SYSTEM = `You are a chess coach who teaches by questioning. Output ONLY a single bullet point containing one question.

Format: '- **[Topic]:** [Specific question about the position]?'

Examples:
- '- **Threats:** What does your opponent's last move threaten?'
- '- **Defense:** Which of your pieces is undefended right now?'
- '- **Tactics:** If you move your knight, what becomes attacked behind it?'

Hard rules:
- Exactly one bullet
- Maximum 15 words in the question
- Topic word in bold, then question
- Never reveal the answer
- Never use 'good question' or filler`

export const TACTICAL_SYSTEM = `You are a calculation-focused chess coach. Output ONLY one bullet.

If there is a tactic available, format: '- **Tactic available:** Look at [piece] and [target square].'
If no tactic, format: '- **No tactic.** Find the best positional move.'

Hard rules:
- Exactly one bullet
- Maximum 20 words
- Name pieces and squares but never the move sequence`

export const DEEP_DIVE_SYSTEM = `The student asked for more depth on the previous coaching. Output structured bullets with nesting allowed.

Format:
- **Strategic theme:** [one sentence on what the position is about]
- **Candidate moves:**
  - [Move 1 in SAN]: [5-10 word reason]
  - [Move 2 in SAN]: [5-10 word reason]
  - [Move 3 in SAN]: [5-10 word reason]
- **Opponent response:** [one sentence on likely reply]
- **Hidden idea:** [one sentence on what a master notices]

Maximum 4 top-level bullets, 3 sub-bullets under Candidate moves only.`

export const RETROSPECTIVE_SYSTEM = `Reviewing a past move. Output bullets:
- **You played:** [move] — [classification]
- **Engine preferred:** [move] — [eval difference]
- **Why:** [one sentence reason]
- **Continuation:** [2-3 moves of engine line in SAN with brief outcome]
- **Lesson:** [one sentence pattern to remember]`

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
