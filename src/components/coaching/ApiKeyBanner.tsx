import { Link } from 'react-router-dom'
import { useState } from 'react'
import { X } from 'lucide-react'

interface ApiKeyBannerProps {
  coachMode: 'off' | 'warnings' | 'full'
  hasKey: boolean
}

export function ApiKeyBanner({ coachMode, hasKey }: ApiKeyBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  if (coachMode !== 'full' || hasKey || dismissed) return null
  return (
    <div className="mx-auto mb-4 flex max-w-[1180px] items-center justify-between gap-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm text-blue-900">
      <span>
        Add an Anthropic API key in{' '}
        <Link to="/settings" className="underline font-medium">
          Settings
        </Link>{' '}
        to enable AI-coached explanations. Rule-based feedback works without one.
      </span>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="text-blue-700 hover:text-blue-900"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}
