import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const STORAGE_KEY = 'cc.seenEngineScope.v1'

function readSeen(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return true
  }
}

function persistSeen(): void {
  try {
    localStorage.setItem(STORAGE_KEY, '1')
  } catch {
    /* ignore quota/availability errors */
  }
}

export function EngineScopeCard() {
  const [dismissed, setDismissed] = useState(readSeen)
  if (dismissed) return null

  const dismiss = (): void => {
    persistSeen()
    setDismissed(true)
  }

  return (
    <Card className="mb-4 border-primary/40 bg-accent/40">
      <CardContent className="space-y-3 py-4 text-sm">
        <p className="font-medium text-foreground">About this trainer</p>
        <p className="text-muted-foreground">
          This trainer uses <strong>Maia</strong> &mdash; a neural network trained on real
          human games &mdash; for ratings <strong>1100&ndash;1900</strong>, and{' '}
          <strong>Stockfish</strong> for stronger ratings.
        </p>
        <p className="text-muted-foreground">
          <strong>Below 1100?</strong> Use{' '}
          <a
            href="https://lichess.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2"
          >
            Lichess.org
          </a>{' '}
          for matched beginner play &mdash; they have bots and humans at every rating. Come
          back here when you&rsquo;re consistently winning games at your rated level.
        </p>
        <div className="flex justify-end">
          <Button type="button" size="sm" onClick={dismiss}>
            Got it
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
