import { Flag, Handshake, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BoardActionBarProps {
  onResign?: () => void
  onDraw?: () => void
  onFlip: () => void
}

export function BoardActionBar({ onResign, onDraw, onFlip }: BoardActionBarProps) {
  return (
    <div className="flex items-center gap-1">
      {onResign && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onResign}
          title="Resign"
          aria-label="Resign"
        >
          <Flag className="size-4" />
        </Button>
      )}
      {onDraw && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onDraw}
          title="Offer draw"
          aria-label="Offer draw"
        >
          <Handshake className="size-4" />
        </Button>
      )}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onFlip}
        title="Flip board"
        aria-label="Flip board"
      >
        <RefreshCw className="size-4" />
      </Button>
    </div>
  )
}
