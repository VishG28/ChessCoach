export type PieceSetId = 'standard' | 'loco' | 'classic' | 'minimal'

export interface PieceSet {
  id: PieceSetId
  name: string
  description: string
  source: string
  preview: string
}

export const PIECE_SETS: Record<PieceSetId, PieceSet> = {
  standard: {
    id: 'standard', name: 'Standard',
    description: 'Clean traditional Staunton design',
    source: 'cburnett',
    preview: '/pieces/cburnett/wK.svg',
  },
  loco: {
    id: 'loco', name: 'Loco',
    description: 'Chunky bold pieces with thick outlines, oversized presence',
    source: 'fantasy',
    preview: '/pieces/fantasy/wK.svg',
  },
  classic: {
    id: 'classic', name: 'Classic',
    description: 'Tournament-style Merida',
    source: 'merida',
    preview: '/pieces/merida/wK.svg',
  },
  minimal: {
    id: 'minimal', name: 'Minimal',
    description: 'Clean geometric Alpha set',
    source: 'alpha',
    preview: '/pieces/alpha/wK.svg',
  },
}

export const DEFAULT_PIECE_SET: PieceSetId = 'standard'
