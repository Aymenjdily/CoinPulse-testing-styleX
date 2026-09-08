# 004 — Home page (markets dashboard)

## Goal

Build the real home page (`/`) exactly as shown in `design/home.png`: header
with nav + search + live badge, a global stats strip, a trending rail, and a
sortable, paginated, live-polling markets table with watchlist stars —
replacing the phase-01 component gallery and the phase-02 debug route. This
consolidates tasks 03 (global stats strip), 04 (markets table), 06
(watchlist), 07 (search), and 08 (trending rail) into one build, per the
user's explicit choice to do this as one full build rather than five
separate approval cycles.

## Docs read

- `agents.md` sections 1, 6, 7, 8, 9, 11, 12, 13.
- `design/home.png` — full reference, re-examined in detail for this plan.
- TanStack Query v5 docs (web search) — `useQuery`, `refetchInterval`,
  `refetchIntervalInBackground: false`, `QueryClientProvider` SSR-safe setup
  with TanStack Start (client created via `useState(() => new
  QueryClient())`).
- Lucide React docs (web search) — confirmed `lucide-react` is the package,
  tree-shakeable named imports.

## Code inspected

- `src/lib/server/*.ts` — the six server functions from phase 02, callable
  directly from client components.
- `src/components/{Button,Badge,RangeTabs,SearchInput,StatCard,MarketsTableShell}.tsx`
  — phase-01 primitives, several extended here (see below).
- `src/routes/index.tsx` — currently the phase-01 gallery, replaced.
- `src/routes/debug.data.tsx` — phase-02 debug route, deleted (its job is
  done — real UI now consumes this data).
- `src/styles/tokens.stylex.ts` — confirmed `chartLine`/sparkline tokens
  already exist for the table's sparkline column.

## Decisions and assumptions

1. **TanStack Query added now** (`@tanstack/react-query`, not yet
   installed) — agents.md section 6 mandates it for all client polling.
   `QueryClientProvider` wraps the app in `__root.tsx` with a client created
   via `useState(() => new QueryClient())` (the standard SSR-safe pattern —
   avoids sharing a client across requests). No SSR prefetch/dehydrate in
   this build (see point 9) — kept simple, revisit in phase 10 if the
   plain-loading first paint isn't good enough.
2. **Lucide added now** (`lucide-react`) — agents.md section 6 names it as
   the one icon set. Every new icon in this build (star, flame, chevrons,
   sort arrows, search, arrow-up/down for badges) uses Lucide. The existing
   small inline SVGs in `Badge.tsx` and `SearchInput.tsx` (arrow-up/down,
   search) get swapped to Lucide too, so the repo doesn't end up with two
   icon systems — a one-line change in each, not a redesign.
3. **Dark-mode toggle icon: omitted for now.** The reference header shows a
   moon icon, but dark theme (phase 09) doesn't exist yet and is blocked on
   its own reference. A toggle that does nothing would be worse than no
   toggle. Adding it back is a one-line change once phase 09 ships — noted
   there, not silently dropped.
4. **Footer text drops "shadcn-cssinjs".** The reference footer reads
   "TanStack Start × StyleX × shadcn-cssinjs"; this project doesn't use
   shadcn (agents.md section 6, decided in the design-system phase). Footer
   reads "TanStack Start × StyleX".
5. **Global stats strip: only real deltas shown, not all four from the
   reference.** CoinGecko's `/global` only provides one true 24h delta
   (`marketCapChangePercentage24h`). The reference shows a colored delta on
   all four cards; the real API doesn't support that for volume or BTC
   dominance. Built as: Total Market Cap → real delta badge. 24h Volume →
   no badge (no real figure to show — omitting rather than inventing one,
   agents.md section 7.9). BTC Dominance → no badge, same reason. Active
   Coins → plain "tracked live" caption (already what the reference shows,
   no number needed). `StatCard` gains an optional `note` (plain muted
   text) prop alongside the existing `delta` (badge) prop to support this.
6. **`TrendingCoin` schema extended** with `priceChangePercentage24h`
   (`item.data.price_change_percentage_24h.usd` in the real `/search/trending`
   response) — this field exists in the real API and simply wasn't captured
   in phase 02's schema. The reference's trending chips need it (SOL
   "+2.4%" etc.); adding it is extending honest data coverage, not
   inventing a number. Updates `src/lib/server/trending.ts` and
   `src/lib/types.ts`.
7. **Watchlist: one `view` search param, not a separate route.** The
   reference shows both a header nav "★ Watchlist" link and an inline
   "All coins / ★ Watchlist · 3" tab on the markets section. Implemented as
   a single typed search param (`?view=all|watchlist`) that both the header
   link and the inline tab read/write — avoids a duplicate table
   implementation behind a second route. `useWatchlist()` hook manages the
   starred-id list in `localStorage` (agents.md section 7.4).
8. **Pagination, not virtual scroll** (already decided in
   `tasks/04-markets-table.md` from the `home.png` reference) — 10 rows per
   page, numbered pagination with ellipsis, `page` as a typed search param.
   All 250 coins are fetched in one `getMarkets` call (already true today);
   sorting and pagination happen client-side over that array — no extra
   network requests per page/sort change.
