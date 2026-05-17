import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const LINKS = [
  { to: '/', label: 'Play' },
  { to: '/games', label: 'Games' },
  { to: '/openings', label: 'Openings' },
  { to: '/settings', label: 'Settings' },
]

export function TopNav() {
  return (
    <header className="border-b border-zinc-200 bg-white/70 backdrop-blur">
      <div className="max-w-[1180px] mx-auto flex items-center justify-between px-6 py-3">
        <div className="font-semibold text-lg tracking-tight">ChessCoach</div>
        <nav className="flex gap-1">
          {LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'px-3 py-1.5 rounded-md text-sm transition-colors',
                  isActive
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-700 hover:bg-zinc-100',
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
