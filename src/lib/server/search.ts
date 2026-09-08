import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { SearchResult } from '../types'
import { CACHE_TTL_MS } from '../data-policy'
import { fetchCoinGecko } from './fetchCoinGecko'

const rawSearchSchema = z
  .object({
    coins: z.array(
      z.object({
        id: z.string(),
        symbol: z.string(),
        name: z.string(),
        market_cap_rank: z.number().nullable(),
        thumb: z.string(),
      }),
    ),
  })
  .transform(
    (raw): SearchResult[] =>
      raw.coins.map((coin) => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        marketCapRank: coin.market_cap_rank,
        thumb: coin.thumb,
      })),
  )

export const searchCoins = createServerFn({ method: 'GET' })
  .validator(z.object({ query: z.string().min(1) }))
  .handler(async ({ data }) => {
    return fetchCoinGecko({
      cacheKey: `search:${data.query}`,
      ttlMs: CACHE_TTL_MS.search,
      path: '/search',
      params: { query: data.query },
      schema: rawSearchSchema,
    })
  })
