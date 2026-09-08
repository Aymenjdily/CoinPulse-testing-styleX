import * as stylex from '@stylexjs/stylex'
import { ArrowUp, ArrowDown, Star } from 'lucide-react'
import type { CoinMarket } from '../lib/types'
import type { FlashDirection } from '../hooks/usePriceFlash'
import { colors, duration, easing, font, radius, space, type } from '../styles/tokens.stylex'
import { formatCompactUsd, formatPercent, formatPrice } from '../lib/format'
import Badge from './Badge'

export type SortKey =
  | 'rank'
  | 'price'
  | 'change1h'
  | 'change24h'
  | 'change7d'
  | 'volume'
  | 'marketCap'
export type SortDir = 'asc' | 'desc'

const gridTemplate =
  '32px 48px minmax(160px, 2fr) repeat(4, minmax(80px, 1fr)) 120px minmax(90px, 1fr)'

function ChangeBadge({ value }: { value: number | null }) {
  if (value === null) return <span {...stylex.props(styles.numericCell)}>—</span>
  return (
    <span {...stylex.props(styles.numericCell)}>
      <Badge variant={value >= 0 ? 'up' : 'down'}>{formatPercent(value)}</Badge>
    </span>
  )
}

function Sparkline({ points, direction }: { points: number[]; direction: 'up' | 'down' }) {
  if (points.length < 2) return <span>—</span>

  const width = 96
  const height = 28
  const min = Math.min(...points)
  const max = Math.max(...points)
  const span = max - min || 1

  const path = points
    .map((value, index) => {
      const x = (index / (points.length - 1)) * width
      const y = height - ((value - min) / span) * height
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  const color = direction === 'up' ? colors.sparklineUp : colors.sparklineDown

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <path d={path} fill="none" stroke={color} strokeWidth={1.5} />
    </svg>
  )
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return null
  return dir === 'asc' ? (
    <ArrowUp size={11} strokeWidth={2.5} aria-hidden="true" />
  ) : (
    <ArrowDown size={11} strokeWidth={2.5} aria-hidden="true" />
  )
}

type HeaderProps = {
  sort: SortKey
  dir: SortDir
  onSort: (key: SortKey) => void
}

const sortableHeaders: { key: SortKey; label: string; style: 'rank' | 'numeric' }[] = [
  { key: 'price', label: 'PRICE', style: 'numeric' },
  { key: 'change1h', label: '1H', style: 'numeric' },
  { key: 'change24h', label: '24H', style: 'numeric' },
  { key: 'change7d', label: '7D', style: 'numeric' },
]

export function MarketsTableHeader({ sort, dir, onSort }: HeaderProps) {
  return (
    <div {...stylex.props(styles.headerRow)}>
      <span {...stylex.props(styles.headerCellStar)} aria-hidden="true" />
      <button
        type="button"
        onClick={() => onSort('rank')}
        {...stylex.props(styles.headerButton, styles.headerCellRank)}
      >
        # <SortIcon active={sort === 'rank'} dir={dir} />
      </button>
      <span {...stylex.props(styles.headerCellCoin)}>COIN</span>
      {sortableHeaders.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onSort(key)}
          {...stylex.props(styles.headerButton, styles.headerCellNumeric)}
        >
          {label} <SortIcon active={sort === key} dir={dir} />
        </button>
      ))}
      <span {...stylex.props(styles.headerCellSparkline)}>LAST 7 DAYS</span>
      <button
        type="button"
        onClick={() => onSort('marketCap')}
        {...stylex.props(styles.headerButton, styles.headerCellNumeric)}
      >
        MARKET CAP <SortIcon active={sort === 'marketCap'} dir={dir} />
      </button>
    </div>
  )
}

type RowProps = {
  coin: CoinMarket
  isWatched: boolean
  onToggleWatch: (coinId: string) => void
  flash?: FlashDirection
}

