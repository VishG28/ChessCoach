const KEY = 'cc.repertoire.v1'

export function getRepertoire(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? '[]') as string[]
  } catch {
    return []
  }
}

export function addToRepertoire(id: string): void {
  const list = getRepertoire()
  if (!list.includes(id)) {
    window.localStorage.setItem(KEY, JSON.stringify([...list, id]))
  }
}

export function removeFromRepertoire(id: string): void {
  const list = getRepertoire().filter((x) => x !== id)
  window.localStorage.setItem(KEY, JSON.stringify(list))
}

export function isInRepertoire(id: string): boolean {
  return getRepertoire().includes(id)
}
