# 11 — Launch checks

**Status:** Done (automatable checks; see the flagged quota risk and manual items below)
**Plan:** none — audit only, no plan file needed per agents.md section 2 for
a check-and-report pass with no new features
**Depends on:** everything else

## Scope

Final pass before calling v1 done (agents.md sections 14, 15): full checklist
re-run across the whole app, quota audit against the 10,000/month CoinGecko
budget, network audit confirming zero direct browser calls to
`api.coingecko.com` anywhere in the app, README accuracy check.

## ⚠️ Real finding: sustained foreground use exceeds the monthly quota

Computed directly from `src/lib/data-policy.ts`'s actual TTLs (not a live
measurement — this is what the current polling config implies):

| Endpoint | TTL | Calls/hour if continuously polled |
|---|---|---|
| markets | 60s | 60 |
| global | 5 min | 12 |
| trending | 10 min | 6 |
| **Total (home page alone)** | | **78/hour** |

The server cache means this is 78/hour *total*, regardless of visitor
count — but if **any single tab stays open and foregrounded continuously**
(`refetchIntervalInBackground: false` already stops it when backgrounded),
that's `78 × 24 × 30 = 56,160` calls/month against a 10,000/month budget —
**~5.6x over**, before counting any coin-detail-page traffic at all.

This isn't a hypothetical edge case: "leave the live dashboard open and
watch it update" is this app's actual intended use, so a real user doing
exactly what it's designed for could burn the monthly quota in about
5-6 days of continuous foreground viewing. This needs a decision, not a
silent fix — the TTLs are an established, deliberate decision
(`agents.md` section 7.2 / section 9's table), and I'm not lengthening them
unilaterally. Options, roughly in order of how much they change behavior:

1. Add a real `COINGECKO_API_KEY` (the app already supports this — it
   raises the Demo plan's limits, no code change needed).
2. Lengthen `POLL_INTERVAL_MS.markets`/`CACHE_TTL_MS.markets` beyond 60s
   (the single biggest contributor at 60/hour of the 78).
3. Accept the risk as-is for a low-traffic portfolio/demo context.

## Other checks

- [x] `lint`, `typecheck`, `build` clean on the full app
- [x] Network audit: grepped every file in `dist/client/assets/` for
      `coingecko.com` and the literal API key/env var name — zero matches.
      `createServerFn` structurally prevents this (confirmed in phase 02
      and re-confirmed here on the current build).
- [x] No out-of-scope features present — re-checked the full "Out of scope"
      list in agents.md section 1 (no stock data, no P&L tracking, no auth,
      no price alerts, no WebSockets, no news feed, no i18n, no mobile app,
      no backend database) against everything built. Clean.
- [x] README accuracy — was still saying CoinGecko calls "will go through"
      server functions (future tense, pre-implementation) and didn't
      mention the pages, Recharts, or TanStack Query. Updated.
- [ ] Full manual test matrix from agents.md section 14 (sort every column,
      paginate, star/unstar persistence, search keyboard flow, 429
      simulation, both themes, keyboard-only nav, reduced-motion,
      mobile/desktop breakpoints) — **not run**, needs a real browser.
- [ ] Live quota audit (actual requests/hour in a real session) — **not
      measured**; the table above is a computation from the code's own
      config, not a live traffic measurement. A real measurement needs an
      actual browsing session with DevTools open.
