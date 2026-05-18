// src/components/coaching/CoachMessage.tsx
import type { ComponentProps } from 'react'
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
  /** Flags indicating which arrow types are currently visible on the board. */
  flags?: { hasBestArrow?: boolean; hasThreatArrow?: boolean }
}

function decorate(content: string, flags?: Props['flags']): string {
  if (!flags) return content
  return content
    .split('\n')
    .map((line) => {
      if (flags.hasBestArrow && /^- \*\*Candidate/i.test(line)) {
        return line.replace(/^- /, '- ↗ ')
      }
      if (flags.hasThreatArrow && /threat|attack|hanging/i.test(line) && line.startsWith('- ')) {
        return line.replace(/^- /, '- ⚠ ')
      }
      return line
    })
    .join('\n')
}

const QUIET_LENGTH_THRESHOLD = 80

function isQuiet(content: string): boolean {
  if (content.trim().startsWith('- Position is quiet')) return true
  const isList = content.trim().startsWith('-')
  if (!isList && content.trim().length > 0 && content.length < QUIET_LENGTH_THRESHOLD) return true
  return false
}

const mdComponents: ComponentProps<typeof ReactMarkdown>['components'] = {
  ul: (props) => <ul {...props} className="pl-4 my-0 space-y-1 list-disc" />,
  ol: (props) => <ol {...props} className="pl-4 my-0 space-y-1 list-decimal" />,
  li: (props) => <li {...props} className="leading-snug text-sm" />,
  strong: (props) => (
    <strong {...props} className="font-semibold" style={{ color: 'var(--primary)' }} />
  ),
  p: (props) => <p {...props} className="my-0" />,
}

export function CoachMessage({ message, flags }: Props) {
  const decoratedContent = decorate(message.content, flags)
  const accent =
    message.depth === 'critical'
      ? 'border-l-4 border-red-500'
      : message.depth === 'detail'
        ? 'border-l-4 border-amber-500'
        : 'border-l-4 border-emerald-500'

  const quiet = !message.streaming && isQuiet(decoratedContent)
  const bodyClass = quiet
    ? 'italic text-muted-foreground text-sm leading-relaxed'
    : 'text-left text-base leading-relaxed prose prose-sm dark:prose-invert max-w-none'

  const isList = decoratedContent.trim().startsWith('-')

  const md = (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
      {decoratedContent || '…'}
    </ReactMarkdown>
  )

  return (
    <Card className={`${accent} bg-card`}>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {DEPTH_GLYPH[message.depth]} {message.style}{' '}
            <span className="ml-2 capitalize">{message.trigger.replace('_', ' ')}</span>
          </span>
        </div>
        <div className={`${bodyClass} max-h-[260px] overflow-y-auto`}>
          {message.streaming ? (
            // Mid-stream: render markdown (not raw text) so bullets form incrementally.
            quiet ? (
              <span>{decoratedContent || '…'}</span>
            ) : (
              md
            )
          ) : quiet ? (
            <span className="italic">{decoratedContent}</span>
          ) : isList ? (
            // Bullet list — skip SentenceFade, render markdown directly.
            md
          ) : (
            <SentenceFade content={decoratedContent} />
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
