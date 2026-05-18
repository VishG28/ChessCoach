// src/styles/pieceSets.module.ts
// Centralizes all 4 × 12 piece SVGs as ES-module imports so Vite hashes them
// and prefixes them with `base` ('/ChessCoach/') at build time.

import standardWK from '@/assets/pieces/cburnett/wK.svg'
import standardWQ from '@/assets/pieces/cburnett/wQ.svg'
import standardWR from '@/assets/pieces/cburnett/wR.svg'
import standardWB from '@/assets/pieces/cburnett/wB.svg'
import standardWN from '@/assets/pieces/cburnett/wN.svg'
import standardWP from '@/assets/pieces/cburnett/wP.svg'
import standardBK from '@/assets/pieces/cburnett/bK.svg'
import standardBQ from '@/assets/pieces/cburnett/bQ.svg'
import standardBR from '@/assets/pieces/cburnett/bR.svg'
import standardBB from '@/assets/pieces/cburnett/bB.svg'
import standardBN from '@/assets/pieces/cburnett/bN.svg'
import standardBP from '@/assets/pieces/cburnett/bP.svg'

import locoWK from '@/assets/pieces/fantasy/wK.svg'
import locoWQ from '@/assets/pieces/fantasy/wQ.svg'
import locoWR from '@/assets/pieces/fantasy/wR.svg'
import locoWB from '@/assets/pieces/fantasy/wB.svg'
import locoWN from '@/assets/pieces/fantasy/wN.svg'
import locoWP from '@/assets/pieces/fantasy/wP.svg'
import locoBK from '@/assets/pieces/fantasy/bK.svg'
import locoBQ from '@/assets/pieces/fantasy/bQ.svg'
import locoBR from '@/assets/pieces/fantasy/bR.svg'
import locoBB from '@/assets/pieces/fantasy/bB.svg'
import locoBN from '@/assets/pieces/fantasy/bN.svg'
import locoBP from '@/assets/pieces/fantasy/bP.svg'

import classicWK from '@/assets/pieces/merida/wK.svg'
import classicWQ from '@/assets/pieces/merida/wQ.svg'
import classicWR from '@/assets/pieces/merida/wR.svg'
import classicWB from '@/assets/pieces/merida/wB.svg'
import classicWN from '@/assets/pieces/merida/wN.svg'
import classicWP from '@/assets/pieces/merida/wP.svg'
import classicBK from '@/assets/pieces/merida/bK.svg'
import classicBQ from '@/assets/pieces/merida/bQ.svg'
import classicBR from '@/assets/pieces/merida/bR.svg'
import classicBB from '@/assets/pieces/merida/bB.svg'
import classicBN from '@/assets/pieces/merida/bN.svg'
import classicBP from '@/assets/pieces/merida/bP.svg'

import minimalWK from '@/assets/pieces/alpha/wK.svg'
import minimalWQ from '@/assets/pieces/alpha/wQ.svg'
import minimalWR from '@/assets/pieces/alpha/wR.svg'
import minimalWB from '@/assets/pieces/alpha/wB.svg'
import minimalWN from '@/assets/pieces/alpha/wN.svg'
import minimalWP from '@/assets/pieces/alpha/wP.svg'
import minimalBK from '@/assets/pieces/alpha/bK.svg'
import minimalBQ from '@/assets/pieces/alpha/bQ.svg'
import minimalBR from '@/assets/pieces/alpha/bR.svg'
import minimalBB from '@/assets/pieces/alpha/bB.svg'
import minimalBN from '@/assets/pieces/alpha/bN.svg'
import minimalBP from '@/assets/pieces/alpha/bP.svg'

import type { PieceSetId } from './pieceSets'

export type PieceCode =
  | 'wK' | 'wQ' | 'wR' | 'wB' | 'wN' | 'wP'
  | 'bK' | 'bQ' | 'bR' | 'bB' | 'bN' | 'bP'

export const PIECE_CODES: readonly PieceCode[] =
  ['wK','wQ','wR','wB','wN','wP','bK','bQ','bR','bB','bN','bP'] as const

export const PIECE_URLS: Record<PieceSetId, Record<PieceCode, string>> = {
  standard: { wK: standardWK, wQ: standardWQ, wR: standardWR, wB: standardWB, wN: standardWN, wP: standardWP,
              bK: standardBK, bQ: standardBQ, bR: standardBR, bB: standardBB, bN: standardBN, bP: standardBP },
  loco:     { wK: locoWK, wQ: locoWQ, wR: locoWR, wB: locoWB, wN: locoWN, wP: locoWP,
              bK: locoBK, bQ: locoBQ, bR: locoBR, bB: locoBB, bN: locoBN, bP: locoBP },
  classic:  { wK: classicWK, wQ: classicWQ, wR: classicWR, wB: classicWB, wN: classicWN, wP: classicWP,
              bK: classicBK, bQ: classicBQ, bR: classicBR, bB: classicBB, bN: classicBN, bP: classicBP },
  minimal:  { wK: minimalWK, wQ: minimalWQ, wR: minimalWR, wB: minimalWB, wN: minimalWN, wP: minimalWP,
              bK: minimalBK, bQ: minimalBQ, bR: minimalBR, bB: minimalBB, bN: minimalBN, bP: minimalBP },
}
