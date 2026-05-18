import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ApiKeyProvider } from '@/coaching/apiKey'
import { CostCounterProvider } from '@/coaching/costCounter'
import { BoardThemeProvider } from '@/components/board/BoardThemeProvider'
import { PieceSetProvider } from '@/components/board/PieceSetProvider'
import { ErrorBoundary } from './components/ErrorBoundary'
import { router } from './router'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ApiKeyProvider>
        <CostCounterProvider>
          <BoardThemeProvider>
            <PieceSetProvider>
              <RouterProvider router={router} />
            </PieceSetProvider>
          </BoardThemeProvider>
        </CostCounterProvider>
      </ApiKeyProvider>
    </ErrorBoundary>
  </StrictMode>,
)
