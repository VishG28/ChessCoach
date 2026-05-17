// src/components/nav/SessionCost.tsx
import { useCostCounter } from '@/coaching/costCounter'

export function SessionCost() {
  const { usd } = useCostCounter()
  if (usd <= 0) return null
  return (
    <span
      className="font-mono text-xs text-muted-foreground rounded-md border px-2 py-1"
      title="Anthropic API spend this tab. Resets on tab close."
    >
      Session: ${usd.toFixed(2)}
    </span>
  )
}
