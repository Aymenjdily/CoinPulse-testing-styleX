# 08 — Trending rail

**Status:** Not started
**Plan:** none yet
**Depends on:** 02 (data layer — needs `/search/trending`)

## Scope

Top-7 trending coins rail (agents.md section 1), refreshed on the 10-minute
TTL already defined in `data-policy.ts`.

## Definition of done

- [ ] Shows exactly the top-7 trending coins from the real response
- [ ] Refetches on the 10-minute interval, pauses when tab hidden
- [ ] Section 14 checks pass
