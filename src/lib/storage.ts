const STORAGE_KEY = 'chess-training-game'

export interface PersistedGame {
  pgn: string
  orientation: 'white' | 'black'
}

export function saveGame(state: PersistedGame): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Non-critical: quota exceeded, private mode, etc.
  }
}

export function loadGame(): PersistedGame | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'pgn' in parsed &&
      'orientation' in parsed &&
      typeof (parsed as PersistedGame).pgn === 'string' &&
      ((parsed as PersistedGame).orientation === 'white' ||
        (parsed as PersistedGame).orientation === 'black')
    ) {
      return parsed as PersistedGame
    }
    return null
  } catch {
    return null
  }
}

export function clearGame(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Non-critical.
  }
}
