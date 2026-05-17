// src/components/coaching/CoachMessage.tsx
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { LiveCoachMessage } from '@/coaching/useDeepCoach'

const DEPTH_GLYPH = { quick: '🟢', detail: '🟡', critical: '🔴' } as const

interface Props {
  message: LiveCoachMessage
  onTellMore: () => void
  onQuieter: () => void
}

export function CoachMessage({ message, onTellMore, onQuieter }: Props) {
  const accent =
    message.depth === 'critical'
      ? 'border-l-4 border-red-500'
      : message.depth === 'detail'
        ? 'border-l-4 border-amber-500'
        : 'border-l-4 border-emerald-500'
  return (
    <Card className={`${accent} bg-card`}>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {DEPTH_GLYPH[message.depth]} {message.style}{' '}
            <span className="ml-2 capitalize">{message.trigger.replace('_', ' ')}</span>
          </span>
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content || '…'}</ReactMarkdown>
          {message.streaming && <span className="inline-block w-2 h-4 bg-current animate-pulse align-middle" aria-hidden />}
        </div>
        {!message.streaming && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onTellMore}>Tell me more</Button>
            <Button size="sm" variant="ghost" onClick={onQuieter}>Quieter</Button>
          </div>
        )}
      </div>
    </Card>
  )
}
