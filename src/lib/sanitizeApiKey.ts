export interface SanitizeResult {
  clean: string
  warning: string | null
  valid: boolean
}

const DASH_LOOKALIKES = /[‐-―−]/g  // hyphens, en/em dashes, minus
const DOUBLE_QUOTES = /[“”]/g
const SINGLE_QUOTES = /[‘’]/g
const NBSP = / /g
const ALL_WS = /\s+/g
const NON_ASCII = /[^\x00-\x7F]/g
const KEY_SHAPE = /^sk-ant-[A-Za-z0-9_-]{20,}$/

export function sanitizeApiKey(raw: string): SanitizeResult {
  let clean = raw.trim()

  clean = clean
    .replace(DASH_LOOKALIKES, '-')
    .replace(DOUBLE_QUOTES, '"')
    .replace(SINGLE_QUOTES, "'")
    .replace(NBSP, ' ')
    .replace(ALL_WS, '')

  const nonAscii = clean.match(NON_ASCII)
  let warning: string | null = null
  if (nonAscii) {
    clean = clean.replace(NON_ASCII, '')
    warning = `Removed ${nonAscii.length} invalid character(s) from pasted key.`
  }

  const valid = KEY_SHAPE.test(clean)

  return { clean, warning, valid }
}
