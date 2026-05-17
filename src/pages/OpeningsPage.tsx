import { Board } from '@/components/board/Board'
import { OpeningTree } from '@/components/openings/OpeningTree'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { OPENINGS } from '@/openings/index'
import { useOpeningTrainer } from '@/openings/useOpeningTrainer'
import { cn } from '@/lib/utils'

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
    progressFraction,
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
      {/* Header + progress */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">{opening.title}</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{opening.description}</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-zinc-700">
            {progressFraction.mastered} / {progressFraction.total} lines mastered
          </div>
          <div className="mt-1 h-2 w-40 bg-zinc-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{
                width:
                  progressFraction.total > 0
                    ? `${(progressFraction.mastered / progressFraction.total) * 100}%`
                    : '0%',
              }}
            />
          </div>
        </div>
      </div>

      {/* Tab selector */}
      <div className="flex gap-2 mb-6">
        {OPENINGS.map(o => (
          <button
            key={o.id}
            onClick={() => selectOpening(o.id)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors border',
              o.id === opening.id
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50',
            )}
          >
            {o.title}
            <span className="ml-2 text-xs opacity-60">
              ({o.userColor === 'white' ? 'White' : 'Black'})
            </span>
          </button>
        ))}
      </div>

      {/* Main layout: board + controls + tree */}
      <div className="flex gap-6 items-start">
        {/* Left: Board */}
        <div className="flex-shrink-0">
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

          {/* Controls below board */}
          <div className="mt-4 flex items-center gap-3 flex-wrap">
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

          {/* Hint */}
          {hintActive && correctToSquares.length > 0 && (
            <Card className="mt-3 px-4 py-3 border-blue-200 bg-blue-50">
              <div className="text-sm text-blue-800">
                <span className="font-semibold">Hint:</span> Move to{' '}
                {correctToSquares.join(' or ')}.
              </div>
            </Card>
          )}

          {/* Wrong move feedback */}
          {wrongMove && (
            <Card className="mt-3 px-4 py-3 border-red-200 bg-red-50">
              <div className="text-sm text-red-800 space-y-1">
                <div>
                  <span className="font-semibold">Wrong move:</span>{' '}
                  {wrongMove.from}→{wrongMove.to}
                </div>
                {wrongCorrectSans.length > 0 && (
                  <div>
                    <span className="font-semibold">Correct move{wrongCorrectSans.length > 1 ? 's' : ''}:</span>{' '}
                    {wrongCorrectSans.join(' or ')}
                  </div>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 border-red-300 text-red-700 hover:bg-red-100"
                  onClick={tryAgain}
                >
                  Try Again
                </Button>
              </div>
            </Card>
          )}

          {/* Explanation card */}
          {!wrongMove && lastExplanation && (
            <Card className="mt-3 px-4 py-3 border-zinc-200 bg-zinc-50">
              <div className="text-sm text-zinc-700">{lastExplanation}</div>
            </Card>
          )}

          {/* Turn indicator */}
          <div className="mt-3 text-xs text-zinc-500">
            {userToMove ? (
              <span className="text-green-600 font-medium">Your turn to move</span>
            ) : (
              <span>Engine is moving...</span>
            )}
          </div>
        </div>

        {/* Right: Opening tree */}
        <Card className="flex-1 min-w-[220px] max-w-xs p-3">
          <ScrollArea className="h-[580px]">
            <OpeningTree
              opening={opening}
              currentNodeId={currentNode.id}
              onGoToLine={goToLine}
            />
          </ScrollArea>
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
