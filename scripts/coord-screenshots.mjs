// scripts/coord-screenshots.mjs
// Screenshots each board theme in both orientations to verify coord contrast.
// Run: node scripts/coord-screenshots.mjs
// Prerequisites: dev server running at http://localhost:5173/ChessCoach/

import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const OUT = 'docs/screenshots/coords'
mkdirSync(OUT, { recursive: true })

const THEMES = ['classic', 'green', 'marble', 'wood', 'bubblegum', 'midnight']

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

for (const theme of THEMES) {
  // Set theme in localStorage -- key is 'board_theme', plain string value (not JSON-encoded).
  await page.goto('http://localhost:5173/ChessCoach/')
  await page.evaluate((t) => {
    localStorage.setItem('board_theme', t)
    // Disable Vite HMR overlay to keep the screenshot clean
    if (window.__vite_plugin_react_preamble_installed__) {
      document.querySelectorAll('vite-error-overlay').forEach(el => el.remove())
    }
  }, theme)
  await page.reload()
  await page.waitForSelector('cg-board', { timeout: 10000 })
  await page.waitForTimeout(600)
  // Dismiss any Vite overlay
  await page.keyboard.press('Escape')
  await page.waitForTimeout(200)

  // White-on-bottom (default orientation)
  await page.screenshot({ path: `${OUT}/${theme}-white.png` })

  // Flip the board via the custom event the app dispatches
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('cc:flip-board'))
  })
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${OUT}/${theme}-black.png` })

  // Flip back to white for the next theme iteration
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('cc:flip-board'))
  })

  console.log(`Captured ${theme} (white + black)`)
}

await browser.close()
console.log(`\nAll screenshots saved to ${OUT}/`)
