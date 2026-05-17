import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Engine } from '@/engine/engine'
import type { EngineDebugState } from '@/engine/types'

interface DebugOverlayProps {
  engine: Engine
  elo: number
}

export function DebugOverlay({ engine, elo }: DebugOverlayProps) {
  const [state, setState] = useState<EngineDebugState>(() => engine.getDebugState())

  useEffect(() => {
    return engine.onDebug(setState)
  }, [engine])

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 p-3 font-mono text-xs bg-zinc-900/95 text-zinc-100 border-zinc-700 shadow-xl">
      <div className="font-semibold mb-2">Engine Debug (press ` to close)</div>
      <div>Elo (slider): {elo}</div>
      <div>Skill Level: {state.skill}</div>
      <div>Depth: {state.depth}</div>
      <div>Movetime: {state.movetime}ms</div>
      <div>MultiPV: {state.multipv}</div>
      <div>Randomness: {(state.randomness * 100).toFixed(0)}%</div>
      <Separator className="my-2 bg-zinc-700" />
      <div className="font-semibold mb-1">Last 5 engine moves</div>
      {state.recentMoves.length === 0 ? (
        <div className="text-zinc-400">(none yet)</div>
      ) : (
        state.recentMoves.map((m, i) => {
          const cpStr = `${m.cp >= 0 ? '+' : ''}${(m.cp / 100).toFixed(2)}`
          const bestStr =
            m.cpBest !== undefined && m.cpBest !== m.cp
              ? ` (best ${m.cpBest >= 0 ? '+' : ''}${(m.cpBest / 100).toFixed(2)})`
              : ''
          const tag = m.roll ?? '—'
          const tagClass =
            tag === 'random'
              ? 'text-amber-300'
              : tag === 'blunder'
                ? 'text-red-400'
                : tag === 'filtered'
                  ? 'text-sky-300'
                  : tag === 'best'
                    ? 'text-emerald-300'
                    : 'text-zinc-400'
          return (
            <div key={i} className="flex justify-between gap-2">
              <span>
                {m.san ?? m.uci}{' '}
                <span className="text-zinc-400">
                  {cpStr}
                  {bestStr}
                </span>
              </span>
              <span className={tagClass}>{tag}</span>
            </div>
          )
        })
      )}
      <Separator className="my-2 bg-zinc-700" />
      <div className="font-semibold mb-1">Recent UCI commands</div>
      <div className="text-zinc-400 max-h-24 overflow-auto whitespace-pre-wrap">
        {state.lastCommands.slice(-8).join('\n')}
      </div>
    </Card>
  )
}
