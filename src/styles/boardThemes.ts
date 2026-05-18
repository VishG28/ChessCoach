export type BoardThemeId =
  | 'classic'
  | 'green'
  | 'marble'
  | 'wood'
  | 'bubblegum'
  | 'midnight'

interface UniformTheme {
  id: BoardThemeId
  name: string
  description: string
  type: 'uniform'
  light: string
  dark: string
  border: string
  selected: string
  lastMove: string
  check: string
  texture?: 'wood-grain'
}

interface MarbleTheme {
  id: BoardThemeId
  name: string
  description: string
  type: 'marble'
  palette: readonly string[]
  border: string
  selected: string
  lastMove: string
  check: string
}

export type BoardTheme = UniformTheme | MarbleTheme

export const BOARD_THEMES: Record<BoardThemeId, BoardTheme> = {
  classic: {
    id: 'classic', name: 'Classic',
    description: 'Traditional cream and tan',
    type: 'uniform',
    light: '#EDE3C8', dark: '#B8975F', border: '#5D4A2E',
    selected: 'rgba(255, 235, 100, 0.5)',
    lastMove: 'rgba(155, 199, 0, 0.41)',
    check: 'rgba(255, 0, 0, 0.6)',
  },
  green: {
    id: 'green', name: 'Green',
    description: 'Chess.com style sage and cream',
    type: 'uniform',
    light: '#EEEED2', dark: '#769656', border: '#3D5A37',
    selected: 'rgba(255, 215, 0, 0.5)',
    lastMove: 'rgba(186, 202, 43, 0.5)',
    check: 'rgba(255, 0, 0, 0.6)',
  },
  marble: {
    id: 'marble', name: 'Marble',
    description: 'Multi-tone stone palette with sage, slate, and cream',
    type: 'marble',
    palette: ['#F5F0E1','#E8E2D1','#A8B5A0','#7A8F7E','#94A8B5','#6B7F8C','#A8A29B','#5C6B58'],
    border: '#3D4A3C',
    selected: 'rgba(255, 215, 100, 0.45)',
    lastMove: 'rgba(180, 200, 150, 0.5)',
    check: 'rgba(200, 80, 80, 0.6)',
  },
  wood: {
    id: 'wood', name: 'Wood',
    description: 'Walnut and oak, tournament-style wood grain',
    type: 'uniform',
    light: '#D9B989', dark: '#6B4423', border: '#3D2818',
    texture: 'wood-grain',
    selected: 'rgba(255, 200, 80, 0.5)',
    lastMove: 'rgba(200, 140, 60, 0.5)',
    check: 'rgba(255, 50, 50, 0.6)',
  },
  bubblegum: {
    id: 'bubblegum', name: 'Bubblegum',
    description: 'Dusty pink and slate blue, playful and modern',
    type: 'uniform',
    light: '#D4A8B5', dark: '#3D5A75', border: '#2A3D4F',
    selected: 'rgba(255, 230, 120, 0.5)',
    lastMove: 'rgba(200, 170, 200, 0.5)',
    check: 'rgba(220, 80, 100, 0.6)',
  },
  midnight: {
    id: 'midnight', name: 'Midnight',
    description: 'Deep blue and slate for nighttime play',
    type: 'uniform',
    light: '#4A5870', dark: '#1F2B3D', border: '#0F1419',
    selected: 'rgba(100, 180, 255, 0.5)',
    lastMove: 'rgba(80, 140, 200, 0.5)',
    check: 'rgba(255, 80, 80, 0.6)',
  },
}

export const DEFAULT_BOARD_THEME: BoardThemeId = 'classic'
