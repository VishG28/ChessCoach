import { NavLink } from 'react-router-dom'
import { GitFork } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ApiKeyButton } from '@/components/coaching/ApiKeyButton'
import { SessionCost } from './SessionCost'
import { ThemeToggle } from './ThemeToggle'

const LINKS = [
  { to: '/', label: 'Play' },
  { to: '/games', label: 'Review' },
  { to: '/openings', label: 'Openings' },
  { to: '/repertoire', label: 'Repertoire' },
  ...(import.meta.env.DEV ? [{ to: '/calibrate', label: 'Calibrate' }] : []),
]

export function TopNav() {
  return (
    <header className="sticky top-0 z-30 h-14 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between gap-4 px-6">
        <div className="font-semibold tracking-tight">Chess Coach</div>
        <nav className="hidden md:flex gap-1">
          {LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/' || to === '/openings'}
              className={({ isActive }) =>
                cn(
                  'px-3 py-1.5 rounded-md text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <SessionCost />
          <ApiKeyButton />
          <ThemeToggle />
          <a
            href="https://github.com/VishG28/ChessCoach"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-muted-foreground hover:text-foreground"
          >
            <GitFork className="size-4" />
          </a>
        </div>
      </div>
    </header>
  )
}
