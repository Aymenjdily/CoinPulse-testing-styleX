import { useState } from 'react'

// CoinGecko's /global only provides a real 24h delta for total market cap —
// not for volume or BTC dominance. Rather than invent a "today" number for
// those (AGENTS.md section 7.9: never fabricate figures), this computes a
// genuine change from the first value polled this session. Callers must
// label it "since load", not "today" — it isn't a 24h figure.
//
// The baseline capture runs during render (React's documented "adjusting
// state when a prop changes" pattern), not in an effect, since it only
// needs to react to `current` arriving for the first time.
export function useSinceLoadDelta(current: number | undefined): number | undefined {
  const [baseline, setBaseline] = useState<number | null>(null)

  if (baseline === null && current !== undefined) {
    setBaseline(current)
  }

  if (baseline === null || current === undefined || baseline === 0) {
    return undefined
  }

  return ((current - baseline) / baseline) * 100
}
