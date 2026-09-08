# 002 — Design system implementation

## Goal

Implement the v1.0 CoinPulse design system (`design/design-system.png`) as
the app's real token set and a hand-built StyleX component primitive layer:
full color/type/space/radius/elevation/motion tokens, a `lightTheme` applied
as the new default, and the shared components shown in the reference
(button variants, badges, range tabs, search input, stat cards, and the
markets-table row/header styling) — with no data wiring yet.

## Docs read

- `agents.md` (updated this session — see Decisions below) sections 3, 6, 7,
  12.
- `design/design-system.png` — the full reference image, read directly.

## Code inspected

- `src/styles/tokens.stylex.ts`, `src/styles/themes.stylex.ts` (current dark
  scaffold tokens from prompt 001)
- `src/routes/__root.tsx`, `src/components/Header.tsx`,
  `src/components/Footer.tsx`, `src/routes/index.tsx` (current placeholder
  UI using the scaffold tokens)

## Decisions and assumptions

1. **Conflict surfaced and resolved with the user:** the reference is
   titled "Light default," which contradicted the original agents.md
   decision that dark is primary. User chose **light becomes default**.
   `agents.md` section 3 and section 7.5 have already been updated to
   reflect this (dated 2026-09-08). Dark is now the secondary/future theme
   (tracked as `tasks/09-dark-theme.md`, blocked on a dark reference).
2. **shadcn-cssinjs is not adopted.** The reference names it as its own
   build tool ("shadcn-cssinjs registry, themed by these tokens"), but
   agents.md section 6 forbids any component library. Every component in
   this plan is hand-built with `stylex.create`, matching the reference's
   pixels only — not its underlying library.
3. **Token naming:** the reference's "05 — Tokens as code" panel shows a
   simplified example (`background`, `foreground`, `primary`, `up`, `down`,
   `border`). The reference elsewhere also shows full 11-step neutral and
   10-step blue scales. This plan keeps both: the full scales (for
   flexibility across future components) plus semantic aliases
   (`background`, `foreground`, `border`, `primary`) that resolve to the
   scale, matching the code panel's naming exactly for those top-level
   names.
4. **Existing scaffold tokens are replaced, not extended**, for spacing
   (4/8/12/16/24/32 — already matches, no change) and duration
   (120/200/320ms — already matches, no change), but radius's `lg` changes
   from the placeholder `16px` to the reference's `14px`, and color tokens
   are fully replaced with the reference's exact hex values.
5. **Typography scale becomes real tokens**, not just font-family strings:
   size/weight pairs for display (30/700), title (24/700), card title
   (20/600), body (16/400), small (13/400), caption (12/500 + letter
   spacing) — added to `tokens.stylex.ts` since AGENTS.md section 12.2
   requires tokens, not magic numbers, in components.
6. **Elevation tokens added**: hairline (border only, no shadow),
   `shadowSm` (`0 1px 2px rgba(0,0,0,.05)`), `shadowMd`
   (`0 4px 12px rgba(0,0,0,.08)`) — read directly off the reference's
   "03 — Space & Form" panel.
7. **Easing token added**: `easeOut: cubic-bezier(0.16, 1, 0.3, 1)`, used by
   the price-flash keyframe animation later (phase 04, not built here).
8. **Components built in this phase are presentational primitives only** —
   no CoinGecko data, no routing logic. They take props and render the
   visual states shown (default/hover/disabled/active-tab/etc.). Real data
   wiring happens in later phases per `tasks/README.md`.
9. **Component list scoped to exactly what's in the reference's "04 —
   Components" section**: Button (primary/secondary/ghost/destructive/
   disabled), Badge (up/down/neutral-chip/rank-chip/live-status), RangeTabs
   (segmented control), SearchInput (icon + placeholder + ⌘K hint chip),
   StatCard (caption label + mono value + delta badge), and the Markets
   Table presentational shell (header row + one example row style) — not a
   functional sortable/live table, which is phase 04.
10. **Existing placeholder routes get restyled** with the new tokens
    (`__root.tsx`, `Header.tsx`, `Footer.tsx`, `index.tsx`) so nothing in
    the running app still reflects the old dark scaffold palette, but their
    actual content/copy stays the same placeholder text — no new pages.

## Expected files to create or modify

- `src/styles/tokens.stylex.ts` — full rewrite: neutral scale, blue scale +
  `primary` alias, semantic `up`/`down`/`warn` + soft/border pairs, data-viz
  colors, `background`/`foreground`/`border` aliases, typography scale,
  spacing (unchanged values), radius (lg → 14px), elevation, duration
  (unchanged values), easing.
- `src/styles/themes.stylex.ts` — replace `darkTheme` with `lightTheme`
  (same shape, reference's exact hex values); leave a comment marking dark
  as future work per `tasks/09-dark-theme.md`.
- `src/components/Button.tsx` (new) — primary/secondary/ghost/destructive/
  disabled variants.
- `src/components/Badge.tsx` (new) — up/down/neutral/rank/live variants.
- `src/components/RangeTabs.tsx` (new) — segmented control, controlled
  `value`/`onChange` props, generic over tab labels (not hardcoded to
  24H/7D/30D/1Y so phase 05 can reuse it).
- `src/components/SearchInput.tsx` (new) — presentational only in this
  phase (no debounce/results logic — that's phase 07).
- `src/components/StatCard.tsx` (new) — label, mono value, optional delta
  badge.
- `src/components/MarketsTableShell.tsx` (new) — header row + row style
  primitives (presentational, fed by props, no real data).
- `src/routes/__root.tsx`, `src/components/Header.tsx`,
  `src/components/Footer.tsx`, `src/routes/index.tsx` — restyled with new
  tokens; `index.tsx` gets a small live component gallery so the new
  primitives are visibly exercised (buttons, badges, tabs, search input,
  stat cards, table shell) until real pages replace it in later phases.
- `src/styles.css` — swap the Google Fonts import from Inter+JetBrains Mono
  (already correct, no change expected) — verified during implementation.

## Requirements and acceptance criteria

- Every hex value in `tokens.stylex.ts` matches the reference exactly
  (spot-checked against the visible labels in the image).
- `lightTheme` applied at root; SSR output shows no flash/mismatch.
- No component in this phase hardcodes a color, spacing, radius, or font
  value that has a token — verified by review, not just lint (StyleX lint
  doesn't catch hardcoded-but-valid values).
- Button/Badge/RangeTabs/SearchInput/StatCard/MarketsTableShell visually
  match the reference's states.
- No new runtime dependency added (no shadcn, no icon library beyond what's
  already installed — Lucide isn't installed yet; if a component needs an
  icon, use inline SVG in this phase rather than pulling in Lucide early,
  since icons aren't the focus of this plan).
- `agents.md` diff (already applied) is committed alongside this work, not
  left as an uncommitted side change.

## Security/privacy considerations

None — this phase touches only static presentation code.

## Checks to run and manual test steps

1. `npm run lint`
2. `npm run typecheck`
3. `npm run build` — confirm the StyleX CSS output contains the new token
   values and no leftover dark-scaffold values.
4. `npm run dev` — visually check the component gallery on `/` against the
   reference image side by side: colors, spacing, radius, button states,
   badge variants, range-tab active state, search input, stat cards.
5. Confirm no console errors/hydration warnings.
6. `git diff agents.md` reviewed as part of the commit.
