import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { GlobalData } from '../types'
import { CACHE_TTL_MS } from '../data-policy'
import { fetchCoinGecko } from './fetchCoinGecko'

const rawGlobalSchema = z
  .object({
    data: z.object({
      total_market_cap: z.object({ usd: z.number() }),
      total_volume: z.object({ usd: z.number() }),
      market_cap_percentage: z.object({ btc: z.number() }),
      active_cryptocurrencies: z.number(),
      market_cap_change_percentage_24h_usd: z.number(),
    }),
  })
  .transform(
    (raw): GlobalData => ({
      totalMarketCapUsd: raw.data.total_market_cap.usd,
      totalVolumeUsd: raw.data.total_volume.usd,
      btcDominance: raw.data.market_cap_percentage.btc,
      activeCryptocurrencies: raw.data.active_cryptocurrencies,
      marketCapChangePercentage24h: raw.data.market_cap_change_percentage_24h_usd,
    }),
  )

export const getGlobal = createServerFn({ method: 'GET' }).handler(async () => {
  return fetchCoinGecko({
    cacheKey: 'global',
    ttlMs: CACHE_TTL_MS.global,
    path: '/global',
    schema: rawGlobalSchema,
  })
})
