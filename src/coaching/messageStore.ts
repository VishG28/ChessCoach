// src/coaching/messageStore.ts
import { getGame, updateMove } from '@/games/gameStore'
import type { CoachMessageRecord } from '@/games/types'

/**
 * Appends a coach message to the stored move record for the given ply.
 * Uses getGame + updateMove from gameStore to patch the move entry in localStorage.
 */
export function persistCoachMessage(
  gameId: string | null,
  ply: number,
  msg: CoachMessageRecord,
): void {
  if (!gameId) return
  const game = getGame(gameId)
  if (!game) return
  const move = game.moves.find((m) => m.ply === ply)
  const existing = move?.coach_messages ?? []
  updateMove(gameId, ply, {
    coach_messages: [...existing, msg],
  })
}
