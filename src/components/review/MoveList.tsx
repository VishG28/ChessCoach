import type { MoveEntry } from '@/games/types'
import { CLASS_COLOR } from '@/games/classification'

interface MoveListProps {
  moves: MoveEntry[]
  selectedPly: number
  onSelectPly: (ply: number) => void
}

interface ClassDotProps {
  classification?: MoveEntry['classification']
}

function ClassDot({ classification }: ClassDotProps) {
  if (!classification) return null
  const colorClass = CLASS_COLOR[classification]
  // Convert text-* to bg-* for the dot
  const bgClass = colorClass.replace('text-', 'bg-')
  return (
    <span
      className={`inline-block w-1.5 h-1.5 rounded-full ml-1 align-middle ${bgClass}`}
      title={classification}
    />
  )
}

function MoveCell({
  move,
  selected,
  onClick,
}: {
  move: MoveEntry | undefined
  selected: boolean
  onClick: () => void
}) {
  if (!move) return <td className="px-2 py-1 text-zinc-300 w-28" />
  return (
    <td
      className={`px-2 py-1 cursor-pointer rounded transition-colors w-28 ${
        selected ? 'bg-zinc-200 font-semibold' : 'hover:bg-zinc-100'
      }`}
      onClick={onClick}
    >
      <span className="text-sm font-mono">
        {move.san}
        {move.source === 'book' && (
          <span
            title={`Lichess database, ${Math.round((move.bookWeight ?? 0) * 100)}% frequency`}
            className="ml-1 text-xs"
            aria-label="book move"
          >
            📖
          </span>
        )}
        <ClassDot classification={move.classification} />
      </span>
    </td>
  )
}

export function MoveList({ moves, selectedPly, onSelectPly }: MoveListProps) {
  const pairs: Array<{ white?: MoveEntry; black?: MoveEntry; moveNumber: number }> = []

  for (let i = 0; i < moves.length; i += 2) {
    pairs.push({
      white: moves[i],
      black: moves[i + 1],
      moveNumber: Math.floor(i / 2) + 1,
    })
  }

  if (pairs.length === 0) {
    return (
      <div className="p-4 text-sm text-zinc-500 italic">No moves recorded.</div>
    )
  }

  return (
    <div className="overflow-auto max-h-[400px]">
      <table className="w-full text-left border-collapse">
        <tbody>
          {pairs.map(({ white, black, moveNumber }) => (
            <tr key={moveNumber} className="border-b border-zinc-100">
              <td className="px-2 py-1 text-xs text-zinc-400 w-8 select-none">
                {moveNumber}.
              </td>
              <MoveCell
                move={white}
                selected={white ? selectedPly === white.ply : false}
                onClick={() => white && onSelectPly(white.ply)}
              />
              <MoveCell
                move={black}
                selected={black ? selectedPly === black.ply : false}
                onClick={() => black && onSelectPly(black.ply)}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
