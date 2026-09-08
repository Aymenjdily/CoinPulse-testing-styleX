# 06 — Watchlist

**Status:** Done
**Plan:** [prompts/004-home-page.md](../prompts/004-home-page.md)
**Depends on:** 04 (markets table — star toggle lives there)

## Scope

`localStorage`-only watchlist (agents.md sections 1, 7, 11): star toggle
from table rows, `?view=watchlist` filters the same table to starred coins
(no duplicate fetch — same `getMarkets()` result, filtered client-side),
designed empty state. Coin-detail-page star toggle deferred to phase 05
(that page doesn't exist yet).

## Decision

One `view` search param shared by the header nav "Watchlist" link and the
inline "All coins / Watchlist · N" tab, rather than a separate route — see
`prompts/004-home-page.md` decision 7.

## Definition of done

- [x] Star toggle works from the table (`useWatchlist().toggle`)
- [x] State persists across reload — backed by `localStorage` via
      `useSyncExternalStore`, not a manual hydration-guard effect
- [x] Empty state is a designed component ("Star a coin to pin it here"),
      not a blank area
- [x] No duplicate network requests for watchlist view (filters the existing
      `getMarkets()` result)
- [x] `lint`, `typecheck`, `build` clean
- [ ] Reload-survival manual test — not run in a real browser here (star a
      coin, reload, confirm it's still starred). Please verify.
