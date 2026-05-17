import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ApiKeyProvider } from '@/coaching/apiKey'
import { router } from './router'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApiKeyProvider>
      <RouterProvider router={router} />
    </ApiKeyProvider>
  </StrictMode>,
)
