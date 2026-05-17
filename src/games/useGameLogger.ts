import { useEffect, useRef } from 'react'
import type { UseChessGameResult } from '@/lib/useChessGame'
import { analyzePosition } from '@/engine/analysisEngine'
import {
  startNewGame,
  appendMove,
  updateMove,
  setGamePgn,
  finalizeGame,
} from './gameStore'
import { classify } from './classification'
import type { GameResult } from './types'

export interface GameLoggerInput {
  game: UseChessGameResult
  engineElo: number
  userColor: 'white' | 'black'
  coachMode: 'off' | 'warnings' | 'full'
  /** Last coach message keyed by ply. */
  coachMessage?: { ply: number; text: string } | null
}

export interface GameLoggerOutput {
  currentGameId: string | null
}

function mapGameResult(game: UseChessGameResult): GameResult {
  if (!game.isGameOver) return 'ongoing'
  if (game.gameResult === 'white') return '1-0'
  if (game.gameResult === 'black') return '0-1'
  return '1/2-1/2'
}

export function useGameLogger(input: GameLoggerInput): GameLoggerOutput {
  const { game, engineElo, userColor, coachMode, coachMessage } = input

  const currentGameIdRef = useRef<string | null>(null)
  const prevHistoryLengthRef = useRef(0)
  const prevIsGameOverRef = useRef(false)

  // Capture stable refs so the async callbacks don't close over stale values
  const coachMessageRef = useRef(coachMessage)
  coachMessageRef.current = coachMessage

  useEffect(() => {
    const currentLen = game.history.length
    const prevLen = prevHistoryLengthRef.current
    const isOver = game.isGameOver

    // Detect new move
    if (currentLen > prevLen) {
      // Lazy-create game on first move
      if (currentGameIdRef.current === null) {
        const newGame = startNewGame({ userColor, engineElo, coachMode })
        currentGameIdRef.current = newGame.id
      }

      const gameId = currentGameIdRef.current!

      // Process each new move (usually just 1, but handle bulk loads)
      for (let i = prevLen; i < currentLen; i++) {
        const move = game.history[i]
        const ply = i + 1
        const uci = `${move.from}${move.to}${move.promotion ?? ''}`
        const side = move.color as 'w' | 'b'
        const fen_before = move.before
        const fen_after = move.after

        // Append synchronously with basic fields
        appendMove(gameId, {
          ply,
          san: move.san,
          uci,
          fen_before,
          fen_after,
          timestamp: Date.now(),
          side,
        })

        // Fire-and-forget async analysis
        const capturedPly = ply
        const capturedFenBefore = fen_before
        const capturedFenAfter = fen_after
        const capturedCoachMsg =
          coachMessage && coachMessage.ply === ply ? coachMessage.text : undefined

        void (async () => {
          try {
            // Run both analyses in parallel
            const [beforeResult, afterResult] = await Promise.all([
              analyzePosition(capturedFenBefore, 12),
              analyzePosition(capturedFenAfter, 12),
            ])

            // eval_before: from the perspective of the side that was about to move
            const evalBefore = {
              cp: beforeResult.eval.cp,
              bestMove: beforeResult.eval.bestMove,
              pv: beforeResult.eval.pv,
            }
            // eval_after: from the perspective of the OTHER side (after the move)
            const evalAfter = {
              cp: afterResult.eval.cp,
              bestMove: afterResult.eval.bestMove,
              pv: afterResult.eval.pv,
            }

            // CP loss: side-relative
            // before_stm = eval_before.cp (side-to-move at fen_before = the mover)
            // after_stm = -eval_after.cp (after the move, the OTHER side is STM, so flip)
            const before_stm = evalBefore.cp
            const after_stm = -evalAfter.cp
            const cpLoss = Math.max(0, before_stm - after_stm)

            const classification = classify(cpLoss)

            const topAlternatives = beforeResult.candidates
              .slice(0, 3)
              .map((c) => ({
                move: c.move,
                cp: c.cp,
                pv: c.pv,
              }))

            updateMove(gameId, capturedPly, {
              engine_eval_before: evalBefore,
              engine_eval_after: evalAfter,
              centipawn_loss: cpLoss,
              classification,
              top_alternatives: topAlternatives,
              ...(capturedCoachMsg ? { coach_message: capturedCoachMsg } : {}),
            })
          } catch {
            // Analysis failed — partial data is fine; move still recorded
          }
        })()
      }

      // Update PGN after each move
      setGamePgn(gameId, game.pgn)
    }

    // Detect reset (history went from >0 to 0) or game over
    const wasReset = prevLen > 0 && currentLen === 0
    const justEnded = isOver && !prevIsGameOverRef.current && currentLen > 0

    if ((wasReset || justEnded) && currentGameIdRef.current !== null) {
      const result = mapGameResult(game)
      finalizeGame(currentGameIdRef.current, result, game.pgn)
      if (wasReset) {
        currentGameIdRef.current = null
      }
    }

    prevHistoryLengthRef.current = currentLen
    prevIsGameOverRef.current = isOver
  })

  return { currentGameId: currentGameIdRef.current }
}
