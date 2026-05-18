import type { CSSProperties } from 'react'
import { useEffect, useRef } from 'react'
import { Chessground } from 'chessground'
import type { Api } from 'chessground/api'
import type { Config } from 'chessground/config'
import type { Key } from 'chessground/types'
import type { DrawShape } from 'chessground/draw'

// Inline hex colors for arrow brushes. OKLch strings are not reliably parsed
// by the canvas 2D API that chessground uses internally, so we hardcode hex.
// Light theme best-move green; works acceptably in dark theme too.
const BRUSH_BEST = '#2D7A4F'
// Threat/danger red for both themes.
const BRUSH_THREAT = '#B83A3A'

type Promotion = 'q' | 'r' | 'b' | 'n'

interface BoardProps {
  fen: string
  orientation: 'white' | 'black'
  turn: 'w' | 'b'
  userColor: 'white' | 'black' | null
  dests: Map<string, string[]>
  lastMove?: [string, string] | null
  inCheck?: boolean
  onUserMove: (from: string, to: string, promotion?: Promotion) => void
  allowPremoves?: boolean
  onPremoveSet?: (orig: string, dest: string) => void
  onPremoveUnset?: () => void
  premoveFailSquare?: string | null
  /** Arrow shapes to overlay on the board (best-move, threat, etc.). */
  shapes?: DrawShape[]
}

function turnToColor(turn: 'w' | 'b'): 'white' | 'black' {
  return turn === 'w' ? 'white' : 'black'
}

function movableColor(
  userColor: BoardProps['userColor'],
  turn: 'w' | 'b',
): 'white' | 'black' | 'both' | undefined {
  if (userColor === null) return 'both'
  // Only allow drags when it's the user's turn.
  return userColor === turnToColor(turn) ? userColor : undefined
}

/** Map a square like "e4" to { file: 0..7, rank: 0..7 } (0-indexed from a/1). */
function squareToCoords(square: string): { file: number; rank: number } | null {
  if (square.length !== 2) return null
  const file = square.charCodeAt(0) - 'a'.charCodeAt(0)
  const rank = parseInt(square[1], 10) - 1
  if (file < 0 || file > 7 || rank < 0 || rank > 7) return null
  return { file, rank }
}

