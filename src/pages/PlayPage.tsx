import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Chess } from 'chess.js'
import type { Color, Square } from 'chess.js'
import { useLocation } from 'react-router-dom'
import { Board } from '@/components/board/Board'
import { CapturedPieces } from '@/components/board/CapturedPieces'
import { BoardActionBar } from '@/components/board/BoardActionBar'
import { CoachPanel } from '@/components/coaching/CoachPanel'
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
import { getWeakeningParams, humanThinkDelay, selectMove } from '@/engine/weakening'
import { useGameLogger } from '@/games/useGameLogger'
import { useDeepCoach, uciPvToSan, uciToSan, type LiveCoachMessage } from '@/coaching/useDeepCoach'
import type { CandidateLine, CoachingStyle, PreMoveContext } from '@/coaching/deepCoach'
import { useShortcut } from '@/lib/shortcuts'

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

const DEFAULT_ELO = 800
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
  const [coachingStyle, setCoachingStyle] = useState<CoachingStyle>('conversational')
  const [debugOpen, setDebugOpen] = useState(false)
  const [engineThinking, setEngineThinking] = useState(false)

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

  // Log every move to persistent game storage with background analysis
  const { appendCoachMessage } = useGameLogger({
    game,
    engineElo: elo,
    userColor: userColor === 'w' ? 'white' : 'black',
    coachMode,
    coachMessage: coach.blunderAlert
      ? { ply: game.history.length, text: `Blunder: ${coach.blunderAlert.san} lost ${coach.blunderAlert.loss}cp. Engine prefers ${coach.blunderAlert.better}.` }
      : null,
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
    if (game.isGameOver) return
    if (game.turn !== userColor) return
    if (coachMode !== 'full' || !hasKey) return
    if (!coach.liveEval) return

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
  }, [game.fen, game.turn, game.isGameOver, coachMode, hasKey, coachingStyle])

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

  // Engine plays the opposite color. Use a request-id ref to discard stale
  // bestmoves if the position changes (takeback, new game) mid-search.
  const engineRequestIdRef = useRef(0)
  useEffect(() => {
    if (!engine || !ready) return
    if (game.isGameOver) return
    const engineColor: Color = userColor === 'w' ? 'b' : 'w'
    if (game.turn !== engineColor) return

    const requestId = ++engineRequestIdRef.current
    const params = getWeakeningParams(elo)
    const evalCp = coach.liveEval?.cp
    const fenBefore = game.fen

    setEngineThinking(true)
    void (async () => {
      try {
        const startedAt = performance.now()
        const move = await engine.requestMove({
          fen: fenBefore,
          depth: params.depth,
          movetime: params.movetime,
          multipv: params.multipv,
        })
        if (engineRequestIdRef.current !== requestId) return

        const fallbackUci = `${move.from}${move.to}${move.promotion ?? ''}`
        const candidates =
          move.topCandidates && move.topCandidates.length > 0
            ? move.topCandidates
            : [{ move: fallbackUci, cp: 0, pv: [] }]

        const result = selectMove({
          candidates,
          randomMoveChance: params.randomMoveChance,
          blunderChance: params.blunderChance,
          fenBefore,
          eloForSanity: elo,
          evalCp,
        })

        // Wait for human-feel think time, measured from request start.
        const elapsed = performance.now() - startedAt
        const wait = Math.max(0, humanThinkDelay() - elapsed)
        if (wait > 0) await new Promise((r) => setTimeout(r, wait))
        if (engineRequestIdRef.current !== requestId) return

        const chosen = parseUciMove(result.uci)
        game.makeMove({
          from: chosen.from as Square,
          to: chosen.to as Square,
          promotion: chosen.promotion,
        })

        const lastEntry = game.history[game.history.length - 1]
        if (lastEntry && engine) {
          engine.recordEngineMoveSan(result.uci, lastEntry.san)
          engine.recordRoll(result.uci, result.roll, result.cpBest)
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
  }, [engine, ready, game.fen, game.turn, game.isGameOver, userColor, elo])

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
    const next = resolveUserColor(colorChoice)
    game.setOrientation(next)
    game.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorChoice, coach.dismissAlert, deepCoach.cancel])

  const handleTakeBack = useCallback((): void => {
    if (game.history.length === 0) return
    engineRequestIdRef.current++ // invalidate any in-flight engine move
    coach.dismissAlert()
    deepCoach.cancel()
    // If it's currently the user's turn, the last ply was the engine's reply
    // to the user's blunder; undo both. If it's the engine's turn, only the
    // user's most recent move has been played; undo just that.
    const pliesToUndo = game.turn === userColor ? 2 : 1
    game.undo(Math.min(pliesToUndo, game.history.length))
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

  return (
    <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-6 px-6 py-8 md:grid-cols-[280px_1fr_320px]">
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
          canTakeBack={game.history.length > 0}
          engineStatus={ready ? 'ready' : 'loading'}
          coachingStyle={coachingStyle}
          onCoachingStyleChange={setCoachingStyle}
        />
      </aside>

      <main className="flex flex-col items-center gap-4">
        <CapturedPieces
          history={game.history}
          side="opponent"
          userColor={userColor === 'w' ? 'white' : 'black'}
        />
        <div className="rounded-lg bg-card p-3 shadow-lg">
          <Board
            fen={game.fen}
            orientation={game.orientation}
            turn={game.turn}
            userColor={userColor === 'w' ? 'white' : 'black'}
            dests={game.dests}
            lastMove={game.lastMove}
            inCheck={game.inCheck}
            onUserMove={handleUserMove}
          />
        </div>
        <BoardActionBar
          onFlip={() => game.setOrientation(game.orientation === 'white' ? 'black' : 'white')}
        />
        <CapturedPieces
          history={game.history}
          side="user"
          userColor={userColor === 'w' ? 'white' : 'black'}
        />
        <CoachPanel
          mode={coachMode}
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
        />
      </main>

      <aside className="space-y-4 md:sticky md:top-20 md:self-start">
        <RightSidebar
          history={game.history}
          evalCpWhitePov={evalCpWhitePov}
          mateIn={mateInWhitePov}
          activePly={activePly >= 0 ? activePly : null}
        />
      </aside>

      {debugOpen && engine && <DebugOverlay engine={engine} elo={elo} />}
    </div>
  )
}
