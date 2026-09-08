# 10 — Performance & accessibility polish

**Status:** Not started
**Plan:** none yet
**Depends on:** 03–08 (all core features built)

## Scope

Cross-cutting pass once features exist (agents.md section 11): skeleton
loading states everywhere data streams in, `prefers-reduced-motion` respected
on all `stylex.keyframes` animations, full keyboard navigability audit,
Lighthouse Performance ≥ 90 / Accessibility ≥ 95 on every route, responsive
breakpoints checked on mobile and desktop.

## Definition of done

- [ ] Skeleton states on markets table, coin detail, trending rail
- [ ] `prefers-reduced-motion` disables/reduces price-flash and skeleton
      shimmer animations
- [ ] Lighthouse targets met on `/` and `/coin/$coinId`
- [ ] Full keyboard-only pass across the app with visible focus states
- [ ] Mobile and desktop breakpoints verified on every route
