# 001 — Project Init: TanStack Start + StyleX scaffold

## Goal

Stand up the CoinPulse repo skeleton: a TanStack Start (React 19, Vite, SSR,
TypeScript strict) application wired for StyleX as the only styling system,
with the folder structure, config files, and boundary stubs that every later
feature (markets table, coin detail, watchlist, search) will build on top of.
No feature UI is built in this step — this is scaffolding only.

## Docs read

- `agents.md` (this repo's AGENTS.md) — sections 2 (workflow), 5 (app
  boundaries), 6 (tech stack), 7 (decisions), 9 (data budget), 10 (config),
  12 (StyleX rules).
- TanStack CLI Quick Start (tanstack.com/cli/latest/docs/quick-start) — the
  current scaffolding entrypoint is `npx @tanstack/cli create`, not the
  deprecated `npm create @tanstack/start` / `@tanstack/create-start`.
- StyleX Vite installation guide (stylexjs.com/docs/learn/installation/vite,
  vite-react) and `@stylexjs/unplugin` config docs — `stylex.vite()` must be
  registered before the React plugin in `vite.config.ts`, with
  `runtimeInjection: false` for build and CSS emitted through an imported
  root stylesheet.
- (Local `node_modules` docs don't exist yet — nothing installed. Once
  scaffolded, later prompts must re-check the installed versions' local docs
  per section 4 before writing framework code against them.)

## Code inspected

- Repo root currently contains only `agents.md`. Not yet a git repository.
  No existing routes, components, or config to preserve.

## Decisions and assumptions

1. **Scaffold via `npx @tanstack/cli create .`** (non-interactive flags,
   TypeScript, file-based router, React 19, no add-ons selected beyond what
   we hand-configure) rather than the deprecated `create-start` wrapper.
2. **Initialize git** as part of this step (AGENTS.md assumes commit hygiene
   matters; environment currently reports "not a git repository"). First
   commit will be the clean scaffold before any feature work.
3. **Package manager: npm** (matches the `npm`/`node` toolchain already on
   this machine; no pnpm/yarn lockfile preference stated by the user).
4. **StyleX wiring now, zero real styles yet** — install
   `@stylexjs/stylex`, `@stylexjs/unplugin`, `@stylexjs/eslint-plugin`,
   register the Vite plugin before `@vitejs/plugin-react`, and create an
   empty root stylesheet import so the plugin has an asset to emit into.
   `src/styles/tokens.stylex.ts` gets defined with a minimal real token set
   (color, spacing, radius, font, duration) per section 12 rule 2 — actual
   palette/typography values will be refined once a design reference exists
   for section 3, but the file must exist and be wired now, not deferred.
5. **`src/lib/data-policy.ts`** created now with the TTL/poll-interval
   constants from section 9 and 10, even though no data fetching exists yet
   — this is the "one place to tune" file and should exist before any
   server function references a magic number.
6. **No CoinGecko calls yet.** This step creates the server-function
   boundary shape (`src/server/` or `src/lib/server/` — exact convention
   confirmed against TanStack Start's file-based router docs during
   implementation) but does not implement `/coins/markets` or any other
   endpoint. That's a separate, later prompt per section 2's "one feature at
   a time" spirit.
7. **Dark theme only stub, no light theme yet** — `createTheme` scaffolding
   with a single dark theme applied at root, matching section 7 decision 5
   ("dark is default and primary"). Light theme is a later prompt once a
   design reference exists.
8. **ESLint + TypeScript strict from the start**, including
   `@stylexjs/eslint-plugin`, since section 12 rule 8 makes StyleX lint
   errors a build blocker from day one.
9. **No Recharts/Lucide install yet** — deferred to the prompts that
   actually build the chart and icons, to keep this step to pure scaffold
   (avoids unused-dependency drift).

## Expected files to create or modify

- `package.json`, `tsconfig.json`, `vite.config.ts`, `.gitignore` (via CLI
  scaffold, then edited for StyleX plugin + strict TS)
- `.eslintrc` / `eslint.config.js` with `@stylexjs/eslint-plugin` enabled
- `.env.example` — `COINGECKO_API_KEY`, `COINGECKO_BASE_URL`
- `src/routes/__root.tsx` — root route, head metadata, theme application
- `src/routes/index.tsx` — placeholder markets route (empty shell, no table)
- `src/styles/tokens.stylex.ts` — `stylex.defineVars` token set
- `src/styles/themes.stylex.ts` — dark `createTheme`
- `src/lib/data-policy.ts` — TTL and poll-interval constants (section 9/10)
- `src/lib/types.ts` — empty/stub, ready for section 8 data model types
- `README.md` — brief setup/run instructions
- `.git/` initialized, first commit made

## Requirements and acceptance criteria

- `npm run dev` boots the TanStack Start dev server and renders a minimal
  page (no console errors, no hydration warnings).
- `npm run build` produces a production build with StyleX CSS actually
  emitted into the output (verify a `.css` asset contains StyleX-generated
  class rules, not an empty file).
- `npm run lint` runs clean, including `@stylexjs/eslint-plugin` rules
  registered and firing on a deliberately-introduced inline style (verified
  then reverted) to confirm the rule is live.
- `tsc --noEmit` passes with `strict: true`.
- No hardcoded hex/px values anywhere outside `tokens.stylex.ts`.
- No CoinGecko key or URL appears in any client-bundled file (nothing to
  check yet functionally since no fetch exists, but the `.env.example` and
  any server-only stub must already respect the `import "server-only"`
  convention from section 5).

## Security/privacy considerations

- `.env.example` contains placeholder values only, never a real key.
- Confirm `.gitignore` excludes `.env` and `.env.local` before the first
  commit.

## Checks to run and manual test steps

1. `npm run lint`
2. `npx tsc --noEmit`
3. `npm run build`
4. `npm run dev` → open browser, confirm the placeholder route renders,
   confirm dark background/theme token is applied, confirm no console
   errors/hydration mismatches.
5. Inspect build output for a StyleX-generated CSS file.
6. `git log` shows one clean initial commit.
