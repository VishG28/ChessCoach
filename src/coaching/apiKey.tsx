import { createContext, useContext, useState, type ReactNode } from 'react'

const SESSION_KEY = 'cc.apiKey'

interface ApiKeyContextValue {
  apiKey: string | null
  /** True if the user opted into sessionStorage persistence for this tab. */
  persist: boolean
  setApiKey: (key: string | null, persist?: boolean) => void
  llmEnabled: boolean
  setLlmEnabled: (b: boolean) => void
}

const ApiKeyContext = createContext<ApiKeyContextValue | null>(null)

export function useApiKey(): ApiKeyContextValue {
  const ctx = useContext(ApiKeyContext)
  if (!ctx) throw new Error('useApiKey must be used within ApiKeyProvider')
  return ctx
}

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  // Hydrate from sessionStorage only if a previous render set it (opt-in).
  const initial = (() => {
    try {
      const v = sessionStorage.getItem(SESSION_KEY)
      return v && v.length > 0 ? v : null
    } catch {
      return null
    }
  })()
  const [apiKey, setKey] = useState<string | null>(initial)
  const [persist, setPersist] = useState<boolean>(initial !== null)
  const [llmEnabled, setLlmEnabled] = useState<boolean>(true)

  const setApiKey = (key: string | null, doPersist: boolean = false): void => {
    setKey(key)
    setPersist(Boolean(doPersist && key))
    try {
      if (doPersist && key) sessionStorage.setItem(SESSION_KEY, key)
      else sessionStorage.removeItem(SESSION_KEY)
    } catch {
      /* sessionStorage unavailable — in-memory only */
    }
  }

  return (
    <ApiKeyContext.Provider value={{ apiKey, persist, setApiKey, llmEnabled, setLlmEnabled }}>
      {children}
    </ApiKeyContext.Provider>
  )
}