export function MarketsTableRow({ coin, isWatched, onToggleWatch, flash }: RowProps) {
  const changeDirection = (coin.priceChangePercentage7d ?? 0) >= 0 ? 'up' : 'down'

  return (
    <div {...stylex.props(styles.row)}>
      <button
        type="button"
        onClick={() => onToggleWatch(coin.id)}
        aria-label={isWatched ? `Remove ${coin.name} from watchlist` : `Add ${coin.name} to watchlist`}
        aria-pressed={isWatched}
        {...stylex.props(styles.starButton)}
      >
        <Star size={16} strokeWidth={2} fill={isWatched ? 'currentColor' : 'none'} {...stylex.props(styles.starIcon, isWatched && styles.starIconActive)} />
      </button>
      <span {...stylex.props(styles.rankCell)}>{coin.marketCapRank ?? '—'}</span>
      <span {...stylex.props(styles.coinCell)}>
        <img src={coin.image} alt="" width={24} height={24} {...stylex.props(styles.coinIcon)} />
        <span>
          <span {...stylex.props(styles.coinName)}>{coin.name}</span>
          <span {...stylex.props(styles.coinSymbol)}>{coin.symbol.toUpperCase()}</span>
        </span>
      </span>
      <span
        aria-live="off"
        {...stylex.props(
          styles.numericCell,
          flash === 'up' && styles.flashUp,
          flash === 'down' && styles.flashDown,
        )}
      >
        {formatPrice(coin.currentPrice)}
      </span>
      <ChangeBadge value={coin.priceChangePercentage1h} />
      <span
        aria-live="off"
        {...stylex.props(
          flash === 'up' && styles.flashUp,
          flash === 'down' && styles.flashDown,
        )}
      >
        <ChangeBadge value={coin.priceChangePercentage24h} />
      </span>
      <ChangeBadge value={coin.priceChangePercentage7d} />
      <span {...stylex.props(styles.sparklineCell)}>
        <Sparkline points={coin.sparkline7d} direction={changeDirection} />
      </span>
      <span {...stylex.props(styles.numericCell)}>{formatCompactUsd(coin.marketCap)}</span>
    </div>
  )
}

export function MarketsTableSkeletonRow() {
  return (
    <div {...stylex.props(styles.row)}>
      <span />
      <span {...stylex.props(styles.skeletonBlock, styles.skeletonRank)} />
      <span {...stylex.props(styles.coinCell)}>
        <span {...stylex.props(styles.skeletonCircle)} />
        <span {...stylex.props(styles.skeletonBlock, styles.skeletonName)} />
      </span>
      <span {...stylex.props(styles.skeletonBlock, styles.skeletonNumeric)} />
      <span {...stylex.props(styles.skeletonBlock, styles.skeletonNumericSmall)} />
      <span {...stylex.props(styles.skeletonBlock, styles.skeletonNumericSmall)} />
      <span {...stylex.props(styles.skeletonBlock, styles.skeletonNumericSmall)} />
      <span {...stylex.props(styles.sparklineCell)}>
        <span {...stylex.props(styles.skeletonBlock, styles.skeletonSparkline)} />
      </span>
      <span {...stylex.props(styles.skeletonBlock, styles.skeletonNumericWide)} />
    </div>
  )
}

const flashUpKeyframes = stylex.keyframes({
  '0%': { backgroundColor: colors.upSoft },
  '100%': { backgroundColor: 'transparent' },
})

const flashDownKeyframes = stylex.keyframes({
  '0%': { backgroundColor: colors.downSoft },
  '100%': { backgroundColor: 'transparent' },
})

const shimmer = stylex.keyframes({
  '0%': { opacity: 0.5 },
  '50%': { opacity: 1 },
  '100%': { opacity: 0.5 },
})

