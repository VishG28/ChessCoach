import type { OpponentMode } from '@/engine/opponentEngine'

interface EngineSelectorProps {
  value: OpponentMode
  onChange: (mode: OpponentMode) => void
  disabled?: boolean
}

const STORAGE_KEY = 'cc.opponentEngine.v1'

export function getDefaultEngine(): OpponentMode {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === 'stockfish' ? 'stockfish' : 'maia'
  } catch {
    return 'maia'
  }
}

export function persistEngine(mode: OpponentMode): void {
  try {
    localStorage.setItem(STORAGE_KEY, mode)
  } catch {
    /* ignore quota/availability errors */
  }
}

export function EngineSelector({ value, onChange, disabled }: EngineSelectorProps) {
  const choose = (mode: OpponentMode): void => {
    onChange(mode)
    persistEngine(mode)
  }
  return (
    <fieldset className="space-y-2" disabled={disabled}>
      <legend className="text-xs uppercase tracking-wide text-muted-foreground">
        Opponent engine
      </legend>
      <label
        className={`block rounded-md border p-3 cursor-pointer ${
          value === 'maia' ? 'border-primary' : 'border-border'
        }`}
      >
        <input
          type="radio"
          name="engine"
          value="maia"
          checked={value === 'maia'}
          onChange={() => choose('maia')}
          className="sr-only"
        />
        <div className="font-medium text-sm">Maia (human-like)</div>
        <div className="text-xs text-muted-foreground">
          Neural network trained on human games. Natural mistakes at your level.
        </div>
      </label>
      <label
        className={`block rounded-md border p-3 cursor-pointer ${
          value === 'stockfish' ? 'border-primary' : 'border-border'
        }`}
      >
        <input
          type="radio"
          name="engine"
          value="stockfish"
          checked={value === 'stockfish'}
          onChange={() => choose('stockfish')}
          className="sr-only"
        />
        <div className="font-medium text-sm">Stockfish (calibrated)</div>
        <div className="text-xs text-muted-foreground">
          Traditional engine weakened to target Elo. Predictable, calculation-focused.
        </div>
      </label>
    </fieldset>
  )
}
