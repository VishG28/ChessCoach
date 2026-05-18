import { PIECE_SETS, DEFAULT_PIECE_SET, type PieceSetId } from '@/styles/pieceSets'

const STORAGE_KEY = 'piece_set'

export function savePieceSet(id: PieceSetId): void {
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    // Non-critical: quota exceeded, private mode, etc.
  }
}

export function loadPieceSet(): PieceSetId {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw && raw in PIECE_SETS) {
      return raw as PieceSetId
    }
    return DEFAULT_PIECE_SET
  } catch {
    return DEFAULT_PIECE_SET
  }
}
