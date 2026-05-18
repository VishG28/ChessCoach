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
    <Card className="fixed bottom-4 right-4 z-50 w-80 p-3 font-mono text-xs bg-card text-card-foreground border-border shadow-xl">
      <div className="font-semibold mb-2">Engine Debug (press ` to close)</div>
      <div>Elo (slider): {elo}</div>
      <div>Skill Level: {state.skill}</div>
      <div>Depth: {state.depth}</div>
      <div>Movetime: {state.movetime}ms</div>
      <div>MultiPV: {state.multipv}</div>
      <div>Randomness: {(state.randomness * 100).toFixed(0)}%</div>
      <Separator className="my-2 bg-border" />
      <div className="font-semibold mb-1">Last 5 engine moves</div>
      {state.recentMoves.length === 0 ? (
        <div className="text-muted-foreground">(none yet)</div>
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
                    : 'text-muted-foreground'
          return (
            <div key={i} className="flex justify-between gap-2">
              <span>
                {m.san ?? m.uci}{' '}
                <span className="text-muted-foreground">
                  {cpStr}
                  {bestStr}
                </span>
              </span>
              <span className={tagClass}>{tag}</span>
            </div>
          )
        })
      )}
      {state.lastAnalysis && state.lastAnalysis.length > 0 && (
        <div className="mt-2 border-t border-border pt-2">
          <div className="text-xs font-medium mb-1">Top MultiPV candidates</div>
          <table className="text-xs w-full">
            <thead>
              <tr className="text-muted-foreground">
                <th className="text-left">#</th>
                <th className="text-left">UCI</th>
                <th className="text-right">cp</th>
                <th className="text-left">PV (first 4)</th>
              </tr>
            </thead>
            <tbody>
              {state.lastAnalysis.slice(0, 5).map((c, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td className="font-mono">{c.move}</td>
                  <td className="text-right">{c.cp}</td>
                  <td className="font-mono">{c.pv.slice(0, 4).join(' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {state.lastOpponentSource && (
        <div className="mt-1 text-xs">
          Last opponent move source:{' '}
          <span className="font-mono">{state.lastOpponentSource}</span>
        </div>
      )}
      <Separator className="my-2 bg-border" />
      <div className="font-semibold mb-1">Recent UCI commands</div>
      <div className="text-muted-foreground max-h-24 overflow-auto whitespace-pre-wrap">
        {state.lastCommands.slice(-8).join('\n')}
      </div>
    </Card>
  )
}