9. **No SSR prefetch/dehydrate for the markets query in this build.** Data
   loads client-side via `useQuery`; first paint shows skeleton rows
   (agents.md section 11) rather than real data. This is a deliberate
   scope cut to keep this already-large build shippable — full SSR
   prefetch is a reasonable phase-10 performance improvement, not required
   for correctness now.
10. **Price flash**: a `usePriceFlash(markets)` hook diffs consecutive
    `getMarkets` poll results by coin id and returns a transient
    `Map<id, 'up' | 'down'>` cleared after `duration.slow` (320ms) via
    `stylex.keyframes`, respecting `prefers-reduced-motion` (agents.md
    section 12.7). Applies to the price cell and the 24h change cell —
    matches "data density done right" from section 1, not deferred to
    later polish since it's core to the markets table's own definition of
    done (`tasks/04-markets-table.md`).
11. **Sort state**: typed search params `sort` (rank | price | change1h |
    change24h | change7d | volume | marketCap) and `dir` (asc | desc),
    validated with `validateSearch`. Clicking a header cell toggles it.
12. **Coin icons are real `<img>` tags** using `CoinMarket.image` from the
    API (the phase-01 gallery's colored-circle placeholder was only ever a
    demo stand-in).

## Expected files to create or modify

- `package.json` — add `@tanstack/react-query`, `lucide-react`.
- `src/routes/__root.tsx` — wrap children in `QueryClientProvider`.
- `src/routes/index.tsx` — full rewrite: the real home page, composing
  everything below. Typed `validateSearch` for `view`, `sort`, `dir`,
  `page`.
- `src/routes/debug.data.tsx` — deleted.
- `src/lib/types.ts`, `src/lib/server/trending.ts` — add
  `priceChangePercentage24h` to `TrendingCoin`.
- `src/hooks/useWatchlist.ts` (new) — localStorage-backed starred-id set.
- `src/hooks/usePriceFlash.ts` (new) — poll-diff flash-direction map.
- `src/components/StatCard.tsx` — add optional `note` prop.
- `src/components/Badge.tsx`, `src/components/SearchInput.tsx` — swap inline
  SVGs for `lucide-react` icons.
- `src/components/MarketsTableShell.tsx` — add star column, real `<img>`
  icons, clickable/sortable header cells with sort-direction indicator,
  price-flash integration, skeleton-row variant.
- `src/components/TrendingRail.tsx` (new) — the 🔥 trending chip row.
- `src/components/Pagination.tsx` (new) — numbered pagination with
  ellipsis.
- `src/components/SearchResults.tsx` (new) — the search dropdown
  (keyboard-navigable results list), wired to `SearchInput`.
- `src/components/Header.tsx` — nav links (Markets/Watchlist), live badge,
  search input wired to real search.
- `src/components/Footer.tsx` — updated copy (drop shadcn-cssinjs mention).

## Requirements and acceptance criteria

(Combines the definition-of-done from `tasks/03,04,06,07,08`.)

- Global stats strip renders real `GlobalData`, no invented deltas.
- Trending rail shows exactly the real top-7 trending coins with real 24h
  change.
- Markets table: sortable on every listed column via shareable URL params,
  paginated (10/page) via a shareable URL param, tabular numerals
  throughout, sparklines handle variable-length/empty arrays, price flash
  retriggers on value change without shifting layout, `aria-live="off"` on
  flashing cells.
- Watchlist star toggles from the table, persists in `localStorage` across
  reload, `?view=watchlist` filters to starred coins with a designed empty
  state when there are none.
- Search is debounced 300ms, keyboard-navigable (↑/↓/Enter/Escape), every
  result traces to a real `/search` response field, explicit "no matches"
  state.
- Markets list polls every 60s, global/trending on their own TTL-matched
  intervals, all paused when the tab is hidden
  (`refetchIntervalInBackground: false`).
- No component hardcodes a color/spacing/radius/font value that has a
  token.
- `npm run lint`, `npm run typecheck`, `npm run build` all clean.
- Network tab: zero direct browser calls to `api.coingecko.com`.

## Security/privacy considerations

None beyond what phase 02 already established — this phase only consumes
those server functions from the client.

## Checks to run and manual test steps

1. `npm run lint`, `npm run typecheck`, `npm run build`.
2. `npm run dev` → visually compare `/` against `design/home.png`.
3. Sort every column both directions; confirm URL updates and state
   survives a page reload.
4. Paginate through all 25 pages; confirm page count matches 250 coins ÷ 10.
5. Star a few coins, reload, confirm they're still starred; switch to
   `?view=watchlist`, confirm only starred coins show; unstar all, confirm
   the empty state appears.
6. Search "eth", confirm real results, test keyboard nav and Escape; search
   nonsense, confirm the "no matches" state.
7. Watch the table for 60+ seconds, confirm at least one price flashes
   green/red without shifting layout; confirm `prefers-reduced-motion`
   suppresses the animation (OS-level toggle or DevTools emulation).
8. DevTools Network tab: confirm no request goes to `api.coingecko.com`
   directly.
9. Mobile breakpoint check (this reference is desktop-only — responsive
   behavior follows agents.md section 3's "no mobile reference, make it
   responsive sensibly" rule).
