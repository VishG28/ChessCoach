import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react'

/** Status of the user-supplied Anthropic API key.
 * - 'absent'    no key entered
 * - 'untested'  key entered, not yet validated via Test Connection
 * - 'verified'  key entered and successfully validated this session
 */
export type KeyStatus = 'absent' | 'untested' | 'verified'

interface ApiKeyContextValue {
  /** True iff the user supplied a key in this tab session. */
  hasKey: boolean
  /** Accessor for the key. Never store the returned value in component state. */
  getKey: () => string | null
  setKey: (key: string | null) => void
  /** Tri-state derived from `hasKey` + internal `verified` flag. */
  keyStatus: KeyStatus
  /** Marks the current key as verified (after a successful Test Connection). */
  markVerified: () => void
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
  const [verified, setVerified] = useState(false)

  const setKey = useCallback((key: string | null): void => {
    keyRef.current = key && key.length > 0 ? key : null
    setHasKey(keyRef.current !== null)
    // Any change to the key invalidates a prior verification.
    setVerified(false)
  }, [])

  const getKey = useCallback((): string | null => keyRef.current, [])

  const markVerified = useCallback((): void => {
    if (keyRef.current !== null) setVerified(true)
  }, [])

  const keyStatus: KeyStatus = !hasKey
    ? 'absent'
    : verified
      ? 'verified'
      : 'untested'

  return (
    <ApiKeyContext.Provider
      value={{ hasKey, getKey, setKey, keyStatus, markVerified }}
    >
      {children}
    </ApiKeyContext.Provider>
  )
}
