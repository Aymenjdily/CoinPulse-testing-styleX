// Single source of truth for polling intervals and server-side cache TTLs.
// See AGENTS.md section 9 for the CoinGecko budget these numbers are tuned against.
// Do not shorten any TTL below without updating that table too.

export const CACHE_TTL_MS = {
  markets: 60_000,
  global: 5 * 60_000,
  trending: 10 * 60_000,
  coinDetail: 5 * 60_000,
  marketChart1d: 5 * 60_000,
  marketChart7d: 15 * 60_000,
  marketChart30d: 60 * 60_000,
  marketChart365d: 60 * 60_000,
  search: 2 * 60_000,
} as const

export const POLL_INTERVAL_MS = {
  markets: 60_000,
  global: 5 * 60_000,
  trending: 10 * 60_000,
} as const

export const SEARCH_DEBOUNCE_MS = 300

export const RATE_LIMIT_BACKOFF = {
  initialMs: 1_000,
  maxMs: 30_000,
  multiplier: 2,
} as const
