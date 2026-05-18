import { PIECE_URLS } from './pieceSets.module'

export type PieceSetId = 'standard' | 'loco' | 'classic' | 'minimal'

export interface PieceSet {
  id: PieceSetId
  name: string
  description: string
  source: string
  preview: string
}

export const PIECE_SETS: Record<PieceSetId, PieceSet> = {
  standard: { id: 'standard', name: 'Standard',
              description: 'Clean traditional Staunton design',
              source: 'cburnett', preview: PIECE_URLS.standard.wK },
  loco:     { id: 'loco', name: 'Loco',
              description: 'Chunky bold pieces with thick outlines, oversized presence',
              source: 'fantasy', preview: PIECE_URLS.loco.wK },
  classic:  { id: 'classic', name: 'Classic',
              description: 'Tournament-style Merida',
              source: 'merida', preview: PIECE_URLS.classic.wK },
  minimal:  { id: 'minimal', name: 'Minimal',
              description: 'Clean geometric Alpha set',
              source: 'alpha', preview: PIECE_URLS.minimal.wK },
}

export const DEFAULT_PIECE_SET: PieceSetId = 'standard'
