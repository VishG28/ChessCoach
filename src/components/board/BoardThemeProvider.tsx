import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { BOARD_THEMES, type BoardThemeId } from '@/styles/boardThemes'
import { loadBoardTheme, saveBoardTheme } from '@/lib/boardThemeStorage'
import { marbleIndex } from '@/lib/marbleHash'
import '@/styles/boardThemes.css'

const FILES = ['a','b','c','d','e','f','g','h'] as const

function buildMarbleSvg(palette: readonly string[]): string {
  const rects: string[] = []
  for (let f = 0; f < 8; f++) {
    for (let r = 0; r < 8; r++) {
      const sq = `${FILES[f]}${r + 1}`
      const fill = palette[marbleIndex(sq, palette.length)]
      const x = f * 12.5
      const y = (7 - r) * 12.5
      rects.push(`<rect x="${x}" y="${y}" width="12.5" height="12.5" fill="${fill}"/>`)
    }
  }
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'>${rects.join('')}</svg>`
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`
}

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
    root.style.setProperty('--cc-board-dark', theme.palette[0])
    root.style.setProperty('--cc-board-image', buildMarbleSvg(theme.palette))
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
