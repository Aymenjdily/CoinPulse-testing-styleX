# 08 — Trending rail

**Status:** Done
**Plan:** [prompts/004-home-page.md](../prompts/004-home-page.md)
**Depends on:** 02 (data layer — needs `/search/trending`)

## Scope

Top-7 trending coins rail (agents.md section 1), refreshed on the 10-minute
TTL already defined in `data-policy.ts`. Extended `TrendingCoin` with
`priceChangePercentage24h` (real field from `/search/trending`'s
`item.data.price_change_percentage_24h.usd`, not previously captured in
phase 02) since the reference's trending chips show a 24h change per coin.

## Definition of done

- [x] Shows exactly the top-7 trending coins (already sliced server-side in
      `getTrending()`)
- [x] Refetches on the 10-minute interval, pauses when tab hidden
      (`refetchIntervalInBackground: false`)
- [x] `lint`, `typecheck`, `build` clean
- [ ] Visual verification against `design/home.png` — not run in a real
      browser here. Please spot-check the pill layout/colors.
