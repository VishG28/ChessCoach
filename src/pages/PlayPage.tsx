import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Chess } from 'chess.js'
import type { Color, Square } from 'chess.js'
import { useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { Board } from '@/components/board/Board'
import { CapturedPieces } from '@/components/board/CapturedPieces'
import { BoardActionBar } from '@/components/board/BoardActionBar'
import { MoveNavBar } from '@/components/board/MoveNavBar'
import { CoachPanel } from '@/components/coaching/CoachPanel'
import { EngineScopeCard } from '@/components/onboarding/EngineScopeCard'
import {
  LeftSidebar,
  type CoachMode,
  type UserColor,
} from '@/components/sidebar/LeftSidebar'
import { RightSidebar } from '@/components/sidebar/RightSidebar'
import { DebugOverlay } from '@/components/debug/DebugOverlay'
import { useCoach } from '@/coaching/useCoach'
import { useApiKey } from '@/coaching/apiKey'
import { useExplain } from '@/coaching/useExplain'
import type { BlunderContext } from '@/coaching/llmCoach'
import { useEngine, parseUciMove } from '@/engine/engine'
import { useChessGame } from '@/lib/useChessGame'
import { humanThinkDelay } from '@/engine/thinkDelay'
import { useGameLogger, type OpponentMoveMeta } from '@/games/useGameLogger'
import { getGame, finalizeGame, clearGameCoaching } from '@/games/gameStore'
import { useDeepCoach, uciPvToSan, uciToSan, type LiveCoachMessage } from '@/coaching/useDeepCoach'
import type { CandidateLine, CoachingStyle, PreMoveContext } from '@/coaching/deepCoach'
import { useShortcut } from '@/lib/shortcuts'
import { fenAtPly, lastMoveAtPly } from '@/lib/historyNavigation'
import { cn } from '@/lib/utils'
import type { MoveSourceInfo } from '@/components/sidebar/RightSidebar'
import { requestOpponentMove } from '@/engine/opponentEngine'
import { loadMaiaModel, selectMaiaModel } from '@/engine/maia'
import { resolveEngine } from '@/engine/engineRouting'
import { useAllowPremoves, usePremoveQueue, premoveStillLegal, useArrowsMaster, useArrowsBest, useArrowsThreats } from '@/lib/usePremove'
import { bestMoveShape, threatShapes } from '@/components/board/BoardArrows'
import type { DrawShape } from 'chessground/draw'

/** Convert a UCI move to SAN given a FEN. Returns UCI string unchanged on failure. */
function uciToSanLocal(fen: string, uci: string): string {
  try {
    const chess = new Chess(fen)
    const from = uci.slice(0, 2)
    const to = uci.slice(2, 4)
    const promotion = uci.length >= 5 ? (uci[4] as 'q' | 'r' | 'b' | 'n') : undefined
    return chess.move({ from, to, promotion })?.san ?? uci
  } catch {
    return uci
  }
}

const DEFAULT_ELO = 1100
const DEFAULT_COACH_MODE: CoachMode = 'warnings'
const DEFAULT_USER_COLOR: UserColor = 'white'

function resolveUserColor(choice: UserColor): 'white' | 'black' {
  if (choice === 'random') return Math.random() < 0.5 ? 'white' : 'black'
  return choice
}

export function PlayPage() {
  const game = useChessGame()
  const { engine, ready } = useEngine()
  const location = useLocation()

  const [elo, setElo] = useState(DEFAULT_ELO)
  const [colorChoice, setColorChoice] = useState<UserColor>(DEFAULT_USER_COLOR)
  const [coachMode, setCoachMode] = useState<CoachMode>(DEFAULT_COACH_MODE)
  const [coachingStyle, setCoachingStyle] = useState<CoachingStyle>(() => {
    try {
      const v = localStorage.getItem('cc.coachingStyle.v1')
      if (v === 'conversational' || v === 'socratic' || v === 'tactical') return v
    } catch { /* ignore */ }
    return 'conversational'
  })
  // Persist the chosen style across sessions.
  useEffect(() => {
    try {
      localStorage.setItem('cc.coachingStyle.v1', coachingStyle)
    } catch { /* ignore */ }
  }, [coachingStyle])
  // Track when the style was just changed so the pre-move effect can skip
  // re-firing on the current ply (avoids spam when toggling mid-turn).
  const styleJustChangedRef = useRef(false)
  const prevStyleRef = useRef(coachingStyle)
  if (prevStyleRef.current !== coachingStyle) {
    prevStyleRef.current = coachingStyle
    styleJustChangedRef.current = true
  }
  const [debugOpen, setDebugOpen] = useState(false)
  const [engineThinking, setEngineThinking] = useState(false)
  const resolvedEngine = resolveEngine(elo)
  const engineMode: 'maia' | 'stockfish' = resolvedEngine.source

  // Premove support
  const [allowPremovesPref, setAllowPremovesPref] = useAllowPremoves()
  const { queued: queuedPremove, setPremove, cancelPremove } = usePremoveQueue()
  const [premoveFailSquare, setPremoveFailSquare] = useState<string | null>(null)
  // Ref so the async engine IIFE always reads the latest queued premove.
  const queuedPremoveRef = useRef(queuedPremove)
  queuedPremoveRef.current = queuedPremove
  // Effective allowPremoves: disabled in full coach mode to avoid coaching conflicts.
  const allowPremoves = allowPremovesPref && coachMode !== 'full'
  // When coachMode transitions to 'full', clear any queued premove.
  const prevCoachModeRef = useRef(coachMode)
  if (prevCoachModeRef.current !== coachMode) {
    prevCoachModeRef.current = coachMode
    if (coachMode === 'full') {
      cancelPremove()
    }
  }

  // Arrow toggle settings (persisted to localStorage)
  const [arrowsMaster, setArrowsMaster] = useArrowsMaster()
  const [arrowsBest, setArrowsBest] = useArrowsBest()
  const [arrowsThreats, setArrowsThreats] = useArrowsThreats()

  // Lazy-load Maia model whenever the resolved engine source is Maia and the
  // Elo bucket changes. On load failure, requestOpponentMove falls back to
  // Stockfish per-move; we surface a one-shot toast here.
  useEffect(() => {
    if (engineMode !== 'maia') return
    const tid = toast.loading('Loading Maia neural network…')
    loadMaiaModel(elo)
      .then(() => toast.success(`Maia ${selectMaiaModel(elo)} ready`, { id: tid }))
      .catch((e) => {
        console.error('Maia load failed:', e)
        toast.error('Maia unavailable, falling back to Stockfish per move', { id: tid })
      })
  }, [engineMode, elo])

  const userColor: Color = game.orientation === 'white' ? 'w' : 'b'

  // Handle "Play from here" redirects from GameReviewPage
  const fromFenAppliedRef = useRef(false)
  useEffect(() => {
    if (fromFenAppliedRef.current) return
    const params = new URLSearchParams(location.search)
    const fromFen = params.get('from')
    const engineColorParam = params.get('engineColor')
    if (!fromFen) return
    fromFenAppliedRef.current = true
    game.loadFen(fromFen)
    if (engineColorParam === 'w') {
      // Engine is white => user plays black
      game.setOrientation('black')
    } else if (engineColorParam === 'b') {
      // Engine is black => user plays white
      game.setOrientation('white')
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Power-user keyboard shortcuts (all auto-skipped when typing in inputs)
  useShortcut('`', () => setDebugOpen((v) => !v))

  // Push strength to the engine whenever it changes (and once on ready).
  useEffect(() => {
    if (!engine || !ready) return
    void engine.setStrength(elo)
  }, [engine, ready, elo])

  // Coach reads game + engine and produces threats/captures/blunder alerts.
  const coach = useCoach({
    game,
    engine,
    engineReady: ready,
    mode: coachMode,
    userColor,
    evalDepth: 10,
  })

  // LLM explanation wiring (key is held in memory only, accessed lazily)
  const { hasKey } = useApiKey()
  const blunderAlert = coach.blunderAlert

  // Build the BlunderContext only when there's an active blunder alert.
  // Memoize on the alert's identity fields so we don't thrash useExplain.
  const blunderCtx = useMemo<BlunderContext | null>(() => {
    if (!blunderAlert || coachMode !== 'full') return null
    const fenBefore = blunderAlert.fenBefore
    const betterSan = uciToSanLocal(fenBefore, blunderAlert.better)
    // Convert PV UCIs → SAN (up to 4) starting from fenBefore
    const pvSan: string[] = []
    try {
      const pvChess = new Chess(fenBefore)
      for (const uci of blunderAlert.pv.slice(0, 4)) {
        const from = uci.slice(0, 2)
        const to = uci.slice(2, 4)
        const promotion = uci.length >= 5 ? (uci[4] as 'q' | 'r' | 'b' | 'n') : undefined
        const m = pvChess.move({ from, to, promotion })
        if (!m) break
        pvSan.push(m.san)
      }
    } catch { /* ignore */ }
    const recentMoves = game.history.slice(-6).map((m) => m.san)
    return {
      fen_before: fenBefore,
      user_move: blunderAlert.san,
      engine_best_move: betterSan,
      engine_pv: pvSan,
      centipawn_loss: blunderAlert.loss,
      recent_moves: recentMoves,
      user_elo: elo,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blunderAlert?.san, blunderAlert?.loss, blunderAlert?.fenBefore, coachMode, elo])

  // UCI of the last user move for cache key
  const lastUserUci = useMemo<string | null>(() => {
    if (!blunderAlert) return null
    const lastEntry = game.history[game.history.length - 1]
    if (!lastEntry) return null
    return `${lastEntry.from}${lastEntry.to}${lastEntry.promotion ?? ''}`
  }, [blunderAlert, game.history])

  // Rule-based fallback message
  const ruleFallback = useMemo<string | null>(() => {
    if (!blunderAlert) return null
    const betterSan = uciToSanLocal(blunderAlert.fenBefore, blunderAlert.better)
    const lossPawns = (blunderAlert.loss / 100).toFixed(2)
    return `You played ${blunderAlert.san}, losing ${lossPawns} pawns of evaluation. The engine preferred ${betterSan}.`
  }, [blunderAlert])

  const explain = useExplain({
    ctx: blunderCtx,
    uci: lastUserUci,
    ruleFallback,
    enabled: blunderAlert !== null && coachMode === 'full',
  })

  // Provenance metadata for the next opponent move. PlayPage sets this before
  // calling makeMove; useGameLogger reads and clears it as it persists the move.
  const lastOpponentMetaRef = useRef<OpponentMoveMeta | null>(null)

  // Per-ply (0-based index into game.history) source map for the move list badge.
  const [moveSources, setMoveSources] = useState<ReadonlyMap<number, MoveSourceInfo>>(
    () => new Map(),
  )

  // Ref used by both the engine useEffect (to discard stale searches) and the
  // in-game review handlers (to invalidate an in-flight reply when the user
  // starts scrubbing). Declared early so callbacks below can capture it.
  const engineRequestIdRef = useRef(0)

  // In-game history review: null = at live position; number = displaying the
  // position AFTER this many plies have been played (0 = starting position,
  // game.history.length = live). Read-only — never mutates the actual game.
  const [reviewedPly, setReviewedPly] = useState<number | null>(null)
  const totalPlies = game.history.length
  const displayedPly = reviewedPly ?? totalPlies
  const isReviewing = reviewedPly !== null

  const goToPly = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(totalPlies, next))
      if (clamped !== totalPlies) {
        // Entering or staying in review mode: invalidate any in-flight engine
        // search so its async reply does not land while the user is scrubbing.
        engineRequestIdRef.current++
      }
      setReviewedPly(clamped === totalPlies ? null : clamped)
    },
    [totalPlies],
  )

  const handleReturnToLive = useCallback(() => setReviewedPly(null), [])

  // Defensive: if history shrinks (takeback / new game / FEN load) clear review.
  // Setting state directly in an effect here is intentional state synchronization
  // and only fires in the rare race between an external history mutation and the
  // user's stale review index.
  useEffect(() => {
    if (reviewedPly !== null && reviewedPly > totalPlies) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReviewedPly(null)
    }
  }, [reviewedPly, totalPlies])

  // Log every move to persistent game storage with background analysis
  const { appendCoachMessage, currentGameId } = useGameLogger({
    game,
    engineElo: elo,
    userColor: userColor === 'w' ? 'white' : 'black',
    coachMode,
    engine: engineMode,
    engineModel: resolvedEngine.modelLabel,
    coachMessage: coach.blunderAlert
      ? { ply: game.history.length, text: `Blunder: ${coach.blunderAlert.san} lost ${coach.blunderAlert.loss}cp. Engine prefers ${coach.blunderAlert.better}.` }
      : null,
    lastOpponentMetaRef,
  })

  // Refs for the current pre/post move context so Tell Me More can reference them
  const lastPreMoveCtxRef = useRef<PreMoveContext | null>(null)

  // Deep coach: streaming multi-layer coaching messages
  const deepCoach = useDeepCoach({
    style: coachingStyle,
    enabled: coachMode === 'full' && hasKey,
    onComplete: useCallback((msg: LiveCoachMessage) => {
      // Persist the completed message against the current ply
      appendCoachMessage(game.history.length, {
        trigger: msg.trigger,
        style: msg.style,
        depth: msg.depth,
        content: msg.content,
        timestamp: msg.timestamp,
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appendCoachMessage, game.history.length]),
  })

  // Pre-move coaching: fire when it becomes the user's turn
  useEffect(() => {
    if (isReviewing) return
    if (game.isGameOver) return
    if (game.turn !== userColor) return
    if (coachMode !== 'full' || !hasKey) return
    if (!coach.liveEval) return
    // If this effect ran solely because the user switched coaching style
    // mid-ply, skip the re-fire to avoid spamming the same position.
    if (styleJustChangedRef.current) {
      styleJustChangedRef.current = false
      return
    }

    // Build PreMoveContext from available engine data
    const liveEval = coach.liveEval
    const recentMovesSan = game.history.slice(-8).map((m) => m.san)
    const bestMoveSan = uciToSanLocal(game.fen, liveEval.bestMove)
    const pvSan: string[] = []
    try {
      const pvChess = new Chess(game.fen)
      for (const uci of (liveEval.pv ?? []).slice(0, 5)) {
        const from = uci.slice(0, 2)
        const to = uci.slice(2, 4)
        const prom = uci.length >= 5 ? (uci[4] as 'q' | 'r' | 'b' | 'n') : undefined
        const m = pvChess.move({ from, to, promotion: prom })
        if (!m) break
        pvSan.push(m.san)
      }
    } catch { /* ignore */ }

    const candidates: CandidateLine[] = (liveEval.candidates ?? []).slice(0, 5).map((c) => ({
      san: uciToSan(game.fen, c.move),
      cp: c.cp,
      pvSan: uciPvToSan(game.fen, c.pv, 6),
    }))

    const ctx: PreMoveContext = {
      fen: game.fen,
      recentMovesSan,
      color: userColor === 'w' ? 'white' : 'black',
      bestMoveSan,
      bestEvalCp: liveEval.cp,
      candidates: candidates.length > 0 ? candidates : [{ san: bestMoveSan, cp: liveEval.cp, pvSan }],
      pvSan,
      materialSummary: 'even',
      userElo: elo,
    }
    lastPreMoveCtxRef.current = ctx

    deepCoach.fire({
      trigger: 'pre_move',
      depth: 'detail',
      fen: game.fen,
      preMove: ctx,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.fen, game.turn, game.isGameOver, coachMode, hasKey, coachingStyle, isReviewing])

  // Tell Me More handler
  const handleTellMore = useCallback((messageId: string) => {
    const msg = deepCoach.messages.find((m) => m.id === messageId)
    if (!msg) return
    deepCoach.fire({
      trigger: 'tell_me_more',
      depth: msg.depth,
      fen: msg.fen,
      preMove: lastPreMoveCtxRef.current ?? undefined,
      followUp: 'Go deeper on this position. What else should I notice? Any obscure tactical or strategic ideas I should know about? What would a master player consider here?',
    })
  }, [deepCoach])

  // Quieter handler: downgrade to warnings mode
  const handleQuieter = useCallback(() => {
    setCoachMode('warnings')
  }, [])

  // Engine plays the opposite color. The request-id ref (declared earlier so
  // review handlers can also invalidate in-flight searches) discards stale
  // bestmoves if the position changes (takeback, new game, review).
  useEffect(() => {
    if (isReviewing) return
    if (!engine || !ready) return
    if (game.isGameOver) return
    const engineColor: Color = userColor === 'w' ? 'b' : 'w'
    if (game.turn !== engineColor) return

    const requestId = ++engineRequestIdRef.current
    const evalCp = coach.liveEval?.cp
    const fenBefore = game.fen
    // The ply about to be played (history length grows by 1 after makeMove).
    const ply = game.history.length + 1

    setEngineThinking(true)
    void (async () => {
      try {
        const startedAt = performance.now()
        // liveEval cp is read elsewhere; explicitly mark unused here.
        void evalCp

        // Unified opponent move pipeline: book → maia (with Stockfish fallback) → Stockfish.
        const result = await requestOpponentMove({
          engine,
          fen: fenBefore,
          ply,
          elo,
        })
        if (engineRequestIdRef.current !== requestId) return

        const chosenUci = result.uci
        if (!chosenUci) return

        // Wait for human-feel think time, measured from request start.
        const elapsed = performance.now() - startedAt
        const wait = Math.max(0, humanThinkDelay() - elapsed)
        if (wait > 0) await new Promise((r) => setTimeout(r, wait))
        if (engineRequestIdRef.current !== requestId) return

        // Record provenance for the debug overlay and the logger.
        // result.source is always 'book' | 'stockfish' | 'maia' for opponent
        // moves (never 'user'), but the type union includes 'user'; narrow it.
        if (result.source !== 'user') {
          engine.recordOpponentSource(result.source)
        }
        lastOpponentMetaRef.current = {
          source: result.source,
          engineModel: result.engineModel,
          ...(result.bookWeight !== undefined ? { bookWeight: result.bookWeight } : {}),
        }
        // Snapshot for the move-list badge (history index is ply - 1).
        const historyIndex = ply - 1
        setMoveSources((prev) => {
          const next = new Map(prev)
          next.set(historyIndex, {
            source: result.source,
            ...(result.bookWeight !== undefined ? { bookWeight: result.bookWeight } : {}),
          })
          return next
        })

        const chosen = parseUciMove(chosenUci)
        game.makeMove({
          from: chosen.from as Square,
          to: chosen.to as Square,
          promotion: chosen.promotion,
        })

        // After the engine move lands, try to execute any queued premove.
        const currentPremove = queuedPremoveRef.current
        if (currentPremove) {
          const newFen = game.fen
          const legal = premoveStillLegal(newFen, currentPremove)
          if (legal) {
            // Brief visual breathing room before executing.
            setTimeout(() => {
              game.makeMove({
                from: legal.from as Square,
                to: legal.to as Square,
                promotion: 'q',
              })
              cancelPremove()
            }, 100)
          } else {
            // Flash the origin square red to signal the premove was illegal.
            setPremoveFailSquare(currentPremove.from)
            setTimeout(() => setPremoveFailSquare(null), 200)
            cancelPremove()
          }
        }

        const lastEntry = game.history[game.history.length - 1]
        if (lastEntry && engine && result.source === 'stockfish') {
          engine.recordEngineMoveSan(chosenUci, lastEntry.san)
        }
      } catch {
        // Engine disposed mid-request, or transport error. Silent fail —
        // the position will retry on the next render cycle.
      } finally {
        if (engineRequestIdRef.current === requestId) setEngineThinking(false)
      }
    })()
    // `game` is intentionally omitted: it's a new object every render and
    // including it would loop. The fields we read (fen/turn/isGameOver) are
    // in deps; makeMove is stable in behavior even though its identity isn't.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine, ready, game.fen, game.turn, game.isGameOver, userColor, elo, engineMode, isReviewing])

  const handleUserMove = (
    from: string,
    to: string,
    promotion?: 'q' | 'r' | 'b' | 'n',
  ): void => {
    game.makeMove({
      from: from as Square,
      to: to as Square,
      promotion,
    })
  }

  const handleNewGame = useCallback((): void => {
    engineRequestIdRef.current++ // invalidate any in-flight engine move
    coach.dismissAlert()
    deepCoach.cancel()
    lastOpponentMetaRef.current = null
    setMoveSources(new Map())
    setReviewedPly(null)

    // Abandonment: if the previous game exists and is still ongoing, finalize
    // it as a draw and (unless opted in) clear its coaching before the reset.
    if (currentGameId) {
      const prev = getGame(currentGameId)
      if (prev && prev.result === 'ongoing') {
        finalizeGame(currentGameId, '1/2-1/2', game.pgn ?? '')
        const keepCoaching = ((): boolean => {
          try { return localStorage.getItem('cc.keepCoaching.v1') === '1' } catch { return false }
        })()
        if (!keepCoaching) clearGameCoaching(currentGameId)
        toast('Previous game saved as abandoned')
      }
    }

    const next = resolveUserColor(colorChoice)
    game.setOrientation(next)
    game.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorChoice, coach.dismissAlert, deepCoach.cancel, currentGameId])

  const handleTakeBack = useCallback((): void => {
    if (game.history.length === 0) return
    engineRequestIdRef.current++ // invalidate any in-flight engine move
    coach.dismissAlert()
    deepCoach.cancel()
    lastOpponentMetaRef.current = null
    setReviewedPly(null)
    // If it's currently the user's turn, the last ply was the engine's reply
    // to the user's blunder; undo both. If it's the engine's turn, only the
    // user's most recent move has been played; undo just that.
    const pliesToUndo = game.turn === userColor ? 2 : 1
    const undone = Math.min(pliesToUndo, game.history.length)
    const newLen = game.history.length - undone
    setMoveSources((prev) => {
      const next = new Map<number, MoveSourceInfo>()
      for (const [k, v] of prev) {
        if (k < newLen) next.set(k, v)
      }
      return next
    })
    game.undo(undone)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.history.length, game.turn, userColor, coach.dismissAlert, deepCoach.cancel])

  // Global event listeners for command palette
  useEffect(() => {
    const onNewGame = () => handleNewGame()
    const onTakeBack = () => handleTakeBack()
    const onFlipBoard = () => game.setOrientation(game.orientation === 'white' ? 'black' : 'white')
    window.addEventListener('cc:new-game', onNewGame)
    window.addEventListener('cc:take-back', onTakeBack)
    window.addEventListener('cc:flip-board', onFlipBoard)
    return () => {
      window.removeEventListener('cc:new-game', onNewGame)
      window.removeEventListener('cc:take-back', onTakeBack)
      window.removeEventListener('cc:flip-board', onFlipBoard)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleNewGame, handleTakeBack])

  // Direct keyboard shortcuts (mirror the command palette actions)
  useShortcut('mod+n', handleNewGame)
  useShortcut('mod+z', handleTakeBack)
  useShortcut('f', () =>
    game.setOrientation(game.orientation === 'white' ? 'black' : 'white'),
  )
  useShortcut('mod+e', () =>
    window.dispatchEvent(new Event('cc:open-api-key')),
  )

  // In-game move navigation shortcuts. These only fire on the live PlayPage
  // (GameReviewPage has its own bindings) and are skipped automatically when
  // the user is typing in an input thanks to useShortcut's default behavior.
  useShortcut('arrowleft', () => goToPly(displayedPly - 1))
  useShortcut('arrowright', () => goToPly(displayedPly + 1))
  useShortcut('home', () => goToPly(0))
  useShortcut('end', handleReturnToLive)

  // Eval bar wants White-POV centipawns. EngineEval.cp is from side-to-move
  // POV at the evaluated FEN, which (for liveEval) corresponds to game.turn.
  const evalCpWhitePov =
    coach.liveEval == null
      ? null
      : game.turn === 'w'
        ? coach.liveEval.cp
        : -coach.liveEval.cp
  const mateInWhitePov =
    coach.liveEval?.mateIn == null
      ? null
      : game.turn === 'w'
        ? coach.liveEval.mateIn
        : -coach.liveEval.mateIn

  const activePly = game.history.length - 1

  // While reviewing, render the past position instead of the live one. We do
  // NOT touch the underlying chess.js game — only what the user sees.
  const displayedFen = isReviewing
    ? fenAtPly(game.history, reviewedPly!)
    : game.fen
  const displayedLastMove = isReviewing
    ? lastMoveAtPly(game.history, reviewedPly!)
    : game.lastMove
  // Empty dests map makes chessground reject all drag attempts silently.
  const emptyDests = useMemo(() => new Map<Square, Square[]>(), [])
  const displayedDests = isReviewing ? emptyDests : game.dests

  // Highlight the move that *produced* the displayed position in the move list
  // (i.e. the last ply played, which is displayedPly - 1 as a 0-based index).
  const highlightedMovePly = displayedPly > 0 ? displayedPly - 1 : null

  // Eval at the reviewed ply comes from the persisted gameStore, which the
  // background analyzer fills in as moves are played. Live eval bypasses this.
  // `totalPlies` is included so the memo recomputes after each new move (and
  // its async analysis) is persisted to the store.
  const reviewedEvalCpWhitePov = useMemo<number | null>(() => {
    if (!isReviewing || !currentGameId || reviewedPly === null || reviewedPly === 0) {
      return null
    }
    void totalPlies
    const g = getGame(currentGameId)
    const entry = g?.moves[reviewedPly - 1]
    const ev = entry?.engine_eval_after
    if (!ev || !entry) return null
    // engine_eval_after.cp is from side-to-move POV at fen_after. The side to
    // move at fen_after is the OPPOSITE of entry.side (the side that just
    // moved). White POV: side === 'w' ? -cp : +cp.
    return entry.side === 'w' ? -ev.cp : ev.cp
  }, [isReviewing, reviewedPly, currentGameId, totalPlies])

  const displayedEvalCpWhitePov = isReviewing ? reviewedEvalCpWhitePov : evalCpWhitePov
  const displayedMateIn = isReviewing ? null : mateInWhitePov

  // Compute board arrow shapes from current eval + settings.
  const enoughMoves = game.history.length >= 4
  const userTurn = game.turn === userColor
  const liveEval = coach.liveEval
  const userColorStr = userColor === 'w' ? 'white' : 'black'

  const bestArrow: DrawShape | null =
    !isReviewing &&
    arrowsMaster &&
    arrowsBest &&
    enoughMoves &&
    userTurn &&
    liveEval?.candidates?.[0]
      ? bestMoveShape(liveEval.candidates[0])
      : null

  const threatArrows: DrawShape[] =
    !isReviewing && arrowsMaster && arrowsThreats && enoughMoves && userColor
      ? threatShapes(game.fen, userColorStr)
      : []

  const shapes: DrawShape[] = isReviewing
    ? []
    : [bestArrow, ...threatArrows].filter((s): s is DrawShape => Boolean(s))

  const coachFlags = {
    hasBestArrow: Boolean(bestArrow),
    hasThreatArrow: threatArrows.length > 0,
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-8">
      <EngineScopeCard />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr_320px]">
      <aside className="space-y-4 md:sticky md:top-20 md:self-start">
        <LeftSidebar
          elo={elo}
          onEloChange={setElo}
          color={colorChoice}
          onColorChange={setColorChoice}
          coachMode={coachMode}
          onCoachModeChange={setCoachMode}
          onNewGame={handleNewGame}
          onTakeBack={handleTakeBack}
          canTakeBack={game.history.length > 0 && !isReviewing}
          engineStatus={ready ? 'ready' : 'loading'}
          coachingStyle={coachingStyle}
          onCoachingStyleChange={setCoachingStyle}
          allowPremoves={allowPremovesPref}
          onAllowPremovesChange={setAllowPremovesPref}
          arrowsMaster={arrowsMaster}
          onArrowsMasterChange={setArrowsMaster}
          arrowsBest={arrowsBest}
          onArrowsBestChange={setArrowsBest}
          arrowsThreats={arrowsThreats}
          onArrowsThreatsChange={setArrowsThreats}
        />
      </aside>

      <main className="flex flex-col items-center gap-4">
        <CapturedPieces
          history={game.history}
          side="opponent"
          userColor={userColor === 'w' ? 'white' : 'black'}
        />
        <div
          className={cn(
            'rounded-lg bg-card p-3 shadow-lg transition-shadow',
            isReviewing && 'ring-2 ring-primary/40',
          )}
          onPointerDownCapture={(e) => {
            if (!isReviewing) return
            const target = e.target as HTMLElement | null
            if (target?.closest('piece')) {
              toast('Return to live position to make a move', {
                id: 'cc.review-blocked',
                duration: 1800,
              })
            }
          }}
        >
          <Board
            fen={displayedFen}
            orientation={game.orientation}
            turn={game.turn}
            userColor={userColor === 'w' ? 'white' : 'black'}
            dests={displayedDests}
            lastMove={displayedLastMove}
            inCheck={isReviewing ? false : game.inCheck}
            onUserMove={handleUserMove}
            allowPremoves={allowPremoves && !isReviewing}
            onPremoveSet={(orig, dest) => setPremove({ from: orig, to: dest })}
            onPremoveUnset={cancelPremove}
            premoveFailSquare={premoveFailSquare}
            shapes={shapes}
          />
        </div>
        <BoardActionBar
          onFlip={() => game.setOrientation(game.orientation === 'white' ? 'black' : 'white')}
        />
        <MoveNavBar
          totalPlies={totalPlies}
          displayedPly={displayedPly}
          isReviewing={isReviewing}
          onFirst={() => goToPly(0)}
          onPrev={() => goToPly(displayedPly - 1)}
          onNext={() => goToPly(displayedPly + 1)}
          onLast={handleReturnToLive}
          onReturnToLive={handleReturnToLive}
        />
        <CapturedPieces
          history={game.history}
          side="user"
          userColor={userColor === 'w' ? 'white' : 'black'}
        />
        <div
          className={cn(
            'w-full transition-opacity',
            isReviewing && 'opacity-60 pointer-events-none',
          )}
          aria-hidden={isReviewing ? 'true' : undefined}
        >
          <CoachPanel
            mode={coachMode}
            hasKey={hasKey}
            threats={coach.threats}
            captures={coach.captures}
            blunderAlert={coach.blunderAlert}
            thinking={coach.thinking}
            engineThinking={engineThinking}
            onDismissAlert={coach.dismissAlert}
            onTakeBackBlunder={handleTakeBack}
            explain={explain}
            messages={deepCoach.messages}
            onTellMore={handleTellMore}
            onQuieter={handleQuieter}
            coachFlags={coachFlags}
          />
        </div>
      </main>

      <aside className="space-y-4 md:sticky md:top-20 md:self-start">
        <RightSidebar
          history={game.history}
          evalCpWhitePov={displayedEvalCpWhitePov}
          mateIn={displayedMateIn}
          activePly={isReviewing ? highlightedMovePly : activePly >= 0 ? activePly : null}
          moveSources={moveSources}
          onSelectPly={(plyIndex) => goToPly(plyIndex + 1)}
        />
      </aside>

      {debugOpen && engine && <DebugOverlay engine={engine} elo={elo} />}
      </div>
    </div>
  )
}
