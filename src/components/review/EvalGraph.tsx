import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { MoveEntry } from '@/games/types'

interface EvalGraphProps {
  moves: MoveEntry[]
  selectedPly: number
  onSelectPly: (ply: number) => void
}

const CLAMP = 1000

function clampCp(cp: number): number {
  return Math.max(-CLAMP, Math.min(CLAMP, cp))
}

interface DataPoint {
  ply: number
  label: string
  cp: number
  isMate?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyChartClickEvent = any

export function EvalGraph({ moves, selectedPly, onSelectPly }: EvalGraphProps) {
  // Build data: ply 0 = starting position (cp 0), then each move's eval_after from white POV
  const data: DataPoint[] = [{ ply: 0, label: 'Start', cp: 0 }]

  for (const m of moves) {
    if (m.engine_eval_after !== undefined) {
      // eval_after.cp is from side-to-move POV after the move.
      // After a white move, black is to move; cp is from black's POV — negate for white POV.
      // After a black move, white is to move; cp is from white's POV — already white POV.
      const rawCp = m.side === 'w' ? -m.engine_eval_after.cp : m.engine_eval_after.cp
      const isMate = Math.abs(rawCp) >= 99000
      data.push({
        ply: m.ply,
        label: `${Math.ceil(m.ply / 2)}${m.side === 'w' ? '.' : '…'} ${m.san}`,
        cp: clampCp(rawCp),
        isMate,
      })
    } else {
      data.push({ ply: m.ply, label: m.san, cp: 0 })
    }
  }

  if (data.length <= 1) {
    return (
      <div className="h-28 flex items-center justify-center text-sm text-zinc-400 italic">
        No evaluation data yet.
      </div>
    )
  }

  const handleClick = (e: AnyChartClickEvent) => {
    if (e?.activePayload?.[0]) {
      const point = e.activePayload[0].payload as DataPoint
      onSelectPly(point.ply)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tooltipFormatter = (value: unknown, _name: unknown, props: any): [string, string] => {
    const numValue = typeof value === 'number' ? value : 0
    const isMate = (props?.payload as DataPoint | undefined)?.isMate
    const display = isMate ? 'M' : `${numValue > 0 ? '+' : ''}${numValue}`
    return [display, 'Eval']
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const labelFormatter = (_label: unknown, payload?: readonly any[]): string => {
    const point = payload?.[0]?.payload as DataPoint | undefined
    return point?.label ?? `Ply ${String(_label)}`
  }

  return (
    <div className="h-28 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          onClick={handleClick}
          style={{ cursor: 'pointer' }}
        >
          <XAxis dataKey="ply" hide />
          <YAxis domain={[-CLAMP, CLAMP]} hide />
          <Tooltip
            formatter={tooltipFormatter}
            labelFormatter={labelFormatter}
          />
          <ReferenceLine y={0} stroke="#d4d4d8" strokeDasharray="3 3" />
          <ReferenceLine
            x={selectedPly}
            stroke="#3f3f46"
            strokeWidth={2}
            strokeDasharray="4 2"
          />
          <Line
            type="monotone"
            dataKey="cp"
            stroke="#52525b"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#3f3f46' }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
