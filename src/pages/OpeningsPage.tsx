import { Board } from '@/components/board/Board'
import { OpeningTree } from '@/components/openings/OpeningTree'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { CheckCircle2 } from 'lucide-react'
import { OPENINGS } from '@/openings/index'
import { useOpeningTrainer } from '@/openings/useOpeningTrainer'
import { masteredCount } from '@/openings/progress'

export function OpeningsPage() {
  const trainer = useOpeningTrainer()

  const {
    opening,
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
    selectOpening,
    tryUserMove,
    tryAgain,
    showHint,
    setDrillMode,
    goToLine,
  } = trainer

  const turn = fen.split(' ')[1] as 'w' | 'b'

  function handleMove(from: string, to: string) {
    const uci = `${from}${to}`
    tryUserMove(uci)
  }

  const wrongCorrectSans = wrongMove
    ? wrongMove.expectedUcis.map(u => {
        const child = opening.root && findChildByUci(currentNode, u)
        return child?.san ?? u
      })
    : []

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold mb-2">Openings</h1>

      {/* Shadcn Tabs for opening selector */}
      <Tabs value={opening.id} onValueChange={selectOpening} className="mb-6">
        <TabsList>
          {OPENINGS.map(o => {
            const prog = masteredCount(o)
            return (
              <TabsTrigger key={o.id} value={o.id} className="gap-2">
                {o.title}
                <span className="text-xs opacity-60">
                  ({o.userColor === 'white' ? 'White' : 'Black'})
                </span>
                {prog.mastered === prog.total && prog.total > 0 && (
                  <CheckCircle2 className="size-3 text-emerald-500" />
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {OPENINGS.map(o => (
          <TabsContent key={o.id} value={o.id}>
            {/* Opening title + progress bar */}
            <div className="mb-6 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{o.title}</p>
                  <p className="text-sm text-muted-foreground">{o.description}</p>
                </div>
                <span className="text-sm text-muted-foreground">
                  {masteredCount(o).mastered} / {masteredCount(o).total} mastered
                </span>
              </div>
              <Progress
                value={masteredCount(o).total > 0 ? (masteredCount(o).mastered / masteredCount(o).total) * 100 : 0}
                className="h-2 [&>div]:bg-emerald-500"
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Main layout: board left, tree right */}
      <div className="grid grid-cols-1 md:grid-cols-[480px_1fr] gap-6 items-start">
        {/* Left: Board + drill controls */}
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

          {/* Drill controls card */}
          <Card>
            <CardContent className="p-3 space-y-3">
              {/* Controls row */}
              <div className="flex items-center gap-3 flex-wrap">
                <Button variant="outline" size="sm" onClick={tryAgain}>
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={showHint}
                  disabled={!userToMove || currentNode.children.length === 0}
                >
                  Show Hint
                </Button>
                <div className="flex items-center gap-2 ml-auto">
                  <Switch
                    id="drill-mode"
                    checked={drillMode}
                    onCheckedChange={setDrillMode}
                  />
                  <Label htmlFor="drill-mode" className="text-sm cursor-pointer">
                    Drill Mode
                  </Label>
                </div>
              </div>

              {/* Turn indicator */}
              <div className="text-xs">
                {userToMove ? (
                  <span className="text-emerald-600 font-medium">Your turn to move</span>
                ) : (
                  <span className="text-muted-foreground">Engine is moving...</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Hint */}
          {hintActive && correctToSquares.length > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-3 text-sm text-blue-800">
                <span className="font-semibold">Hint:</span> Move to{' '}
                {correctToSquares.join(' or ')}.
              </CardContent>
            </Card>
          )}

          {/* Wrong move feedback */}
          {wrongMove && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-3 text-sm text-red-800 space-y-2">
                <div>
                  <span className="font-semibold">Wrong move:</span>{' '}
                  {wrongMove.from}→{wrongMove.to}
                </div>
                {wrongCorrectSans.length > 0 && (
                  <div>
                    <span className="font-semibold">
                      Correct move{wrongCorrectSans.length > 1 ? 's' : ''}:
                    </span>{' '}
                    {wrongCorrectSans.join(' or ')}
                  </div>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-100"
                  onClick={tryAgain}
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Explanation card */}
          {!wrongMove && lastExplanation && (
            <Card>
              <CardContent className="p-3 text-sm text-muted-foreground">
                {lastExplanation}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Opening variation tree */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Variation tree</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <ScrollArea className="h-[580px]">
              <OpeningTree
                opening={opening}
                currentNodeId={currentNode.id}
                onGoToLine={goToLine}
              />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

/** Utility: find a direct child of a node by UCI string */
function findChildByUci(
  node: { children: Array<{ uci: string; san: string }> },
  uci: string,
) {
  return node.children.find(c => c.uci === uci)
}
