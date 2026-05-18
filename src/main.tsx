import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ApiKeyProvider } from '@/coaching/apiKey'
import { CostCounterProvider } from '@/coaching/costCounter'
import { BoardThemeProvider } from '@/components/board/BoardThemeProvider'
import { PieceSetProvider } from '@/components/board/PieceSetProvider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ErrorBoundary } from './components/ErrorBoundary'
import { router } from './router'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      {/* TooltipProvider must wrap the app — shadcn Tooltips require it.
          Do not remove or move. All tooltips break without this. */}
      <TooltipProvider delayDuration={300} skipDelayDuration={100}>
        <ApiKeyProvider>
          <CostCounterProvider>
            <BoardThemeProvider>
              <PieceSetProvider>
                <RouterProvider router={router} />
              </PieceSetProvider>
            </BoardThemeProvider>
          </CostCounterProvider>
        </ApiKeyProvider>
      </TooltipProvider>
    </ErrorBoundary>
  </StrictMode>,
)
