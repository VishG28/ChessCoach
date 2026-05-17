export interface BlunderContext {
  fen_before: string
  user_move: string        // SAN
  engine_best_move: string // SAN (convert UCI → SAN at call site)
  engine_pv: string[]      // first 4 SAN moves of engine's preferred continuation
  centipawn_loss: number
  recent_moves: string[]   // last 6 SAN moves up to and including user's blunder
  user_elo: number
}

const SYSTEM_PROMPT = `You are a chess coach for a beginner (300-800 Elo). Explain blunders in 2-3 sentences max. Name the tactic if there is one (fork, pin, skewer, discovered attack, hanging piece, back rank weakness). Be specific about which pieces and squares. Do not use chess notation the player won't understand. Encouraging tone but factually direct. Never just say 'you lost material' - explain WHY.`

function renderUserPrompt(ctx: BlunderContext): string {
  return [
    `I played ${ctx.user_move} but the engine prefers ${ctx.engine_best_move}.`,
    `After my move the eval shifted by ${ctx.centipawn_loss}cp.`,
    `The engine's line continues: ${ctx.engine_pv.join(' ')}.`,
    `Position FEN: ${ctx.fen_before}.`,
    `Recent moves: ${ctx.recent_moves.join(' ')}.`,
    `What did I miss in 2-3 sentences?`,
  ].join(' ')
}

export async function explainBlunder(
  ctx: BlunderContext,
  apiKey: string,
  signal?: AbortSignal,
): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    signal,
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 200,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: renderUserPrompt(ctx) }],
    }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Anthropic API ${res.status}: ${text || res.statusText}`)
  }
  const data = (await res.json()) as { content?: Array<{ text?: string }> }
  const out = data.content?.[0]?.text?.trim()
  if (!out) throw new Error('Empty response from Anthropic')
  return out
}

/** Cheap key validation — does a tiny ping with low max_tokens. */
export async function pingAnthropic(apiKey: string): Promise<void> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 5,
      messages: [{ role: 'user', content: 'Hi' }],
    }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`API ${res.status}: ${text || res.statusText}`)
  }
}
