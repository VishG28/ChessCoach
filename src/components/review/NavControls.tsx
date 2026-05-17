import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Play,
  Pause,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NavControlsProps {
  totalPlies: number
  selectedPly: number
  autoplaying: boolean
  onFirst: () => void
  onPrev: () => void
  onNext: () => void
  onLast: () => void
  onToggleAutoplay: () => void
}

export function NavControls({
  totalPlies,
  selectedPly,
  autoplaying,
  onFirst,
  onPrev,
  onNext,
  onLast,
  onToggleAutoplay,
}: NavControlsProps) {
  return (
    <div className="flex items-center gap-1 justify-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={onFirst}
        disabled={selectedPly === 0}
        title="First move"
      >
        <ChevronsLeft className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrev}
        disabled={selectedPly === 0}
        title="Previous move"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleAutoplay}
        title={autoplaying ? 'Pause autoplay' : 'Autoplay'}
      >
        {autoplaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onNext}
        disabled={selectedPly === totalPlies}
        title="Next move"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onLast}
        disabled={selectedPly === totalPlies}
        title="Last move"
      >
        <ChevronsRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
