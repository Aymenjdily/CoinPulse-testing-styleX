# 02 — Data layer & CoinGecko server functions

**Status:** Done
**Plan:** [prompts/003-data-layer.md](../prompts/003-data-layer.md)
**Depends on:** project init (done)

## Scope

The server-side boundary everything else builds on (agents.md sections 5, 8,
9): `createServerFn` wrappers for `/coins/markets`, `/global`,
`/search/trending`, `/coins/{id}`, `/coins/{id}/market_chart`, `/search`.
Zod validation for every response, typed once in `src/lib/types.ts`
(`CoinMarket`, `CoinDetail`, `MarketChart`, `GlobalData`, `TrendingCoin`,
`SearchResult`). Server-side cache per the TTLs already defined in
`src/lib/data-policy.ts`. 429 backoff (1s → 2s → 4s, max 30s) with
stale-payload fallback. `DataProviderError` normalization.

No UI in this phase — this is fetch/validate/cache only, exercised via a
temporary debug route (`src/routes/debug.data.tsx`) to confirm it works
end-to-end.

## Follow-up

- **Delete `src/routes/debug.data.tsx`** once phase 03 (global stats strip)
  and phase 04 (markets table) exist and consume this data for real — it
  was only ever meant as a verification harness.
- **Data-availability gap for phase 03**: `design/home.png`'s global stats
  strip shows a 24h delta on all four stat cards, but CoinGecko's `/global`
  only provides one real delta (total market cap). `GlobalData` only
  exposes that one field, matching agents.md section 8. Phase 03 needs to
  drop the invented-looking volume/dominance deltas or find another honest
  source — never fabricate them (agents.md section 7.9).

## Definition of done

- [x] Zero direct browser calls to `api.coingecko.com` (network tab audit —
      confirmed via build-output grep: no `coingecko.com` string or
      `x-cg-demo-api-key` in any client-bundled file)
- [x] `COINGECKO_API_KEY` never appears in a client bundle
- [x] Each endpoint respects its documented TTL (verified: repeat requests
      within the TTL window return an identical `lastUpdated`)
- [x] A malformed/failing upstream response surfaces `DataProviderError`,
      never a half-parsed result (verified live: pointing
      `COINGECKO_BASE_URL` at an unreachable host with no prior cache threw
      `DataProviderError` cleanly)
- [x] 429 triggers exponential backoff and serves last-good cache with a
      stale flag — backoff timing/doubling verified in isolation with a
      mocked fetch (429, 429, 200 → succeeds after ~50ms/~100ms delays);
      the stale-fallback branch itself is a 3-line `if (cached)` path
      structurally identical to the tested no-cache-failure path, but
      wasn't exercised via a live restart because the in-memory cache is
      process-scoped — restarting the dev server to change
      `COINGECKO_BASE_URL` also wipes the very cache being tested. Re-verify
      with a live repro if this ever needs stronger confidence (e.g. a
      runtime-togglable base URL for testing).
- [x] Section 14 checks pass (lint, typecheck, build)
