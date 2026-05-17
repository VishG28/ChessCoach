import { useState } from 'react'
import { useApiKey } from '@/coaching/apiKey'
import { pingAnthropic } from '@/coaching/llmCoach'
import { Button } from '@/components/ui/button'

export function SettingsPage() {
  const { apiKey, persist, setApiKey, llmEnabled, setLlmEnabled } = useApiKey()

  const [inputValue, setInputValue] = useState(apiKey ?? '')
  const [showKey, setShowKey] = useState(false)
  const [rememberSession, setRememberSession] = useState(persist)
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [testError, setTestError] = useState<string | null>(null)

  const handleSave = (): void => {
    const trimmed = inputValue.trim()
    setApiKey(trimmed.length > 0 ? trimmed : null, rememberSession)
  }

  const handleClear = (): void => {
    setInputValue('')
    setApiKey(null, false)
    setRememberSession(false)
    setTestStatus('idle')
    setTestError(null)
  }

  const handleTest = async (): Promise<void> => {
    const keyToTest = inputValue.trim()
    if (!keyToTest) return
    setTestStatus('loading')
    setTestError(null)
    try {
      await pingAnthropic(keyToTest)
      setTestStatus('ok')
    } catch (e: unknown) {
      setTestStatus('error')
      setTestError(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Settings</h1>
        <p className="text-sm text-zinc-500">Configure your API key and coaching preferences.</p>
      </div>

      {/* Privacy info card */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 space-y-1.5">
        <p className="font-semibold">Key privacy</p>
        <ul className="list-disc list-inside space-y-1 text-blue-800">
          <li>
            Your key is held <strong>in memory only</strong> by default — it is gone when you close
            the tab.
          </li>
          <li>
            If you tick <em>Remember for this session</em>, it is stored in{' '}
            <strong>sessionStorage</strong> (cleared when the tab closes — never localStorage).
          </li>
          <li>
            The key is sent <strong>only to api.anthropic.com</strong> when you trigger an
            explanation.
          </li>
          <li>
            Average cost: <strong>~$0.002 per explanation</strong> at current Claude Sonnet pricing.
          </li>
        </ul>
      </div>

      {/* API key section */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold">Anthropic API Key</h2>

        <div className="space-y-2">
          <label className="block text-sm text-zinc-700" htmlFor="api-key-input">
            API key
          </label>
          <div className="flex gap-2">
            <input
              id="api-key-input"
              type={showKey ? 'text' : 'password'}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                setTestStatus('idle')
                setTestError(null)
              }}
              placeholder="sk-ant-..."
              autoComplete="off"
              spellCheck={false}
              className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowKey((v) => !v)}
              className="shrink-0"
            >
              {showKey ? 'Hide' : 'Show'}
            </Button>
          </div>
          <p className="text-xs text-zinc-500">
            Starts with <code className="font-mono">sk-ant-</code>. Get one at{' '}
            <a
              href="https://console.anthropic.com/settings/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              console.anthropic.com
            </a>
            .
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="remember-session"
            type="checkbox"
            checked={rememberSession}
            onChange={(e) => setRememberSession(e.target.checked)}
            className="size-4 rounded border-zinc-300"
          />
          <label htmlFor="remember-session" className="text-sm text-zinc-700">
            Remember for this session (stored in sessionStorage — cleared when this tab closes)
          </label>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button type="button" onClick={handleSave} disabled={inputValue.trim().length === 0 && apiKey === null}>
            Save key
          </Button>
          <Button type="button" variant="outline" onClick={handleClear} disabled={!apiKey && inputValue.trim().length === 0}>
            Clear key
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => void handleTest()}
            disabled={inputValue.trim().length === 0 || testStatus === 'loading'}
          >
            {testStatus === 'loading' ? 'Testing…' : 'Test connection'}
          </Button>
          {testStatus === 'ok' && (
            <span className="text-sm text-emerald-700 font-medium">Connection OK</span>
          )}
          {testStatus === 'error' && (
            <span className="text-sm text-red-700">{testError ?? 'Connection failed'}</span>
          )}
        </div>

        {apiKey && (
          <p className="text-xs text-zinc-500">
            Key saved:{' '}
            <span className="font-mono">
              {apiKey.slice(0, 12)}…
            </span>
            {persist ? (
              <span className="ml-2 text-blue-700">(remembered for this session)</span>
            ) : (
              <span className="ml-2 text-zinc-400">(in-memory only)</span>
            )}
          </p>
        )}
      </section>

      {/* LLM explanations toggle */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">LLM Explanations</h2>
        <div className="flex items-center gap-2">
          <input
            id="llm-enabled"
            type="checkbox"
            checked={llmEnabled}
            onChange={(e) => setLlmEnabled(e.target.checked)}
            className="size-4 rounded border-zinc-300"
          />
          <label htmlFor="llm-enabled" className="text-sm text-zinc-700">
            Enable LLM explanations (requires API key)
          </label>
        </div>
        {!llmEnabled && (
          <p className="text-xs text-zinc-500">
            Disabled — rule-based blunder messages will be shown instead.
          </p>
        )}
      </section>
    </main>
  )
}
