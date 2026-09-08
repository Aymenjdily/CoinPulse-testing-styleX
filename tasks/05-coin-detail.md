# 05 — Coin detail page

**Status:** Done
**Plan:** [prompts/006-coin-detail-page.md](../prompts/006-coin-detail-page.md)
**Depends on:** 01 (design system), 02 (data layer)

## Scope

`/coin/$coinId` built from `design/page-details.png`: coin header with
watchlist toggle, hero price + 24h badge, 1H/7D/30D/1Y period changes,
range-tabbed Recharts area chart with crosshair tooltip, and an 8-card
market-stats grid. Table rows and search results now link here.

## Known deviation (deliberate, see prompts/006)

24H High/Low don't show "reached HH:MM UTC" like the reference — CoinGecko
gives the value but never a timestamp for when it occurred. Everything else
in the reference is a real field; extended `CoinDetail` with `high24h`,
`low24h`, `athChangePercentage`, `marketCapChangePercentage24h`,
`priceChangePercentage30d`, `priceChangePercentage1y` — all verified against
the live API (including the `ethereum` no-max-supply case) before shipping.

## Definition of done

- [x] Range tabs switch chart data and respect per-range TTLs (reuses
      phase 02's `getMarketChart` TTLs unchanged)
- [x] Missing supply/ATH/ATL fields render `—` or degrade gracefully —
      verified live against `ethereum` (`maxSupply: null`): circulating
      supply card drops the percentage/progress bar, max supply card shows
      "uncapped"
- [x] Tooltip time formatting uses `Intl.DateTimeFormat`
- [x] No hydration mismatch from relative-time strings (explicit UTC
      formatters throughout, same pattern as the home page)
- [x] Table rows and search results navigate here; watchlist star shared
      via the same `useWatchlist()` store, stays in sync both directions
- [x] `lint`, `typecheck`, `build` clean; verified live end-to-end
      (schema→transform pipeline confirmed against real `bitcoin` and
      `ethereum` API responses, not just typechecked)
- [ ] Full visual comparison against `design/page-details.png` and
      interactive click-through (range tabs, star toggle, chart tooltip
      hover) — not run in a real browser here. Please verify.
