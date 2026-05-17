import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  RotateCcw,
  RefreshCw,
  KeyRound,
  Sun,
  History,
  BookOpen,
  Keyboard,
} from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command'
import { useShortcut } from '@/lib/shortcuts'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useShortcut('mod+k', () => setOpen(true))

  function close() {
    setOpen(false)
  }

  function dispatch(eventName: string) {
    window.dispatchEvent(new Event(eventName))
  }

  const actions = [
    {
      label: 'New game',
      icon: <Plus className="size-4" />,
      shortcut: '⌘N',
      onSelect: () => {
        dispatch('cc:new-game')
        close()
      },
    },
    {
      label: 'Take back',
      icon: <RotateCcw className="size-4" />,
      shortcut: '⌘Z',
      onSelect: () => {
        dispatch('cc:take-back')
        close()
      },
    },
    {
      label: 'Flip board',
      icon: <RefreshCw className="size-4" />,
      shortcut: 'F',
      onSelect: () => {
        dispatch('cc:flip-board')
        close()
      },
    },
    {
      label: 'Open API key',
      icon: <KeyRound className="size-4" />,
      shortcut: '⌘E',
      onSelect: () => {
        dispatch('cc:open-api-key')
        close()
      },
    },
    {
      label: 'Toggle theme',
      icon: <Sun className="size-4" />,
      shortcut: '',
      onSelect: () => {
        dispatch('cc:toggle-theme')
        close()
      },
    },
    {
      label: 'Go to Review',
      icon: <History className="size-4" />,
      shortcut: '',
      onSelect: () => {
        navigate('/games')
        close()
      },
    },
    {
      label: 'Go to Openings',
      icon: <BookOpen className="size-4" />,
      shortcut: '',
      onSelect: () => {
        navigate('/openings')
        close()
      },
    },
    {
      label: 'Show shortcut cheatsheet',
      icon: <Keyboard className="size-4" />,
      shortcut: '?',
      onSelect: () => {
        dispatch('cc:show-cheatsheet')
        close()
      },
    },
  ]

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command..." />
      <CommandList>
        <CommandEmpty>No commands found.</CommandEmpty>
        <CommandGroup heading="Actions">
          {actions.map((action) => (
            <CommandItem
              key={action.label}
              onSelect={action.onSelect}
            >
              {action.icon}
              <span>{action.label}</span>
              {action.shortcut && (
                <CommandShortcut>{action.shortcut}</CommandShortcut>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
