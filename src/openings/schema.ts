import { z } from 'zod'

export const openingMoveSchema = z.object({
  san: z.string(),
  uci: z.string(),
  fen: z.string(),
  explanation: z.string(),
})

export const openingVariationSchema = z.object({
  id: z.string(),
  name: z.string(),
  triggerMove: z.string(),
  moves: z.array(openingMoveSchema),
  explanation: z.string(),
})

export const amateurResponseSchema = z.object({
  name: z.string(),
  description: z.string(),
  moves: z.array(openingMoveSchema),
  refutation: z.string(),
})

export const openingTrapSchema = z.object({
  name: z.string(),
  description: z.string(),
  moves: z.array(openingMoveSchema),
  lesson: z.string(),
})

export const openingSchema = z.object({
  id: z.string(),
  name: z.string(),
  eco: z.string(),
  popularityRank: z.number(),
  category: z.enum(['main_lines', 'underrated']),
  side: z.enum(['white', 'black', 'both']),
  startingMoves: z.array(z.string()),
  description: z.string(),
  whyPlayIt: z.string(),
  keyIdeas: z.array(z.string()),
  mainLine: z.array(openingMoveSchema),
  variations: z.array(openingVariationSchema),
  commonAmateurResponses: z.array(amateurResponseSchema),
  trapsToKnow: z.array(openingTrapSchema),
})

export type OpeningJson = z.infer<typeof openingSchema>

export function parseOpening(raw: unknown): OpeningJson {
  return openingSchema.parse(raw)
}