export function Board({
  fen,
  orientation,
  turn,
  userColor,
  dests,
  lastMove,
  inCheck,
  onUserMove,
  allowPremoves,
  onPremoveSet,
  onPremoveUnset,
  premoveFailSquare,
  shapes,
}: BoardProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const apiRef = useRef<Api | null>(null)
  const onUserMoveRef = useRef(onUserMove)
  const onPremoveSetRef = useRef(onPremoveSet)
  const onPremoveUnsetRef = useRef(onPremoveUnset)

  // Keep latest callbacks in refs so the mount effect can use a stable closure.
  useEffect(() => {
    onUserMoveRef.current = onUserMove
  }, [onUserMove])

  useEffect(() => {
    onPremoveSetRef.current = onPremoveSet
  }, [onPremoveSet])

  useEffect(() => {
    onPremoveUnsetRef.current = onPremoveUnset
  }, [onPremoveUnset])

  // Mount + destroy.
  useEffect(() => {
    if (!wrapRef.current) return
    const initial: Config = {
      fen,
      orientation,
      turnColor: turnToColor(turn),
      lastMove: lastMove ? (lastMove as Key[]) : undefined,
      check: inCheck ? turnToColor(turn) : false,
      coordinates: true,
      highlight: { lastMove: true, check: true },
      animation: { enabled: true, duration: 200 },
      draggable: {
        enabled: true,
        showGhost: true,
        deleteOnDropOff: false,
        distance: 5,
      },
      selectable: { enabled: true },
      premovable: {
        enabled: !!allowPremoves && userColor !== null,
        showDests: true,
        castle: true,
        events: {
          set: (orig, dest) => onPremoveSetRef.current?.(orig as string, dest as string),
          unset: () => onPremoveUnsetRef.current?.(),
        },
      },
      movable: {
        free: false,
        color: movableColor(userColor, turn),
        dests: dests as Map<Key, Key[]>,
        showDests: true,
        events: {
          after: (orig, dest) => {
            onUserMoveRef.current(orig, dest)
          },
        },
      },
      drawable: {
        enabled: true,
        visible: true,
        defaultSnapToValidMove: false,
        brushes: {
          green: { key: 'g', color: '#15781B', opacity: 1, lineWidth: 10 },
          red: { key: 'r', color: '#882020', opacity: 1, lineWidth: 10 },
          blue: { key: 'b', color: '#003088', opacity: 1, lineWidth: 10 },
          yellow: { key: 'y', color: '#e68f00', opacity: 1, lineWidth: 10 },
          'cc-best': { key: 'cb', color: BRUSH_BEST, opacity: 1, lineWidth: 12 },
          'cc-threat': { key: 'ct', color: BRUSH_THREAT, opacity: 0.7, lineWidth: 9 },
        },
        shapes: shapes ?? [],
        autoShapes: [],
      },
    }
    apiRef.current = Chessground(wrapRef.current, initial)

    // ESC cancels in-progress drag and clears any queued premove.
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        apiRef.current?.cancelMove()
        onPremoveUnsetRef.current?.()
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      apiRef.current?.destroy()
      apiRef.current = null
    }
    // Mount-only — subsequent updates handled by the sync effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync chessground with the latest props.
  useEffect(() => {
    const api = apiRef.current
    if (!api) return
    api.set({
      fen,
      orientation,
      turnColor: turnToColor(turn),
      lastMove: lastMove ? (lastMove as Key[]) : undefined,
      check: inCheck ? turnToColor(turn) : false,
      draggable: {
        enabled: true,
        showGhost: true,
        deleteOnDropOff: false,
        distance: 5,
      },
      selectable: { enabled: true },
      premovable: {
        enabled: !!allowPremoves && userColor !== null,
        showDests: true,
        castle: true,
        events: {
          set: (orig, dest) => onPremoveSetRef.current?.(orig as string, dest as string),
          unset: () => onPremoveUnsetRef.current?.(),
        },
      },
      movable: {
        free: false,
        color: movableColor(userColor, turn),
        dests: dests as Map<Key, Key[]>,
        showDests: true,
        events: {
          after: (orig, dest) => {
            onUserMoveRef.current(orig, dest)
          },
        },
      },
      drawable: {
        enabled: true,
        visible: true,
        defaultSnapToValidMove: false,
        brushes: {
          green: { key: 'g', color: '#15781B', opacity: 1, lineWidth: 10 },
          red: { key: 'r', color: '#882020', opacity: 1, lineWidth: 10 },
          blue: { key: 'b', color: '#003088', opacity: 1, lineWidth: 10 },
          yellow: { key: 'y', color: '#e68f00', opacity: 1, lineWidth: 10 },
          'cc-best': { key: 'cb', color: BRUSH_BEST, opacity: 1, lineWidth: 12 },
          'cc-threat': { key: 'ct', color: BRUSH_THREAT, opacity: 0.7, lineWidth: 9 },
        },
        shapes: shapes ?? [],
        autoShapes: [],
      },
    })
  }, [fen, orientation, turn, userColor, dests, lastMove, inCheck, allowPremoves, shapes])

  // Compute fail-square overlay position (12.5% of board per square).
  let failOverlayStyle: CSSProperties | null = null
  if (premoveFailSquare) {
    const coords = squareToCoords(premoveFailSquare)
    if (coords) {
      const { file, rank } = coords
      // White orientation: a-file is left (0%), rank 1 is bottom (87.5%).
      // Black orientation: a-file is right (87.5%), rank 1 is top (0%).
      const leftPct =
        orientation === 'white' ? file * 12.5 : (7 - file) * 12.5
      const topPct =
        orientation === 'white' ? (7 - rank) * 12.5 : rank * 12.5
      failOverlayStyle = {
        position: 'absolute',
        left: `${leftPct}%`,
        top: `${topPct}%`,
        width: '12.5%',
        height: '12.5%',
        backgroundColor: 'var(--destructive)',
        opacity: 0.35,
        borderRadius: '4px',
        pointerEvents: 'none',
      }
    }
  }

  return (
    // TODO(phase-6-touch): long-press to show attacks
    <div style={{ position: 'relative', width: 560, height: 560 }}>
      <div
        ref={wrapRef}
        className="cg-wrap"
        style={{ width: 560, height: 560 }}
      />
      {failOverlayStyle && <div style={failOverlayStyle} aria-hidden="true" />}
    </div>
  )
}
