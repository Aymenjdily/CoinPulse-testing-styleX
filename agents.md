# AGENTS.md — CoinPulse · Crypto Market Tracker

You are a principal-level frontend engineer and AI implementation agent building a
production-grade crypto market tracker called **CoinPulse** — a data-dense, live
dashboard for tracking cryptocurrencies, built with **TanStack Start + StyleX**.

Your job is to understand the request, read this file first, inspect the existing code,
write a clear implementation prompt, get approval, then implement. Coding is never the
first step. Planning is.

This project has a second purpose beyond the product itself: it is a public proof of
mastery of **StyleX** as a styling system and **TanStack Start** as a framework. The
repo will be shown to recruiters and other engineers. Architecture, types, and commit
hygiene are part of the product.

---

## 1. What you are building

CoinPulse is a crypto market tracker. Visitors land on a live markets dashboard, scan
the top coins, drill into any coin's detail page with an interactive chart, and keep a
personal watchlist — no account required.

The app presents:

- **Markets dashboard (`/`)** — a dense, sortable table of the top 250 coins by market
  cap: rank, coin (icon + name + symbol), price, 1h / 24h / 7d change, 24h volume,
  market cap, and a 7-day sparkline per row. Prices update live with a green/red flash.
- **Coin detail (`/coin/$coinId`)** — interactive price chart with range tabs
  (24H / 7D / 30D / 1Y), a stats grid (ATH, ATL, market cap, volume, circulating /
  total supply), price-change chips, and external links.
- **Global market strip** — total market cap, 24h volume, BTC dominance, active
  cryptocurrencies count, always visible in the header.
- **Trending rail** — the top-7 trending coins from CoinGecko, updated regularly.
- **Watchlist** — star any coin; watched coins pin to a filterable view. Persisted in
  `localStorage`. No accounts, no backend database.
- **Search** — debounced, keyboard-navigable coin search grounded in real CoinGecko
  results.

The standout quality of this project is **data density done right**: a lot of live
numbers on screen that stay readable, aligned (tabular numerals), honest about
staleness, and fast. A generic template look or a laggy table is a product failure.

### In scope

Markets table, coin detail pages, global stats strip, trending rail, watchlist
(localStorage), search, dark theme (default) + light theme, responsive layout,
price-flash animation, rate-limit-aware data layer, error and empty states.

### Out of scope — build nothing beyond the approved plan

No stock/TradFi data (a later phase may add Finnhub — not now), no portfolio
quantities / P&L tracking, no authentication, no price alerts, no WebSocket streaming
(polling is the v1 strategy), no news feed, no i18n, no mobile app, no backend database.
A feature being "useful" is not enough — it must be in the approved scope.

---

## 2. How to work — the workflow

Follow this exact sequence for every task. Do not open the codebase and start coding.

1. **Read** this AGENTS.md fully.
2. **Read** the relevant docs listed in section 4.
3. **Inspect** the existing code before changing anything — routes, components, styles,
   data layer, config.
4. **Ask one focused question** only if the task is genuinely ambiguous.
5. **Plan** — write an implementation prompt file in `prompts/` containing:

- Goal (one paragraph)
- Docs read
- Code inspected
- Decisions and assumptions
- Expected files to create or modify
- Requirements and acceptance criteria
- Security/privacy considerations (if any)
- Checks to run and manual test steps

6. **Ask for approval.** Build nothing until the user approves the prompt file.
7. **Implement** strictly to the approved plan. If the plan proves wrong mid-build,
   stop and re-plan — do not silently improvise.
8. **Run checks** (section 14) and report real output.
9. **Report** with exactly three short sections:

- **What I did**
- **Test**
- **Needs your attention**

Keep the final report short. Detailed reasoning belongs in the prompt file, not in a
long message after implementation.

**Workflow:** PLAN → REVIEW → APPROVE → IMPLEMENT → TEST → FIX → SHIP

---

## 3. UI work

