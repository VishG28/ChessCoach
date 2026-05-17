import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info)
  }

  handleReset = (): void => {
    this.setState({ error: null })
  }

  render(): ReactNode {
    if (!this.state.error) return this.props.children
    const msg = this.state.error.message
    const isAnthropic = /Anthropic|API key|ByteString/i.test(msg)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full rounded-lg border bg-card p-6 shadow space-y-4">
          <h1 className="text-lg font-semibold">Something went wrong</h1>
          <p className="text-sm text-muted-foreground">{msg}</p>
          {isAnthropic ? (
            <p className="text-xs text-muted-foreground">
              If you see ByteString errors, your pasted API key contains invisible
              Unicode characters. Re-copy directly from
              console.anthropic.com/settings/keys.
            </p>
          ) : null}
          <button
            type="button"
            className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
            onClick={this.handleReset}
          >
            Try again
          </button>
        </div>
      </div>
    )
  }
}
