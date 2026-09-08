# 11 — Launch checks

**Status:** Not started
**Plan:** none yet
**Depends on:** everything else

## Scope

Final pass before calling v1 done (agents.md sections 14, 15): full checklist
re-run across the whole app, quota audit against the 10,000/month CoinGecko
budget, network audit confirming zero direct browser calls to
`api.coingecko.com` anywhere in the app, README accuracy check.

## Definition of done

- [ ] `lint`, `typecheck`, `build` clean on the full app
- [ ] Full manual test matrix from section 14 run end-to-end
- [ ] Network audit: zero direct `api.coingecko.com` calls from the browser,
      no demo key in any client request, across every route
- [ ] Quota audit: requests/hour measured in a normal session, reported
      against the 10,000/month budget
- [ ] No out-of-scope features present (recheck against agents.md section 1
      "Out of scope" list)
