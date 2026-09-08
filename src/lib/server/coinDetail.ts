import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { CoinDetail } from '../types'
import { CACHE_TTL_MS } from '../data-policy'
import { fetchCoinGecko } from './fetchCoinGecko'

const rawCoinDetailSchema = z
  .object({
    id: z.string(),
    symbol: z.string(),
    name: z.string(),
    image: z.object({ large: z.string() }),
    market_data: z.object({
      current_price: z.object({ usd: z.number() }),
      market_cap: z.object({ usd: z.number() }),
      market_cap_rank: z.number().nullable(),
      total_volume: z.object({ usd: z.number() }),
      price_change_percentage_1h_in_currency: z.object({ usd: z.number().nullable() }).optional(),
      price_change_percentage_24h: z.number().nullable(),
      price_change_percentage_7d: z.number().nullable(),
      ath: z.object({ usd: z.number() }),
      atl: z.object({ usd: z.number() }),
      ath_date: z.object({ usd: z.string() }),
      atl_date: z.object({ usd: z.string() }),
      circulating_supply: z.number().nullable(),
      total_supply: z.number().nullable(),
      max_supply: z.number().nullable(),
    }),
    description: z.object({ en: z.string() }),
    links: z.object({ homepage: z.array(z.string()) }),
    genesis_date: z.string().nullable(),
    last_updated: z.string(),
  })
  .transform(
    (raw): CoinDetail => ({
      id: raw.id,
      symbol: raw.symbol,
      name: raw.name,
      image: raw.image.large,
      currentPrice: raw.market_data.current_price.usd,
      marketCap: raw.market_data.market_cap.usd,
      marketCapRank: raw.market_data.market_cap_rank,
      totalVolume: raw.market_data.total_volume.usd,
      priceChangePercentage1h: raw.market_data.price_change_percentage_1h_in_currency?.usd ?? null,
      priceChangePercentage24h: raw.market_data.price_change_percentage_24h,
      priceChangePercentage7d: raw.market_data.price_change_percentage_7d,
      description: raw.description.en.split('\n')[0] ?? '',
      ath: raw.market_data.ath.usd,
      atl: raw.market_data.atl.usd,
      athDate: raw.market_data.ath_date.usd,
      atlDate: raw.market_data.atl_date.usd,
      circulatingSupply: raw.market_data.circulating_supply,
      totalSupply: raw.market_data.total_supply,
      maxSupply: raw.market_data.max_supply,
      homepage: raw.links.homepage[0] || null,
      genesisDate: raw.genesis_date,
      lastUpdated: raw.last_updated,
    }),
  )

export const getCoinDetail = createServerFn({ method: 'GET' })
  .validator(z.object({ coinId: z.string() }))
  .handler(async ({ data }) => {
    return fetchCoinGecko({
      cacheKey: `coin-detail:${data.coinId}`,
      ttlMs: CACHE_TTL_MS.coinDetail,
      path: `/coins/${data.coinId}`,
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
      },
      schema: rawCoinDetailSchema,
    })
  })
