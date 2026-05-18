export interface OpeningSeed {
  id: string
  name: string
  eco: string
  side: 'white' | 'black' | 'both'
  category: 'main_lines' | 'underrated'
  startingMoves: string[]
}

export const SEEDS: OpeningSeed[] = [
  // ===== MAIN LINES (25) =====
  // White
  { id: 'italian-game', name: 'Italian Game', eco: 'C50', side: 'white', category: 'main_lines', startingMoves: ['e4','e5','Nf3','Nc6','Bc4'] },
  { id: 'ruy-lopez', name: 'Ruy Lopez', eco: 'C60', side: 'white', category: 'main_lines', startingMoves: ['e4','e5','Nf3','Nc6','Bb5'] },
  { id: 'queens-gambit', name: "Queen's Gambit", eco: 'D06', side: 'white', category: 'main_lines', startingMoves: ['d4','d5','c4'] },
  { id: 'london-system', name: 'London System', eco: 'D02', side: 'white', category: 'main_lines', startingMoves: ['d4','d5','Nf3','Nf6','Bf4'] },
  { id: 'vienna-game', name: 'Vienna Game', eco: 'C25', side: 'white', category: 'main_lines', startingMoves: ['e4','e5','Nc3'] },
  { id: 'scotch-game', name: 'Scotch Game', eco: 'C45', side: 'white', category: 'main_lines', startingMoves: ['e4','e5','Nf3','Nc6','d4'] },
  { id: 'four-knights', name: 'Four Knights Game', eco: 'C46', side: 'white', category: 'main_lines', startingMoves: ['e4','e5','Nf3','Nc6','Nc3','Nf6'] },
  { id: 'english-opening', name: 'English Opening', eco: 'A10', side: 'white', category: 'main_lines', startingMoves: ['c4'] },
  { id: 'catalan', name: 'Catalan', eco: 'E00', side: 'white', category: 'main_lines', startingMoves: ['d4','Nf6','c4','e6','g3'] },
  { id: 'kings-indian-attack', name: "King's Indian Attack", eco: 'A07', side: 'white', category: 'main_lines', startingMoves: ['Nf3','d5','g3'] },
  { id: 'bishops-opening', name: "Bishop's Opening", eco: 'C23', side: 'white', category: 'main_lines', startingMoves: ['e4','e5','Bc4'] },
  { id: 'stonewall-attack', name: 'Stonewall Attack', eco: 'D00', side: 'white', category: 'main_lines', startingMoves: ['d4','d5','e3','Nf6','Bd3'] },
  // Black
  { id: 'sicilian-defense', name: 'Sicilian Defense', eco: 'B20', side: 'black', category: 'main_lines', startingMoves: ['e4','c5'] },
  { id: 'french-defense', name: 'French Defense', eco: 'C00', side: 'black', category: 'main_lines', startingMoves: ['e4','e6'] },
  { id: 'caro-kann', name: 'Caro-Kann', eco: 'B10', side: 'black', category: 'main_lines', startingMoves: ['e4','c6'] },
  { id: 'pirc-defense', name: 'Pirc Defense', eco: 'B07', side: 'black', category: 'main_lines', startingMoves: ['e4','d6','d4','Nf6','Nc3','g6'] },
  { id: 'scandinavian-defense', name: 'Scandinavian Defense', eco: 'B01', side: 'black', category: 'main_lines', startingMoves: ['e4','d5'] },
  { id: 'kings-indian-defense', name: "King's Indian Defense", eco: 'E60', side: 'black', category: 'main_lines', startingMoves: ['d4','Nf6','c4','g6'] },
  { id: 'queens-gambit-declined', name: "Queen's Gambit Declined", eco: 'D30', side: 'black', category: 'main_lines', startingMoves: ['d4','d5','c4','e6'] },
  { id: 'slav-defense', name: 'Slav Defense', eco: 'D10', side: 'black', category: 'main_lines', startingMoves: ['d4','d5','c4','c6'] },
  { id: 'nimzo-indian', name: 'Nimzo-Indian', eco: 'E20', side: 'black', category: 'main_lines', startingMoves: ['d4','Nf6','c4','e6','Nc3','Bb4'] },
  { id: 'dutch-defense', name: 'Dutch Defense', eco: 'A80', side: 'black', category: 'main_lines', startingMoves: ['d4','f5'] },
  { id: 'modern-defense', name: 'Modern Defense', eco: 'B06', side: 'black', category: 'main_lines', startingMoves: ['e4','g6'] },
  { id: 'alekhine-defense', name: "Alekhine's Defense", eco: 'B02', side: 'black', category: 'main_lines', startingMoves: ['e4','Nf6'] },
  { id: 'petroff-defense', name: 'Petroff Defense', eco: 'C42', side: 'black', category: 'main_lines', startingMoves: ['e4','e5','Nf3','Nf6'] },

  // ===== UNDERRATED GEMS (25) =====
  // White
  { id: 'trompowsky-attack', name: 'Trompowsky Attack', eco: 'A45', side: 'white', category: 'underrated', startingMoves: ['d4','Nf6','Bg5'] },
  { id: 'colle-system', name: 'Colle System', eco: 'D04', side: 'white', category: 'underrated', startingMoves: ['d4','d5','Nf3','Nf6','e3'] },
  { id: 'veresov-attack', name: 'Veresov Attack', eco: 'D01', side: 'white', category: 'underrated', startingMoves: ['d4','d5','Nc3','Nf6','Bg5'] },
  { id: 'birds-opening', name: "Bird's Opening", eco: 'A02', side: 'white', category: 'underrated', startingMoves: ['f4'] },
  { id: 'larsens-opening', name: "Larsen's Opening", eco: 'A01', side: 'white', category: 'underrated', startingMoves: ['b3'] },
  { id: 'smith-morra-gambit', name: 'Smith-Morra Gambit', eco: 'B21', side: 'white', category: 'underrated', startingMoves: ['e4','c5','d4'] },
  { id: 'kings-gambit', name: "King's Gambit", eco: 'C30', side: 'white', category: 'underrated', startingMoves: ['e4','e5','f4'] },
  { id: 'danish-gambit', name: 'Danish Gambit', eco: 'C21', side: 'white', category: 'underrated', startingMoves: ['e4','e5','d4','exd4','c3'] },
  { id: 'evans-gambit', name: 'Evans Gambit', eco: 'C51', side: 'white', category: 'underrated', startingMoves: ['e4','e5','Nf3','Nc6','Bc4','Bc5','b4'] },
  { id: 'grob-attack', name: 'Grob Attack', eco: 'A00', side: 'white', category: 'underrated', startingMoves: ['g4'] },
  { id: 'hippopotamus-attack', name: 'Hippopotamus Attack', eco: 'A00', side: 'white', category: 'underrated', startingMoves: ['e3','d6','g3','Nf6','Bg2','g6'] },
  { id: 'sokolsky-opening', name: 'Sokolsky Opening', eco: 'A00', side: 'white', category: 'underrated', startingMoves: ['b4'] },
  // Black
  { id: 'owens-defense', name: "Owen's Defense", eco: 'B00', side: 'black', category: 'underrated', startingMoves: ['e4','b6'] },
  { id: 'englund-gambit', name: 'Englund Gambit', eco: 'A40', side: 'black', category: 'underrated', startingMoves: ['d4','e5'] },
  { id: 'latvian-gambit', name: 'Latvian Gambit', eco: 'C40', side: 'black', category: 'underrated', startingMoves: ['e4','e5','Nf3','f5'] },
  { id: 'elephant-gambit', name: 'Elephant Gambit', eco: 'C40', side: 'black', category: 'underrated', startingMoves: ['e4','e5','Nf3','d5'] },
  { id: 'albin-counter-gambit', name: 'Albin Counter-Gambit', eco: 'D08', side: 'black', category: 'underrated', startingMoves: ['d4','d5','c4','e5'] },
  { id: 'budapest-gambit', name: 'Budapest Gambit', eco: 'A52', side: 'black', category: 'underrated', startingMoves: ['d4','Nf6','c4','e5'] },
  { id: 'czech-benoni', name: 'Czech Benoni', eco: 'A56', side: 'black', category: 'underrated', startingMoves: ['d4','Nf6','c4','c5','d5','e5'] },
  { id: 'old-indian-defense', name: 'Old Indian Defense', eco: 'A53', side: 'black', category: 'underrated', startingMoves: ['d4','Nf6','c4','d6'] },
  { id: 'hippopotamus-defense', name: 'Hippopotamus Defense', eco: 'B00', side: 'black', category: 'underrated', startingMoves: ['e4','g6','d4','Bg7'] },
  { id: 'st-george-defense', name: 'St. George Defense', eco: 'B00', side: 'black', category: 'underrated', startingMoves: ['e4','a6'] },
  { id: 'wade-defense', name: 'Wade Defense', eco: 'A41', side: 'black', category: 'underrated', startingMoves: ['d4','d6','Nf3','Bg4'] },
  { id: 'black-knights-tango', name: 'Black Knights Tango', eco: 'A50', side: 'black', category: 'underrated', startingMoves: ['d4','Nf6','c4','Nc6'] },
  { id: 'pterodactyl-defense', name: 'Pterodactyl Defense', eco: 'A40', side: 'black', category: 'underrated', startingMoves: ['d4','g6','c4','Bg7'] },
]
