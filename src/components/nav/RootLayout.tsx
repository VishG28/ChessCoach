import { Outlet } from 'react-router-dom'
import { TopNav } from './TopNav'
import { CommandPalette } from '@/components/command/CommandPalette'
import { ShortcutCheatsheet } from '@/components/command/ShortcutCheatsheet'

export function RootLayout() {
  return (
    <div className="min-h-screen bg-[#f7f6f1]">
      <TopNav />
      <Outlet />
      <CommandPalette />
      <ShortcutCheatsheet />
    </div>
  )
}
