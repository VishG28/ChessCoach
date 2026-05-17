import { v4 as uuid } from 'uuid'
import type { CoachMessageRecord, Game, GameResult, MoveEntry } from './types'

const GAMES_KEY = 'cc.games.v1'
const MAX_GAMES = 200

/** Migrate a move's legacy single coach_message string to coach_messages array. */
function migrateMoveEntry(m: MoveEntry): MoveEntry {
  if (m.coach_messages !== undefined || !m.coach_message) return m
  const record: CoachMessageRecord = {
    trigger: 'post_move',
    style: 'conversational',
    depth: 'detail',
    content: m.coach_message,
    timestamp: m.timestamp ?? Date.now(),
  }
  return { ...m, coach_messages: [record] }
}

function readAll(): Game[] {
  try {
    const raw = localStorage.getItem(GAMES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    // Apply backward-compat migration for each game's moves
    return (parsed as Game[]).map((g) => ({
      ...g,
      moves: g.moves.map(migrateMoveEntry),
    }))
  } catch {
    return []
  }
}

function writeAll(games: Game[]): void {
  try {
    const trimmed =
      games.length > MAX_GAMES
        ? [...games].sort((a, b) => b.startedAt - a.startedAt).slice(0, MAX_GAMES)
        : games
    localStorage.setItem(GAMES_KEY, JSON.stringify(trimmed))
  } catch {
    // localStorage full — drop oldest half and retry once
    const sorted = [...games].sort((a, b) => b.startedAt - a.startedAt)
    const half = sorted.slice(0, Math.max(1, Math.floor(sorted.length / 2)))
    try {
      localStorage.setItem(GAMES_KEY, JSON.stringify(half))
    } catch {
      /* give up */
    }
  }
}

export function listGames(): Game[] {
  return readAll().sort((a, b) => b.startedAt - a.startedAt)
}

export function getGame(id: string): Game | undefined {
  return readAll().find((g) => g.id === id)
}

export function deleteGame(id: string): void {
  writeAll(readAll().filter((g) => g.id !== id))
}

interface NewGameInit {
  userColor: 'white' | 'black'
  engineElo: number
  coachMode: 'off' | 'warnings' | 'full'
  engine?: 'stockfish' | 'maia'
  engineModel?: string
}

export function startNewGame(init: NewGameInit): Game {
  const game: Game = {
    id: uuid(),
    startedAt: Date.now(),
    result: 'ongoing',
    userColor: init.userColor,
    engineElo: init.engineElo,
    coachMode: init.coachMode,
    pgn: '',
    moves: [],
    ...(init.engine ? { engine: init.engine } : {}),
    ...(init.engineModel ? { engineModel: init.engineModel } : {}),
  }
  writeAll([game, ...readAll()])
  return game
}

export function appendMove(gameId: string, move: MoveEntry): void {
  const all = readAll()
  const idx = all.findIndex((g) => g.id === gameId)
  if (idx === -1) return
  // Avoid duplicates (e.g., React StrictMode double-mount)
  const exists = all[idx].moves.some((m) => m.ply === move.ply)
  if (exists) return
  const next: Game = { ...all[idx], moves: [...all[idx].moves, move] }
  all[idx] = next
  writeAll(all)
}

export function updateMove(gameId: string, ply: number, patch: Partial<MoveEntry>): void {
  const all = readAll()
  const idx = all.findIndex((g) => g.id === gameId)
  if (idx === -1) return
  const moves = all[idx].moves.map((m) => (m.ply === ply ? { ...m, ...patch } : m))
  all[idx] = { ...all[idx], moves }
  writeAll(all)
}

export function setGamePgn(gameId: string, pgn: string): void {
  const all = readAll()
  const idx = all.findIndex((g) => g.id === gameId)
  if (idx === -1) return
  all[idx] = { ...all[idx], pgn }
  writeAll(all)
}

export function finalizeGame(gameId: string, result: GameResult, pgn: string): void {
  const all = readAll()
  const idx = all.findIndex((g) => g.id === gameId)
  if (idx === -1) return
  all[idx] = { ...all[idx], result, pgn, endedAt: Date.now() }
  writeAll(all)
}
