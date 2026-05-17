# ChessCoach

A chess training app for the 300–800 Elo player. Play against Stockfish at adjustable strength with rule-based blunder warnings and optional Claude-powered coaching, log every game with per-move evaluation, drill the London System and Caro-Kann Defense, and review games with an eval graph and engine alternatives.

**Live demo:** https://vishg28.github.io/ChessCoach/

## Features

- **Play** — Adjustable Elo (300–2000) with calibrated weakening: Skill Level + depth + movetime + weighted-random candidate selection at low strength.
- **Coach modes** — Off / Warnings (threats + captures) / Full (warnings + post-move blunder alerts + optional AI explanations).
- **Game logging** — Every game is persisted to localStorage with per-move CP loss, classification (best / good / inaccuracy / mistake / blunder), and top 3 engine alternatives.
- **Game review** — Eval graph, click-to-jump navigation, "Play from here", PGN export.
- **Opening trainer** — London System (white) and Caro-Kann Defense (black) with mastery tracking and drill mode.
- **AI explanations** — Bring your own Anthropic API key for Claude-coached blunder explanations (optional; rule-based fallback always available).

## Local development

```bash
npm install
npm run dev
```

Visit http://localhost:5173.

### Build & preview

```bash
npm run build
npm run preview
```

### Debug overlay

Press the backtick (\`) key during play to toggle a debug panel showing the current Skill Level, depth, movetime, MultiPV, randomness, last 5 engine moves with their evals, and the most recent UCI commands sent.

## Anthropic API key (optional)

The AI coaching feature uses Claude Sonnet 4.6 directly from the browser. To use it:

1. Open the running app and navigate to **Settings**.
2. Paste an Anthropic API key (starts with `sk-ant-`).
3. Optionally tick "Remember for this session" — the key stays in `sessionStorage` and clears when you close the tab. Otherwise it's held in memory only.
4. Click **Test** to verify the key works.
5. Enable **Coach: Full** in the left sidebar.

The key is sent only to `api.anthropic.com`. It is never persisted to disk or `localStorage`. Without a key, the app still produces rule-based blunder explanations.

## Deployment

The repo is configured to auto-deploy to GitHub Pages on every push to `main`:

1. `.github/workflows/deploy.yml` runs `npm ci && npm run build`.
2. The `dist/` folder is published to the `gh-pages` branch via `peaceiris/actions-gh-pages@v3`.
3. In repo Settings → Pages, ensure **Branch** is set to `gh-pages` and **Folder** to `/ (root)`.

The Vite base path is `/ChessCoach/`, matching the repo name. A `public/404.html` SPA fallback preserves deep links across hard reloads.

## Architecture

- **Frontend:** Vite + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui
- **Chess:** chess.js (move validation) + chessground (board UI)
- **Engine:** Stockfish 18 (WebAssembly) running in two workers — one for live play, one for background depth-12 analysis.
- **Routing:** React Router v7
- **Charts:** Recharts
- **Storage:** localStorage (games, opening progress, LLM cache) and sessionStorage (API key, optional)
