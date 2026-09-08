# 007 — Performance & accessibility polish

## Goal

Cross-cutting audit and fix pass per `tasks/10-perf-a11y-polish.md`: close
real gaps found by code review (missing skeletons, a missing focus
indicator, table overflow that clips instead of scrolling on narrow
viewports), and be explicit about what still needs a human with a real
browser (Lighthouse scores, keyboard-only click-through, visual responsive
check) since no headless browser tool exists in this environment.

## Docs read

- `agents.md` section 11 (skeleton first paint, keyboard navigable, visible
  focus states, mobile/desktop responsive) and section 14 (checks).

## Code inspected

Audited the whole `src/` tree directly rather than a single file:

- Every `animationName` usage (5, across `MarketsTableShell.tsx` and
  `coin.$coinId.tsx`) — all already guard `prefers-reduced-motion`. No fix
  needed there.
- Every loading-state branch across `index.tsx`, `coin.$coinId.tsx`,
  `TrendingRail.tsx`, `MarketsTableShell.tsx`.
- Every `overflow`/`@media` usage in `src/`.
- `SearchInput.tsx`'s `outline: 'none'`.

## Findings and decisions

1. **Coin detail page's first load is plain "Loading…" text**, not a
   skeleton — inconsistent with the rest of the app and a literal violation
   of "skeleton rows, not a spinner-only screen" (arguably worse, it's not
   even a spinner). Building a skeleton matching the real layout (identity
   row, price row, stats grid) using the same shimmer keyframe already
   established in `MarketsTableShell.tsx`.
2. **Trending rail has no loading state at all** — it renders nothing until
   data arrives, popping in and shifting layout. Adding pill-shaped skeleton
   placeholders.
3. **Markets table clips instead of scrolling on narrow viewports.** The
   table shell uses `overflow: hidden` for its rounded corners, but the
   grid's 9 columns (`32px 48px minmax(160px,2fr) repeat(4,minmax(80px,1fr))
   120px minmax(90px,1fr)`) can't meaningfully compress to phone width —
   content would be cut off, not accessible via scroll. Switching to
   `overflowX: auto` (keeping `overflowY: hidden` so rounded corners still
   clip vertically) and adding a `minWidth` to the row/header grid so
   columns stay legible instead of being squeezed to illegibility.
4. **`SearchInput` removes the native focus outline with no replacement** —
   a keyboard user tabbing to search gets zero visible indication of focus,
   a direct violation of "visible focus states." Adding a `:focus-within`
   ring on the wrapping pill (keeps the input's own `outline: none` so the
   ring follows the pill's rounded shape instead of a rectangular native
   outline clipped by `overflow`).
5. **No responsive breakpoints anywhere else needed fixing** — the stats
   grids and search box already use `auto-fit`/`max-width: 100%` patterns
   that degrade reasonably on narrow viewports without extra media queries.
6. **What this plan does NOT cover** (needs a human + real browser, listed
   honestly rather than claimed done):
   - Lighthouse Performance ≥ 90 / Accessibility ≥ 95 measurement.
   - An actual keyboard-only click-through of every interactive element.
   - Visual confirmation of the horizontal-scroll fix and skeletons at real
     phone widths.
   - Confirming `prefers-reduced-motion` visually suppresses animations
     (code-verified via the `@media` guard existing; not eye-verified).

## Expected files to create or modify

- `src/routes/coin.$coinId.tsx` — skeleton for the page's first-load state.
- `src/components/TrendingRail.tsx` — skeleton pills while loading (needs an
  `isLoading` prop from the caller).
- `src/routes/index.tsx` — pass `trendingQuery.isLoading` to `TrendingRail`.
- `src/routes/index.tsx` — table shell `overflow` fix.
- `src/components/MarketsTableShell.tsx` — `minWidth` on the grid.
- `src/components/SearchInput.tsx` — `:focus-within` ring.

## Requirements and acceptance criteria

- No animation fires when `prefers-reduced-motion: reduce` is set (already
  true, re-verified after changes).
- Every loading branch shows a skeleton shaped like its real content, never
  bare text or a sudden pop-in.
- Markets table is horizontally scrollable (not clipped) below its natural
  content width.
- Tabbing to the search input shows a visible ring.
- `lint`, `typecheck`, `build` clean.

## Checks to run and manual test steps

1. Section 14 checks.
2. Code-verify (grep) that every new skeleton respects reduced-motion the
   same way the existing ones do.
3. Flag to the user: Lighthouse run, keyboard-only pass, and narrow-viewport
   visual check still need to happen in a real browser.
