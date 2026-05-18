import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface RatingHelpModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RatingHelpModal({ open, onOpenChange }: RatingHelpModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Finding your rating</DialogTitle>
          <DialogDescription>
            How to pick a fair Elo for the bot.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            If you already have a rating on <strong>Chess.com</strong> or{' '}
            <strong>Lichess</strong>, use that.
          </p>
          <p>If not, start at <strong>1100</strong> and adjust based on results:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              If you <strong>win more than 50%</strong> of games, increase by{' '}
              <strong>100</strong>.
            </li>
            <li>
              If you <strong>lose more than 70%</strong> of games, decrease by{' '}
              <strong>50</strong>.
            </li>
          </ul>
          <p>
            The slider should land where you win roughly <strong>30&ndash;40%</strong> of
            games against the bot.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
