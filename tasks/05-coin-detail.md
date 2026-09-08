# 05 — Coin detail page

**Status:** Not started
**Plan:** none yet
**Depends on:** 01 (design system — range tabs, stat cards),
02 (data layer — needs `/coins/{id}`, `/coins/{id}/market_chart`)
**Blocked on:** the reference covers range tabs and stat cards generically but
has no dedicated coin-detail-page layout — confirm layout before planning, or
compose it from the existing primitives if that's acceptable

## Scope

`/coin/$coinId` (agents.md sections 1, 11): Recharts price chart with range
tabs (24H/7D/30D/1Y, typed search param, each range its own Query entry and
TTL), crosshair tooltip with `Intl.DateTimeFormat`, stats grid (ATH/ATL with
dates, market cap, volume, circulating/total/max supply — missing values
render `—`), price-change chips, external links (homepage).

## Definition of done

- [ ] Range tabs switch chart data and respect per-range TTLs
- [ ] Missing supply/ATH/ATL fields render `—`, never `0` or a crash
- [ ] Tooltip time formatting uses `Intl.DateTimeFormat`
- [ ] No hydration mismatch from relative-time strings
- [ ] Section 14 checks pass
