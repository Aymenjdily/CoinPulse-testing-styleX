# 07 — Search

**Status:** Not started
**Plan:** none yet
**Depends on:** 01 (design system — search input component),
02 (data layer — needs `/search`)

## Scope

Debounced (300ms), keyboard-navigable (↑/↓/Enter/Escape) coin search
grounded entirely in `/search` results (agents.md sections 1, 11). No
invented coins, ranks, or symbols. Explicit "no matches" state.

## Definition of done

- [ ] 300ms debounce, matches `SEARCH_DEBOUNCE_MS` in `data-policy.ts`
- [ ] Full keyboard flow works (↑/↓/Enter/Escape)
- [ ] Every result traces to a real `/search` response field
- [ ] "No matches" state is explicit, not a blank dropdown
- [ ] Section 14 checks pass
