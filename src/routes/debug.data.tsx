import { createFileRoute } from '@tanstack/react-router'
import { getMarkets } from '../lib/server/markets'
import { getGlobal } from '../lib/server/global'
import { getTrending } from '../lib/server/trending'
import { getCoinDetail } from '../lib/server/coinDetail'
import { getMarketChart } from '../lib/server/marketChart'
import { searchCoins } from '../lib/server/search'

// Temporary dev-only route to verify the data layer end-to-end (phase
// tasks/02-data-layer.md). Delete once phase 03/04 build real UI that
// consumes this data.
export const Route = createFileRoute('/debug/data')({
  loader: async () => {
    const [markets, global, trending, coinDetail, marketChart, search] = await Promise.all([
      getMarkets(),
      getGlobal(),
      getTrending(),
      getCoinDetail({ data: { coinId: 'bitcoin' } }),
      getMarketChart({ data: { coinId: 'bitcoin', days: 7 } }),
      searchCoins({ data: { query: 'eth' } }),
    ])
    return { markets, global, trending, coinDetail, marketChart, search }
  },
  component: DebugData,
})

function DebugData() {
  const data = Route.useLoaderData()

  return (
    <pre style={{ padding: 16, fontSize: 12, whiteSpace: 'pre-wrap' }}>
      {JSON.stringify(
        {
          markets: { ...data.markets, data: data.markets.data.slice(0, 3) },
          global: data.global,
          trending: data.trending,
          coinDetail: data.coinDetail,
          marketChart: {
            ...data.marketChart,
            data: {
              prices: data.marketChart.data.prices.slice(0, 3),
              marketCaps: data.marketChart.data.marketCaps.slice(0, 3),
              totalVolumes: data.marketChart.data.totalVolumes.slice(0, 3),
            },
          },
          search: data.search,
        },
        null,
        2,
      )}
    </pre>
  )
}
