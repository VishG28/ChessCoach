import { useEffect, useState } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'

const STORAGE_KEY = 'theme.v1'
type Theme = 'system' | 'light' | 'dark'

const CYCLE: Readonly<Record<Theme, Theme>> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'system' || saved === 'light' || saved === 'dark') return saved
  return 'system'
}

function applyTheme(theme: Theme): void {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else if (theme === 'light') {
    root.classList.remove('dark')
  } else {
    // system: respect the OS preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  // Apply theme whenever it changes
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // In system mode, keep the .dark class in sync with OS preference changes live
  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (): void => applyTheme('system')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  const cycle = (): void => {
    const next = CYCLE[theme]
    localStorage.setItem(STORAGE_KEY, next)
    setTheme(next)
  }

  const nextLabel = CYCLE[theme]
  const ariaLabel = `Theme: ${theme} (click to switch to ${nextLabel})`

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycle}
      aria-label={ariaLabel}
      className="text-muted-foreground hover:text-foreground"
    >
      {theme === 'dark' ? (
        <Moon className="size-4" />
      ) : theme === 'light' ? (
        <Sun className="size-4" />
      ) : (
        <Monitor className="size-4" />
      )}
    </Button>
  )
}
