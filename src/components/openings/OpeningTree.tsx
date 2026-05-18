import { useState, useMemo } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
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
  expandedIds: Set<string>
  currentPath: Set<string>
  onGoToLine: (leafId: string) => void
  onToggleExpand: (id: string) => void
}

/** Collect all node ids from root to a given node id */
function collectPath(root: OpeningNode, targetId: string, acc: Set<string> = new Set()): boolean {
  if (root.id === targetId) {
    acc.add(root.id)
    return true
  }
  for (const child of root.children) {
    if (collectPath(child, targetId, acc)) {
      acc.add(root.id)
      return true
    }
  }
  return false
}

function NodeRow({
  node,
  depth,
  opening,
  currentNodeId,
  masteredIds,
  expandedIds,
  currentPath,
  onGoToLine,
  onToggleExpand,
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
            expandedIds={expandedIds}
            currentPath={currentPath}
            onGoToLine={onGoToLine}
            onToggleExpand={onToggleExpand}
          />
        ))}
      </>
    )
  }

  const isLeaf = node.children.length === 0
  const isMastered = masteredIds.has(node.id)
  const isCurrent = node.id === currentNodeId
  const isOnPath = currentPath.has(node.id)
  const hasBranch = node.children.length > 1
  const isExpanded = expandedIds.has(node.id)
  // Always show children on the current path; otherwise use expanded state
  const showChildren = node.children.length > 0 && (isOnPath || isExpanded || !hasBranch)

  return (
    <div>
      <div className="flex items-center">
        {/* Expand/collapse toggle for branch nodes */}
        {hasBranch ? (
          <button
            onClick={() => onToggleExpand(node.id)}
            className="shrink-0 p-0.5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {showChildren ? (
              <ChevronDown className="size-3" />
            ) : (
              <ChevronRight className="size-3" />
            )}
          </button>
        ) : (
          <span className="size-4 shrink-0" />
        )}

        <button
          onClick={() => isLeaf && onGoToLine(node.id)}
          disabled={!isLeaf}
          className={cn(
            'flex items-center gap-1.5 py-0.5 rounded text-sm w-full text-left transition-colors',
            depth === 0 && 'font-medium',
            isCurrent || isOnPath
              ? 'bg-accent text-foreground'
              : 'hover:bg-muted text-muted-foreground hover:text-foreground',
            !isLeaf && 'cursor-default',
            isLeaf && 'cursor-pointer',
          )}
          style={{ paddingLeft: `${8 + depth * 16}px`, paddingRight: '8px' }}
        >
          <span className="font-mono text-xs text-muted-foreground w-3 shrink-0">
            {depth > 0 && '·'}
          </span>
          <span className={cn('flex-1', isMastered && 'line-through opacity-60')}>
            {node.san}
          </span>
          {isMastered && (
            <span className="text-emerald-500 text-xs" title="Mastered">✓</span>
          )}
          {isLeaf && !isMastered && (
            <span className="text-muted-foreground text-xs" title="Drill this line">→</span>
          )}
        </button>
      </div>

      {showChildren && (
        <div>
          {node.children.map(child => (
            <NodeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              opening={opening}
              currentNodeId={currentNodeId}
              masteredIds={masteredIds}
              expandedIds={expandedIds}
              currentPath={currentPath}
              onGoToLine={onGoToLine}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function OpeningTree({ opening, currentNodeId, onGoToLine }: OpeningTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const root = opening.root
  if (!root) return null

  const leaves = listLeafLines(opening)
  const prog = loadProgress()[opening.id] ?? {}
  const masteredIds = new Set(leaves.filter(l => prog[l.id]?.mastered).map(l => l.id))

  const currentPath = useMemo(() => {
    const path = new Set<string>()
    collectPath(root, currentNodeId, path)
    return path
  }, [root, currentNodeId])

  function handleToggleExpand(id: string) {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="select-none">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 px-2">
        Opening Tree
      </div>
      <NodeRow
        node={root}
        depth={0}
        opening={opening}
        currentNodeId={currentNodeId}
        masteredIds={masteredIds}
        expandedIds={expandedIds}
        currentPath={currentPath}
        onGoToLine={onGoToLine}
        onToggleExpand={handleToggleExpand}
      />
    </div>
  )
}
