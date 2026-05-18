// src/components/coaching/TellMoreButton.tsx
import { useState, useEffect } from 'react'

interface TellMoreButtonProps {
  visibleAfterMs?: number
  onClick: () => void
  disabled?: boolean
}

/**
 * "Tell me more" affordance that appears after a short delay so it doesn't
 * compete with the brief message's own fade-in. Renders nothing until the
 * timer fires. Consumed by CoachPanel after a brief deep-coach message
 * finishes streaming.
 */
export function TellMoreButton({ visibleAfterMs = 1000, onClick, disabled }: TellMoreButtonProps) {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setShown(true), visibleAfterMs)
    return () => clearTimeout(t)
  }, [visibleAfterMs])
  if (!shown) return null
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mt-2 text-xs text-primary underline-offset-2 hover:underline"
    >
      Tell me more
    </button>
  )
}
