// scripts/contrast-check.mjs
// Validates WCAG-AA (>=4.5:1) contrast for per-theme coordinate label colors.
// Square colors are pulled directly from src/styles/boardThemes.ts.
// onLight / onDark are the proposed coord colors -- iterate until every row passes.

import { hex } from 'wcag-contrast'

// light / dark come from BOARD_THEMES in boardThemes.ts.
// marble uses palette[0] as light reference, palette[7] as dark reference.
const THEMES = {
  classic:   { light: '#EDE3C8', dark: '#B8975F', onLight: '#3D2A18', onDark: '#1A1008' },
  green:     { light: '#EEEED2', dark: '#769656', onLight: '#12200A', onDark: '#12200A' },
  marble:    { light: '#F5F0E1', dark: '#5C6B58', onLight: '#2E2A20', onDark: '#F0EEE0' },
  wood:      { light: '#D9B989', dark: '#6B4423', onLight: '#3A2410', onDark: '#F5E6D1' },
  bubblegum: { light: '#D4A8B5', dark: '#3D5A75', onLight: '#3A1A26', onDark: '#F0E6EC' },
  midnight:  { light: '#4A5870', dark: '#1F2B3D', onLight: '#E6ECF5', onDark: '#D6DCE5' },
}

let allPass = true
const rows = []
for (const [name, t] of Object.entries(THEMES)) {
  const ratioOnLight = hex(t.onLight, t.light)
  const ratioOnDark  = hex(t.onDark,  t.dark)
  const pass = ratioOnLight >= 4.5 && ratioOnDark >= 4.5
  if (!pass) allPass = false
  rows.push({
    theme:   name,
    lightSq: t.light,
    onLight: t.onLight,
    ratioL:  ratioOnLight.toFixed(2),
    darkSq:  t.dark,
    onDark:  t.onDark,
    ratioD:  ratioOnDark.toFixed(2),
    pass:    pass ? 'PASS' : 'FAIL',
  })
}

console.table(rows)
if (!allPass) {
  console.error('\nOne or more themes fail WCAG-AA (4.5:1). Adjust onLight/onDark and rerun.')
  process.exit(1)
} else {
  console.log('\nAll themes pass WCAG-AA (>=4.5:1 contrast).')
  process.exit(0)
}
