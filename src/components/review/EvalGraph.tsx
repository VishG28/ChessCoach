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

type DotClass = 'good' | 'inaccuracy' | 'mistake' | 'blunder' | 'mate'

function dotColor(cls: DotClass): string {
  switch (cls) {
    case 'good': return '#10b981'
    case 'inaccuracy': return '#f59e0b'
    case 'mistake': return '#f97316'
    case 'blunder': return '#ef4444'
    case 'mate': return '#f59e0b'
    default: return '#71717a'
  }
}

function classifyLoss(cpLoss: number | undefined, isMate: boolean): DotClass {
  if (isMate) return 'mate'
  if (cpLoss === undefined) return 'good'
  if (cpLoss > 150) return 'blunder'
  if (cpLoss > 100) return 'mistake'
  if (cpLoss > 50) return 'inaccuracy'
  return 'good'
}

interface DataPoint {
  ply: number
  label: string
  cp: number
  isMate?: boolean
  dotClass: DotClass
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyChartClickEvent = any

export function EvalGraph({ moves, selectedPly, onSelectPly }: EvalGraphProps) {
  const data: DataPoint[] = [{ ply: 0, label: 'Start', cp: 0, dotClass: 'good' }]

  for (const m of moves) {
    if (m.engine_eval_after !== undefined) {
      const rawCp = m.side === 'w' ? -m.engine_eval_after.cp : m.engine_eval_after.cp
      const isMate = Math.abs(rawCp) >= 99000
      data.push({
        ply: m.ply,
        label: `${Math.ceil(m.ply / 2)}${m.side === 'w' ? '.' : '…'} ${m.san}`,
        cp: clampCp(rawCp),
        isMate,
        dotClass: classifyLoss(m.centipawn_loss, isMate),
      })
    } else {
      data.push({ ply: m.ply, label: m.san, cp: 0, dotClass: 'good' })
    }
  }

  if (data.length <= 1) {
    return (
      <div className="h-28 flex items-center justify-center text-sm text-muted-foreground italic">
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderDot = (props: any) => {
    const { cx, cy, payload } = props as { cx: number; cy: number; payload: DataPoint }
    const cls = (payload.dotClass ?? 'good') as DotClass
    const fill = dotColor(cls)
    const r = cls === 'good' ? 2 : 4
    return (
      <circle
        key={`dot-${payload.ply}`}
        cx={cx}
        cy={cy}
        r={r}
        fill={fill}
        stroke={cls === 'good' ? undefined : 'white'}
        strokeWidth={cls === 'good' ? 0 : 1}
      />
    )
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
          <ReferenceLine y={0} stroke="var(--border)" strokeDasharray="3 3" />
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
            dot={renderDot}
            activeDot={{ r: 4, fill: '#3f3f46' }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
