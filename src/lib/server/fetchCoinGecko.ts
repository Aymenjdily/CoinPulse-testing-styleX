import type { z } from 'zod'
import { DataProviderError, type Fetched } from '../types'
import { RATE_LIMIT_BACKOFF } from '../data-policy'
import { getCacheEntry, isFresh, setCacheEntry } from './cache'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function buildUrl(path: string, params: Record<string, string | number | boolean | undefined>) {
  const base = process.env.COINGECKO_BASE_URL ?? 'https://api.coingecko.com/api/v3'
  const url = new URL(base + path)
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value))
  }
  return url
}

async function requestWithBackoff(url: URL): Promise<unknown> {
  const headers: HeadersInit = {}
  const apiKey = process.env.COINGECKO_API_KEY
  if (apiKey) headers['x-cg-demo-api-key'] = apiKey

  let delay = RATE_LIMIT_BACKOFF.initialMs
  // One initial attempt plus retries while backoff stays under the cap.
  for (;;) {
    const response = await fetch(url, { headers })

    if (response.ok) {
      return response.json()
    }

    if (response.status === 429 && delay <= RATE_LIMIT_BACKOFF.maxMs) {
      await sleep(delay)
      delay *= RATE_LIMIT_BACKOFF.multiplier
      continue
    }

    throw new DataProviderError(
      `CoinGecko request failed: ${response.status} ${response.statusText} (${url.pathname})`,
    )
  }
}

type FetchOptions<TSchema extends z.ZodTypeAny> = {
  cacheKey: string
  ttlMs: number
  path: string
  params?: Record<string, string | number | boolean | undefined>
  schema: TSchema
}

// Shared fetch → validate → cache → backoff pipeline. On success, caches and
// returns fresh data. On failure, falls back to the last cached payload with
// stale: true; only throws DataProviderError when there's no cache to fall
// back to. Never returns a half-parsed result — a schema mismatch is a
// thrown error, same as a network failure.
export async function fetchCoinGecko<TSchema extends z.ZodTypeAny>({
  cacheKey,
  ttlMs,
  path,
  params = {},
  schema,
}: FetchOptions<TSchema>): Promise<Fetched<z.infer<TSchema>>> {
  const cached = getCacheEntry<z.infer<TSchema>>(cacheKey)

  if (cached && isFresh(cached, ttlMs)) {
    return { data: cached.data, stale: false, lastUpdated: cached.fetchedAt }
  }

  try {
    const raw = await requestWithBackoff(buildUrl(path, params))
    const parsed = schema.parse(raw) as z.infer<TSchema>
    const entry = setCacheEntry(cacheKey, parsed)
    return { data: entry.data, stale: false, lastUpdated: entry.fetchedAt }
  } catch (error) {
    if (cached) {
      return { data: cached.data, stale: true, lastUpdated: cached.fetchedAt }
    }
    throw new DataProviderError(`Failed to fetch ${path} and no cache available`, error)
  }
}
