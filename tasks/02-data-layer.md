# 02 — Data layer & CoinGecko server functions

**Status:** Not started
**Plan:** none yet
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
temporary route or test harness if needed to confirm it works end-to-end.

## Definition of done

- [ ] Zero direct browser calls to `api.coingecko.com` (network tab audit)
- [ ] `COINGECKO_API_KEY` never appears in a client bundle
- [ ] Each endpoint respects its documented TTL
- [ ] A malformed/failing upstream response surfaces `DataProviderError`,
      never a half-parsed result
- [ ] 429 triggers exponential backoff and serves last-good cache with a
      stale flag, verified by simulating a blocked network request
- [ ] Section 14 checks pass (lint, typecheck, build)
