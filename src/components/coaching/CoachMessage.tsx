// src/components/coaching/CoachMessage.tsx
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Card } from '@/components/ui/card'
import type { LiveCoachMessage } from '@/coaching/useDeepCoach'

const DEPTH_GLYPH = { quick: '🟢', detail: '🟡', critical: '🔴' } as const

interface Props {
  message: LiveCoachMessage
  /**
   * @deprecated Action buttons now live in `CoachPanel` (`TellMoreButton`).
   * Accepted for back-compat with `GameReviewPage`; ignored.
   */
  onTellMore?: () => void
  /**
   * @deprecated Quieter is handled at the page level via mode toggle.
   * Accepted for back-compat; ignored.
   */
  onQuieter?: () => void
}

const QUIET_PREFIX = 'Position is roughly equal'
const QUIET_LENGTH_THRESHOLD = 80

function isQuiet(content: string): boolean {
  if (content.startsWith(QUIET_PREFIX)) return true
  if (content.trim().length > 0 && content.length < QUIET_LENGTH_THRESHOLD) return true
  return false
}

export function CoachMessage({ message }: Props) {
  const accent =
    message.depth === 'critical'
      ? 'border-l-4 border-red-500'
      : message.depth === 'detail'
        ? 'border-l-4 border-amber-500'
        : 'border-l-4 border-emerald-500'

  const quiet = !message.streaming && isQuiet(message.content)
  const bodyClass = quiet
    ? 'italic text-muted-foreground text-sm leading-relaxed'
    : 'text-base leading-relaxed prose prose-sm dark:prose-invert max-w-none'

  return (
    <Card className={`${accent} bg-card`}>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {DEPTH_GLYPH[message.depth]} {message.style}{' '}
            <span className="ml-2 capitalize">{message.trigger.replace('_', ' ')}</span>
          </span>
        </div>
        <div className={`${bodyClass} max-h-[120px] overflow-hidden`}>
          {message.streaming ? (
            // Mid-stream: render raw content so it streams character-by-character.
            // No sentence-fade until streaming completes.
            quiet ? (
              <span>{message.content || '…'}</span>
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content || '…'}</ReactMarkdown>
            )
          ) : (
            <SentenceFade content={message.content} />
          )}
        </div>
      </div>
    </Card>
  )
}

interface SentenceFadeProps {
  content: string
}

function SentenceFade({ content }: SentenceFadeProps) {
  const sentences = content
    .split(/(?<=\.) +/)
    .filter((s) => s.trim().length > 0)
  if (sentences.length === 0) {
    return <span>{content || '…'}</span>
  }
  return (
    <>
      {sentences.map((s, i) => (
        <span
          key={i}
          style={{
            animation: 'cc-fade-in 200ms ease-out forwards',
            animationDelay: `${i * 100}ms`,
            opacity: 0,
            display: 'inline',
          }}
        >
          {s}
          {i < sentences.length - 1 ? ' ' : ''}
        </span>
      ))}
    </>
  )
}
