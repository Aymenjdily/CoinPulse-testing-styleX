# 03 — Global stats strip

**Status:** Not started
**Plan:** none yet
**Depends on:** 01 (design system), 02 (data layer — needs `/global`)

## Scope

Header strip (agents.md section 1): total market cap, 24h volume, BTC
dominance, active cryptocurrencies count. Always visible. Polls every 5 min
per `data-policy.ts`, pauses when tab hidden. Honest staleness indicator on
provider failure.

## Definition of done

- [ ] Renders real `GlobalData` fields, no placeholder numbers
- [ ] Big numbers use `Intl.NumberFormat` compact notation (no manual
      `toFixed` on trillions)
- [ ] Poll pauses in hidden tabs
- [ ] Stale state visible on provider failure, with last-successful timestamp
- [ ] Uses only `tokens.stylex.ts` values, no hardcoded hex/px
- [ ] Section 14 checks pass
