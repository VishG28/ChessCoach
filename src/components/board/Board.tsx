import { useEffect, useRef } from 'react'
import { Chessground } from 'chessground'
import type { Api } from 'chessground/api'
import type { Config } from 'chessground/config'
import type { Key } from 'chessground/types'

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

export function Board({
  fen,
  orientation,
  turn,
  userColor,
  dests,
  lastMove,
  inCheck,
  onUserMove,
}: BoardProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const apiRef = useRef<Api | null>(null)
  const onUserMoveRef = useRef(onUserMove)

  // Keep the latest callback in a ref so the mount effect can use a stable closure.
  useEffect(() => {
    onUserMoveRef.current = onUserMove
  }, [onUserMove])

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
      draggable: { enabled: true, showGhost: true },
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
    }
    apiRef.current = Chessground(wrapRef.current, initial)
    return () => {
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
    })
  }, [fen, orientation, turn, userColor, dests, lastMove, inCheck])

  return (
    <div
      ref={wrapRef}
      className="cg-wrap"
      style={{ width: 560, height: 560 }}
    />
  )
}
