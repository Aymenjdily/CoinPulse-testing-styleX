import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { TrendingCoin } from '../types'
import { CACHE_TTL_MS } from '../data-policy'
import { fetchCoinGecko } from './fetchCoinGecko'

const rawTrendingSchema = z
  .object({
    coins: z.array(
      z.object({
        item: z.object({
          id: z.string(),
          symbol: z.string(),
          name: z.string(),
          market_cap_rank: z.number().nullable(),
          thumb: z.string(),
          score: z.number(),
          data: z
            .object({
              price_change_percentage_24h: z.object({ usd: z.number() }).partial().optional(),
            })
            .optional(),
        }),
      }),
    ),
  })
  .transform((raw): TrendingCoin[] =>
    raw.coins.slice(0, 7).map(({ item }) => ({
      id: item.id,
      symbol: item.symbol,
      name: item.name,
      marketCapRank: item.market_cap_rank,
      thumb: item.thumb,
      score: item.score,
      priceChangePercentage24h: item.data?.price_change_percentage_24h?.usd ?? null,
    })),
  )

export const getTrending = createServerFn({ method: 'GET' }).handler(async () => {
  return fetchCoinGecko({
    cacheKey: 'trending',
    ttlMs: CACHE_TTL_MS.trending,
    path: '/search/trending',
    schema: rawTrendingSchema,
  })
})
