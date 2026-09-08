# Tasks — CoinPulse phase tracker

This folder tracks project phases at a glance: what's done, what's next, what
each phase depends on. It is a status board, not a spec.

**This folder does not replace the `prompts/` workflow.** Per `agents.md`
section 2, no phase gets implemented until its own numbered plan file exists
in `prompts/` and is approved. A task file here should link to its
`prompts/NNN-*.md` plan once that plan is written.

## Status legend

- `Not started` — no plan file yet
- `Planned` — plan file written in `prompts/`, awaiting approval
- `In progress` — approved and being implemented
- `Done` — implemented, checked (section 14), and committed
- `Blocked` — needs a decision or input (usually a design reference) before it can be planned

## Phases

Project init is done and its task file has been removed — see the initial
commit and `prompts/001-project-init.md` for what it covered.

| # | Phase | Status |
|---|-------|--------|
| 01 | [Design system implementation](01-design-system.md) | Done |
| 02 | [Data layer & CoinGecko server functions](02-data-layer.md) | Done |
| 03 | [Global stats strip](03-global-stats-strip.md) | Done |
| 04 | [Markets table](04-markets-table.md) | Done |
| 05 | [Coin detail page](05-coin-detail.md) | Done |
| 06 | [Watchlist](06-watchlist.md) | Done |
| 07 | [Search](07-search.md) | Done |
| 08 | [Trending rail](08-trending-rail.md) | Done |
| 09 | [Dark theme](09-dark-theme.md) | Done |
| 10 | [Performance & accessibility polish](10-perf-a11y-polish.md) | Done (code-level; Lighthouse/keyboard/visual pass still needed) |
| 11 | [Launch checks](11-launch-checks.md) | Done — ⚠️ real quota risk flagged, needs your decision |

Update the table and the phase's own file together whenever status changes —
don't let them drift.
