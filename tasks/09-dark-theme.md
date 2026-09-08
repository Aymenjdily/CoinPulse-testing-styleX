# 09 — Dark theme

**Status:** Done
**Plan:** [prompts/005-dark-theme.md](../prompts/005-dark-theme.md)
**Depends on:** 01 (design system — `themes.stylex.ts` has `lightTheme`)

## Scope

Secondary dark theme (agents.md section 7.5) as a second typed
`createTheme`, applied via the same mechanism as light — no class-toggle
string overrides, no flash on load. User explicitly chose to derive this
from the existing light-theme structure rather than wait for a dedicated
dark-mode reference (previously blocking this phase).

## Definition of done

- [x] `darkTheme` defined in `themes.stylex.ts` — derived (not from a
      reference): same blue hue one step lighter for contrast, near-black
      background/near-white foreground from the neutral scale, semantic
      up/down/warn keep their hues with translucent soft/border overlays
      instead of pale tints
- [x] No flash of unstyled/wrong theme on load — a synchronous inline
      script sets the correct theme class before paint;
      `suppressHydrationWarning` + `useSyncExternalStore` reconcile React
      to the same value without a hydration-guard effect
- [x] Theme switch persists via `localStorage`, toggle button in the header
      (Sun/Moon icon)
- [x] `lint`, `typecheck`, `build` clean; SSR confirmed still defaulting to
      light with no error boundary hit
- [ ] Full manual verification (toggle in a real browser, reload while
      dark, fresh-session defaults to light) — not run in a real browser
      here. Please verify.
