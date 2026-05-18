import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { OPENING_SUMMARIES, type OpeningSummary } from '@/openings/index'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type CategoryFilter = 'main_lines' | 'underrated'
type SideFilter = 'white' | 'black'

function sideBadgeClass(side: OpeningSummary['side']) {
  if (side === 'white') return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200'
  if (side === 'black') return 'bg-slate-700 text-slate-100 dark:bg-slate-800 dark:text-slate-100'
  return 'bg-muted text-muted-foreground'
}

function sideLabel(side: OpeningSummary['side']) {
  if (side === 'white') return 'White'
  if (side === 'black') return 'Black'
  return 'Both'
}

export function OpeningsListPage() {
  const [query, setQuery] = useState('')
  const [categoryFilters, setCategoryFilters] = useState<Set<CategoryFilter>>(new Set())
  const [sideFilters, setSideFilters] = useState<Set<SideFilter>>(new Set())

  function toggleCategory(c: CategoryFilter) {
    setCategoryFilters(prev => {
      const next = new Set(prev)
      if (next.has(c)) next.delete(c)
      else next.add(c)
      return next
    })
  }

  function toggleSide(s: SideFilter) {
    setSideFilters(prev => {
      const next = new Set(prev)
      if (next.has(s)) next.delete(s)
      else next.add(s)
      return next
    })
  }

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return OPENING_SUMMARIES.filter(o => {
      if (q && !o.name.toLowerCase().includes(q) && !o.eco.toLowerCase().includes(q)) return false
      if (categoryFilters.size > 0 && !categoryFilters.has(o.category)) return false
      if (sideFilters.size > 0) {
        const matchesSide = [...sideFilters].some(s => o.side === s || o.side === 'both')
        if (!matchesSide) return false
      }
      return true
    })
  }, [query, categoryFilters, sideFilters])

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">Openings</h1>
        <p className="text-sm text-muted-foreground">
          Browse {OPENING_SUMMARIES.length} openings and build your repertoire.
        </p>
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search openings..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(['main_lines', 'underrated'] as CategoryFilter[]).map(cat => (
            <Button
              key={cat}
              variant={categoryFilters.has(cat) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleCategory(cat)}
            >
              {cat === 'main_lines' ? 'Main lines' : 'Underrated'}
            </Button>
          ))}
          {(['white', 'black'] as SideFilter[]).map(s => (
            <Button
              key={s}
              variant={sideFilters.has(s) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleSide(s)}
            >
              {s === 'white' ? 'White' : 'Black'}
            </Button>
          ))}
          {(categoryFilters.size > 0 || sideFilters.size > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setCategoryFilters(new Set()); setSideFilters(new Set()) }}
              className="text-muted-foreground"
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          No openings match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(o => (
            <Card key={o.id} className="flex flex-col hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-snug">{o.name}</CardTitle>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge variant="outline" className="font-mono text-xs shrink-0">
                      {o.eco}
                    </Badge>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                        sideBadgeClass(o.side),
                      )}
                    >
                      {sideLabel(o.side)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2 flex-1">
                <p className="text-sm text-muted-foreground line-clamp-2">{o.description}</p>
                {o.category === 'underrated' && (
                  <span className="mt-2 inline-block text-xs text-violet-600 dark:text-violet-400 font-medium">
                    Hidden gem
                  </span>
                )}
              </CardContent>
              <CardFooter className="pt-2">
                <Button asChild size="sm" className="w-full">
                  <Link to={`/openings/${o.id}`}>Practice</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}
