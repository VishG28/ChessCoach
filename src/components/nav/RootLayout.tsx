import { Outlet } from 'react-router-dom'
import { TopNav } from './TopNav'

export function RootLayout() {
  return (
    <div className="min-h-screen bg-[#f7f6f1]">
      <TopNav />
      <Outlet />
    </div>
  )
}
