import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/components/nav/RootLayout'
import { PlayPage } from '@/pages/PlayPage'
import { GamesListPage } from '@/pages/GamesListPage'
import { GameReviewPage } from '@/pages/GameReviewPage'
import { OpeningsListPage } from '@/pages/OpeningsListPage'
import { OpeningDetailPage } from '@/pages/OpeningDetailPage'
import { RepertoirePage } from '@/pages/RepertoirePage'
import { CalibratePage } from '@/pages/CalibratePage'

export const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
        { path: '/', element: <PlayPage /> },
        { path: '/games', element: <GamesListPage /> },
        { path: '/games/:id', element: <GameReviewPage /> },
        { path: '/openings', element: <OpeningsListPage /> },
        { path: '/openings/:id', element: <OpeningDetailPage /> },
        { path: '/repertoire', element: <RepertoirePage /> },
        ...(import.meta.env.DEV ? [{ path: '/calibrate', element: <CalibratePage /> }] : []),
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || undefined },
)
