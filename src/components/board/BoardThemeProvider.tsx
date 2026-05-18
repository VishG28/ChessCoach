import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { BOARD_THEMES, type BoardThemeId } from '@/styles/boardThemes'
import { loadBoardTheme, saveBoardTheme } from '@/lib/boardThemeStorage'
import '@/styles/boardThemes.css'
import marbleLightUrl from '@/assets/themes/marble/light.svg'
import marbleDarkUrl from '@/assets/themes/marble/dark.svg'

function applyTheme(id: BoardThemeId): void {
  const theme = BOARD_THEMES[id]
  const root = document.documentElement
  root.setAttribute('data-board-theme', id)
  root.style.setProperty('--cc-board-border', theme.border)
  root.style.setProperty('--cc-board-selected', theme.selected)
  root.style.setProperty('--cc-board-last-move', theme.lastMove)
  root.style.setProperty('--cc-board-check', theme.check)
  if (theme.type === 'marble') {
    root.setAttribute('data-board-mode', 'marble')
    root.removeAttribute('data-board-texture')
    root.style.setProperty('--cc-board-light', theme.palette[0])
    root.style.setProperty('--cc-board-dark', theme.palette[theme.palette.length - 1])
    root.style.setProperty('--cc-marble-light', `url("${marbleLightUrl}")`)
    root.style.setProperty('--cc-marble-dark', `url("${marbleDarkUrl}")`)
    root.style.removeProperty('--cc-board-image')
  } else {
    root.setAttribute('data-board-mode', 'uniform')
    if (theme.texture) root.setAttribute('data-board-texture', theme.texture)
    else root.removeAttribute('data-board-texture')
    root.style.setProperty('--cc-board-light', theme.light)
    root.style.setProperty('--cc-board-dark', theme.dark)
    root.style.setProperty('--cc-board-image', 'none')
  }
}

interface Ctx { themeId: BoardThemeId; setThemeId: (id: BoardThemeId) => void }
const BoardThemeCtx = createContext<Ctx | null>(null)

export function BoardThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<BoardThemeId>(() => loadBoardTheme())
  useEffect(() => { applyTheme(themeId); saveBoardTheme(themeId) }, [themeId])
  return <BoardThemeCtx.Provider value={{ themeId, setThemeId: setThemeIdState }}>{children}</BoardThemeCtx.Provider>
}

export function useBoardTheme(): Ctx {
  const ctx = useContext(BoardThemeCtx)
  if (!ctx) throw new Error('useBoardTheme must be used inside BoardThemeProvider')
  return ctx
}
