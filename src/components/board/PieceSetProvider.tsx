import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { PIECE_SETS, type PieceSetId } from '@/styles/pieceSets'
import { loadPieceSet, savePieceSet } from '@/lib/pieceSetStorage'

interface Ctx { setId: PieceSetId; setSetId: (id: PieceSetId) => void }
const PieceSetCtx = createContext<Ctx | null>(null)

function applyPieceSetClass(id: PieceSetId): void {
  const root = document.documentElement
  for (const key of Object.keys(PIECE_SETS) as PieceSetId[]) {
    root.classList.remove(`cg-piece-set-${key}`)
  }
  root.classList.add(`cg-piece-set-${id}`)
}

export function PieceSetProvider({ children }: { children: ReactNode }) {
  const [setId, setSetIdState] = useState<PieceSetId>(() => loadPieceSet())
  useEffect(() => { applyPieceSetClass(setId); savePieceSet(setId) }, [setId])
  return <PieceSetCtx.Provider value={{ setId, setSetId: setSetIdState }}>{children}</PieceSetCtx.Provider>
}

export function usePieceSet(): Ctx {
  const ctx = useContext(PieceSetCtx)
  if (!ctx) throw new Error('usePieceSet must be used inside PieceSetProvider')
  return ctx
}
