import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MoveNavBarProps {
  /** Total number of plies played in the live game (== game.history.length). */
  totalPlies: number
  /** Currently displayed ply (0 = starting position, totalPlies = live). */
  displayedPly: number
  /** True when the user is reviewing a past position. */
  isReviewing: boolean
  onFirst: () => void
  onPrev: () => void
  onNext: () => void
  onLast: () => void
  onReturnToLive: () => void
}

export function MoveNavBar({
  totalPlies,
  displayedPly,
  isReviewing,
  onFirst,
  onPrev,
  onNext,
  onLast,
  onReturnToLive,
}: MoveNavBarProps) {
  const atStart = displayedPly <= 0
  const atLive = displayedPly >= totalPlies
  const liveMoveNumber = Math.ceil(totalPlies / 2)

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onFirst}
          disabled={atStart}
          aria-label="Go to first move"
          title="First move"
        >
          <ChevronsLeft />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onPrev}
          disabled={atStart}
          aria-label="Previous move"
          title="Previous move"
        >
          <ChevronLeft />
        </Button>
        <span
          className={cn(
            'min-w-[5.5rem] text-center font-mono text-xs tabular-nums',
            isReviewing ? 'text-foreground font-semibold' : 'text-muted-foreground',
          )}
          aria-live="polite"
        >
          {totalPlies === 0
            ? 'No moves yet'
            : `Move ${displayedPly} / ${totalPlies}`}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onNext}
          disabled={atLive}
          aria-label="Next move"
          title="Next move"
        >
          <ChevronRight />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onLast}
          disabled={atLive}
          aria-label="Go to current position"
          title="Latest move"
        >
          <ChevronsRight />
        </Button>
      </div>
      {isReviewing && totalPlies > 0 && (
        <Button
          variant="default"
          size="sm"
          onClick={onReturnToLive}
          aria-label="Return to live position"
          className="mt-1"
        >
          <ArrowLeft />
          Return to Live (after move {liveMoveNumber})
        </Button>
      )}
    </div>
  )
}
