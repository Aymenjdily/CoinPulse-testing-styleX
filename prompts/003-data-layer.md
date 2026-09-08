# 003 — Data layer & CoinGecko server functions

## Goal

Build the server-side boundary everything else depends on: typed, validated,
cached, rate-limit-aware access to CoinGecko's free/Demo API via TanStack
Start server functions. The browser will only ever call these — never
CoinGecko directly. No page UI is built in this phase; a temporary debug
route renders raw JSON so the pipeline can be verified end-to-end before
phase 04 builds the real home page against it.

## Docs read

- `agents.md` sections 5 (app boundaries), 8 (data model), 9 (CoinGecko
  budget/TTLs/backoff), 10 (config).
- `node_modules/@tanstack/start-client-core/dist/esm/createServerFn.d.ts` —
  confirmed the installed API: `createServerFn({ method }).validator(fn or
  standard-schema).handler(async ({ data }) => ...)`.
- `node_modules/@tanstack/start-plugin-core/src/vite/load-env-plugin/plugin.ts`
  — confirmed `.env` values load into `process.env` unprefixed (via
  `loadEnv(mode, root, '')`), so `COINGECKO_API_KEY` needs no extra dotenv
  setup.
- CoinGecko public API docs (web search) for exact response shapes of
  `/coins/markets`, `/global`, `/search/trending`, `/coins/{id}`,
  `/coins/{id}/market_chart`, `/search`, and the 429 response shape.

## Code inspected

- `src/lib/data-policy.ts` — existing TTL/poll/backoff constants (from
  project init), reused as-is.
- `src/lib/types.ts` — currently an empty stub, replaced in this phase.
- `.env.example` — `COINGECKO_API_KEY`, `COINGECKO_BASE_URL` already
  documented.
- `design/home.png` — confirms which `GlobalData` fields the UI actually
  needs (total market cap + 24h delta, 24h volume, BTC dominance, active
  coin count) — see note below on a data-availability gap this surfaced.

## Decisions and assumptions

1. **No `import "server-only"` package.** That's a Next.js convention;
   nothing by that name is installed or applicable here. TanStack Start's
   `createServerFn` already guarantees handler code is stripped from the
   client bundle at compile time — that mechanism satisfies agents.md
   section 5's intent. All CoinGecko fetch/key-handling code lives inside
   `createServerFn(...).handler()` callbacks, never in a module a client
   component imports directly.
2. **In-memory cache, one process.** A module-level `Map` keyed by request
   signature (endpoint + params), storing `{ data, fetchedAt }`. No Redis or
   external cache — out of scope per agents.md section 1, and unnecessary
   for a single Node/Nitro process.
3. **Cache-and-backoff wrapper is one shared function**
   (`src/lib/server/fetchCoinGecko.ts`), not duplicated per endpoint: takes
   a cache key, a TTL, and a fetch callback. On success, caches and returns
   fresh. On failure (including after exhausting backoff retries on 429),
   returns the last cached payload with `stale: true` if one exists,
   otherwise throws `DataProviderError`.
4. **Every server function returns `{ data, stale, lastUpdated }`**, not
   bare data — so the UI (later phases) can render the honest staleness
   indicator required by agents.md section 7.8 without re-deriving it.
