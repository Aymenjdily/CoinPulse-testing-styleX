import { useCallback, useMemo, useSyncExternalStore } from 'react'
import type { WatchlistEntry } from '../lib/types'

const STORAGE_KEY = 'coinpulse:watchlist'
const listeners = new Set<() => void>()

function emitChange() {
  for (const listener of listeners) listener()
}

function subscribe(callback: () => void) {
  listeners.add(callback)
  window.addEventListener('storage', callback)
  return () => {
    listeners.delete(callback)
    window.removeEventListener('storage', callback)
  }
}

function getSnapshot(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? '[]'
  } catch {
    return '[]'
  }
}

function getServerSnapshot(): string {
  return '[]'
}

function writeEntries(entries: WatchlistEntry[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // localStorage unavailable (private mode, quota) — in-memory state
    // still updates via emitChange, just won't survive reload.
  }
  emitChange()
}

// Client-only, localStorage-backed watchlist (AGENTS.md section 7.4). Never
// synced, never sent to the server. useSyncExternalStore keeps the server
// render ('[]') and the first client render in sync, then picks up the
// real value immediately after — no manual hydration-guard effect needed.
export function useWatchlist() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const entries = useMemo<WatchlistEntry[]>(() => {
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }, [raw])

  const isWatched = useCallback(
    (coinId: string) => entries.some((entry) => entry.coinId === coinId),
    [entries],
  )

  const toggle = useCallback(
    (coinId: string) => {
      if (entries.some((entry) => entry.coinId === coinId)) {
        writeEntries(entries.filter((entry) => entry.coinId !== coinId))
      } else {
        writeEntries([...entries, { coinId, addedAt: Date.now() }])
      }
    },
    [entries],
  )

  return {
    watchedIds: new Set(entries.map((entry) => entry.coinId)),
    isWatched,
    toggle,
  }
}
