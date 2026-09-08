# 006 — Coin detail page

## Goal

Build `/coin/$coinId` exactly as shown in `design/page-details.png`: coin
header with watchlist toggle, hero price with 24h badge, a row of period
changes (1H/7D/30D/1Y), range-tabbed Recharts area chart with crosshair
tooltip, and an 8-card market-stats grid. Wire it up so table rows and
search results actually navigate here (currently dead ends).

## Docs read

- `agents.md` sections 1, 6, 11, 12, 13 (Recharts mandated for this chart
  specifically; crosshair tooltip with `Intl.DateTimeFormat`; missing
  values render `—`, never `0` or a crash; numbers must be honest).
- `design/page-details.png` — full reference, read in detail.
- CoinGecko `/coins/{id}` field reference (recalled from phase 02 work) for
  which of the reference's numbers are real vs. need honest handling.

## Code inspected

- `src/lib/server/coinDetail.ts`, `marketChart.ts` (phase 02) — already
  fetch/validate/cache what most of this page needs.
- `src/lib/types.ts` — current `CoinDetail` shape.
- `src/components/RangeTabs.tsx`, `StatCard.tsx`, `Badge.tsx`, `Button.tsx`
  — reused as-is.
- `src/routes/index.tsx` — pattern for typed search params, `useQuery`
  polling, `usePriceFlash`-style hooks.

## Decisions and assumptions

1. **Two data-availability gaps in the reference, handled honestly:**
   - **24H HIGH / 24H LOW show "reached HH:MM UTC" in the reference.**
     CoinGecko's `/coins/{id}` gives the high/low *values* but no timestamp
     for when they occurred. Not fabricating a time — these two cards show
     just the value, no "reached" caption.
   - Everything else in the reference **is** a real, available field:
     `high_24h`, `low_24h`, `ath_change_percentage`,
     `market_cap_change_percentage_24h`, `price_change_percentage_30d`,
     `price_change_percentage_1y` all exist on the real endpoint and simply
     weren't captured in phase 02's schema (same situation as
     `TrendingCoin.priceChangePercentage24h` before it) — extending
     `CoinDetail` to include them now.
2. **Two derived-but-honest captions**, computed from real fetched numbers
   rather than invented:
   - "2.2% of market cap" (24h volume card) = `totalVolume / marketCap`.
   - "94% of max supply" + progress bar (circulating supply card) =
     `circulatingSupply / maxSupply`. If `maxSupply` is null (true for many
     coins, e.g. Ethereum), the card shows the supply number with no
     percentage/bar — never a fake 100% or hidden card.
   - "7d · hourly · 168 points" (chart caption) — "points" is the real
     `prices.length`; the granularity word is *measured* from the actual
     average interval between consecutive timestamps in the response, not
     assumed from CoinGecko's documented-but-unverified auto-granularity
     behavior.
3. **New type-scale token**: the hero price in this reference is visibly
   larger than the existing `type.displaySize` (30px) — adding
   `type.heroSize` (48px) rather than hardcoding, since this is a real
   recurring need (the largest number on the page), not a one-off.
4. **Recharts added now** (`recharts`, not yet installed) — agents.md
   section 6 mandates it specifically for this chart (table sparklines stay
   hand-drawn SVG, unchanged).
5. **Range/TTL reuse**: 24H/7D/30D/1Y map directly to the existing
   `getMarketChart({coinId, days: 1|7|30|365})` and its already-defined TTLs
   (5min/15min/1hr/1hr) — no new server function needed.
6. **No description or homepage link** — not shown in this reference, so
   not added (section 3: reproduce exactly, don't embellish). The `CoinDetail`
   type already carries these fields for whenever a future page needs them.
7. **Table rows and search results become links to this page** — the
   reference doesn't show this explicitly, but building the detail page and
   *not* linking to it would leave it dead code. `MarketsTableRow`'s coin
   cell and `SearchResults`' option both become `Link`s to
   `/coin/$coinId`, keeping the star-toggle button as a separate
   non-navigating control (`stopPropagation`/nested-interactive handled by
   making the row a wrapping link around everything except the star
   button, not the whole `<tr>`-equivalent).
8. **Watchlist toggle button here reuses `useWatchlist()`** — same
   localStorage store as the table, so starring here reflects on the table
   and vice versa automatically.
9. **Polling**: coin detail data polls at its existing TTL-matched interval
   (5 min, matching `CACHE_TTL_MS.coinDetail`) via `useQuery`, paused when
   the tab is hidden, consistent with the rest of the app.

## Expected files to create or modify

- `package.json` — add `recharts`.
- `src/lib/types.ts`, `src/lib/server/coinDetail.ts` — extend `CoinDetail`
  with `high24h`, `low24h`, `athChangePercentage`,
  `marketCapChangePercentage24h`, `priceChangePercentage30d`,
  `priceChangePercentage1y`.
- `src/styles/tokens.stylex.ts` — add `type.heroSize`.
- `src/routes/coin.$coinId.tsx` (new) — the page itself.
- `src/components/PriceChart.tsx` (new) — Recharts area chart wrapper:
  gradient fill, dashed max-value guide line, floating current-price
  bubble, crosshair tooltip (`Intl.DateTimeFormat`).
- `src/components/MarketsTableShell.tsx` — coin cell becomes a `Link`.
- `src/components/SearchResults.tsx` — options become `Link`s; keep
  keyboard Enter-to-navigate behavior.
- `src/components/Header.tsx` — search Enter/click now navigates instead of
  just closing the dropdown.

## Requirements and acceptance criteria

- Range tabs switch the chart's data source and respect each range's TTL.
- Missing `circulatingSupply`/`totalSupply`/`maxSupply`/`athDate`/`atlDate`
  render `—`, never `0` or a crash (test against a coin with null
  `maxSupply`, e.g. `ethereum`).
- Chart tooltip shows price + time via `Intl.DateTimeFormat`, not
  hand-rolled string math.
- No hydration mismatch from relative-time strings (reuse the existing
  `Intl.DateTimeFormat`-with-explicit-UTC pattern from `index.tsx`).
- Watchlist star here and on the table stay in sync (shared hook/store).
- Table rows and search results navigate here correctly by coin id.
- `lint`, `typecheck`, `build` clean.

## Security/privacy considerations

None beyond what phase 02 already established.

## Checks to run and manual test steps

1. Section 14 checks.
2. Click a table row → lands on the right coin's detail page.
3. Search a coin, press Enter → navigates there too.
4. Switch all four range tabs, confirm the chart updates and the "points"
   caption changes with it.
5. Star/unstar from the detail page, confirm the table reflects it (and
   vice versa).
6. Visit a coin with no max supply (e.g. `ethereum`) — confirm the max
   supply card and circulating-supply percentage degrade to `—` /
   no-progress-bar rather than crashing or showing `0%`/`100%`.
7. Visual compare against `design/page-details.png`.