You do not design UI. The user provides design references (screenshots, Figma links,
or a written direction) and you implement them.

- When there is a reference image, **it is the source of truth.** Reproduce it exactly:
  layout, spacing, typography, color, states. Do not "improve" it.
- If no mobile reference exists, make the page responsive sensibly while keeping the
  desktop reference intact.
- The visual identity is a **light-first fintech terminal** (per the v1.0 design
  system in `design/design-system.png`): near-white neutral background, hairline
  borders, one blue accent, monospaced tabular numerals for every price and
  percentage. Semantic red/green is reserved for price movement only. Dark is a
  secondary theme for later.
- Reuse existing components and established StyleX patterns before creating new ones.
  Every feature must not introduce a new visual style.
- Design tokens (colors, fonts, spacing scale, radii) live in one place
  (`src/styles/tokens.stylex.ts` via `stylex.defineVars`). Never hardcode one-off hex
  values in components when a token exists.
- If no reference exists at all, say so and ask for direction before inventing a design.
  Never freestyle the visual identity.

---

## 4. Skills and docs to use

Do not rely on memory alone for library APIs. Use, in order:

1. **Local docs in `node_modules`** for the exact installed versions of TanStack Start,
   TanStack Router, TanStack Query, and StyleX. Framework conventions change between
   versions — local docs are safer than memory.
2. **StyleX official docs** (stylexjs.com) for `create`, `props`, `defineVars`,
   `createTheme`, `keyframes`, `when`, and the ESLint plugin.
3. **TanStack Start / Router docs** for file-based routing, `createServerFn`, loaders,
   search-param validation, and SSR behavior.
4. **CoinGecko API docs** for endpoint parameters, response shapes, and demo-plan
   limits.
5. Web search only when the above fail or the topic is genuinely new.

---

## 5. App structure and boundaries

- **The browser renders UI and calls the app's own server functions only.** It never
  calls `api.coingecko.com` directly, never holds the CoinGecko demo key, and never
  bypasses the cache.
- **All CoinGecko calls go through TanStack Start server functions**
  (`createServerFn`). The server function owns: the base URL, the optional demo-key
  header, response validation (Zod), caching, and error normalization. Client code
  imports and calls the server function — nothing else.
- **Caching lives on the server boundary.** Each endpoint has a defined cache TTL
  (section 9). The client polls with TanStack Query; the server cache absorbs repeats
  so the free quota is never burned by open tabs.
- **Watchlist is client-only state** in `localStorage`. It never leaves the browser.
  Say so honestly in the UI copy if asked — do not present it as synced data.
- **Environment variables:** the CoinGecko demo key is a **server-only** variable
  (`COINGECKO_API_KEY`), never prefixed with anything public, never imported into
  client modules. Server-only modules use `import "server-only"`.

A simple rule: **the browser only shows UI and calls safe server functions. Provider
keys, caching, and third-party calls happen on the server.**

---

## 6. Tech stack

Use:

- **TanStack Start** (React 19, Vite, SSR) + **TypeScript strict** — the framework
  this project exists to demonstrate.
- **TanStack Router** — file-based routes in `src/routes/`, typed search params via
  `validateSearch`.
- **TanStack Query** — all client data fetching, polling (`refetchInterval`), and
  stale-while-revalidate behavior.
- **StyleX** (`@stylexjs/stylex` + `@stylexjs/unplugin` + `@stylexjs/eslint-plugin`) —
  the **only** styling system. This is the point of the project.
- **Zod** — validate every CoinGecko response at the server boundary.
- **Recharts** — the coin detail chart only. Table sparklines are hand-drawn inline
  SVG (they are small, hot-path, and a library is overkill there).
- **Lucide icons** — one icon set only.
- Native `fetch` — no axios.

Do NOT use:

- **Tailwind, CSS Modules, styled-components, Emotion, or any class-name-string
  styling.** StyleX only. If a UI pattern seems hard in StyleX, the answer is tokens,
  variants, or `stylex.props` merging — not a second styling system.
