import { useCallback, useEffect, useRef, type MutableRefObject } from 'react'
import { toast } from 'sonner'
import type { UseChessGameResult } from '@/lib/useChessGame'
import { analyzePosition } from '@/engine/analysisEngine'
import {
  startNewGame,
  appendMove,
  updateMove,
  setGamePgn,
  finalizeGame,
  getGame,
  clearGameCoaching,
  restoreGameCoaching,
} from './gameStore'
import { classify } from './classification'
import type { CoachMessageRecord, GameResult, MoveSource } from './types'

export interface OpponentMoveMeta {
  source: MoveSource
  engineModel: string
  bookWeight?: number
}

export interface GameLoggerInput {
  game: UseChessGameResult
  engineElo: number
  userColor: 'white' | 'black'
  coachMode: 'off' | 'warnings' | 'full'
  /** Engine family used to generate opponent moves. */
  engine?: 'stockfish' | 'maia'
  /** Specific model identifier (e.g. 'stockfish-18', 'maia-1300'). */
  engineModel?: string
  /** Last coach message keyed by ply. */
  coachMessage?: { ply: number; text: string } | null
  /**
   * Provenance metadata for the most recently selected opponent move.
   * The logger reads this ref when it observes a new opponent move in
   * `game.history` and then clears it so the value cannot leak to a
   * subsequent move.
   */
  lastOpponentMetaRef?: MutableRefObject<OpponentMoveMeta | null>
}

export interface GameLoggerOutput {
  currentGameId: string | null
  /** Imperatively append a coach message to the stored move at the given ply. */
  appendCoachMessage: (ply: number, msg: CoachMessageRecord) => void
}

function mapGameResult(game: UseChessGameResult): GameResult {
  if (!game.isGameOver) return 'ongoing'
  if (game.gameResult === 'white') return '1-0'
  if (game.gameResult === 'black') return '0-1'
  return '1/2-1/2'
}

export function useGameLogger(input: GameLoggerInput): GameLoggerOutput {
  const {
    game,
    engineElo,
    userColor,
    coachMode,
    engine,
    engineModel,
    coachMessage,
    lastOpponentMetaRef,
  } = input

  const currentGameIdRef = useRef<string | null>(null)
  const prevHistoryLengthRef = useRef(0)
  const prevIsGameOverRef = useRef(false)
  const gameSavedToastedRef = useRef<string | null>(null)

  // Capture stable refs so the async callbacks don't close over stale values
  const coachMessageRef = useRef(coachMessage)
  coachMessageRef.current = coachMessage

  const userColorChar: 'w' | 'b' = userColor === 'white' ? 'w' : 'b'

  useEffect(() => {
    const currentLen = game.history.length
    const prevLen = prevHistoryLengthRef.current
    const isOver = game.isGameOver

    // Detect new move
    if (currentLen > prevLen) {
      // Lazy-create game on first move
      if (currentGameIdRef.current === null) {
        const newGame = startNewGame({
          userColor,
          engineElo,
          coachMode,
          ...(engine ? { engine } : {}),
          ...(engineModel ? { engineModel } : {}),
        })
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

        // Determine provenance: user vs opponent.
        // Opponent meta comes from the lastOpponentMetaRef (set by PlayPage just
        // before makeMove). Consumed once, then cleared to avoid leaking into
        // the next move.
        const isUserMove = side === userColorChar
        let meta: OpponentMoveMeta | null = null
        if (!isUserMove && lastOpponentMetaRef?.current) {
          meta = lastOpponentMetaRef.current
          lastOpponentMetaRef.current = null
        }
        const sourceField: MoveSource = isUserMove ? 'user' : (meta?.source ?? 'stockfish')

        // Append synchronously with basic fields + provenance
        appendMove(gameId, {
          ply,
          san: move.san,
          uci,
          fen_before,
          fen_after,
          timestamp: Date.now(),
          side,
          source: sourceField,
          ...(meta?.engineModel ? { engineModel: meta.engineModel } : {}),
          ...(meta?.bookWeight !== undefined ? { bookWeight: meta.bookWeight } : {}),
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
      const finalizedGameId = currentGameIdRef.current
      const result = mapGameResult(game)
      finalizeGame(finalizedGameId, result, game.pgn)
      // Fire game-saved toast once per game (keyed by game id)
      if (justEnded && gameSavedToastedRef.current !== finalizedGameId) {
        gameSavedToastedRef.current = finalizedGameId
        const keepCoaching = ((): boolean => {
          try {
            return localStorage.getItem('cc.keepCoaching.v1') === '1'
          } catch {
            return false
          }
        })()

        if (!keepCoaching) {
          const snapshot = clearGameCoaching(finalizedGameId)
          toast('Game saved. Coaching cleared.', {
            duration: 10000,
            ...(snapshot
              ? {
                  action: {
                    label: 'Undo',
                    onClick: () => {
                      restoreGameCoaching(finalizedGameId, snapshot)
                      toast.success('Coaching restored')
                    },
                  },
                }
              : {}),
          })
        } else {
          toast.success('Game saved')
        }
      }
      if (wasReset) {
        currentGameIdRef.current = null
      }
    }

    prevHistoryLengthRef.current = currentLen
    prevIsGameOverRef.current = isOver
  })

  const appendCoachMessage = useCallback((ply: number, msg: CoachMessageRecord): void => {
    const gameId = currentGameIdRef.current
    if (!gameId) return
    const game = getGame(gameId)
    if (!game) return
    const move = game.moves.find((m) => m.ply === ply)
    const existing = move?.coach_messages ?? []
    updateMove(gameId, ply, { coach_messages: [...existing, msg] })
  }, [])

  return { currentGameId: currentGameIdRef.current, appendCoachMessage }
}
