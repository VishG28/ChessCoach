import { useEffect, useRef } from 'react'
import { Chessground } from 'chessground'
import type { Api } from 'chessground/api'
import type { Key } from 'chessground/types'

interface ReviewBoardProps {
  fen: string
  orientation: 'white' | 'black'
  lastMove?: [string, string] | null
}

export function ReviewBoard({ fen, orientation, lastMove }: ReviewBoardProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const apiRef = useRef<Api | null>(null)

  // Mount + destroy
  useEffect(() => {
    if (!wrapRef.current) return
    apiRef.current = Chessground(wrapRef.current, {
      fen,
      orientation,
      lastMove: lastMove ? (lastMove as Key[]) : undefined,
      viewOnly: true,
      coordinates: true,
      highlight: { lastMove: true, check: false },
      animation: { enabled: true, duration: 200 },
      movable: { free: false, color: undefined },
    })
    return () => {
      apiRef.current?.destroy()
      apiRef.current = null
    }
    // Mount only — updates handled below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync position
  useEffect(() => {
    const api = apiRef.current
    if (!api) return
    api.set({
      fen,
      orientation,
      lastMove: lastMove ? (lastMove as Key[]) : undefined,
    })
  }, [fen, orientation, lastMove])

  return (
    <div className="cc-board-square cc-board-square--review" style={{ position: 'relative' }}>
      <div
        ref={wrapRef}
        className="cg-wrap"
      />
    </div>
  )
}
