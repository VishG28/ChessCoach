// src/components/nav/SessionCost.tsx
import { useCostCounter } from '@/coaching/costCounter'
import { formatUSD } from '@/coaching/cost'

export function SessionCost() {
  const { usd, usdWithoutCache, cacheCreationTokens, cacheReadTokens } = useCostCounter()
  if (usd <= 0) return null
  const saved = Math.max(0, usdWithoutCache - usd)
  const showCacheStats = cacheCreationTokens > 0 || cacheReadTokens > 0
  const tooltip = showCacheStats
    ? `Anthropic API spend this tab. Cache writes ${cacheCreationTokens} · reads ${cacheReadTokens} · saved ${formatUSD(saved)}. Resets on tab close.`
    : 'Anthropic API spend this tab. Resets on tab close.'

  return (
    <span
      className="font-mono text-xs text-muted-foreground rounded-md border px-2 py-1"
      title={tooltip}
    >
      Session: ${usd.toFixed(2)}
      {showCacheStats && (
        <span className="ml-1 text-[10px] opacity-70">
          {' · '}cache reads {cacheReadTokens.toLocaleString()}
          {saved > 0 && <> · saved {formatUSD(saved)}</>}
        </span>
      )}
    </span>
  )
}
