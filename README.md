# ChessCoach

A chess training app for the 300–800 Elo player. Play against a properly-weakened Stockfish, get streaming multi-layer coaching from Claude Sonnet 4.6 (optional), review your games with an eval graph, and drill openings.

**Live demo:** https://vishg28.github.io/ChessCoach/

## Features

- **Play vs. a properly weakened engine (Elo 300–2000)** — A custom weakening pipeline (`src/engine/weakening.ts`) layers depth limiting, movetime caps, and multipv-based candidate selection on top of Stockfish 18. At Elo 300 the engine plays at depth 1 with multipv 10, picks a random move 60 % of the time, and blunders 25 % of the time. Mate-in-1 and queen-hanging moves are sanity-filtered out (queen blunders are allowed below Elo 500 — that's realistic for a true beginner).
- **Human-feel think time** — The engine always pauses 1.2–2.0 seconds before playing, even when its search finishes in 200 ms. Makes the game feel like you're playing a person.
- **Three coach modes** — Off / Warnings (threats + capture suggestions) / Full (everything plus post-move blunder analysis).
- **Deep multi-layer live coaching** — When Full mode is on and a key is set, Claude streams flowing 4–8-sentence paragraphs explaining what to look at, what your opponent might do, hidden patterns a beginner would miss, and obscure-but-useful strategic ideas. Three coaching styles: **Conversational** (default), **Socratic** (coach asks you questions), **Tactical drills** (single nudge per critical moment).
- **Session cost counter** — Top-bar pill shows live Anthropic API spend in USD for the tab. Resets on tab close.
- **Game review** — Every game persists to `localStorage` with per-move CP loss, classification, top engine alternatives, and any coach messages you received during play. Reviewable in a side-by-side board + eval-graph view.
- **Opening trainer** — London System (white) and Caro-Kann Defense (black) with mastery tracking and a Random Drill mode.
- **Dark theme by default**, light theme one click away.
- **Power-user shortcuts** — `Cmd/Ctrl+K` for the command palette, `?` for the cheatsheet, `Cmd/Ctrl+N` new game, `Cmd/Ctrl+Z` take back, `F` flip board, arrows step through review moves, `` ` `` toggles engine debug overlay.

## Engines

ChessCoach supports two opponent engine modes:

- **Maia (default)** - a neural network trained on millions of human Lichess
  games at specific rating buckets. Mistakes are the kind a real player at
  that level would make: misjudging a tactic, missing a counterattack,
  developing a piece to the wrong square. Nine models cover Elo 1100, 1200,
  1300, 1400, 1500, 1600, 1700, 1800, and 1900 (the full
  [CSSLab Maia-1](https://github.com/CSSLab/maia-chess) lineup) and are
  downloaded lazily (~3.5MB each, cached after first load). Your Elo setting
  snaps to the nearest 100 to pick which model plays.
- **Stockfish (calibrated)** - Stockfish 18 with depth, MultiPV, and
  random-move chance dialed to a target Elo. Always available, no download.

Switch in the left sidebar under "Opponent engine". Stockfish at full strength
always runs in the background for blunder detection and coaching - Maia is
only used for opponent move selection.

## Opening Book

For the first 12 plies (or 8 plies for Maia under Elo 1400), the opponent
plays from the [Lichess opening explorer](https://explorer.lichess.ovh/),
sampling moves by frequency in that Elo bucket. This gives natural opening
play without engine artifacts. Book moves show a book badge in the move list.

## Costs

- Maia inference is **free** - runs in your browser, no API calls.
- Lichess opening explorer is **free**, no rate limit for reasonable use.
- Only LLM coaching uses the paid Anthropic API. Free play mode works without
  any API key. With Phase 5 prompt tightening, a 40-move game in Conversational
  mode costs roughly $0.08-0.12 (down from $0.30-0.50 in earlier versions).

## Privacy

- **Your data never leaves your browser.** Game history is stored in
  `localStorage` on this device only.
- Maia models are downloaded once and cached in your browser.
- Lichess opening explorer requests send only the current FEN - no personal data.
- No telemetry, no analytics, no tracking.
- The Anthropic API key lives in memory only for the current browser tab. It is
  never written to disk, `localStorage`, `sessionStorage`, cookies, or any
  server we control. Close the tab and it is gone. When you trigger an AI
  explanation, the key is sent only to `api.anthropic.com`.

## Troubleshooting

**"ByteString" error when saving API key:**
Your pasted key contains invisible Unicode characters (em-dashes from docs,
zero-width spaces). The dialog tries to clean these automatically, but if it
fails: re-copy the key directly from
[console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys).

## Credits

- Engine: [Stockfish](https://stockfishchess.org/) 18
- Neural opponent: [Maia](https://github.com/CSSLab/maia-chess) (CSSLab, U of Toronto)
- Opening data: [Lichess explorer](https://explorer.lichess.ovh)
- ONNX runtime: [onnxruntime-web](https://onnxruntime.ai/docs/tutorials/web/)
- Piece sets: [Lichess](https://github.com/lichess-org/lila) (MIT licensed) — cburnett, fantasy, merida, alpha

## Local development

```bash
npm install
npm run dev
```

Visit `http://localhost:5173/ChessCoach/` (note the base path).

### Build & preview

```bash
npm run build
npm run preview
```

### Tests

Engine weakening logic has unit tests via Node's built-in test runner:

```bash
node --test --experimental-strip-types src/engine/__tests__/weakening.test.ts
```

### Debug overlay

Press `` ` `` (backtick) during play to toggle a debug panel showing the current Elo, Skill Level, depth, movetime, MultiPV, randomness, and the last 5 engine moves with their roll outcomes (`best` / `random` / `blunder` / `filtered`) and best-vs-played centipawn differences.

### Calibration (dev only)

A dev-only route `/calibrate` runs Stockfish-vs-Stockfish at each Elo bucket (300, 500, 800, 1100, 1500, 2000) against a full-strength engine. Configurable games per bucket (default 3); cancellable. Helps verify the weakening table is producing the expected win-rate curve. Hidden in production builds.

## Anthropic API key (optional)

To enable AI coaching:

1. Click **Add API Key** in the top-right corner.
2. Paste an Anthropic key (starts with `sk-ant-`). The dialog verifies it with a small ping request before accepting.
3. The key is held in memory only for this browser tab. There is no "Remember" checkbox. Closing the tab clears it.
4. Set Coach to **Full** in the left sidebar. Optional: pick a coaching style (Conversational / Socratic / Tactical drills).

Typical cost for a 40-move game with full coaching: $0.30–$0.50 using Claude Sonnet 4.6 ($3/M input, $15/M output). The session pill in the top bar tracks running spend.

## Deployment

The repo auto-deploys to GitHub Pages on every push to `main`:

1. `.github/workflows/deploy.yml` runs `npm ci && npm run build`.
2. `dist/` publishes to the `gh-pages` branch via `peaceiris/actions-gh-pages@v3`.
3. In repo **Settings → Pages**, set Branch to `gh-pages`, Folder to `/ (root)`.

The Vite base path is `/ChessCoach/`. A `public/404.html` SPA fallback preserves deep links across hard reloads.

## Architecture

- **Frontend:** Vite 8 + React 19 + TypeScript 6 + Tailwind v4 + shadcn/ui
- **Chess:** chess.js (move validation) + chessground (board UI)
- **Engine:** Stockfish 18 (WebAssembly) running in two workers — one for live play, one for background depth-12 analysis. Weakening pipeline in `src/engine/weakening.ts`; sanity-filtered selector in `selectMove()`.
- **AI:** `@anthropic-ai/sdk` streaming Messages API (`claude-sonnet-4-6`); browser-direct via `dangerouslyAllowBrowser: true`. The raw key is held in a `useRef` so it never lands in React state or DevTools.
- **Routing:** React Router v7. `/calibrate` is dev-only.
- **Charts:** Recharts (eval graph)
- **Shortcuts:** Custom `useShortcut` hook + `cmdk`-based command palette
- **Toasts:** `sonner` for blunder/game-saved notifications
- **Storage:** `localStorage` for game history, opening progress, LLM-explanation cache, and the user's chosen theme. The Anthropic API key is held in memory only.
