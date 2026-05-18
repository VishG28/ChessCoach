// scripts/matrix-verify.mjs
// Verifies every (board-theme × piece-set) combination renders correctly.
// localStorage keys discovered from src/lib/boardThemeStorage.ts + pieceSetStorage.ts:
//   board_theme  — plain string (no JSON wrapper)
//   piece_set    — plain string (no JSON wrapper)
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const PIECE_SETS = ['standard', 'loco', 'classic', 'minimal']
const THEMES = ['classic', 'green', 'marble', 'wood', 'bubblegum', 'midnight']

mkdirSync('docs/screenshots/matrix', { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 900, height: 900 } })
const results = []

// Warm up: navigate once so localStorage is accessible
await page.goto('http://localhost:3000/ChessCoach/', { waitUntil: 'networkidle' })

for (const theme of THEMES) {
  for (const set of PIECE_SETS) {
    const fails = []
    page.removeAllListeners('response')
    page.on('response', r => { if (r.status() >= 400) fails.push(r.url()) })

    // Set storage on the already-loaded page, then reload
    await page.evaluate(({ t, s }) => {
      // Keys are plain strings — no JSON.stringify wrapper
      localStorage.setItem('board_theme', t)
      localStorage.setItem('piece_set', s)
    }, { t: theme, s: set })
    await page.goto('http://localhost:3000/ChessCoach/', { waitUntil: 'networkidle' })
    await page.waitForSelector('cg-board piece', { timeout: 10000 })

    const pieceCount = await page.locator('cg-board piece').count()
    const distinct = await page.evaluate(() => {
      const urls = new Set()
      for (const p of document.querySelectorAll('cg-board piece')) {
        const bg = getComputedStyle(p).backgroundImage
        if (bg && bg !== 'none') urls.add(bg)
      }
      return urls.size
    })

    await page.screenshot({ path: `docs/screenshots/matrix/${theme}-${set}.png` })
    const ok = fails.length === 0 && distinct >= 12
    results.push({ theme, set, pieceCount, distinct, fails: fails.length, ok })

    if (!ok) {
      console.error(`FAIL: ${theme}x${set} -- fails=${fails.length}, distinct=${distinct}, pieces=${pieceCount}`)
      if (fails.length > 0) {
        console.error('  Failed URLs:', fails.slice(0, 5))
      }
    }
  }
}

console.table(results)
await browser.close()

const allOk = results.every(r => r.ok)
if (!allOk) {
  console.error('\nMatrix has failures. See table above.')
  process.exit(1)
} else {
  console.log('\nAll 24 combinations PASS.')
  process.exit(0)
}
