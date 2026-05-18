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
import type { MoveSource } from '@/games/types'
import { evalToWhiteShare, formatEval } from '@/lib/evalShare'

export interface MoveSourceInfo {
  source: MoveSource
  bookWeight?: number
}

export interface RightSidebarProps {
  /** Verbose chess.js history (Move[]). */
  history: Move[]
  /** Centipawn eval from White's POV (already sign-corrected if needed). null = unknown. */
  evalCpWhitePov: number | null
  /** Set when a mate is pending. Positive = White mates in N, negative = Black mates in N. */
  mateIn?: number | null
  /** Highlight which ply index is selected. -1 or null = none. */
  activePly?: number | null
  /**
   * Optional per-move provenance keyed by 0-based ply index (matches the index
   * into `history`). When `source === 'book'` a 📖 badge is rendered.
   */
  moveSources?: ReadonlyMap<number, MoveSourceInfo>
  /**
   * Optional click handler for the move list. Receives the 0-based ply index
   * into `history` for the move that was clicked. When omitted, plies render
   * as non-interactive labels.
   */
  onSelectPly?: (ply: number) => void
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
  moveSources,
  onSelectPly,
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
          <div className="flex items-center justify-between text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            <span>Evaluation</span>
            <span
              className={cn(
                'font-mono text-sm tabular-nums',
                evalFavorsWhite ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {evalLabel}
            </span>
          </div>
          <div
            className="relative h-5 overflow-hidden rounded-md ring-1 ring-inset ring-black/15"
            style={{ backgroundColor: 'var(--cc-board-dark)' }}
            role="meter"
            aria-label="Position evaluation, White's share"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(whitePct)}
          >
            <div
              className="absolute inset-y-0 left-0 transition-[width] duration-300 ease-out"
              style={{
                width: `${whitePct}%`,
                backgroundColor: 'var(--cc-board-light)',
              }}
            />
            <div
              className="pointer-events-none absolute top-0 h-full w-px"
              style={{ left: '50%', backgroundColor: 'rgba(0,0,0,0.25)' }}
            />
            <span
              className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-[0.7rem] font-semibold tabular-nums text-foreground mix-blend-difference"
              aria-hidden="true"
            >
              {evalLabel}
            </span>
          </div>
        </section>

        <Separator />

        <section className="space-y-2">
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Moves
          </span>
          <ScrollArea className="h-[480px] rounded-md border border-border">
            {pairs.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                Make a move to start.
              </p>
            ) : (
              <ol className="divide-y divide-border">
                {pairs.map((pair) => (
                  <li
                    key={pair.number}
                    className="grid grid-cols-[2.25rem_1fr_1fr] items-center gap-1 px-3 py-1.5 font-mono text-sm"
                  >
                    <span className="text-xs font-medium text-muted-foreground tabular-nums">
                      {pair.number}.
                    </span>
                    <PlyCell
                      move={pair.white}
                      ply={pair.whitePly}
                      activePly={activePly}
                      sourceInfo={
                        pair.whitePly != null ? moveSources?.get(pair.whitePly) : undefined
                      }
                      onSelectPly={onSelectPly}
                    />
                    <PlyCell
                      move={pair.black}
                      ply={pair.blackPly}
                      activePly={activePly}
                      sourceInfo={
                        pair.blackPly != null ? moveSources?.get(pair.blackPly) : undefined
                      }
                      onSelectPly={onSelectPly}
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
  sourceInfo?: MoveSourceInfo
  onSelectPly?: (ply: number) => void
}

function PlyCell({ move, ply, activePly, sourceInfo, onSelectPly }: PlyCellProps) {
  if (move == null || ply == null) {
    return <span className="text-muted-foreground">·</span>
  }
  const isActive = activePly === ply
  const isBook = sourceInfo?.source === 'book'
  const interactive = Boolean(onSelectPly)
  return (
    <button
      type="button"
      className={cn(
        'rounded px-1.5 py-0.5 text-left transition-colors',
        isActive
          ? 'bg-foreground text-background'
          : 'text-foreground hover:bg-muted',
        interactive ? 'cursor-pointer' : 'cursor-default',
      )}
      data-ply={ply}
      aria-current={isActive ? 'true' : undefined}
      onClick={onSelectPly ? () => onSelectPly(ply) : undefined}
    >
      {move.san}
      {isBook && (
        <span
          title={`Lichess database, ${Math.round((sourceInfo?.bookWeight ?? 0) * 100)}% frequency`}
          className="ml-1 text-xs"
          aria-label="book move"
        >
          📖
        </span>
      )}
    </button>
  )
}