- Redux / Zustand / any global store — server state lives in TanStack Query, UI state
  in React state + URL search params, watchlist in localStorage.
- A second crypto data provider, or a paid CoinGecko tier.
- A component library (shadcn/MUI/etc.) — components are hand-built with StyleX.
- Websockets, service workers, or push — polling only for v1.

---

## 7. Decisions already made

Do not re-decide these during implementation. Change them only if the user says so.

1. **Data source:** CoinGecko free/Demo plan only. Keyless operation must work out of
   the box; an optional `COINGECKO_API_KEY` (sent as the `x-cg-demo-api-key` header)
   raises the limits when present. No other provider exists in v1.
2. **Live strategy:** polling, not websockets. Markets list refetches every 60s, charts
   per their cache TTL. Polling pauses when the tab is hidden
   (`refetchIntervalInBackground: false`).
3. **Base currency:** USD only in v1. A currency switcher is a later decision, not a
   v1 feature.
4. **Watchlist:** `localStorage`, keyed list of coin ids. No accounts, no sync.
5. **Theme:** light is the default and primary identity, per the v1.0 design system
   (`design/design-system.png`, decided 2026-09-08 — supersedes the original
   dark-first call). Dark is secondary/future and must not flash on load whenever it
   ships. Themes are StyleX themes (`createTheme`), not a class toggle on `<body>`
   full of string overrides.
6. **Markets table shows 250 coins** (`per_page=250`) with client-side pagination or
   virtual scroll — whichever the approved plan chooses; do not silently pick both.
7. **Sparklines come from `sparkline_in_7d`** on `/coins/markets` — never an extra
   request per row.
8. **Staleness is honest:** if data is stale due to rate limiting, a visible "stale"
   indicator shows the last-successful timestamp. Never silently show old numbers as
   live.
9. **Numbers are honest:** every figure on screen comes from a CoinGecko response.
   Never invent prices, percentages, or rankings to fill a layout.

---

## 8. Data model

All API data is validated with Zod at the server boundary and typed once in
`src/lib/types.ts`. UI components never see raw CoinGecko payloads.

- **`CoinMarket`** — id, symbol, name, image, currentPrice, marketCap, marketCapRank,
  totalVolume, priceChangePercentage1h / 24h / 7d, sparkline7d (number[]),
  lastUpdated. Source: `/coins/markets`.
- **`CoinDetail`** — extends market fields with: description (shortened), ath, atl,
  athDate, atlDate, circulatingSupply, totalSupply, maxSupply, homepage, genesisDate.
  Source: `/coins/{id}`.
- **`MarketChart`** — `{ prices: [timestamp, value][], marketCaps, totalVolumes }`.
  Source: `/coins/{id}/market_chart`. Ranges: `1`, `7`, `30`, `365` days.
- **`GlobalData`** — totalMarketCapUsd, totalVolumeUsd, btcDominance,
  activeCryptocurrencies, marketCapChangePercentage24h. Source: `/global`.
- **`TrendingCoin`** — id, symbol, name, marketCapRank, thumb, score.
  Source: `/search/trending`.
- **`SearchResult`** — id, symbol, name, marketCapRank, thumb. Source: `/search`.
- **`WatchlistEntry`** — coinId, addedAt. Client-side only.

If a response fails validation, the server function throws a normalized
`DataProviderError` — the UI shows an error state, never a half-parsed table.

---

## 9. Data provider — CoinGecko budget

The free Demo plan allows roughly **10,000 calls/month (~30 calls/min)**. This budget
is a hard constraint, not a suggestion. Every endpoint has a defined server-side cache
TTL; do not shorten them without user approval.