const styles = stylex.create({
  headerRow: {
    display: 'grid',
    gridTemplateColumns: gridTemplate,
    alignItems: 'center',
    gap: space.md,
    paddingBlock: space.sm,
    paddingInline: space.md,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.border,
  },
  headerButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '2px',
    backgroundColor: 'transparent',
    borderWidth: 0,
    cursor: 'pointer',
    fontFamily: font.sans,
    fontSize: type.captionSize,
    fontWeight: type.captionWeight,
    letterSpacing: type.captionTracking,
    color: colors.foreground,
    opacity: {
      default: 0.5,
      ':hover': 0.8,
    },
    textTransform: 'uppercase',
  },
  headerCellStar: {},
  headerCellRank: {
    justifyContent: 'flex-start',
  },
  headerCellCoin: {
    fontFamily: font.sans,
    fontSize: type.captionSize,
    fontWeight: type.captionWeight,
    letterSpacing: type.captionTracking,
    color: colors.foreground,
    opacity: 0.5,
    textTransform: 'uppercase',
  },
  headerCellNumeric: {
    textAlign: 'right',
  },
  headerCellSparkline: {
    fontFamily: font.sans,
    fontSize: type.captionSize,
    fontWeight: type.captionWeight,
    letterSpacing: type.captionTracking,
    color: colors.foreground,
    opacity: 0.5,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: gridTemplate,
    alignItems: 'center',
    gap: space.md,
    paddingBlock: space.md,
    paddingInline: space.md,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.border,
  },
  starButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
    cursor: 'pointer',
    padding: 0,
    color: colors.foreground,
    opacity: {
      default: 0.3,
      ':hover': 0.6,
    },
  },
  starIcon: {},
  starIconActive: {
    color: colors.primary,
    opacity: 1,
  },
  rankCell: {
    fontFamily: font.mono,
    fontSize: type.smallSize,
    color: colors.foreground,
    opacity: 0.6,
  },
  coinCell: {
    display: 'flex',
    alignItems: 'center',
    gap: space.sm,
  },
  coinIcon: {
    borderRadius: radius.pill,
    flexShrink: 0,
  },
  coinName: {
    display: 'block',
    fontFamily: font.sans,
    fontSize: type.bodySize,
    fontWeight: 600,
    color: colors.foreground,
  },
  coinSymbol: {
    display: 'block',
    fontFamily: font.sans,
    fontSize: type.smallSize,
    color: colors.foreground,
    opacity: 0.5,
  },
  numericCell: {
    fontFamily: font.mono,
    fontSize: type.smallSize,
    fontWeight: 600,
    color: colors.foreground,
    fontVariantNumeric: 'tabular-nums',
    textAlign: 'right',
    borderRadius: radius.sm,
  },
  sparklineCell: {
    display: 'flex',
    justifyContent: 'center',
  },
  flashUp: {
    animationName: {
      default: flashUpKeyframes,
      '@media (prefers-reduced-motion: reduce)': 'none',
    },
    animationDuration: duration.slow,
    animationTimingFunction: easing.out,
  },
  flashDown: {
    animationName: {
      default: flashDownKeyframes,
      '@media (prefers-reduced-motion: reduce)': 'none',
    },
    animationDuration: duration.slow,
    animationTimingFunction: easing.out,
  },
  skeletonBlock: {
    display: 'inline-block',
    backgroundColor: colors.border,
    borderRadius: radius.sm,
    animationName: {
      default: shimmer,
      '@media (prefers-reduced-motion: reduce)': 'none',
    },
    animationDuration: duration.slow,
    animationIterationCount: 'infinite',
  },
  skeletonCircle: {
    display: 'inline-block',
    width: '24px',
    height: '24px',
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    flexShrink: 0,
    animationName: {
      default: shimmer,
      '@media (prefers-reduced-motion: reduce)': 'none',
    },
    animationDuration: duration.slow,
    animationIterationCount: 'infinite',
  },
  skeletonRank: { width: '16px', height: '12px' },
  skeletonName: { width: '96px', height: '14px' },
  skeletonNumeric: { width: '64px', height: '14px', marginLeft: 'auto' },
  skeletonNumericSmall: { width: '48px', height: '14px', marginLeft: 'auto' },
  skeletonNumericWide: { width: '72px', height: '14px', marginLeft: 'auto' },
  skeletonSparkline: { width: '96px', height: '20px' },
})
