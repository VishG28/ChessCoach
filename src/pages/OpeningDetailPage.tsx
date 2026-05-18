import { useEffect, useMemo, useState } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { ChevronLeft, BookmarkPlus, BookmarkCheck } from 'lucide-react'
import { Board } from '@/components/board/Board'
import { OpeningTree } from '@/components/openings/OpeningTree'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { loadOpening } from '@/openings/index'
import { buildOpeningTree } from '@/openings/buildTree'
import { useOpeningTrainer } from '@/openings/useOpeningTrainer'
import { isInRepertoire, addToRepertoire, removeFromRepertoire } from '@/openings/repertoire'
import type { Opening, OpeningMove } from '@/openings/types'
import { cn } from '@/lib/utils'

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

function popularityLabel(opening: Opening): string {
  if (opening.popularityRank <= 5) return 'Top 5 at your level'
  if (opening.popularityRank <= 15) return 'Very popular'
  if (opening.category === 'underrated') return 'Hidden gem'
  return opening.category === 'main_lines' ? 'Main line' : 'Underrated'
}

function MoveList({ moves }: { moves: OpeningMove[] }) {
  if (moves.length === 0) return <span className="text-muted-foreground text-xs">No moves recorded.</span>
  return (
    <div className="flex flex-wrap gap-1">
      {moves.map((m, i) => (
        <span
          key={i}
          className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 font-mono text-xs"
        >
          {m.san}
        </span>
      ))}
    </div>
  )
}

interface PracticeTabProps {
  opening: Opening
}

