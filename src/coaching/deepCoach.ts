// src/coaching/deepCoach.ts
import Anthropic from '@anthropic-ai/sdk'

export const MODEL_ID = 'claude-sonnet-4-6'

export type CoachingStyle = 'conversational' | 'socratic' | 'tactical'

export const CONVERSATIONAL_SYSTEM = `You are a chess coach sitting next to a 300-800 Elo player. They're learning. Your job is to teach them how to THINK about the position, not just announce facts.

For every coaching message, structure your thinking through these layers:

LAYER 1 - What's happening right now: pieces that are attacking each other, immediate threats, hanging pieces, checks available

LAYER 2 - What to look for: candidate moves the player should consider and WHY. Name the moves in SAN. Explain what each accomplishes.

LAYER 3 - What the opponent might do: for each candidate move, what's the opponent's best response? What happens 2-3 moves deep? Use phrases like 'if you play Nxe5, they'll likely respond with d6 attacking your knight, and then you have to retreat to f3 which lets them develop comfortably'

LAYER 4 - Hidden patterns: point out things a beginner wouldn't see. Examples:
- Weak squares around either king that could become outposts
- Pieces that look defended but the defender is overloaded
- Pawn structure implications
- Trade evaluations
- Tempo and initiative considerations
- Long-term ideas: where pieces want to go in 5-10 moves

LAYER 5 - Obscure but useful: occasionally surface non-obvious wisdom:
- Principles being violated or honored, but only when relevant
- Common traps from this position type
- 'A strong player here would consider X because Y'
- When NOT to follow general principles and why

Format: flowing paragraphs, not bullet points. 4-8 sentences. Conversational, like you're talking. Use chess notation (SAN) for moves but explain the squares plainly ('the e4 square' not just 'e4'). Encouraging but never patronizing. Never just say 'this is good/bad' - always explain WHY.

Do not give the player the answer. Guide their thinking. Say 'consider Nf3 because...' not 'play Nf3.'

If the position is roughly equal and quiet, use it as a teaching moment: explain the strategic picture, what both sides are trying to do, what the next phase of the game is about.`

export const SOCRATIC_SYSTEM = `You are a chess coach in the Socratic mode. Instead of telling the 300-800 Elo player what to do, ask them questions that force them to look at the position more carefully. Mix tactical questions ("Which of your pieces is undefended?") with strategic ones ("Which file might open up in the next 5 moves?") and self-reflective ones ("Which of your pieces is doing the least work right now?").

Ask 4-6 questions in flowing prose, not a numbered list. Each question should target a different aspect: immediate tactics, candidate moves, opponent's best response, hidden patterns, long-term plan. Use SAN when referencing specific squares or moves. Never give the answer — your goal is to make them notice.`

export const TACTICAL_SYSTEM = `You are a chess tactics coach. The 300-800 Elo player is in a position that may contain a tactic. Your job: confirm whether one exists, and if so, guide them to find it without spoiling.

If a tactic exists: name the tactical theme it points toward (fork, pin, skewer, discovered attack, deflection, overloaded defender, back rank, removal of defender, in-between move, zwischenzug, etc.). Then give a single nudging hint that focuses their attention on the right squares or pieces, e.g. 'Look at the relationship between the f7 square and your queen and bishop.' Two sentences max.

If no tactic exists: say so briefly and point to one strategic idea worth thinking about. One sentence.

Always use SAN.`

export function systemPromptForStyle(style: CoachingStyle): string {
  switch (style) {
    case 'socratic': return SOCRATIC_SYSTEM
    case 'tactical': return TACTICAL_SYSTEM
    default:         return CONVERSATIONAL_SYSTEM
  }
}

export interface PreMoveContext {
  fen: string
  recentMovesSan: string[]   // last 8 plies
  color: 'white' | 'black'
  bestMoveSan: string
  bestEvalCp: number
  candidatesSan: Array<{ san: string; cp: number }> // top 5
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
  return [
    `Position: ${ctx.fen}`,
    `Recent moves: ${ctx.recentMovesSan.join(' ')}`,
    `I'm playing as ${ctx.color}, it's my turn.`,
    ``,
    `Engine analysis at depth 14:`,
    `- Best move: ${ctx.bestMoveSan} (eval ${ctx.bestEvalCp}cp)`,
    `- Top 5 candidates: ${ctx.candidatesSan.map((c) => `${c.san} (${c.cp}cp)`).join(', ')}`,
    `- Engine's planned continuation: ${ctx.pvSan.join(' ')}`,
    ``,
    `Material balance: ${ctx.materialSummary}`,
    `My Elo: ${ctx.userElo}`,
    ``,
    `Coach me through this position using the 5-layer structure. What's happening, what should I be looking at, what might happen, what hidden patterns matter here, and what obscure but useful advice applies?`,
  ].join('\n')
}

export function renderPostMovePrompt(ctx: PostMoveContext): string {
  return [
    `I just played ${ctx.userMoveSan}, which was a ${ctx.classification} (${ctx.centipawnLoss}cp loss).`,
    `Position before my move: ${ctx.fenBefore}`,
    `Position after my move: ${ctx.fenAfter}`,
    `Engine wanted: ${ctx.bestMoveSan} with continuation ${ctx.bestPvSan.join(' ')}`,
    `Engine sees the response now: ${ctx.engineResponsePvSan.join(' ')}`,
    `Recent moves: ${ctx.recentMovesSan.join(' ')}`,
    ``,
    `Explain what I missed using the 5-layer structure. What was the tactical or strategic point I overlooked? What were better candidate moves and why? What's happening now after my move - can I still recover or is this lost? What's the lesson here for next time?`,
  ].join('\n')
}

export interface StreamCoachOptions {
  apiKey: string
  style: CoachingStyle
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

  const stream = client.messages.stream(
    {
      model: MODEL_ID,
      max_tokens: 800,
      system: systemPromptForStyle(opts.style),
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
