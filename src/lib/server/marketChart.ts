import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { MarketChart } from '../types'
import { CACHE_TTL_MS } from '../data-policy'
import { fetchCoinGecko } from './fetchCoinGecko'

const rawMarketChartSchema = z
  .object({
    prices: z.array(z.tuple([z.number(), z.number()])),
    market_caps: z.array(z.tuple([z.number(), z.number()])),
    total_volumes: z.array(z.tuple([z.number(), z.number()])),
  })
  .transform(
    (raw): MarketChart => ({
      prices: raw.prices,
      marketCaps: raw.market_caps,
      totalVolumes: raw.total_volumes,
    }),
  )

const daysSchema = z.union([z.literal(1), z.literal(7), z.literal(30), z.literal(365)])

const ttlByDays: Record<z.infer<typeof daysSchema>, number> = {
  1: CACHE_TTL_MS.marketChart1d,
  7: CACHE_TTL_MS.marketChart7d,
  30: CACHE_TTL_MS.marketChart30d,
  365: CACHE_TTL_MS.marketChart365d,
}

export const getMarketChart = createServerFn({ method: 'GET' })
  .validator(z.object({ coinId: z.string(), days: daysSchema }))
  .handler(async ({ data }) => {
    return fetchCoinGecko({
      cacheKey: `market-chart:${data.coinId}:${data.days}`,
      ttlMs: ttlByDays[data.days],
      path: `/coins/${data.coinId}/market_chart`,
      params: { vs_currency: 'usd', days: data.days },
      schema: rawMarketChartSchema,
    })
  })