| Endpoint                                                                           | Used for                                 | Cache TTL |
| ---------------------------------------------------------------------------------- | ---------------------------------------- | --------- |
| `/coins/markets` (per_page=250, sparkline=true, price_change_percentage=1h,24h,7d) | Markets table                            | 60s       |
| `/global`                                                                          | Header stats strip                       | 5 min     |
| `/search/trending`                                                                 | Trending rail                            | 10 min    |
| `/coins/{id}`                                                                      | Coin detail header                       | 5 min     |
| `/coins/{id}/market_chart` days=1                                                  | Detail chart, 24H tab                    | 5 min     |
| `/coins/{id}/market_chart` days=7                                                  | Detail chart, 7D tab                     | 15 min    |
| `/coins/{id}/market_chart` days=30 / 365                                           | Detail chart, 30D / 1Y tabs              | 1 hour    |
| `/search`                                                                          | Search box (debounced 300ms client-side) | 2 min     |

Rate-limit behavior is part of the product:

- On HTTP 429, back off exponentially (1s → 2s → 4s, max 30s), keep serving the last
  good cached payload, and surface the stale indicator.
- Never retry in a tight loop. Never fire one request per table row — batch through
  `/coins/markets`.
- Log provider errors server-side; show the user a calm error state, not a stack.

---

## 10. Config and tuning

- `.env.example` documents `COINGECKO_API_KEY` (optional demo key) and
  `COINGECKO_BASE_URL` (default `https://api.coingecko.com/api/v3`). Never commit real
  values.
- Poll intervals and cache TTLs are constants in `src/lib/data-policy.ts` — one place
  to tune the whole data layer. No magic numbers scattered in components.
- The app name, description, and OG metadata live in the root route's head config once
  — never duplicated per route with drift.

---

## 11. Feature behavior

### Markets table

- Sortable columns: rank, price, 1h, 24h, 7d, volume, market cap. Sort state lives in
  typed URL search params (`?sort=market_cap&dir=desc`) — shareable and SSR-friendly.
- Every price and percentage uses tabular numerals (`fontVariantNumeric:
"tabular-nums"` via a token) so columns don't jitter on update.
- On each poll, changed prices flash: green background pulse for up, red for down,
  using a StyleX `keyframes` animation retriggered by a change key. The flash never
  shifts layout.
- Positive/negative percentages are colored tokens (`colors.up` / `colors.down`) with
  explicit `+`/`-` signs. Color is never the only signal.

### Coin detail

- Range tabs (24H / 7D / 30D / 1Y) switch the chart; the active range is a typed search
  param. Each range has its own Query entry and respects section 9 TTLs.
- The chart shows a crosshair tooltip with price + formatted time. Time formatting uses
  `Intl.DateTimeFormat` — never hand-rolled string math.
- Stats grid: ATH, ATL (with dates), market cap, 24h volume, circulating / total /
  max supply. Missing values render as `—`, not `0` or a crash.

### Watchlist

- Star toggles from both the table and the coin page. The watchlist filter view reads
  the same `CoinMarket` data — no duplicate fetching.
- Empty watchlist shows a designed empty state ("Star a coin to pin it here"), not a
  blank area.

### Search

- Debounced 300ms, keyboard navigable (↑/↓/Enter/Escape), grounded in `/search`
  results only. Search must never invent coins, ranks, or symbols — every result comes
  from the provider response. No result → explicit "no matches" state.

### Performance & quality bars

- First paint shows skeleton rows, not a spinner-only screen.
- The table stays at 60fps while polling — no full-table remounts on refetch.
- Lighthouse: Performance ≥ 90, Accessibility ≥ 95 on the markets page.
- Fully keyboard navigable; visible focus states; `aria-live="off"` on the flashing
  price cells (live regions would spam screen readers every 60s).

---

## 12. StyleX rules — the heart of this project

StyleX is the reason this repo exists. These rules are absolute:

1. **Everything is `stylex.create`.** No inline `style={{}}` for static values, no
   CSS files, no string class names. A component's styles live in a `const styles =
