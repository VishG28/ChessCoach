import type { LineProgress, Opening, OpeningNode, OpeningProgress } from './types'

const KEY = 'cc.openings.progress.v1'

function read(): OpeningProgress {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    return parsed && typeof parsed === 'object' ? (parsed as OpeningProgress) : {}
  } catch {
    return {}
  }
}

function write(p: OpeningProgress): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    /* ignore */
  }
}

export function loadProgress(): OpeningProgress {
  return read()
}

export function getLineProgress(openingId: string, lineId: string): LineProgress {
  const all = read()
  return (
    all[openingId]?.[lineId] ?? {
      attempts: 0,
      correct_streak: 0,
      mastered: false,
      lastPlayed: 0,
    }
  )
}

export function recordAttempt(
  openingId: string,
  lineId: string,
  correct: boolean,
): LineProgress {
  const all = read()
  const opening = all[openingId] ?? {}
  const prev = opening[lineId] ?? {
    attempts: 0,
    correct_streak: 0,
    mastered: false,
    lastPlayed: 0,
  }
  const newStreak = correct ? prev.correct_streak + 1 : 0
  const next: LineProgress = {
    attempts: prev.attempts + 1,
    correct_streak: newStreak,
    // once mastered, stays mastered
    mastered: newStreak >= 3 ? true : prev.mastered,
    lastPlayed: Date.now(),
  }
  opening[lineId] = next
  all[openingId] = opening
  write(all)
  return next
}

export function listLeafLines(opening: Opening): OpeningNode[] {
  const out: OpeningNode[] = []
  const walk = (n: OpeningNode): void => {
    if (n.children.length === 0) {
      out.push(n)
      return
    }
    for (const c of n.children) walk(c)
  }
  walk(opening.root)
  return out
}

export function masteredCount(opening: Opening): { mastered: number; total: number } {
  const leaves = listLeafLines(opening)
  const prog = read()[opening.id] ?? {}
  const mastered = leaves.filter(l => prog[l.id]?.mastered).length
  return { mastered, total: leaves.length }
}

export function pickRandomUnmastered(opening: Opening): OpeningNode | null {
  const leaves = listLeafLines(opening)
  const prog = read()[opening.id] ?? {}
  const unmastered = leaves.filter(l => !prog[l.id]?.mastered)
  if (unmastered.length === 0) {
    return leaves[Math.floor(Math.random() * leaves.length)] ?? null
  }
  return unmastered[Math.floor(Math.random() * unmastered.length)]
}
