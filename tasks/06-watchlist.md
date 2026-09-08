# 06 — Watchlist

**Status:** Not started
**Plan:** none yet
**Depends on:** 04 (markets table — star toggle lives there and on coin detail)

## Scope

`localStorage`-only watchlist (agents.md sections 1, 7, 11): star toggle from
table rows and the coin detail page, filterable watchlist view reusing the
same `CoinMarket` data (no duplicate fetch), designed empty state.

## Definition of done

- [ ] Star toggle works from both the table and coin detail page
- [ ] State persists across reload (localStorage), never presented as synced
- [ ] Empty state is a designed component, not a blank area
- [ ] No duplicate network requests for watchlist view
- [ ] Section 14 checks pass, including reload-survival manual test