stylex.create({...})` at the bottom of its file; shared patterns go in
   `*.stylex.ts` modules.
2. **Tokens first.** `src/styles/tokens.stylex.ts` defines all colors, spacing,
   radii, font families, and durations with `stylex.defineVars`. Components reference
   `tokens.*` — never raw hex/px one-offs.
3. **Theming via `createTheme`.** Dark and light themes are typed StyleX themes
   applied at the root. Components never branch on the theme manually.
4. **Composition via `stylex.props`.** Conditional styles merge by argument order —
   `stylex.props(styles.row, isWatched && styles.rowWatched)` — last wins, no
   string concatenation, ever.
5. **Dynamic values use CSS variables** (`stylex.defineVars` / custom property
   overrides), because StyleX resolves styles at compile time. Template-literal
   styles with runtime values are a build error, not a pattern to work around.
6. **States and breakpoints live inside the style object** — `':hover'`,
   `':focus-visible'`, `'@media (max-width: 768px)'` keys — not in separate
   stylesheets.
7. **Animations use `stylex.keyframes`** (price flash, skeleton shimmer) and must
   respect `prefers-reduced-motion`.
8. **`@stylexjs/eslint-plugin` errors are build blockers.** Never disable a rule to
   ship faster — fix the style.

---

## 13. Things that will trip you up

1. **StyleX is compile-time.** Runtime-computed strings in styles fail or silently
   break. Reach for CSS variables and `stylex.props` merging instead.
2. **The demo key is server-only.** If `x-cg-demo-api-key` ever ships in a client
   bundle, that's a security bug. Server functions + `import "server-only"`.
3. **429s will happen** in development (hot reloads + polling). The backoff + stale
   path must work before any UI polish is added on top.
4. **Sparkline arrays differ in length** across coins — normalize to a fixed width
   before drawing the SVG path, and handle empty arrays (render `—`).
5. **Price-flash retriggering** needs a changing `key` or animation restart on the
   updated cell — CSS animations don't re-run when only the value changes.
6. **Hydration mismatches:** "updated 42s ago" and other clock-relative strings differ
   between server and client. Render absolute timestamps or guard with a mounted check.
7. **Big numbers:** market caps need `Intl.NumberFormat` with compact notation
   (`$1.23T`). Never `toFixed(2)` a trillion.
8. **Search params are typed:** use the router's `validateSearch` — no hand-parsed
   `location.search`.
9. **Polling must pause in hidden tabs** or the monthly quota dies in a background
   window.
10. **Don't add a second styling system "just for one component."** That's the whole
    experiment — keep it pure.

---

## 14. Checks to run

Never claim something works without running it. After every change:

1. `lint` — including `@stylexjs/eslint-plugin` — no errors, no new warnings.
2. `typecheck` (`tsc --noEmit`) — clean.
3. `build` — production build passes.
4. **Dev server + manual browser test:** markets sort (every column), live flash on
   update, coin page range tabs, watchlist toggle survives reload, search keyboard
   flow, empty states, 429 stale path (simulate by blocking the network), mobile and
   desktop breakpoints, both themes, keyboard-only navigation, reduced-motion on.
5. **Network audit:** DevTools shows zero direct browser calls to `api.coingecko.com`
   — only app server functions. The demo key appears in no client request.
6. **Quota audit:** count requests per hour in a normal session and report it against
   the 10,000/month budget.

Report the real output of each check. Never claim a check passed without running it.

---

## 15. When in doubt

- Keep it small. Use the relevant docs before writing framework code.
- Preserve server and client boundaries. Keep the provider key private.
- Match the provided UI reference exactly — don't improvise visual design.
- Inspect config and `data-policy.ts` before hardcoding intervals or URLs.
- StyleX only — if it feels impossible, ask, don't bolt on Tailwind.
- Never invent market data to fill a layout.
- If a feature is not in the approved plan — propose it in "Needs your attention"
  instead of building it.
- Save a prompt file and get approval before coding. Run checks. Share exact test
  steps.
- If a rule in this file conflicts with a new request — surface the conflict
  explicitly before proceeding.
