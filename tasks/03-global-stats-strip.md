# 03 — Global stats strip

**Status:** Done
**Plan:** [prompts/004-home-page.md](../prompts/004-home-page.md)
**Depends on:** 01 (design system), 02 (data layer — needs `/global`)

## Scope

Header strip (agents.md section 1): total market cap, 24h volume, BTC
dominance, active cryptocurrencies count. Always visible. Polls every 5 min
per `data-policy.ts`, pauses when tab hidden. Honest staleness indicator on
provider failure.

## Known deviation from design/home.png (deliberate, see prompts/004)

CoinGecko's `/global` only provides one real 24h delta
(`marketCapChangePercentage24h`). The reference shows a colored delta badge
on all four cards; built as real delta on Total Market Cap only, no badge on
24h Volume or BTC Dominance (nothing honest to show), plain "tracked live"
caption on Active Coins. Never fabricated the missing two.

## Definition of done

- [x] Renders real `GlobalData` fields, no placeholder numbers
- [x] Big numbers use `Intl.NumberFormat` compact notation (no manual
      `toFixed` on trillions)
- [x] Poll pauses in hidden tabs (`refetchIntervalInBackground: false`)
- [x] Stale state visible on provider failure — a "Showing stale data · last
      updated …" notice appears above the stats grid when `getGlobal()`
      returns `stale: true`
- [x] Uses only `tokens.stylex.ts` values, no hardcoded hex/px
- [x] `lint`, `typecheck`, `build` pass; SSR render confirmed via curl
- [ ] Full interactive/visual verification in an actual browser wasn't done
      in this environment (no headless browser tool available) — please
      spot-check against `design/home.png` yourself.