5. **Zod schemas use `.passthrough()` nowhere** — unexpected extra fields
   from CoinGecko are silently dropped (Zod's default), which is fine;
   missing *required* fields fail validation and throw `DataProviderError`,
   never a half-parsed result.
6. **Data-availability gap found, flagged for phase 03 (not blocking this
   phase):** `design/home.png`'s global stats strip shows a 24h delta badge
   on all four stat cards (market cap, volume, dominance, active count).
   CoinGecko's `/global` endpoint only provides one change figure:
   `market_cap_change_percentage_24h_usd`. There is no real 24h-volume delta
   or BTC-dominance delta in the API response. This phase's `GlobalData`
   type only exposes the one real field, matching agents.md section 8
   exactly. Phase 03 will need to either drop those two delta badges or
   find another honest source — cannot invent them (agents.md section 7.9).
7. **`getMarkets` takes no parameters** (fixed `per_page=250`,
   `sparkline=true`, `price_change_percentage=1h,24h,7d`, `vs_currency=usd`)
   — matches the fixed v1 scope (USD only, 250 coins, sparkline included).
8. **`getTrending` slices to the top 7** server-side (agents.md section 1),
   so the client never receives more than it should render.
9. **`getMarketChart` takes `{ coinId, days }`** with `days` restricted via
   Zod enum to `1 | 7 | 30 | 365`, and picks its TTL from
   `CACHE_TTL_MS.marketChart{1d,7d,30d,365d}` based on the requested value.
10. **Debug route is temporary.** `src/routes/debug.data.tsx` renders raw
    JSON from all six server functions on load, clearly marked dev-only in
    a code comment. It gets deleted once phase 04 (markets table) and phase
    03 (global stats strip) exist and consume this data for real — tracked
    as a follow-up item in `tasks/02-data-layer.md`, not left to rot.

## Expected files to create or modify

- `package.json` — add `zod` as a real dependency (currently only present
  transitively).
- `src/lib/types.ts` — replace stub with Zod schemas + inferred types:
  `CoinMarket`, `CoinDetail`, `MarketChart`, `GlobalData`, `TrendingCoin`,
  `SearchResult`, plus `DataProviderError` and a `Fetched<T>` wrapper type.
- `src/lib/server/fetchCoinGecko.ts` (new) — shared fetch-validate-cache-
  backoff wrapper.
- `src/lib/server/cache.ts` (new) — the in-memory TTL cache.
- `src/lib/server/markets.ts` (new) — `getMarkets` server function.
- `src/lib/server/global.ts` (new) — `getGlobal` server function.
- `src/lib/server/trending.ts` (new) — `getTrending` server function.
- `src/lib/server/coinDetail.ts` (new) — `getCoinDetail` server function.
- `src/lib/server/marketChart.ts` (new) — `getMarketChart` server function.
- `src/lib/server/search.ts` (new) — `searchCoins` server function.
- `src/routes/debug.data.tsx` (new, temporary) — renders raw JSON from all
  six functions for manual verification.

## Requirements and acceptance criteria

- Zero direct browser calls to `api.coingecko.com` — every request in
  DevTools' network tab goes to the app's own origin.
- `COINGECKO_API_KEY` never appears in any client-bundled file (grep the
  build output).
- Each endpoint respects its documented TTL — verified by hitting the debug
  route twice within a TTL window and confirming `lastUpdated` doesn't
  change, then again after the TTL and confirming it does.
- A simulated upstream failure (temporarily point `COINGECKO_BASE_URL` at an
  invalid host) surfaces `DataProviderError` on first call (no cache yet)
  and a `stale: true` payload on subsequent calls once a cache entry exists.
- A simulated 429 (can't easily force from CoinGecko directly — verified by
  unit-testing `fetchCoinGecko`'s backoff logic in isolation with a mocked
  fetch that returns 429 twice then 200) triggers the documented 1s → 2s →
  4s backoff, capped at 30s, before giving up to the stale/cache path.
- `npm run lint`, `npm run typecheck`, `npm run build` all clean.

## Security/privacy considerations

- `COINGECKO_API_KEY` read only inside server function handlers via
  `process.env`, never exported from a module a client file imports.
- No PII involved — CoinGecko data is public market data.

## Checks to run and manual test steps

1. `npm run lint`
2. `npm run typecheck`
3. `npm run build` — grep `dist/client` for the literal API key value (set a
   throwaway one locally) and for `x-cg-demo-api-key` to confirm neither
   ships client-side.
4. `npm run dev` → visit `/debug/data`, confirm all six sections render real
   CoinGecko data with no console errors.
5. Network tab audit: confirm all requests go to the app's own origin, none
   to `api.coingecko.com`.
6. TTL check: reload `/debug/data` immediately (data unchanged, same
   `lastUpdated`) and again after >60s for markets (data/`lastUpdated`
   refreshes).
7. Stale-path check: temporarily break `COINGECKO_BASE_URL`, confirm first
   request throws a normalized error and, once a cache entry exists from a
   prior good run, subsequent requests serve stale data with `stale: true`.
