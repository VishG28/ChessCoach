import { useCallback, useState, type ClipboardEvent } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useApiKey } from '@/coaching/apiKey'
import { pingAnthropic } from '@/coaching/llmCoach'
import { sanitizeApiKey } from '@/lib/sanitizeApiKey'
import { toast } from 'sonner'

interface ApiKeyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type TestState = 'idle' | 'testing' | 'ok' | 'fail'

const KEEP_COACHING_KEY = 'cc.keepCoaching.v1'

export function ApiKeyDialog({ open, onOpenChange }: ApiKeyDialogProps) {
  const { setKey, markVerified } = useApiKey()
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [test, setTest] = useState<TestState>('idle')
  const [keepCoaching, setKeepCoaching] = useState<boolean>(() => {
    try { return localStorage.getItem(KEEP_COACHING_KEY) === '1' } catch { return false }
  })

  const applyClean = useCallback((raw: string): string => {
    const { clean, warning } = sanitizeApiKey(raw)
    if (warning) toast.warning(warning)
    return clean
  }, [])

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text')
    setValue(applyClean(pasted))
    setError(null)
    setTest('idle')
  }

  const handleTest = async (): Promise<void> => {
    const { clean, valid } = sanitizeApiKey(value)
    setValue(clean)
    if (!valid) {
      setError("This doesn't look like a valid Anthropic key. It should start with sk-ant-")
      return
    }
    setTest('testing')
    setError(null)
    try {
      await pingAnthropic(clean)
      setTest('ok')
    } catch (e: unknown) {
      setTest('fail')
      setError(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  const handleSave = (): void => {
    const { clean, valid } = sanitizeApiKey(value)
    if (!valid) {
      setError("This doesn't look like a valid Anthropic key. It should start with sk-ant-")
      return
    }
    const wasTested = test === 'ok'
    setKey(clean)
    // setKey resets verified to false; if the user verified this key in this
    // dialog session, re-mark it as verified so the indicator shows green.
    if (wasTested) markVerified()
    try { localStorage.setItem(KEEP_COACHING_KEY, keepCoaching ? '1' : '0') } catch {}
    setValue('')
    setError(null)
    setTest('idle')
    onOpenChange(false)
  }

  const handleCancel = (): void => {
    setValue('')
    setError(null)
    setTest('idle')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Anthropic API Key</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-2 text-sm">
              <p>
                Your key is held in memory for this browser tab only. It is never saved
                to disk, localStorage, cookies, or any server we control. Close the tab
                and it's gone.
              </p>
              <p className="text-xs text-muted-foreground">
                Paste your key directly from console.anthropic.com/settings/keys
              </p>
              <p className="text-xs text-muted-foreground">
                Brief coaching averages ~$0.002 per move. A 40-move game runs about $0.08–0.12.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <input
            type="password"
            autoComplete="off"
            spellCheck={false}
            placeholder="sk-ant-..."
            value={value}
            onPaste={handlePaste}
            onChange={(e) => { setValue(e.target.value); setError(null); setTest('idle') }}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm font-mono"
          />
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => void handleTest()}
              disabled={test === 'testing' || value.trim().length === 0}
            >
              {test === 'testing' ? 'Testing…' : 'Test Connection'}
            </Button>
            {test === 'ok' && <span className="text-xs text-green-500">✓ Connected to Anthropic</span>}
            {test === 'fail' && <span className="text-xs text-red-500">✗ Connection failed</span>}
          </div>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <label className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
            <input
              type="checkbox"
              checked={keepCoaching}
              onChange={(e) => setKeepCoaching(e.target.checked)}
            />
            Keep coaching messages after games end
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave} disabled={value.trim().length === 0}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
