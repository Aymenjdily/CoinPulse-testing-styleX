import { z } from 'zod'

// Zod schemas validate every CoinGecko response at the server boundary
// (AGENTS.md section 8). UI components only ever see these inferred types,
// never a raw CoinGecko payload.

export const coinMarketSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  image: z.string(),
  currentPrice: z.number(),
  marketCap: z.number(),
  marketCapRank: z.number().nullable(),
  totalVolume: z.number(),
  priceChangePercentage1h: z.number().nullable(),
  priceChangePercentage24h: z.number().nullable(),
  priceChangePercentage7d: z.number().nullable(),
  sparkline7d: z.array(z.number()),
  lastUpdated: z.string(),
})
export type CoinMarket = z.infer<typeof coinMarketSchema>

export const coinDetailSchema = coinMarketSchema
  .omit({ sparkline7d: true })
  .extend({
    description: z.string(),
    ath: z.number(),
    athChangePercentage: z.number().nullable(),
    atl: z.number(),
    athDate: z.string(),
    atlDate: z.string(),
    high24h: z.number().nullable(),
    low24h: z.number().nullable(),
    marketCapChangePercentage24h: z.number().nullable(),
    priceChangePercentage30d: z.number().nullable(),
    priceChangePercentage1y: z.number().nullable(),
    circulatingSupply: z.number().nullable(),
    totalSupply: z.number().nullable(),
    maxSupply: z.number().nullable(),
    homepage: z.string().nullable(),
    genesisDate: z.string().nullable(),
  })
export type CoinDetail = z.infer<typeof coinDetailSchema>

export const marketChartSchema = z.object({
  prices: z.array(z.tuple([z.number(), z.number()])),
  marketCaps: z.array(z.tuple([z.number(), z.number()])),
  totalVolumes: z.array(z.tuple([z.number(), z.number()])),
})
export type MarketChart = z.infer<typeof marketChartSchema>

export const globalDataSchema = z.object({
  totalMarketCapUsd: z.number(),
  totalVolumeUsd: z.number(),
  btcDominance: z.number(),
  activeCryptocurrencies: z.number(),
  marketCapChangePercentage24h: z.number(),
})
export type GlobalData = z.infer<typeof globalDataSchema>

export const trendingCoinSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  marketCapRank: z.number().nullable(),
  thumb: z.string(),
  score: z.number(),
  priceChangePercentage24h: z.number().nullable(),
})
export type TrendingCoin = z.infer<typeof trendingCoinSchema>

export const searchResultSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  marketCapRank: z.number().nullable(),
  thumb: z.string(),
})
export type SearchResult = z.infer<typeof searchResultSchema>

export type WatchlistEntry = {
  coinId: string
  addedAt: number
}

// Wraps every server-function result so the UI can render an honest
// staleness indicator (AGENTS.md section 7.8) without re-deriving it.
export type Fetched<T> = {
  data: T
  stale: boolean
  lastUpdated: number
}

export class DataProviderError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message)
    this.name = 'DataProviderError'
  }
}
