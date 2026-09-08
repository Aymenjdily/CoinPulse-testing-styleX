import { createFileRoute, Link } from '@tanstack/react-router'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import * as stylex from '@stylexjs/stylex'
import { ArrowLeft, Star } from 'lucide-react'
import { getCoinDetail } from '../lib/server/coinDetail'
import { getMarketChart } from '../lib/server/marketChart'
import { CACHE_TTL_MS } from '../lib/data-policy'
import { formatCompactNumber, formatCompactUsd, formatPercent, formatPrice } from '../lib/format'
import { useWatchlist } from '../hooks/useWatchlist'
import { colors, duration, font, radius, space, type } from '../styles/tokens.stylex'
import Badge from '../components/Badge'
import RangeTabs from '../components/RangeTabs'
import PriceChart from '../components/PriceChart'
import DetailStatCard, { StatCaption } from '../components/DetailStatCard'

const RANGES = ['24H', '7D', '30D', '1Y'] as const
type Range = (typeof RANGES)[number]

const daysByRange: Record<Range, 1 | 7 | 30 | 365> = {
  '24H': 1,
  '7D': 7,
  '30D': 30,
  '1Y': 365,
}

const searchSchema = z.object({
  range: z.enum(RANGES).optional(),
})

export const Route = createFileRoute('/coin/$coinId')({
  validateSearch: searchSchema,
  component: CoinDetailPage,
})

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  month: 'short',
  day: '2-digit',
  year: 'numeric',
})

function describeGranularity(points: [number, number][]): string {
  if (points.length < 2) return ''
  let totalGap = 0
  for (let i = 1; i < points.length; i++) totalGap += points[i][0] - points[i - 1][0]
  const avgMinutes = totalGap / (points.length - 1) / 60_000

  if (avgMinutes <= 10) return `${Math.round(avgMinutes)}-minutely`
  if (avgMinutes <= 180) return 'hourly'
  return 'daily'
}

function PeriodChange({ label, value }: { label: string; value: number | null }) {
  return (
    <span {...stylex.props(styles.period)}>
      <span {...stylex.props(styles.periodLabel)}>{label}</span>
      {value === null ? (
        <span {...stylex.props(styles.periodMuted)}>—</span>
      ) : (
        <span {...stylex.props(value >= 0 ? styles.periodUp : styles.periodDown)}>
          {formatPercent(value)}
        </span>
      )}
    </span>
  )
}

function SupplyBar({ fraction }: { fraction: number }) {
  return (
    <div {...stylex.props(styles.supplyTrack)}>
      <div {...stylex.props(styles.supplyFill)} style={{ '--supply-fraction': fraction } as React.CSSProperties} />
    </div>
  )
}

