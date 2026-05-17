import { useEffect, useState } from 'react'
import { useApiKey } from '@/coaching/apiKey'
import { Button } from '@/components/ui/button'
import { ApiKeyDialog } from './ApiKeyDialog'

export function ApiKeyButton() {
  const { hasKey, setKey } = useApiKey()
  const [open, setOpen] = useState(false)

  // Allow anything in the UI to ask us to open via a CustomEvent.
  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('cc:open-api-key', handler)
    return () => window.removeEventListener('cc:open-api-key', handler)
  }, [])

  if (hasKey) {
    return (
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs text-emerald-500">
          <span className="size-2 rounded-full bg-emerald-500" aria-hidden />
          API Connected
        </span>
        <Button size="sm" variant="ghost" onClick={() => setKey(null)}>
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <span className="size-2 rounded-full bg-red-500 mr-2" aria-hidden />
        Add API Key
      </Button>
      <ApiKeyDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
