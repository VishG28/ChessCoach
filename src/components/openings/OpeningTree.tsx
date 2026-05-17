import { cn } from '@/lib/utils'
import { listLeafLines, loadProgress } from '@/openings/progress'
import type { Opening, OpeningNode } from '@/openings/types'

interface OpeningTreeProps {
  opening: Opening
  currentNodeId: string
  onGoToLine: (leafId: string) => void
}

interface NodeRowProps {
  node: OpeningNode
  depth: number
  opening: Opening
  currentNodeId: string
  masteredIds: Set<string>
  onGoToLine: (leafId: string) => void
}

function NodeRow({
  node,
  depth,
  opening,
  currentNodeId,
  masteredIds,
  onGoToLine,
}: NodeRowProps) {
  if (!node.san) {
    // Root node — only render children
    return (
      <>
        {node.children.map(child => (
          <NodeRow
            key={child.id}
            node={child}
            depth={0}
            opening={opening}
            currentNodeId={currentNodeId}
            masteredIds={masteredIds}
            onGoToLine={onGoToLine}
          />
        ))}
      </>
    )
  }

  const isLeaf = node.children.length === 0
  const isMastered = masteredIds.has(node.id)
  const isCurrent = node.id === currentNodeId

  return (
    <div>
      <button
        onClick={() => isLeaf && onGoToLine(node.id)}
        disabled={!isLeaf}
        className={cn(
          'flex items-center gap-1.5 py-0.5 rounded text-sm w-full text-left transition-colors',
          depth === 0 && 'font-medium',
          isCurrent
            ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100'
            : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300',
          !isLeaf && 'cursor-default',
          isLeaf && 'cursor-pointer',
        )}
        style={{ paddingLeft: `${8 + depth * 16}px`, paddingRight: '8px' }}
      >
        <span className="font-mono text-xs text-zinc-400 w-3 shrink-0">
          {depth > 0 && '·'}
        </span>
        <span className={cn('flex-1', isMastered && 'line-through opacity-60')}>
          {node.san}
        </span>
        {isMastered && (
          <span className="text-green-500 text-xs" title="Mastered">
            ✓
          </span>
        )}
        {isLeaf && !isMastered && (
          <span className="text-zinc-400 text-xs" title="Drill this line">
            →
          </span>
        )}
      </button>
      {node.children.length > 0 && (
        <div>
          {node.children.map(child => (
            <NodeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              opening={opening}
              currentNodeId={currentNodeId}
              masteredIds={masteredIds}
              onGoToLine={onGoToLine}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function OpeningTree({ opening, currentNodeId, onGoToLine }: OpeningTreeProps) {
  const leaves = listLeafLines(opening)
  const prog = loadProgress()[opening.id] ?? {}
  const masteredIds = new Set(leaves.filter(l => prog[l.id]?.mastered).map(l => l.id))

  return (
    <div className="select-none">
      <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-2 px-2">
        Opening Tree
      </div>
      <NodeRow
        node={opening.root}
        depth={0}
        opening={opening}
        currentNodeId={currentNodeId}
        masteredIds={masteredIds}
        onGoToLine={onGoToLine}
      />
    </div>
  )
}
