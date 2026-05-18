import { useRef, useState } from 'react'
import { Chess } from 'chess.js'
import { Engine, parseUciMove } from '@/engine/engine'
import { requestMaiaMove } from '@/engine/maia'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface MaiaResult {
  model: number
  maiaWins: number
  draws: number
  stockfishWins: number
}

const MAIA_MODEL_OPTIONS = [1100, 1300, 1500, 1700, 1900] as const
const MAIA_BENCH_STOCKFISH_DEPTH = 20
const MAIA_BENCH_STOCKFISH_MOVETIME = 1000
const STRONG_ELO_PROXY = 3000

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

export function CalibratePage() {
  const [maiaModel, setMaiaModel] = useState<number>(1100)
  const [maiaGames, setMaiaGames] = useState<number>(3)
  const [maiaRunning, setMaiaRunning] = useState(false)
  const [maiaResults, setMaiaResults] = useState<MaiaResult[]>([])
  const maiaCancelRef = useRef(false)

  const runMaia = async (): Promise<void> => {
    maiaCancelRef.current = false
    setMaiaRunning(true)
    try {
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

  return (
    <div className="mx-auto max-w-3xl px-6 py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Engine scope (2026-05-17)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Maia</strong> drives ratings <strong>1100&ndash;1899</strong> (model
            selected by Elo bucket). <strong>Stockfish</strong> drives ratings{' '}
            <strong>1900+</strong> via <code>UCI_LimitStrength</code> +{' '}
            <code>UCI_Elo</code>.
          </p>
          <p>
            <em>Historical note:</em> an earlier Phase&nbsp;3A Stockfish
            handicap table (depth caps, MultiPV pools, random and tactical-error
            rolls) was removed on 2026-05-17 because it was never empirically
            validated against any rated-player baseline. Today the opponent is
            exactly Maia (1100&ndash;1899) or Stockfish with{' '}
            <code>UCI_LimitStrength</code> (1900+); no extra randomization is
            layered on top. For
            sub-1100 play, use{' '}
            <a
              href="https://lichess.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2"
            >
              Lichess.org
            </a>
            .
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Maia vs Stockfish benchmark</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Maia neural net (selected model) vs full-strength Stockfish (depth{' '}
            {MAIA_BENCH_STOCKFISH_DEPTH}). Expected baselines: Maia-1100 should lose
            &asymp;90%+; Maia-1900 should lose &asymp;70%.
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
