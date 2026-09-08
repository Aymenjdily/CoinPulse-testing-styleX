# 10 — Performance & accessibility polish

**Status:** Done (code-level; see the manual items below)
**Plan:** [prompts/007-perf-a11y-polish.md](../prompts/007-perf-a11y-polish.md)
**Depends on:** 03–08 (all core features built)

## Scope

Cross-cutting pass (agents.md section 11): skeleton loading states
everywhere data streams in, `prefers-reduced-motion` respected on all
`stylex.keyframes` animations, full keyboard navigability audit, Lighthouse
Performance ≥ 90 / Accessibility ≥ 95 on every route, responsive breakpoints
checked on mobile and desktop.

## What was actually found and fixed (real bugs, not just polish)

- Coin detail page's first load was plain "Loading…" text — replaced with a
  skeleton matching the real layout.
- Trending rail had no loading state at all (silently popped in, shifting
  layout) — added skeleton pills.
- Markets table used `overflow: hidden`, which would have **clipped**
  content on narrow viewports with no way to reach it — changed to
  `overflowX: auto` with a `minWidth` on the grid so it scrolls instead.
- `SearchInput` had `outline: none` on its input with **no replacement
  focus indicator at all** — a keyboard user got zero visual feedback on
  focus. Added a `:focus-within` ring on the wrapping pill.
- Extracted a shared `skeleton.pulse` (src/styles/skeleton.stylex.ts) since
  three near-identical shimmer keyframes had accumulated across
  `MarketsTableShell.tsx`, `coin.$coinId.tsx`, and now `TrendingRail.tsx`.

## Definition of done

- [x] Skeleton states on markets table (already existed), coin detail (now
      added — both the full first-load skeleton and the chart's own), and
      trending rail (now added)
- [x] `prefers-reduced-motion` disables every `stylex.keyframes` animation
      in the app — verified by grep: every `animationName` usage (now
      centralized in `skeleton.pulse` plus the price-flash keyframes in
      `MarketsTableShell.tsx`) carries the `@media` guard
- [ ] Lighthouse Performance ≥ 90 / Accessibility ≥ 95 — **not measured**,
      needs a real browser + Lighthouse run
- [ ] Full keyboard-only pass — **not run**, needs a real browser. Code
      review confirms every interactive element is a native
      button/link/input (never a styled div), and the one missing focus
      indicator found (`SearchInput`) is now fixed
- [ ] Mobile/desktop breakpoints — **not visually verified** at real
      viewport widths. Code review found and fixed the one real overflow
      bug (markets table); everything else already used `auto-fit`/
      `max-width: 100%` patterns that should degrade reasonably
- [x] `lint`, `typecheck`, `build` clean; live-verified `/` and
      `/coin/bitcoin` still render without errors after all changes
