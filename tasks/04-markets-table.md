# 04 — Markets table

**Status:** Not started
**Plan:** none yet
**Depends on:** 01 (design system — stat cards, table header/row styling),
02 (data layer — needs `/coins/markets`)

## Scope

The core product surface (agents.md sections 1, 11): 250 coins, sortable
columns (rank, price, 1h/24h/7d, volume, market cap) via typed URL search
params, tabular numerals, per-row 7-day sparkline from `sparkline_in_7d`
(hand-drawn inline SVG, no per-row request), green/red price-flash on poll
update via `stylex.keyframes`. **Pagination, not virtual scroll** —
`design/home.png` (a full markets-page reference, found alongside the design
system doc) shows numbered pagination ("Showing 1–10 of 250 coins", pages
1/2/3/.../25), which settles the choice agents.md section 7.6 left open.

`design/home.png` also shows the full page shell for this phase: global
stats strip (4 stat cards), trending rail, watchlist star column + tab
filter, and a header with Markets/Watchlist nav + a dark-mode toggle icon.
Re-check it when planning phases 03 (global stats strip), 04 (this phase),
06 (watchlist), 07 (search), and 08 (trending rail) — it wasn't reviewed in
detail for this task file yet, just spotted.

## Definition of done

- [ ] Sortable on every listed column, sort state in shareable URL params
- [ ] Sparklines normalize variable-length arrays, handle empty arrays as `—`
- [ ] Price flash retriggers correctly on value change (not just on mount)
      and never shifts layout
- [ ] `aria-live="off"` on flashing cells
- [ ] 60fps while polling — no full-table remount on refetch
- [ ] Keyboard navigable, visible focus states
- [ ] Lighthouse Performance ≥ 90, Accessibility ≥ 95
- [ ] Section 14 checks pass, including the manual test matrix
