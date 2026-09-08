# 005 — Dark theme + toggle

## Goal

Add a dark theme derived from the existing light-theme token structure (no
new design reference — user explicitly chose this over waiting for one) and
a working light/dark toggle in the header, with no flash of the wrong theme
on load.

## Docs read

- `agents.md` section 7.5 (light is default/primary, dark is secondary,
  must not flash on load; themes are StyleX `createTheme`, not a class
  toggle full of string overrides — the toggle here switches between two
  `createTheme` outputs, which satisfies that).
- `tasks/09-dark-theme.md` (previously blocked on a reference; unblocked by
  the user's explicit choice to derive one instead).

## Code inspected

- `src/styles/tokens.stylex.ts`, `src/styles/themes.stylex.ts` — current
  `colors` var shape and `lightTheme`.
- `src/routes/__root.tsx` — where the theme class is applied to `<html>`,
  and where the project init scaffold's original (later removed)
  `THEME_INIT_SCRIPT` pattern lived, before dark theme existed to need it.

## Decisions and assumptions

1. **Two modes only (light/dark), no "auto/system" mode.** agents.md
   decision 7.5 says light is the default/primary identity — that means
   defaulting to light regardless of OS preference, not syncing with it.
2. **Derived color values**: same blue accent hue, lightened slightly
   (`blue.b500` `#3B82F6` instead of `b600`) for better contrast against a
   dark background; near-black background (`neutral.n950` `#0A0A0A`) and
   near-white foreground (`neutral.n50` `#FAFAFA`); borders on
   `neutral.n800` (`#262626`). Semantic up/down/warn keep the same base
   hues (already vibrant enough on dark) but their soft/border pairs become
   translucent overlays instead of pale tints, since a pale-green chip on a
   near-black background would look wrong.
3. **No-flash mechanism**: a synchronous inline `<script>` in `<head>`
   (same pattern the original TanStack scaffold used before this project
   had a second theme) sets `document.documentElement.className` to the
   correct theme's StyleX class *before* paint, reading `localStorage`.
   `<html>` gets `suppressHydrationWarning` since React's own render still
   defaults to light (matching SSR) and a `useLayoutEffect` reconciles
   state from `localStorage` immediately after mount, before the browser
   paints.
4. **Toggle lives in the header's right group**, next to the Live badge —
   matches the reference's icon position even though the reference's icon
   itself couldn't be wired up until now.

## Expected files to create or modify

- `src/styles/themes.stylex.ts` — add `darkTheme`.
- `src/routes/__root.tsx` — theme state, inline init script,
  `suppressHydrationWarning`, theme context provider.
- `src/theme/theme-context.ts` (new) — `ThemeContext` + `useTheme()` hook.
- `src/components/Header.tsx` — add the toggle button (Sun/Moon icon)
  reading `useTheme()`.

## Requirements and acceptance criteria

- Toggling switches every themed color instantly, no full reload needed.
- Reloading after toggling to dark stays dark — no flash of light before
  dark applies.
- `npm run lint`, `npm run typecheck`, `npm run build` clean.

## Checks to run and manual test steps

1. Section 14 checks.
2. Toggle in the browser, confirm colors update throughout (header, cards,
   table, badges).
3. Reload while in dark mode — confirm no light-mode flash.
4. Reload in a fresh private window (no stored preference) — confirm it
   defaults to light.
