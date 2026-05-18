import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { PIECE_SETS, type PieceSetId } from '@/styles/pieceSets'
import { usePieceSet } from '@/components/board/PieceSetProvider'

export function PieceSetCard() {
  const { setId, setSetId } = usePieceSet()
  return (
    <Card className="w-full">
      <CardHeader><CardTitle className="text-base tracking-tight">Piece Set</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(PIECE_SETS) as PieceSetId[]).map((id) => {
            const set = PIECE_SETS[id]
            const active = setId === id
            return (
              <Tooltip key={id}>
                <TooltipTrigger asChild>
                  <button type="button" onClick={() => setSetId(id)} aria-pressed={active}
                    className={cn(
                      'flex flex-col items-center gap-1 rounded-md p-2 transition-colors',
                      active ? 'border-2 border-primary bg-accent/40' : 'border-2 border-transparent hover:bg-accent/30',
                    )}>
                    <div className="rounded bg-muted p-1.5">
                      <img src={set.preview} alt={`${set.name} king`} width={56} height={56}
                        style={{ transform: id === 'loco' ? 'scale(1.1)' : undefined }} />
                    </div>
                    <span className="text-xs font-medium">{set.name}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>{set.description}</TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
