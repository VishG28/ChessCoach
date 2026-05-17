// src/coaching/costCounter.tsx
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'

interface CostCounterValue {
  usd: number
  add: (delta: number) => void
  reset: () => void
}

const CostCounterContext = createContext<CostCounterValue | null>(null)

export function useCostCounter(): CostCounterValue {
  const ctx = useContext(CostCounterContext)
  if (!ctx) throw new Error('useCostCounter must be used within CostCounterProvider')
  return ctx
}

export function CostCounterProvider({ children }: { children: ReactNode }) {
  // Use a ref + state so adds are race-free.
  const ref = useRef(0)
  const [usd, setUsd] = useState(0)

  const add = useCallback((delta: number) => {
    ref.current += delta
    setUsd(ref.current)
  }, [])
  const reset = useCallback(() => {
    ref.current = 0
    setUsd(0)
  }, [])

  return (
    <CostCounterContext.Provider value={{ usd, add, reset }}>
      {children}
    </CostCounterContext.Provider>
  )
}
