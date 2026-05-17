import { useRef, useState } from 'react'
import { Chess } from 'chess.js'
import { Engine, parseUciMove } from '@/engine/engine'
import { getWeakeningParams, selectMove } from '@/engine/weakening'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

interface BucketResult {
  elo: number
  wins: number
  losses: number
  draws: number
}

const BUCKETS = [300, 500, 800, 1100, 1500, 2000]
const STRONG_DEPTH = 18
const STRONG_MOVETIME = 600
const STRONG_ELO_PROXY = 3000

async function playOne(weakElo: number): Promise<'win' | 'loss' | 'draw'> {
  const weak = new Engine({ instanceName: 'cal-weak' })
  const strong = new Engine({ instanceName: 'cal-strong' })
  await Promise.all([weak.init(), strong.init()])
  await weak.setStrength(weakElo)
  await strong.setStrength(STRONG_ELO_PROXY)
  const board = new Chess()
  const weakIsWhite = Math.random() < 0.5
  try {
    for (let ply = 0; ply < 200; ply++) {
      if (board.isGameOver()) break
      const weakToMove = (board.turn() === 'w') === weakIsWhite
      if (weakToMove) {
        const p = getWeakeningParams(weakElo)
        const move = await weak.requestMove({ fen: board.fen(), depth: p.depth, movetime: p.movetime, multipv: p.multipv })
        const cands = move.topCandidates ?? [{ move: `${move.from}${move.to}${move.promotion ?? ''}`, cp: 0, pv: [] }]
        const sel = selectMove({ candidates: cands, randomMoveChance: p.randomMoveChance, blunderChance: p.blunderChance, fenBefore: board.fen(), eloForSanity: weakElo })
        const m = parseUciMove(sel.uci)
        board.move({ from: m.from, to: m.to, promotion: m.promotion })
      } else {
        const move = await strong.requestMove({ fen: board.fen(), depth: STRONG_DEPTH, movetime: STRONG_MOVETIME, multipv: 1 })
        board.move({ from: move.from, to: move.to, promotion: move.promotion })
      }
    }
  } finally {
    weak.dispose()
    strong.dispose()
  }
  if (board.isDraw() || board.isStalemate() || board.isThreefoldRepetition() || board.isInsufficientMaterial()) return 'draw'
  if (board.isCheckmate()) {
    const winnerIsWhite = board.turn() === 'b'
    return winnerIsWhite === weakIsWhite ? 'win' : 'loss'
  }
  return 'draw'
}

export function CalibratePage() {
  const [gamesPerBucket, setGames] = useState(3)
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState<BucketResult[]>([])
  const cancelRef = useRef(false)

  const run = async (): Promise<void> => {
    cancelRef.current = false
    setRunning(true)
    setResults([])
    try {
      for (const elo of BUCKETS) {
        if (cancelRef.current) break
        let w = 0, l = 0, d = 0
        for (let i = 0; i < gamesPerBucket; i++) {
          if (cancelRef.current) break
          const r = await playOne(elo)
          if (r === 'win') w++
          else if (r === 'loss') l++
          else d++
          setResults((prev) => {
            const idx = prev.findIndex((p) => p.elo === elo)
            const next: BucketResult = { elo, wins: w, losses: l, draws: d }
            return idx >= 0 ? [...prev.slice(0, idx), next, ...prev.slice(idx + 1)] : [...prev, next]
          })
        }
      }
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8 space-y-6">
      <Card>
        <CardHeader><CardTitle>Engine Calibration</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm mb-2">Games per Elo bucket: <span className="font-mono">{gamesPerBucket}</span></div>
            <Slider min={1} max={10} step={1} value={[gamesPerBucket]} onValueChange={(v) => setGames(v[0] ?? 3)} disabled={running} />
          </div>
          <div className="flex gap-2">
            <Button onClick={() => void run()} disabled={running}>{running ? 'Running…' : 'Start calibration'}</Button>
            <Button variant="outline" onClick={() => { cancelRef.current = true }} disabled={!running}>Stop</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Results — weakened side win/loss/draw vs full-strength</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm font-mono">
            <thead><tr className="text-muted-foreground"><th className="text-left">Elo</th><th>W</th><th>L</th><th>D</th><th>Win %</th></tr></thead>
            <tbody>
              {results.map((r) => {
                const total = r.wins + r.losses + r.draws
                const pct = total > 0 ? Math.round((r.wins / total) * 100) : 0
                return (
                  <tr key={r.elo}><td>{r.elo}</td><td className="text-center">{r.wins}</td><td className="text-center">{r.losses}</td><td className="text-center">{r.draws}</td><td className="text-center">{pct}%</td></tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
