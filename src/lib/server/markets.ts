import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { CoinMarket } from '../types'
import { CACHE_TTL_MS } from '../data-policy'
import { fetchCoinGecko } from './fetchCoinGecko'

const rawCoinMarketSchema = z
  .object({
    id: z.string(),
    symbol: z.string(),
    name: z.string(),
    image: z.string(),
    current_price: z.number(),
    market_cap: z.number(),
    market_cap_rank: z.number().nullable(),
    total_volume: z.number(),
    price_change_percentage_1h_in_currency: z.number().nullable().optional(),
    price_change_percentage_24h_in_currency: z.number().nullable().optional(),
    price_change_percentage_7d_in_currency: z.number().nullable().optional(),
    sparkline_in_7d: z.object({ price: z.array(z.number()) }).optional(),
    last_updated: z.string(),
  })
  .transform(
    (raw): CoinMarket => ({
      id: raw.id,
      symbol: raw.symbol,
      name: raw.name,
      image: raw.image,
      currentPrice: raw.current_price,
      marketCap: raw.market_cap,
      marketCapRank: raw.market_cap_rank,
      totalVolume: raw.total_volume,
      priceChangePercentage1h: raw.price_change_percentage_1h_in_currency ?? null,
      priceChangePercentage24h: raw.price_change_percentage_24h_in_currency ?? null,
      priceChangePercentage7d: raw.price_change_percentage_7d_in_currency ?? null,
      sparkline7d: raw.sparkline_in_7d?.price ?? [],
      lastUpdated: raw.last_updated,
    }),
  )

const marketsResponseSchema = z.array(rawCoinMarketSchema)

export const getMarkets = createServerFn({ method: 'GET' }).handler(async () => {
  return fetchCoinGecko({
    cacheKey: 'markets',
    ttlMs: CACHE_TTL_MS.markets,
    path: '/coins/markets',
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 250,
      page: 1,
      sparkline: true,
      price_change_percentage: '1h,24h,7d',
    },
    schema: marketsResponseSchema,
  })
})
