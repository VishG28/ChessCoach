import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Swords } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { OPENING_SUMMARIES } from '@/openings/index'
import { getRepertoire, removeFromRepertoire } from '@/openings/repertoire'
import { loadProgress } from '@/openings/progress'

export function RepertoirePage() {
  const [savedIds, setSavedIds] = useState<string[]>(() => getRepertoire())

  // Re-read from localStorage when tab regains focus
  useEffect(() => {
    function onFocus() { setSavedIds(getRepertoire()) }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  const saved = OPENING_SUMMARIES.filter(o => savedIds.includes(o.id))

  const allProgress = loadProgress()
  const totalMastered = savedIds.reduce((acc, id) => {
    const lines = allProgress[id] ?? {}
    return acc + Object.values(lines).filter(l => l.mastered).length
  }, 0)

  function handleRemove(id: string) {
    removeFromRepertoire(id)
    setSavedIds(prev => prev.filter(x => x !== id))
  }

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-8">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">My Repertoire</h1>
          <p className="text-sm text-muted-foreground">
            Openings you are actively studying and drilling.
          </p>
        </div>
        {saved.length > 0 && (
          <div className="flex gap-4 text-sm text-muted-foreground">
            <div className="text-center">
              <div className="text-xl font-semibold text-foreground">{saved.length}</div>
              <div>saved</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-foreground">{totalMastered}</div>
              <div>lines mastered</div>
            </div>
          </div>
        )}
      </div>

      {saved.length === 0 ? (
        <div className="py-20 flex flex-col items-center gap-4 text-muted-foreground">
          <BookOpen className="size-12 opacity-30" />
          <p className="text-base">Your repertoire is empty.</p>
          <p className="text-sm">Browse openings and click "Add to repertoire" to save them here.</p>
          <Button asChild>
            <Link to="/openings">Browse Openings</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {saved.map(o => {
            const lines = allProgress[o.id] ?? {}
            const masteredCount = Object.values(lines).filter(l => l.mastered).length
            return (
              <Card key={o.id} className="flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-snug">{o.name}</CardTitle>
                    <Badge variant="outline" className="font-mono text-xs shrink-0">{o.eco}</Badge>
                  </div>
                  {masteredCount > 0 && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">
                      {masteredCount} line{masteredCount !== 1 ? 's' : ''} mastered
                    </p>
                  )}
                </CardHeader>
                <CardContent className="pb-2 flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-2">{o.description}</p>
                </CardContent>
                <CardFooter className="pt-2 flex gap-2">
                  <Button asChild size="sm" className="flex-1">
                    <Link to={`/openings/${o.id}?tab=practice`}>
                      <Swords className="size-4 mr-1" />Drill
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemove(o.id)}
                    className="text-muted-foreground"
                  >
                    Remove
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </main>
  )
}
