import { useRef, useState } from 'react'
import { Chess } from 'chess.js'
import { Engine, parseUciMove } from '@/engine/engine'
import { getWeakeningParams, selectMove } from '@/engine/weakening'
import { requestMaiaMove } from '@/engine/maia'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

interface BucketResult {
  elo: number
  wins: number
  losses: number
  draws: number
}

interface MaiaResult {
  model: number
  maiaWins: number
  draws: number
  stockfishWins: number
}

const BUCKETS = [300, 500, 800, 1100, 1500, 2000]
const STRONG_DEPTH = 18
const STRONG_MOVETIME = 600
const STRONG_ELO_PROXY = 3000

const MAIA_MODEL_OPTIONS = [1100, 1300, 1500, 1700, 1900] as const
const MAIA_BENCH_STOCKFISH_DEPTH = 20
const MAIA_BENCH_STOCKFISH_MOVETIME = 1000

async function playMaiaVsStockfish(modelElo: number): Promise<'maia' | 'stockfish' | 'draw'> {
  const strong = new Engine({ instanceName: 'maia-bench-strong' })
  await strong.init()
  await strong.setStrength(STRONG_ELO_PROXY)
  const board = new Chess()
  const maiaIsWhite = Math.random() < 0.5
  try {
    for (let ply = 0; ply < 200; ply++) {
      if (board.isGameOver()) break
      const maiaToMove = (board.turn() === 'w') === maiaIsWhite
      if (maiaToMove) {
        const uci = await requestMaiaMove(board.fen(), modelElo)
        const m = parseUciMove(uci)
        const result = board.move({ from: m.from, to: m.to, promotion: m.promotion })
        if (!result) break
      } else {
        const move = await strong.requestMove({
          fen: board.fen(),
          depth: MAIA_BENCH_STOCKFISH_DEPTH,
          movetime: MAIA_BENCH_STOCKFISH_MOVETIME,
          multipv: 1,
        })
        const result = board.move({ from: move.from, to: move.to, promotion: move.promotion })
        if (!result) break
      }
    }
  } finally {
    strong.dispose()
  }
  if (
    board.isDraw() ||
    board.isStalemate() ||
    board.isThreefoldRepetition() ||
    board.isInsufficientMaterial()
  ) {
    return 'draw'
  }
  if (board.isCheckmate()) {
    const winnerIsWhite = board.turn() === 'b'
    return winnerIsWhite === maiaIsWhite ? 'maia' : 'stockfish'
  }
  return 'draw'
}

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

  // Maia benchmark state
  const [maiaModel, setMaiaModel] = useState<number>(1100)
  const [maiaGames, setMaiaGames] = useState<number>(3)
  const [maiaRunning, setMaiaRunning] = useState(false)
  const [maiaResults, setMaiaResults] = useState<MaiaResult[]>([])
  const maiaCancelRef = useRef(false)

  const runMaia = async (): Promise<void> => {
    maiaCancelRef.current = false
    setMaiaRunning(true)
    try {
      // Replace any existing entry for the same model
      setMaiaResults((prev) => prev.filter((r) => r.model !== maiaModel))
      let mw = 0
      let sw = 0
      let dr = 0
      for (let i = 0; i < maiaGames; i++) {
        if (maiaCancelRef.current) break
        const r = await playMaiaVsStockfish(maiaModel)
        if (r === 'maia') mw++
        else if (r === 'stockfish') sw++
        else dr++
        setMaiaResults((prev) => {
          const idx = prev.findIndex((p) => p.model === maiaModel)
          const next: MaiaResult = {
            model: maiaModel,
            maiaWins: mw,
            draws: dr,
            stockfishWins: sw,
          }
          return idx >= 0
            ? [...prev.slice(0, idx), next, ...prev.slice(idx + 1)]
            : [...prev, next]
        })
      }
    } finally {
      setMaiaRunning(false)
    }
  }

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
      <Card>
        <CardHeader><CardTitle>Maia vs Stockfish benchmark</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Maia neural net (selected model) vs full-strength Stockfish (depth {MAIA_BENCH_STOCKFISH_DEPTH}).
            Expected baselines: Maia-1100 should lose ≈90%+; Maia-1900 should lose ≈70%.
          </p>
          <div className="flex flex-wrap items-end gap-4">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-muted-foreground">Maia model</span>
              <select
                className="rounded border bg-background px-2 py-1 text-sm"
                value={maiaModel}
                onChange={(e) => setMaiaModel(Number(e.target.value))}
                disabled={maiaRunning}
              >
                {MAIA_MODEL_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    maia-{m}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-muted-foreground">Games</span>
              <input
                type="number"
                className="w-20 rounded border bg-background px-2 py-1 text-sm"
                min={1}
                max={20}
                step={1}
                value={maiaGames}
                onChange={(e) => {
                  const n = Number(e.target.value)
                  if (Number.isFinite(n)) setMaiaGames(Math.max(1, Math.min(20, Math.floor(n))))
                }}
                disabled={maiaRunning}
              />
            </label>
            <div className="flex gap-2">
              <Button onClick={() => void runMaia()} disabled={maiaRunning}>
                {maiaRunning ? 'Running…' : 'Run Maia benchmark'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  maiaCancelRef.current = true
                }}
                disabled={!maiaRunning}
              >
                Stop
              </Button>
            </div>
          </div>
          <table className="text-sm w-full font-mono">
            <thead>
              <tr className="text-muted-foreground">
                <th className="text-left">Model</th>
                <th>Maia wins</th>
                <th>Draws</th>
                <th>Stockfish wins</th>
              </tr>
            </thead>
            <tbody>
              {maiaResults.map((r) => (
                <tr key={r.model}>
                  <td>maia-{r.model}</td>
                  <td className="text-center">{r.maiaWins}</td>
                  <td className="text-center">{r.draws}</td>
                  <td className="text-center">{r.stockfishWins}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
