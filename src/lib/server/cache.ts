type CacheEntry<T> = {
  data: T
  fetchedAt: number
}

// Single in-memory cache for the whole server process. No external store —
// out of scope per AGENTS.md section 1 (no backend database), and
// unnecessary for a single Node/Nitro process.
const store = new Map<string, CacheEntry<unknown>>()

export function getCacheEntry<T>(key: string): CacheEntry<T> | undefined {
  return store.get(key) as CacheEntry<T> | undefined
}

export function setCacheEntry<T>(key: string, data: T): CacheEntry<T> {
  const entry = { data, fetchedAt: Date.now() }
  store.set(key, entry)
  return entry
}

export function isFresh(entry: CacheEntry<unknown>, ttlMs: number): boolean {
  return Date.now() - entry.fetchedAt < ttlMs
}