function PracticeTab({ opening }: PracticeTabProps) {
  const trainerOpening = useMemo(() => {
    const tree = buildOpeningTree(opening)
    return {
      ...opening,
      userColor: tree.userColor,
      startFen: tree.startFen,
      root: tree.tree,
      title: opening.name,
    }
  }, [opening])

  const trainer = useOpeningTrainer(trainerOpening)
  const {
    fen,
    userToMove,
    currentNode,
    wrongMove,
    lastExplanation,
    drillMode,
    hintActive,
    correctToSquares,
    dests,
    userColor,
    orientation,
    lastMove,
    tryUserMove,
    tryAgain,
    showHint,
    setDrillMode,
    goToLine,
  } = trainer

  const turn = fen.split(' ')[1] as 'w' | 'b'

  function handleMove(from: string, to: string) {
    tryUserMove(`${from}${to}`)
  }

  const wrongCorrectSans = wrongMove
    ? wrongMove.expectedUcis.map(u => currentNode.children.find(c => c.uci === u)?.san ?? u)
    : []

  return (
    <div className="grid grid-cols-1 md:grid-cols-[420px_1fr] gap-6 items-start">
      <div className="flex flex-col gap-4">
        <Board
          fen={fen}
          orientation={orientation}
          turn={turn}
          userColor={userColor}
          dests={dests}
          lastMove={lastMove}
          inCheck={false}
          onUserMove={handleMove}
        />

        <Card>
          <CardContent className="p-3 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <Button variant="outline" size="sm" onClick={tryAgain}>Try Again</Button>
              <Button
                variant="outline"
                size="sm"
                onClick={showHint}
                disabled={!userToMove || currentNode.children.length === 0}
              >
                Show Hint
              </Button>
              <div className="flex items-center gap-2 ml-auto">
                <Switch id="drill-mode-detail" checked={drillMode} onCheckedChange={setDrillMode} />
                <Label htmlFor="drill-mode-detail" className="text-sm cursor-pointer">Drill Mode</Label>
              </div>
            </div>
            <div className="text-xs">
              {userToMove ? (
                <span className="text-emerald-600 font-medium">Your turn to move</span>
              ) : (
                <span className="text-muted-foreground">Engine is moving...</span>
              )}
            </div>
          </CardContent>
        </Card>

        {hintActive && correctToSquares.length > 0 && (
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/30">
            <CardContent className="p-3 text-sm text-blue-800 dark:text-blue-200">
              <span className="font-semibold">Hint:</span> Move to {correctToSquares.join(' or ')}.
            </CardContent>
          </Card>
        )}

        {wrongMove && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-950/30">
            <CardContent className="p-3 text-sm text-red-800 dark:text-red-200 space-y-2">
              <div><span className="font-semibold">Wrong move:</span> {wrongMove.from}→{wrongMove.to}</div>
              {wrongCorrectSans.length > 0 && (
                <div>
                  <span className="font-semibold">Correct: </span>
                  {wrongCorrectSans.join(' or ')}
                </div>
              )}
              <Button size="sm" variant="outline" className="border-red-300 text-red-700" onClick={tryAgain}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {!wrongMove && lastExplanation && (
          <Card>
            <CardContent className="p-3 text-sm text-muted-foreground">{lastExplanation}</CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Variation tree</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <ScrollArea className="h-[500px]">
            <OpeningTree
              opening={trainerOpening}
              currentNodeId={currentNode.id}
              onGoToLine={goToLine}
            />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

export function OpeningDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const defaultTab = searchParams.get('tab') ?? 'main-line'

  const [opening, setOpening] = useState<Opening | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [inRepertoire, setInRepertoire] = useState(false)
  const [boardFen, setBoardFen] = useState(STARTING_FEN)
  const [mainLineIndex, setMainLineIndex] = useState(-1)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    loadOpening(id)
      .then(o => {
        setOpening(o)
        setInRepertoire(isInRepertoire(id))
        setBoardFen(STARTING_FEN)
        setMainLineIndex(-1)
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'Unknown error')
      })
      .finally(() => setLoading(false))
  }, [id])

  function toggleRepertoire() {
    if (!id) return
    if (inRepertoire) {
      removeFromRepertoire(id)
      setInRepertoire(false)
    } else {
      addToRepertoire(id)
      setInRepertoire(true)
    }
  }

  function stepMainLine(direction: 'next' | 'prev') {
    if (!opening) return
    const next = direction === 'next'
      ? Math.min(mainLineIndex + 1, opening.mainLine.length - 1)
      : Math.max(mainLineIndex - 1, -1)
    setMainLineIndex(next)
    setBoardFen(next === -1 ? STARTING_FEN : opening.mainLine[next]!.fen)
  }

  if (loading) {
    return (
      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="text-muted-foreground">Loading opening...</div>
      </main>
    )
  }

  if (error || !opening) {
    return (
      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="text-red-600 mb-4">Error: {error ?? 'Opening not found'}</div>
        <Button asChild variant="outline" size="sm">
          <Link to="/openings"><ChevronLeft className="size-4 mr-1" />Back to Openings</Link>
        </Button>
      </main>
    )
  }

  const currentMoveExplanation = mainLineIndex >= 0
    ? opening.mainLine[mainLineIndex]?.explanation
    : opening.description

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button asChild variant="ghost" size="sm" className="-ml-2">
              <Link to="/openings"><ChevronLeft className="size-4" />Openings</Link>
            </Button>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold">{opening.name}</h1>
            <Badge variant="outline" className="font-mono">{opening.eco}</Badge>
            <Badge variant="secondary">{popularityLabel(opening)}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {opening.side === 'white' ? 'White' : opening.side === 'black' ? 'Black' : 'Both sides'} opening
          </p>
        </div>
        <Button
          variant={inRepertoire ? 'default' : 'outline'}
          size="sm"
          onClick={toggleRepertoire}
          className="shrink-0"
        >
          {inRepertoire ? (
            <><BookmarkCheck className="size-4 mr-1" />In repertoire</>
          ) : (
            <><BookmarkPlus className="size-4 mr-1" />Add to repertoire</>
          )}
        </Button>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-sm text-muted-foreground">Description</CardTitle></CardHeader>
          <CardContent className="pb-4 text-sm">{opening.description}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-sm text-muted-foreground">Why play it?</CardTitle></CardHeader>
          <CardContent className="pb-4 text-sm">{opening.whyPlayIt}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-sm text-muted-foreground">Key ideas</CardTitle></CardHeader>
          <CardContent className="pb-4">
            <ul className="text-sm space-y-1 list-disc list-inside">
              {opening.keyIdeas.map((idea, i) => <li key={i}>{idea}</li>)}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={defaultTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="main-line">Main Line</TabsTrigger>
          <TabsTrigger value="practice">Practice</TabsTrigger>
          <TabsTrigger value="variations">Variations</TabsTrigger>
          <TabsTrigger value="counters">Counters & Traps</TabsTrigger>
        </TabsList>

        {/* Main Line tab */}
        <TabsContent value="main-line">
          <div className="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-6 items-start">
            <div className="flex flex-col gap-4">
              <Board
                fen={boardFen}
                orientation={opening.side === 'black' ? 'black' : 'white'}
                turn={boardFen.split(' ')[1] as 'w' | 'b'}
                userColor={null}
                dests={new Map()}
                lastMove={null}
                inCheck={false}
                onUserMove={() => {}}
              />
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => stepMainLine('prev')}
                  disabled={mainLineIndex <= -1}
                >
                  Previous
                </Button>
                <span className="text-xs text-muted-foreground flex-1 text-center">
                  {mainLineIndex === -1 ? 'Starting position' : `Move ${mainLineIndex + 1} of ${opening.mainLine.length}`}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => stepMainLine('next')}
                  disabled={mainLineIndex >= opening.mainLine.length - 1}
                >
                  Next
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Move sequence */}
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Moves</CardTitle></CardHeader>
                <CardContent className="pb-4">
                  <div className="flex flex-wrap gap-1.5">
                    {opening.mainLine.map((m, i) => (
                      <button
                        key={i}
                        onClick={() => { setMainLineIndex(i); setBoardFen(m.fen) }}
                        className={cn(
                          'inline-flex items-center rounded px-2 py-1 font-mono text-sm transition-colors',
                          i === mainLineIndex
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-accent',
                        )}
                      >
                        {m.san}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Explanation */}
              <Card>
                <CardContent className="p-4 text-sm text-muted-foreground">
                  {currentMoveExplanation}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Practice tab */}
        <TabsContent value="practice">
          <PracticeTab opening={opening} />
        </TabsContent>

        {/* Variations tab */}
        <TabsContent value="variations">
          {opening.variations.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm">
              No variations yet — run the generator to populate.
            </div>
          ) : (
            <div className="space-y-4">
              {opening.variations.map(v => (
                <Card key={v.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{v.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{v.explanation}</p>
                  </CardHeader>
                  <CardContent className="pb-4 space-y-2">
                    <div className="text-xs text-muted-foreground">
                      Branches after: <span className="font-mono font-semibold">{v.triggerMove}</span>
                    </div>
                    <MoveList moves={v.moves} />
                    {v.moves.map((m, i) => (
                      <p key={i} className="text-xs text-muted-foreground">
                        <span className="font-mono font-semibold mr-1">{m.san}</span>{m.explanation}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Counters & Traps tab */}
        <TabsContent value="counters">
          <div className="space-y-6">
            {opening.commonAmateurResponses.length > 0 && (
              <div>
                <h2 className="text-base font-semibold mb-3">Common Amateur Responses</h2>
                <div className="space-y-4">
                  {opening.commonAmateurResponses.map((r, i) => (
                    <Card key={i}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">{r.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{r.description}</p>
                      </CardHeader>
                      <CardContent className="pb-4 space-y-2">
                        <MoveList moves={r.moves} />
                        <div className="text-xs">
                          <span className="font-semibold text-emerald-700 dark:text-emerald-400">Refutation: </span>
                          <span className="text-muted-foreground">{r.refutation}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {opening.trapsToKnow.length > 0 && (
              <div>
                <h2 className="text-base font-semibold mb-3">Traps to Know</h2>
                <div className="space-y-4">
                  {opening.trapsToKnow.map((t, i) => (
                    <Card key={i} className="border-amber-200 dark:border-amber-800">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">{t.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{t.description}</p>
                      </CardHeader>
                      <CardContent className="pb-4 space-y-2">
                        <MoveList moves={t.moves} />
                        <div className="text-xs">
                          <span className="font-semibold text-amber-700 dark:text-amber-400">Lesson: </span>
                          <span className="text-muted-foreground">{t.lesson}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {opening.commonAmateurResponses.length === 0 && opening.trapsToKnow.length === 0 && (
              <div className="py-8 text-center text-muted-foreground text-sm">
                No counters or traps yet — run the generator to populate.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}
