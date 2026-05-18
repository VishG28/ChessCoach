import { describe, it, expect } from 'vitest'
import { PIECE_SETS } from './pieceSets'

describe('PIECE_SETS', () => {
  it('each preview URL is a Vite-resolved asset (not a literal /pieces/... path)', () => {
    for (const set of Object.values(PIECE_SETS)) {
      // Must NOT be the old broken absolute path
      expect(set.preview).not.toMatch(/^\/pieces\//)
      // Must be either a Vite-hashed asset URL (.svg or .svg?hash) or a data-URI
      // (Vitest inlines SVGs as data-URIs in the test environment; production build
      // produces hashed asset URLs under /ChessCoach/assets/*)
      expect(set.preview).toMatch(/\.svg(\?|$)|^data:image\/svg\+xml/)
    }
  })
})
