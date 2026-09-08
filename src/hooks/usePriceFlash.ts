import { useEffect, useState } from 'react'
import type { CoinMarket } from '../lib/types'
import { duration } from '../styles/tokens.stylex'

export type FlashDirection = 'up' | 'down'

const FLASH_MS = parseInt(duration.slow, 10) || 320

// Diffs consecutive markets-poll results by coin id and returns a transient
// per-row flash direction, cleared automatically. Never fires on the first
// render (nothing to compare against yet).
//
// The diff itself runs during render (React's documented "adjusting state
// when a prop changes" pattern, using only useState — no refs, since
// mutating a ref during render isn't safe either) rather than in an
// effect, since it only needs to react to `markets` getting a new
// reference from a poll. The only real effect here is the timer that
// clears the flash after it's shown.
export function usePriceFlash(markets: CoinMarket[] | undefined) {
  const [previousPrices, setPreviousPrices] = useState<Map<string, number>>(new Map())
  const [trackedMarkets, setTrackedMarkets] = useState(markets)
  const [flashes, setFlashes] = useState<Map<string, FlashDirection>>(new Map())

  if (markets !== trackedMarkets) {
    const next = new Map<string, FlashDirection>()
    if (markets) {
      for (const coin of markets) {
        const previous = previousPrices.get(coin.id)
        if (previous !== undefined && previous !== coin.currentPrice) {
          next.set(coin.id, coin.currentPrice > previous ? 'up' : 'down')
        }
      }
      setPreviousPrices(new Map(markets.map((coin) => [coin.id, coin.currentPrice])))
    }
    setTrackedMarkets(markets)
    setFlashes(next)
  }

  useEffect(() => {
    if (flashes.size === 0) return
    const timeout = setTimeout(() => setFlashes(new Map()), FLASH_MS)
    return () => clearTimeout(timeout)
  }, [flashes])

  return flashes
}
