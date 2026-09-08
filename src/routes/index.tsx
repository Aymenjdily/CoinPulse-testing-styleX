import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { z } from 'zod'
import * as stylex from '@stylexjs/stylex'
import { Star } from 'lucide-react'
import { getMarkets } from '../lib/server/markets'
import { getGlobal } from '../lib/server/global'
import { getTrending } from '../lib/server/trending'
import type { CoinMarket } from '../lib/types'
import { POLL_INTERVAL_MS } from '../lib/data-policy'
import { formatCompactUsd, formatCompactNumber, formatPercent } from '../lib/format'
import { useWatchlist } from '../hooks/useWatchlist'
import { usePriceFlash } from '../hooks/usePriceFlash'
import { useSinceLoadDelta } from '../hooks/useSinceLoadDelta'
import { colors, font, radius, space, type } from '../styles/tokens.stylex'
import StatCard from '../components/StatCard'
import TrendingRail from '../components/TrendingRail'
import ViewToggle from '../components/ViewToggle'
import Pagination from '../components/Pagination'
import {
  MarketsTableHeader,
  MarketsTableRow,
  MarketsTableSkeletonRow,
  type SortDir,
  type SortKey,
} from '../components/MarketsTableShell'

const PAGE_SIZE = 10

const searchSchema = z.object({
  view: z.enum(['all', 'watchlist']).optional(),
  sort: z
    .enum(['rank', 'price', 'change1h', 'change24h', 'change7d', 'volume', 'marketCap'])
    .optional(),
  dir: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().min(1).optional(),
})

export const Route = createFileRoute('/')({
  validateSearch: searchSchema,
  component: App,
})

function sortValue(coin: CoinMarket, key: SortKey): number {
  switch (key) {
    case 'rank':
      return coin.marketCapRank ?? Number.MAX_SAFE_INTEGER
    case 'price':
      return coin.currentPrice
    case 'change1h':
      return coin.priceChangePercentage1h ?? -Infinity
    case 'change24h':
      return coin.priceChangePercentage24h ?? -Infinity
    case 'change7d':
      return coin.priceChangePercentage7d ?? -Infinity
    case 'volume':
      return coin.totalVolume
    case 'marketCap':
      return coin.marketCap
  }
}

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

