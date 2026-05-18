import type { JSX } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { BOARD_THEMES, type BoardThemeId } from '@/styles/boardThemes'
import { marbleIndex } from '@/lib/marbleHash'
import { useBoardTheme } from '@/components/board/BoardThemeProvider'

const PREVIEW_SIZE = 64
const PREVIEW_CELLS = 4

function MiniBoard({ id }: { id: BoardThemeId }) {
  const theme = BOARD_THEMES[id]
  const cells: JSX.Element[] = []
  for (let r = 0; r < PREVIEW_CELLS; r++) {
    for (let f = 0; f < PREVIEW_CELLS; f++) {
      let bg: string
      if (theme.type === 'marble') {
        const fakeSquare = `${String.fromCharCode(97 + f)}${r + 1}`
        bg = theme.palette[marbleIndex(fakeSquare, theme.palette.length)]
      } else {
        bg = (f + r) % 2 === 0 ? theme.light : theme.dark
      }
      cells.push(<div key={`${f}-${r}`} style={{ backgroundColor: bg, width: '100%', height: '100%' }} />)
    }
  }
  return (
    <div style={{
      width: PREVIEW_SIZE, height: PREVIEW_SIZE,
      display: 'grid',
      gridTemplateColumns: `repeat(${PREVIEW_CELLS}, 1fr)`,
      gridTemplateRows: `repeat(${PREVIEW_CELLS}, 1fr)`,
      border: `1px solid ${theme.border}`,
      borderRadius: 4, overflow: 'hidden',
    }}>{cells}</div>
  )
}

export function BoardThemeCard() {
  const { themeId, setThemeId } = useBoardTheme()
  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader><CardTitle className="text-base tracking-tight">Board Theme</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(BOARD_THEMES) as BoardThemeId[]).map((id) => {
              const theme = BOARD_THEMES[id]
              const active = themeId === id
              return (
                <Tooltip key={id}>
                  <TooltipTrigger asChild>
                    <button type="button" onClick={() => setThemeId(id)} aria-pressed={active}
                      className={cn(
                        'flex flex-col items-center gap-1 rounded-md p-1.5 transition-colors',
                        active ? 'border-2 border-primary bg-accent/40' : 'border-2 border-transparent hover:bg-accent/30',
                      )}>
                      <MiniBoard id={id} />
                      <span className="text-xs font-medium">{theme.name}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>{theme.description}</TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
