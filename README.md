# CoinPulse

A live crypto market tracker built with **TanStack Start** and **StyleX**. See
[agents.md](agents.md) for the full product spec, architecture rules, and
workflow this repo follows, and [tasks/](tasks/README.md) for build status.

## Pages

- `/` — markets dashboard: global stats, trending rail, a sortable/paginated
  live-polling table, search, and a localStorage watchlist.
- `/coin/$coinId` — coin detail: price chart (Recharts, range-tabbed), period
  changes, and a market-stats grid.

Light and dark themes, toggleable in the header.

## Getting started

```bash
npm install
cp .env.example .env   # optional: add COINGECKO_API_KEY to raise rate limits
npm run dev
```

## Scripts

```bash
npm run dev        # start the dev server on :3000
npm run build       # production build
npm run preview     # preview the production build
npm run lint         # eslint, including @stylexjs/eslint-plugin
npm run typecheck   # tsc --noEmit
```

## Stack notes

- **Styling is StyleX only** — no Tailwind, CSS Modules, or styled-components.
  Tokens live in [src/styles/tokens.stylex.ts](src/styles/tokens.stylex.ts);
  themes in [src/styles/themes.stylex.ts](src/styles/themes.stylex.ts).
- **Data fetching policy** (cache TTLs, poll intervals) is centralized in
  [src/lib/data-policy.ts](src/lib/data-policy.ts).
- All CoinGecko calls go through TanStack Start server functions
  ([src/lib/server/](src/lib/server/)) — the browser never calls the
  provider directly, and the key (if set) never ships in the client bundle.
  See agents.md section 5.
- Client polling is TanStack Query; the chart is Recharts (mandated only for
  that chart — table sparklines are hand-drawn inline SVG).
