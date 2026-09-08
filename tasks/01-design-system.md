# 01 — Design system implementation

**Status:** Done
**Plan:** [prompts/002-design-system.md](../prompts/002-design-system.md)
**Depends on:** project init (done)

## Scope

Implement the v1.0 design system (`design/design-system.png`) as the app's
actual visual foundation: full token set in `tokens.stylex.ts` (neutrals,
blue accent scale, semantic up/down/warn pairs, data-viz colors, spacing,
radii, elevation, motion), `lightTheme` via `createTheme` applied at root
(light is now default/primary per the 2026-09-08 decision — see agents.md
section 7.5), Inter + JetBrains Mono type ramp, and the hand-built StyleX
component set shown in section 04 of the reference: buttons, badges, range
tabs, search input, stat cards, and the markets table row/header styling.
No shadcn or any component library — same visual result, hand-built with
StyleX per agents.md section 6.

This phase produces reusable primitives; it does not wire them to real
CoinGecko data (that's phases 02–08).

## Definition of done

- [x] `tokens.stylex.ts` matches every value in the reference exactly (hex
      codes, spacing scale, radii, motion durations)
- [x] `lightTheme` applied at root, no flash on load
- [x] Type ramp matches: Inter for UI text, JetBrains Mono + tabular-nums for
      all numbers, exact size/weight pairs from the reference
- [x] Button, badge, range-tab, search, and stat-card components hand-built
      in StyleX, pixel-matching the reference states shown (default, hover,
      disabled, active tab, etc.)
- [x] No component library dependency added
- [x] Section 14 checks pass (lint, typecheck, build)
