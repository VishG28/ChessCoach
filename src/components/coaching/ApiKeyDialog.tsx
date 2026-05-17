import { useState } from 'react'
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

interface ApiKeyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ApiKeyDialog({ open, onOpenChange }: ApiKeyDialogProps) {
  const { setKey } = useApiKey()
  const [value, setValue] = useState('')
  const [testing, setTesting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async (): Promise<void> => {
    const trimmed = value.trim()
    if (!trimmed) return
    setTesting(true)
    setError(null)
    try {
      await pingAnthropic(trimmed)
      setKey(trimmed)
      setValue('')
      onOpenChange(false)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setTesting(false)
    }
  }

  const handleCancel = (): void => {
    setValue('')
    setError(null)
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
                Your Anthropic API key is held in memory for this browser tab only.
                It is never saved to disk, localStorage, cookies, or any server we
                control. Close the tab and it's gone — you'll need to re-enter it
                next session.
              </p>
              <p className="text-xs text-muted-foreground">
                The key is sent only to api.anthropic.com when you trigger an
                explanation.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <input
          type="password"
          autoComplete="off"
          spellCheck={false}
          placeholder="sk-ant-..."
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setError(null)
          }}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm font-mono"
        />
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={() => void handleSave()}
            disabled={testing || value.trim().length === 0}
          >
            {testing ? 'Testing…' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
