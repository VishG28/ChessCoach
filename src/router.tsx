import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/components/nav/RootLayout'
import { PlayPage } from '@/pages/PlayPage'
import { GamesListPage } from '@/pages/GamesListPage'
import { GameReviewPage } from '@/pages/GameReviewPage'
import { OpeningsPage } from '@/pages/OpeningsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { CalibratePage } from '@/pages/CalibratePage'

export const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
        { path: '/', element: <PlayPage /> },
        { path: '/games', element: <GamesListPage /> },
        { path: '/games/:id', element: <GameReviewPage /> },
        { path: '/openings', element: <OpeningsPage /> },
        { path: '/settings', element: <SettingsPage /> },
        ...(import.meta.env.DEV ? [{ path: '/calibrate', element: <CalibratePage /> }] : []),
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || undefined },
)
