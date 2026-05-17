import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useShortcut } from '@/lib/shortcuts'

const SHORTCUTS: { label: string; key: string }[] = [
  { label: 'New game', key: '⌘N' },
  { label: 'Take back', key: '⌘Z' },
  { label: 'Flip board', key: 'F' },
  { label: 'Open API key', key: '⌘E' },
  { label: 'Toggle debug overlay', key: '`' },
  { label: 'Command palette', key: '⌘K' },
  { label: 'Previous move (review)', key: '←' },
  { label: 'Next move (review)', key: '→' },
  { label: 'First move (review)', key: 'Home' },
  { label: 'Last move (review)', key: 'End' },
  { label: 'Shortcut cheatsheet', key: '?' },
]

export function ShortcutCheatsheet() {
  const [open, setOpen] = useState(false)

  useShortcut('?', () => setOpen(true))

  useEffect(() => {
    function onShow() {
      setOpen(true)
    }
    window.addEventListener('cc:show-cheatsheet', onShow)
    return () => window.removeEventListener('cc:show-cheatsheet', onShow)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 py-2">
          {SHORTCUTS.map(({ label, key }) => (
            <div key={label} className="contents">
              <span className="text-sm text-muted-foreground">{label}</span>
              <kbd className="justify-self-end rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                {key}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
