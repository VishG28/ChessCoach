import { Button } from '@/components/ui/button'
import type { ExplainSource } from '@/coaching/useExplain'

interface ExplainBoxProps {
  text: string | null
  source: ExplainSource | null
  loading: boolean
  error: string | null
  onRegenerate: () => void
}

const SOURCE_LABEL: Record<ExplainSource, string> = {
  cache: 'cached',
  llm: 'Claude',
  rule: 'rule-based',
}

export function ExplainBox({ text, source, loading, error, onRegenerate }: ExplainBoxProps) {
  if (loading) {
    return (
      <div className="space-y-1.5">
        <div className="h-3 w-3/4 rounded bg-muted animate-pulse" />
        <div className="h-3 w-5/6 rounded bg-muted animate-pulse" />
        <div className="h-3 w-2/3 rounded bg-muted animate-pulse" />
        <div className="text-[0.65rem] uppercase tracking-wider text-muted-foreground mt-1">Coaching…</div>
      </div>
    )
  }
  if (!text) {
    if (error) return <p className="text-xs text-red-600">{error}</p>
    return null
  }
  return (
    <div className="space-y-2">
      <p className="text-sm leading-snug">{text}</p>
      <div className="flex items-center gap-2 text-[0.65rem]">
        {source && (
          <span className="rounded-full border border-border bg-muted px-2 py-0.5 font-semibold uppercase tracking-wider text-muted-foreground">
            {SOURCE_LABEL[source]}
          </span>
        )}
        {(source === 'llm' || source === 'cache') && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-[0.7rem]"
            onClick={onRegenerate}
          >
            Regenerate
          </Button>
        )}
        {source === 'rule' && error && (
          <span className="text-[0.65rem] text-amber-600">
            used rule-based fallback ({truncate(error, 60)})
          </span>
        )}
      </div>
    </div>
  )
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n) + '…' : s
}