function App() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  const view = search.view ?? 'all'
  const sort: SortKey = search.sort ?? 'marketCap'
  const dir: SortDir = search.dir ?? 'desc'
  const page = search.page ?? 1

  const { watchedIds, isWatched, toggle } = useWatchlist()

  const marketsQuery = useQuery({
    queryKey: ['markets'],
    queryFn: () => getMarkets(),
    refetchInterval: POLL_INTERVAL_MS.markets,
    refetchIntervalInBackground: false,
  })
  const globalQuery = useQuery({
    queryKey: ['global'],
    queryFn: () => getGlobal(),
    refetchInterval: POLL_INTERVAL_MS.global,
    refetchIntervalInBackground: false,
  })
  const trendingQuery = useQuery({
    queryKey: ['trending'],
    queryFn: () => getTrending(),
    refetchInterval: POLL_INTERVAL_MS.trending,
    refetchIntervalInBackground: false,
  })

  const flashes = usePriceFlash(marketsQuery.data?.data)

  const filteredMarkets = useMemo(() => {
    const all = marketsQuery.data?.data ?? []
    if (view === 'watchlist') return all.filter((coin) => watchedIds.has(coin.id))
    return all
  }, [marketsQuery.data, view, watchedIds])

  const sortedMarkets = useMemo(() => {
    const copy = [...filteredMarkets]
    copy.sort((a, b) => {
      const diff = sortValue(a, sort) - sortValue(b, sort)
      return dir === 'asc' ? diff : -diff
    })
    return copy
  }, [filteredMarkets, sort, dir])

  const totalPages = Math.max(1, Math.ceil(sortedMarkets.length / PAGE_SIZE))
  const clampedPage = Math.min(page, totalPages)
  const pageRows = sortedMarkets.slice((clampedPage - 1) * PAGE_SIZE, clampedPage * PAGE_SIZE)

  function updateSearch(next: Partial<z.infer<typeof searchSchema>>) {
    navigate({ search: (prev) => ({ ...prev, ...next }) })
  }

  function handleSort(key: SortKey) {
    if (key === sort) {
      updateSearch({ dir: dir === 'asc' ? 'desc' : 'asc', page: 1 })
    } else {
      updateSearch({ sort: key, dir: 'desc', page: 1 })
    }
  }

  function handleViewChange(nextView: 'all' | 'watchlist') {
    updateSearch({ view: nextView === 'all' ? undefined : nextView, page: 1 })
  }

  const global = globalQuery.data?.data
  const marketCapDelta =
    global && global.marketCapChangePercentage24h !== 0
      ? {
          direction: (global.marketCapChangePercentage24h >= 0 ? 'up' : 'down') as 'up' | 'down',
          text: `${formatPercent(global.marketCapChangePercentage24h)} today`,
        }
      : undefined

  // CoinGecko's /global has no real 24h delta for volume or dominance —
  // these are genuine changes since this page loaded, not "today" figures.
  // See tasks/03-global-stats-strip.md.
  const volumeSinceLoad = useSinceLoadDelta(global?.totalVolumeUsd)
  const volumeDelta =
    volumeSinceLoad !== undefined && volumeSinceLoad !== 0
      ? {
          direction: (volumeSinceLoad >= 0 ? 'up' : 'down') as 'up' | 'down',
          text: `${formatPercent(volumeSinceLoad)} since load`,
        }
      : undefined

  const dominanceSinceLoad = useSinceLoadDelta(global?.btcDominance)
  const dominanceDelta =
    dominanceSinceLoad !== undefined && dominanceSinceLoad !== 0
      ? {
          direction: (dominanceSinceLoad >= 0 ? 'up' : 'down') as 'up' | 'down',
          text: `${formatPercent(dominanceSinceLoad)} since load`,
        }
      : undefined

  return (
    <main {...stylex.props(styles.main)}>
      <section {...stylex.props(styles.statsSection)}>
        {globalQuery.data?.stale && (
          <p {...stylex.props(styles.staleNotice)}>
            Showing stale data · last updated {timeFormatter.format(globalQuery.data.lastUpdated)} UTC
          </p>
        )}
        <div {...stylex.props(styles.statsGrid)}>
        <StatCard
          label="Total market cap"
          value={global ? formatCompactUsd(global.totalMarketCapUsd) : '—'}
          delta={marketCapDelta}
        />
        <StatCard
          label="24h volume"
          value={global ? formatCompactUsd(global.totalVolumeUsd) : '—'}
          delta={volumeDelta}
          note={global && !volumeDelta ? 'awaiting next update' : undefined}
        />
        <StatCard
          label="BTC dominance"
          value={global ? `${global.btcDominance.toFixed(1)}%` : '—'}
          delta={dominanceDelta}
          note={global && !dominanceDelta ? 'awaiting next update' : undefined}
        />
        <StatCard
          label="Active coins"
          value={global ? formatCompactNumber(global.activeCryptocurrencies) : '—'}
          note="tracked live"
        />
        </div>
      </section>

      {trendingQuery.data && <TrendingRail coins={trendingQuery.data.data} />}

      <section {...stylex.props(styles.marketsSection)}>
        <div {...stylex.props(styles.marketsHeader)}>
          <h1 {...stylex.props(styles.title)}>Markets</h1>
          <ViewToggle view={view} watchlistCount={watchedIds.size} onChange={handleViewChange} />
          {marketsQuery.data && (
            <p {...stylex.props(styles.liveStatus)}>
              {marketsQuery.data.stale ? 'stale · last updated' : 'live · updated'}{' '}
              {timeFormatter.format(marketsQuery.data.lastUpdated)} UTC
            </p>
          )}
        </div>

        <div {...stylex.props(styles.tableShell)}>
          <MarketsTableHeader sort={sort} dir={dir} onSort={handleSort} />

          {marketsQuery.isLoading &&
            Array.from({ length: PAGE_SIZE }, (_, i) => <MarketsTableSkeletonRow key={i} />)}

          {!marketsQuery.isLoading && view === 'watchlist' && pageRows.length === 0 && (
            <div {...stylex.props(styles.emptyState)}>
              <Star size={28} strokeWidth={1.5} aria-hidden="true" />
              <p {...stylex.props(styles.emptyTitle)}>Star a coin to pin it here</p>
              <p {...stylex.props(styles.emptyBody)}>
                Your watchlist is saved in this browser only.
              </p>
            </div>
          )}

          {!marketsQuery.isLoading &&
            pageRows.map((coin) => (
              <MarketsTableRow
                key={coin.id}
                coin={coin}
                isWatched={isWatched(coin.id)}
                onToggleWatch={toggle}
                flash={flashes.get(coin.id)}
              />
            ))}
        </div>

        {!marketsQuery.isLoading && sortedMarkets.length > 0 && (
          <div {...stylex.props(styles.paginationRow)}>
            <p {...stylex.props(styles.paginationLabel)}>
              Showing {(clampedPage - 1) * PAGE_SIZE + 1}–
              {Math.min(clampedPage * PAGE_SIZE, sortedMarkets.length)} of {sortedMarkets.length} coins
            </p>
            <Pagination
              page={clampedPage}
              totalPages={totalPages}
              onPageChange={(nextPage) => updateSearch({ page: nextPage })}
            />
          </div>
        )}
      </section>
    </main>
  )
}

const styles = stylex.create({
  main: {
    maxWidth: 1280,
    marginInline: 'auto',
    paddingInline: space.lg,
    paddingBlock: space.xl,
    display: 'flex',
    flexDirection: 'column',
    gap: space.xxl,
  },
  statsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.sm,
  },
  staleNotice: {
    margin: 0,
    fontFamily: font.mono,
    fontSize: type.captionSize,
    color: colors.warn,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: space.lg,
  },
  marketsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.lg,
  },
  marketsHeader: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space.lg,
  },
  title: {
    margin: 0,
    marginRight: 'auto',
    fontFamily: font.sans,
    fontSize: type.titleSize,
    fontWeight: type.titleWeight,
    color: colors.foreground,
  },
  liveStatus: {
    margin: 0,
    fontFamily: font.mono,
    fontSize: type.captionSize,
    color: colors.up,
  },
  tableShell: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: space.xs,
    paddingBlock: space.xxl,
    color: colors.foreground,
    opacity: 0.5,
  },
  emptyTitle: {
    margin: 0,
    fontFamily: font.sans,
    fontSize: type.bodySize,
    fontWeight: 600,
  },
  emptyBody: {
    margin: 0,
    fontFamily: font.sans,
    fontSize: type.smallSize,
  },
  paginationRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  paginationLabel: {
    margin: 0,
    fontFamily: font.sans,
    fontSize: type.smallSize,
    color: colors.foreground,
    opacity: 0.5,
  },
})
