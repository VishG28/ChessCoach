// scripts/asset-audit.mjs
import { chromium } from 'playwright'
const browser = await chromium.launch()
const page = await browser.newPage()
const fails = []
page.on('requestfailed', r => fails.push({ url: r.url(), why: r.failure()?.errorText }))
page.on('response', r => { if (r.status() >= 400) fails.push({ url: r.url(), status: r.status() }) })
await page.goto('http://localhost:3000/ChessCoach/')
for (const set of ['standard', 'loco', 'classic', 'minimal']) {
  await page.evaluate(s => {
    const root = document.documentElement
    for (const cls of Array.from(root.classList)) {
      if (cls.startsWith('cg-piece-set-')) root.classList.remove(cls)
    }
    root.classList.add(`cg-piece-set-${s}`)
  }, set)
  await page.waitForTimeout(300)
}
console.log(JSON.stringify(fails, null, 2))
await browser.close()
