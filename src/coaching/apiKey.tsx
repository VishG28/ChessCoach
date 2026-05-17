import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react'

interface ApiKeyContextValue {
  /** True iff the user supplied a key in this tab session. */
  hasKey: boolean
  /** Accessor for the key. Never store the returned value in component state. */
  getKey: () => string | null
  setKey: (key: string | null) => void
}

const ApiKeyContext = createContext<ApiKeyContextValue | null>(null)

export function useApiKey(): ApiKeyContextValue {
  const ctx = useContext(ApiKeyContext)
  if (!ctx) throw new Error('useApiKey must be used within ApiKeyProvider')
  return ctx
}

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  // Hold the raw key in a ref so it never lands in React state inspectors / devtools.
  const keyRef = useRef<string | null>(null)
  const [hasKey, setHasKey] = useState(false)

  const setKey = useCallback((key: string | null): void => {
    keyRef.current = key && key.length > 0 ? key : null
    setHasKey(keyRef.current !== null)
  }, [])

  const getKey = useCallback((): string | null => keyRef.current, [])

  return (
    <ApiKeyContext.Provider value={{ hasKey, getKey, setKey }}>
      {children}
    </ApiKeyContext.Provider>
  )
}
