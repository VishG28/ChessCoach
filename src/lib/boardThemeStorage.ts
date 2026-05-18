import { BOARD_THEMES, DEFAULT_BOARD_THEME, type BoardThemeId } from '@/styles/boardThemes'

const STORAGE_KEY = 'board_theme'

export function saveBoardTheme(id: BoardThemeId): void {
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    // Non-critical: quota exceeded, private mode, etc.
  }
}

export function loadBoardTheme(): BoardThemeId {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw && raw in BOARD_THEMES) {
      return raw as BoardThemeId
    }
    return DEFAULT_BOARD_THEME
  } catch {
    return DEFAULT_BOARD_THEME
  }
}
