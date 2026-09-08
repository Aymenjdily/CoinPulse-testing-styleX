# 09 — Dark theme

**Status:** Blocked
**Plan:** none yet
**Depends on:** 01 (design system — `themes.stylex.ts` has `lightTheme`;
this phase adds `darkTheme` alongside it)
**Blocked on:** a dark-mode design reference (agents.md section 3 — never
freestyle the visual identity; the v1.0 design system doc is light-only)

## Scope

Secondary dark theme (agents.md section 7.5, updated 2026-09-08 — light is
now primary/default, dark is the future secondary theme) as a second typed
`createTheme`, applied via the same mechanism as light — no class-toggle
string overrides, no flash on load.

## Definition of done

- [ ] `darkTheme` defined in `themes.stylex.ts`, matches a provided reference
      exactly
- [ ] No flash of unstyled/wrong theme on load
- [ ] Theme switch persists per session appropriately (mechanism decided in
      the plan file)
- [ ] Section 14 checks pass, both themes covered in the manual test matrix
