import type { Classification } from './types'

export function classify(cpLoss: number): Classification {
  if (cpLoss < 20) return 'best'
  if (cpLoss < 50) return 'good'
  if (cpLoss < 100) return 'inaccuracy'
  if (cpLoss < 200) return 'mistake'
  return 'blunder'
}

export const CLASS_COLOR: Record<Classification, string> = {
  best: 'text-emerald-600',
  good: 'text-zinc-600',
  inaccuracy: 'text-amber-600',
  mistake: 'text-orange-600',
  blunder: 'text-red-600',
}

export const CLASS_BG: Record<Classification, string> = {
  best: 'bg-emerald-100',
  good: 'bg-zinc-100',
  inaccuracy: 'bg-amber-100',
  mistake: 'bg-orange-100',
  blunder: 'bg-red-100',
}

export const CLASS_LABEL: Record<Classification, string> = {
  best: 'Best',
  good: 'Good',
  inaccuracy: 'Inaccuracy',
  mistake: 'Mistake',
  blunder: 'Blunder',
}
