import type { Move } from 'chess.js'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export interface RightSidebarProps {
  /** Verbose chess.js history (Move[]). */
  history: Move[]
  /** Centipawn eval from White's POV (already sign-corrected if needed). null = unknown. */
  evalCpWhitePov: number | null
  /** Set when a mate is pending. Positive = White mates in N, negative = Black mates in N. */
  mateIn?: number | null
  /** Highlight which ply index is selected. -1 or null = none. */
  activePly?: number | null
}

/** Convert centipawn evaluation to White's share (0..1) using a logistic. */
function evalToWhiteShare(cp: number | null, mateIn?: number | null): number {
  if (mateIn != null) return mateIn > 0 ? 1 : 0
  if (cp == null) return 0.5
  return 1 / (1 + Math.pow(10, -cp / 400))
}

/** Pretty-print the eval as `+0.32`, `-1.40`, or `M3` / `-M3`. */
function formatEval(cp: number | null, mateIn?: number | null): string {
  if (mateIn != null) {
    if (mateIn === 0) return 'M'
    return mateIn > 0 ? `M${mateIn}` : `-M${Math.abs(mateIn)}`
  }
  if (cp == null) return '—'
  const pawns = cp / 100
  const sign = pawns > 0 ? '+' : pawns < 0 ? '−' : ''
  return `${sign}${Math.abs(pawns).toFixed(2)}`
}

interface MovePair {
  number: number
  whitePly: number | null
  white: Move | null
  blackPly: number | null
  black: Move | null
}

function pairHistory(history: Move[]): MovePair[] {
  const pairs: MovePair[] = []
  for (let i = 0; i < history.length; i += 2) {
    const whiteMove = history[i] ?? null
    const blackMove = history[i + 1] ?? null
    pairs.push({
      number: Math.floor(i / 2) + 1,
      whitePly: whiteMove ? i : null,
      white: whiteMove,
      blackPly: blackMove ? i + 1 : null,
      black: blackMove,
    })
  }
  return pairs
}

export function RightSidebar({
  history,
  evalCpWhitePov,
  mateIn = null,
  activePly = null,
}: RightSidebarProps) {
  const share = evalToWhiteShare(evalCpWhitePov, mateIn)
  const whitePct = Math.max(0, Math.min(1, share)) * 100
  const evalLabel = formatEval(evalCpWhitePov, mateIn)
  const evalFavorsWhite =
    mateIn != null ? mateIn > 0 : (evalCpWhitePov ?? 0) >= 0
  const pairs = pairHistory(history)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base tracking-tight">Game</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <section className="space-y-2">
          <div className="flex items-center justify-between text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-neutral-500">
            <span>Evaluation</span>
            <span
              className={cn(
                'font-mono text-sm tabular-nums',
                evalFavorsWhite ? 'text-neutral-900' : 'text-neutral-500',
              )}
            >
              {evalLabel}
            </span>
          </div>
          <div
            className="relative h-3 overflow-hidden rounded-full bg-neutral-900 ring-1 ring-inset ring-black/10"
            role="meter"
            aria-label="Position evaluation, White's share"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(whitePct)}
          >
            <div
              className="absolute inset-y-0 right-0 bg-white"
              style={{ width: `${whitePct}%` }}
            />
            <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px bg-neutral-400/40" />
          </div>
        </section>

        <Separator />

        <section className="space-y-2">
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-neutral-500">
            Moves
          </span>
          <ScrollArea className="h-[480px] rounded-md border border-neutral-100">
            {pairs.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-neutral-400">
                Make a move to start.
              </p>
            ) : (
              <ol className="divide-y divide-neutral-100">
                {pairs.map((pair) => (
                  <li
                    key={pair.number}
                    className="grid grid-cols-[2.25rem_1fr_1fr] items-center gap-1 px-3 py-1.5 font-mono text-sm"
                  >
                    <span className="text-xs font-medium text-neutral-400 tabular-nums">
                      {pair.number}.
                    </span>
                    <PlyCell
                      move={pair.white}
                      ply={pair.whitePly}
                      activePly={activePly}
                    />
                    <PlyCell
                      move={pair.black}
                      ply={pair.blackPly}
                      activePly={activePly}
                    />
                  </li>
                ))}
              </ol>
            )}
          </ScrollArea>
        </section>
      </CardContent>
    </Card>
  )
}

interface PlyCellProps {
  move: Move | null
  ply: number | null
  activePly: number | null
}

function PlyCell({ move, ply, activePly }: PlyCellProps) {
  if (move == null || ply == null) {
    return <span className="text-neutral-300">·</span>
  }
  const isActive = activePly === ply
  return (
    <button
      type="button"
      className={cn(
        'rounded px-1.5 py-0.5 text-left transition-colors',
        isActive
          ? 'bg-neutral-900 text-white'
          : 'text-neutral-800 hover:bg-neutral-100',
      )}
      data-ply={ply}
    >
      {move.san}
    </button>
  )
}
