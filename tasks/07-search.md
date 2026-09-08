# 07 — Search

**Status:** Done
**Plan:** [prompts/004-home-page.md](../prompts/004-home-page.md)
**Depends on:** 01 (design system — search input component),
02 (data layer — needs `/search`)

## Scope

Debounced (300ms), keyboard-navigable (↑/↓/Enter/Escape) coin search
grounded entirely in `/search` results (agents.md sections 1, 11). No
invented coins, ranks, or symbols. Explicit "no matches" state.

## Decision

Coin detail pages don't exist yet (tasks/05). Selecting a result closes the
dropdown rather than linking to a page that isn't built — see
`prompts/004-home-page.md`, `SearchResults.tsx`.

## Definition of done

- [x] 300ms debounce via `useDebouncedValue`, matches `SEARCH_DEBOUNCE_MS`
- [x] Keyboard flow implemented (↑/↓ moves highlight, Enter selects, Escape
      closes) in `Header.tsx`'s `handleKeyDown`
- [x] Every result comes straight from `searchCoins()` / `/search` — no
      invented fields
- [x] "No matches" state is explicit (`SearchResults.tsx`), not a blank
      dropdown
- [x] `lint`, `typecheck`, `build` clean
- [ ] Manual keyboard-flow and live-typing verification — not run in a real
      browser here. Please verify ↑/↓/Enter/Escape actually feel right.
