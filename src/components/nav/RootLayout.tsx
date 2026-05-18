import { NavLink, Outlet } from 'react-router-dom'
import { Sword, BookOpen, ChartBar } from 'lucide-react'
import { Toaster } from 'sonner'
import { TopNav } from './TopNav'
import { CommandPalette } from '@/components/command/CommandPalette'
import { ShortcutCheatsheet } from '@/components/command/ShortcutCheatsheet'
import { cn } from '@/lib/utils'

const MOBILE_LINKS = [
  { to: '/', label: 'Play', Icon: Sword },
  { to: '/games', label: 'Review', Icon: ChartBar },
  { to: '/openings', label: 'Openings', Icon: BookOpen },
]

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <TopNav />
      <Outlet />
      <CommandPalette />
      <ShortcutCheatsheet />
      <Toaster richColors closeButton position="bottom-right" />

      {/* Attribution footer — hidden on mobile to avoid clashing with the bottom nav. */}
      <footer
        className="hidden md:block border-t border-border/40 bg-background/60 px-6 py-3 text-[0.7rem] text-muted-foreground"
        aria-label="Attribution"
      >
        Opening book powered by{' '}
        <a
          href="https://lichess.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-2 hover:text-foreground hover:underline"
        >
          Lichess.org
        </a>
        .
      </footer>

      {/* Mobile bottom nav — hidden on md+ */}
      <nav
        className="fixed bottom-0 inset-x-0 z-40 flex md:hidden h-16 border-t bg-background/90 backdrop-blur"
        aria-label="Mobile navigation"
      >
        {MOBILE_LINKS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center justify-center gap-0.5 text-[0.65rem] font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )
            }
          >
            <Icon className="size-5" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