function CoinDetailPage() {
  const { coinId } = Route.useParams()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const range = search.range ?? '7D'
  const days = daysByRange[range]

  const { isWatched, toggle } = useWatchlist()

  const detailQuery = useQuery({
    queryKey: ['coin-detail', coinId],
    queryFn: () => getCoinDetail({ data: { coinId } }),
    refetchInterval: CACHE_TTL_MS.coinDetail,
    refetchIntervalInBackground: false,
  })

  const chartTtl =
    days === 1
      ? CACHE_TTL_MS.marketChart1d
      : days === 7
        ? CACHE_TTL_MS.marketChart7d
        : days === 30
          ? CACHE_TTL_MS.marketChart30d
          : CACHE_TTL_MS.marketChart365d

  const chartQuery = useQuery({
    queryKey: ['market-chart', coinId, days],
    queryFn: () => getMarketChart({ data: { coinId, days } }),
    refetchInterval: chartTtl,
    refetchIntervalInBackground: false,
    // Keeps the previous range's chart on screen (dimmed via PriceChart's
    // isFetching prop) while a newly selected range loads, instead of
    // blanking to a loading state on every tab click.
    placeholderData: keepPreviousData,
  })

  const coin = detailQuery.data?.data

  return (
    <main {...stylex.props(styles.main)}>
      <Link to="/" {...stylex.props(styles.backLink)}>
        <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" /> Back to markets
      </Link>

      {!coin && <p {...stylex.props(styles.loading)}>Loading…</p>}

      {coin && (
        <>
          <div {...stylex.props(styles.identityRow)}>
            <div {...stylex.props(styles.identity)}>
              <img src={coin.image} alt="" width={40} height={40} {...stylex.props(styles.coinIcon)} />
              <h1 {...stylex.props(styles.coinName)}>{coin.name}</h1>
              <Badge variant="neutral">{coin.symbol.toUpperCase()}</Badge>
              {coin.marketCapRank !== null && <Badge variant="rank">#{coin.marketCapRank}</Badge>}
            </div>
            <button
              type="button"
              onClick={() => toggle(coin.id)}
              aria-pressed={isWatched(coin.id)}
              {...stylex.props(styles.watchButton, isWatched(coin.id) && styles.watchButtonActive)}
            >
              <Star size={16} strokeWidth={2} fill={isWatched(coin.id) ? 'currentColor' : 'none'} aria-hidden="true" />
              Watchlist
            </button>
          </div>

          <div {...stylex.props(styles.priceRow)}>
            <span {...stylex.props(styles.heroPrice)}>{formatPrice(coin.currentPrice)}</span>
            {coin.priceChangePercentage24h !== null && (
              <Badge variant={coin.priceChangePercentage24h >= 0 ? 'up' : 'down'}>
                {formatPercent(coin.priceChangePercentage24h)}
              </Badge>
            )}
            <span {...stylex.props(styles.periodMuted)}>24h</span>
          </div>
          <p {...stylex.props(styles.updatedCaption)}>
            updated {timeFormatter.format(detailQuery.data!.lastUpdated)} UTC · data by CoinGecko
          </p>

          <div {...stylex.props(styles.periodsRow)}>
            <PeriodChange label="1H" value={coin.priceChangePercentage1h} />
            <PeriodChange label="7D" value={coin.priceChangePercentage7d} />
            <PeriodChange label="30D" value={coin.priceChangePercentage30d} />
            <PeriodChange label="1Y" value={coin.priceChangePercentage1y} />
          </div>

          <div {...stylex.props(styles.chartHeader)}>
            <RangeTabs
              options={RANGES}
              value={range}
              onChange={(next) => navigate({ search: { range: next === '7D' ? undefined : next } })}
              aria-label="Chart range"
            />
            {chartQuery.data && (
              <p {...stylex.props(styles.chartMeta)}>
                {range.toLowerCase()} · {describeGranularity(chartQuery.data.data.prices)} ·{' '}
                {chartQuery.data.data.prices.length} points
              </p>
            )}
          </div>

          {chartQuery.data ? (
            <PriceChart
              points={chartQuery.data.data.prices}
              days={days}
              isFetching={chartQuery.isFetching}
            />
          ) : (
            <div {...stylex.props(styles.chartLoading)} />
          )}

          <div {...stylex.props(styles.statsHeader)}>
            <h2 {...stylex.props(styles.statsTitle)}>Market stats</h2>
            <p {...stylex.props(styles.chartMeta)}>
              from /coins/{coinId} · cached {Math.round(CACHE_TTL_MS.coinDetail / 60_000)} min
            </p>
          </div>

          <div {...stylex.props(styles.statsGrid)}>
            <DetailStatCard label="Market cap" value={formatCompactUsd(coin.marketCap)}>
              {coin.marketCapChangePercentage24h !== null && (
                <>
                  <StatCaption tone={coin.marketCapChangePercentage24h >= 0 ? 'up' : 'down'}>
                    {formatPercent(coin.marketCapChangePercentage24h)}
                  </StatCaption>
                  <StatCaption>· 24h</StatCaption>
                </>
              )}
            </DetailStatCard>

            <DetailStatCard label="24h volume" value={formatCompactUsd(coin.totalVolume)}>
              <StatCaption>
                {coin.marketCap > 0 ? `${((coin.totalVolume / coin.marketCap) * 100).toFixed(1)}% of market cap` : '—'}
              </StatCaption>
            </DetailStatCard>

            <DetailStatCard
              label="Circulating supply"
              value={coin.circulatingSupply !== null ? `${formatCompactNumber(coin.circulatingSupply)} ${coin.symbol.toUpperCase()}` : '—'}
            >
              {coin.circulatingSupply !== null && coin.maxSupply !== null ? (
                <div {...stylex.props(styles.supplyWrap)}>
                  <StatCaption>{Math.round((coin.circulatingSupply / coin.maxSupply) * 100)}% of max supply</StatCaption>
                  <SupplyBar fraction={coin.circulatingSupply / coin.maxSupply} />
                </div>
              ) : (
                <StatCaption>no max supply</StatCaption>
              )}
            </DetailStatCard>

            <DetailStatCard
              label="Max supply"
              value={coin.maxSupply !== null ? `${formatCompactNumber(coin.maxSupply)} ${coin.symbol.toUpperCase()}` : '—'}
            >
              <StatCaption>{coin.maxSupply !== null ? 'hard cap' : 'uncapped'}</StatCaption>
            </DetailStatCard>

            <DetailStatCard label="24h high" value={coin.high24h !== null ? formatPrice(coin.high24h) : '—'} />

            <DetailStatCard label="24h low" value={coin.low24h !== null ? formatPrice(coin.low24h) : '—'} />

            <DetailStatCard label="All-time high" value={formatPrice(coin.ath)}>
              <StatCaption>{dateFormatter.format(new Date(coin.athDate))}</StatCaption>
              {coin.athChangePercentage !== null && (
                <>
                  <StatCaption>·</StatCaption>
                  <StatCaption tone={coin.athChangePercentage >= 0 ? 'up' : 'down'}>
                    {formatPercent(coin.athChangePercentage)}
                  </StatCaption>
                </>
              )}
            </DetailStatCard>

            <DetailStatCard label="All-time low" value={formatPrice(coin.atl)}>
              <StatCaption>{dateFormatter.format(new Date(coin.atlDate))}</StatCaption>
            </DetailStatCard>
          </div>
        </>
      )}
    </main>
  )
}

const chartShimmer = stylex.keyframes({
  '0%': { opacity: 0.6 },
  '50%': { opacity: 1 },
  '100%': { opacity: 0.6 },
})

const styles = stylex.create({
  main: {
    maxWidth: 1280,
    marginInline: 'auto',
    paddingInline: space.lg,
    paddingBlock: space.xl,
    display: 'flex',
    flexDirection: 'column',
    gap: space.lg,
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: space.xs,
    fontFamily: font.sans,
    fontSize: type.smallSize,
    color: colors.foreground,
    opacity: 0.6,
    textDecoration: 'none',
    width: 'fit-content',
  },
  loading: {
    fontFamily: font.sans,
    fontSize: type.bodySize,
    color: colors.foreground,
    opacity: 0.5,
  },
  identityRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  identity: {
    display: 'flex',
    alignItems: 'center',
    gap: space.md,
  },
  coinIcon: {
    borderRadius: radius.pill,
    flexShrink: 0,
  },
  coinName: {
    margin: 0,
    fontFamily: font.sans,
    fontSize: type.titleSize,
    fontWeight: type.titleWeight,
    color: colors.foreground,
  },
  watchButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: space.xs,
    fontFamily: font.sans,
    fontSize: type.smallSize,
    fontWeight: 600,
    color: colors.foreground,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingBlock: space.sm,
    paddingInline: space.lg,
    cursor: 'pointer',
  },
  watchButtonActive: {
    color: colors.primary,
    borderColor: colors.primary,
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: space.md,
  },
  heroPrice: {
    fontFamily: font.mono,
    fontSize: type.heroSize,
    fontWeight: type.heroWeight,
    color: colors.foreground,
    fontVariantNumeric: 'tabular-nums',
  },
  periodMuted: {
    fontFamily: font.sans,
    fontSize: type.smallSize,
    color: colors.foreground,
    opacity: 0.5,
  },
  updatedCaption: {
    margin: 0,
    fontFamily: font.mono,
    fontSize: type.captionSize,
    color: colors.foreground,
    opacity: 0.5,
  },
  periodsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: space.xl,
  },
  period: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: space.xs,
  },
  periodLabel: {
    fontFamily: font.sans,
    fontSize: type.smallSize,
    color: colors.foreground,
    opacity: 0.5,
  },
  periodUp: {
    fontFamily: font.mono,
    fontSize: type.smallSize,
    fontWeight: 700,
    color: colors.up,
    fontVariantNumeric: 'tabular-nums',
  },
  periodDown: {
    fontFamily: font.mono,
    fontSize: type.smallSize,
    fontWeight: 700,
    color: colors.down,
    fontVariantNumeric: 'tabular-nums',
  },
  chartHeader: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
    marginTop: space.md,
  },
  chartMeta: {
    margin: 0,
    fontFamily: font.mono,
    fontSize: type.captionSize,
    color: colors.foreground,
    opacity: 0.5,
  },
  chartLoading: {
    height: 420,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceSubtle,
    animationName: {
      default: chartShimmer,
      '@media (prefers-reduced-motion: reduce)': 'none',
    },
    animationDuration: duration.slow,
    animationIterationCount: 'infinite',
  },
  statsHeader: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: space.md,
    marginTop: space.lg,
  },
  statsTitle: {
    margin: 0,
    fontFamily: font.sans,
    fontSize: type.cardTitleSize,
    fontWeight: type.cardTitleWeight,
    color: colors.foreground,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: space.lg,
  },
  supplyWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.xs,
    width: '100%',
  },
  supplyTrack: {
    width: '100%',
    height: '4px',
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  supplyFill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    width: 'calc(var(--supply-fraction) * 100%)',
  },
})
