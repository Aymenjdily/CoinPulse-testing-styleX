import * as stylex from '@stylexjs/stylex'
import { colors, font, radius, space, type } from '../styles/tokens.stylex'
import Badge from './Badge'

export type MarketsTableRow = {
  rank: number
  name: string
  symbol: string
  iconColor: string
  price: string
  change1h: { direction: 'up' | 'down'; text: string }
  change24h: { direction: 'up' | 'down'; text: string }
  change7d: { direction: 'up' | 'down'; text: string }
  sparkline: number[]
  marketCap: string
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

export function MarketsTableHeader() {
  return (
    <div {...stylex.props(styles.headerRow)}>
      <span {...stylex.props(styles.headerCellRank)}>#</span>
      <span {...stylex.props(styles.headerCellCoin)}>COIN</span>
      <span {...stylex.props(styles.headerCellNumeric)}>PRICE</span>
      <span {...stylex.props(styles.headerCellNumeric)}>1H</span>
      <span {...stylex.props(styles.headerCellNumeric)}>24H</span>
      <span {...stylex.props(styles.headerCellNumeric)}>7D</span>
      <span {...stylex.props(styles.headerCellSparkline)}>LAST 7 DAYS</span>
      <span {...stylex.props(styles.headerCellNumeric)}>MARKET CAP</span>
    </div>
  )
}

export function MarketsTableRow({ row }: { row: MarketsTableRow }) {
  return (
    <div {...stylex.props(styles.row)}>
      <span {...stylex.props(styles.rankCell)}>{row.rank}</span>
      <span {...stylex.props(styles.coinCell)}>
        <span
          {...stylex.props(styles.coinIcon)}
          style={{ '--coin-icon-color': row.iconColor } as React.CSSProperties}
        />
        <span>
          <span {...stylex.props(styles.coinName)}>{row.name}</span>
          <span {...stylex.props(styles.coinSymbol)}>{row.symbol}</span>
        </span>
      </span>
      <span {...stylex.props(styles.numericCell)}>{row.price}</span>
      <span {...stylex.props(styles.numericCell)}>
        <Badge variant={row.change1h.direction}>{row.change1h.text}</Badge>
      </span>
      <span {...stylex.props(styles.numericCell)}>
        <Badge variant={row.change24h.direction}>{row.change24h.text}</Badge>
      </span>
      <span {...stylex.props(styles.numericCell)}>
        <Badge variant={row.change7d.direction}>{row.change7d.text}</Badge>
      </span>
      <span {...stylex.props(styles.sparklineCell)}>
        <Sparkline points={row.sparkline} direction={row.change7d.direction} />
      </span>
      <span {...stylex.props(styles.numericCell)}>{row.marketCap}</span>
    </div>
  )
}

const gridTemplate =
  '48px minmax(160px, 2fr) repeat(4, minmax(80px, 1fr)) 120px minmax(90px, 1fr)'

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
  headerCellRank: {
    fontFamily: font.sans,
    fontSize: type.captionSize,
    fontWeight: type.captionWeight,
    letterSpacing: type.captionTracking,
    color: colors.foreground,
    opacity: 0.5,
    textTransform: 'uppercase',
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
    fontFamily: font.sans,
    fontSize: type.captionSize,
    fontWeight: type.captionWeight,
    letterSpacing: type.captionTracking,
    color: colors.foreground,
    opacity: 0.5,
    textTransform: 'uppercase',
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
    width: '24px',
    height: '24px',
    borderRadius: radius.pill,
    flexShrink: 0,
    backgroundColor: 'var(--coin-icon-color)',
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
  },
  sparklineCell: {
    display: 'flex',
    justifyContent: 'center',
  },
})
