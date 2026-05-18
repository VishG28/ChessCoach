import { useEffect, useState } from 'react'
import { useApiKey } from '@/coaching/apiKey'
import { Button } from '@/components/ui/button'
import { ApiKeyDialog } from './ApiKeyDialog'
import { cn } from '@/lib/utils'

export function ApiKeyButton() {
  const { hasKey, keyStatus, setKey } = useApiKey()
  const [open, setOpen] = useState(false)

  // Allow anything in the UI to ask us to open via a CustomEvent.
  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('cc:open-api-key', handler)
    return () => window.removeEventListener('cc:open-api-key', handler)
  }, [])

  const dotClass = cn(
    'size-2 rounded-full',
    keyStatus === 'absent' && 'bg-red-500',
    keyStatus === 'untested' && 'bg-amber-400',
    keyStatus === 'verified' && 'bg-emerald-500',
  )

  if (hasKey) {
    return (
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs text-foreground">
          <span className={dotClass} aria-hidden />
          {keyStatus === 'verified' ? 'API Connected' : 'API Key Set'}
        </span>
        <Button size="sm" variant="ghost" onClick={() => setOpen(true)}>
          {keyStatus === 'verified' ? 'Manage' : 'Test'}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setKey(null)}>
          Disconnect
        </Button>
        <ApiKeyDialog open={open} onOpenChange={setOpen} />
      </div>
    )
  }

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <span className={cn(dotClass, 'mr-2')} aria-hidden />
        Add API Key
      </Button>
      <ApiKeyDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
