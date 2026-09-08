# 04 — Markets table

**Status:** Done
**Plan:** [prompts/004-home-page.md](../prompts/004-home-page.md)
**Depends on:** 01 (design system — stat cards, table header/row styling),
02 (data layer — needs `/coins/markets`)

## Scope

The core product surface (agents.md sections 1, 11): 250 coins, sortable
columns (rank, price, 1h/24h/7d, volume, market cap) via typed URL search
params, tabular numerals, per-row 7-day sparkline from `sparkline_in_7d`
(hand-drawn inline SVG, no per-row request), green/red price-flash on poll
update via `stylex.keyframes`, pagination (10/page, numbered with ellipsis,
`page` as a typed search param).

## Definition of done

- [x] Sortable on every listed column, sort state in shareable URL params
      (`?sort=…&dir=…`)
- [x] Sparklines normalize variable-length arrays, handle empty arrays as `—`
- [x] Price flash retriggers correctly on value change (diffs consecutive
      poll results by coin id, `usePriceFlash` hook) and never shifts layout
      (background-only keyframe, no size/position change)
- [x] `aria-live="off"` on flashing cells
- [x] No full-table remount on refetch (sort/pagination happen client-side
      over the already-fetched 250-coin array; TanStack Query keeps the same
      component tree across polls)
- [x] Keyboard navigable (native buttons for every interactive header cell,
      star toggle, and pagination control — all reachable and operable via
      keyboard by default)
- [ ] Lighthouse Performance ≥ 90 / Accessibility ≥ 95 and "60fps while
      polling" — not measured; needs a real browser + Lighthouse run, not
      available in this environment. Please check.
- [x] `lint`, `typecheck`, `build` clean
- [ ] Full manual test matrix (section 14) — visual match against
      `design/home.png`, clicking through sort/pagination/star toggle,
      `prefers-reduced-motion` — not run in a real browser here. Please
      verify.
