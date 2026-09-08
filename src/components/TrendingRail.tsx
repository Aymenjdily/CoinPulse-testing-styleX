import * as stylex from '@stylexjs/stylex'
import { Flame } from 'lucide-react'
import type { TrendingCoin } from '../lib/types'
import { colors, font, radius, space, type } from '../styles/tokens.stylex'
import { formatPercent } from '../lib/format'

type TrendingRailProps = {
  coins: TrendingCoin[]
}

export default function TrendingRail({ coins }: TrendingRailProps) {
  if (coins.length === 0) return null

  return (
    <section {...stylex.props(styles.section)} aria-label="Trending coins">
      <div {...stylex.props(styles.heading)}>
        <Flame size={14} strokeWidth={2} color={colors.warn} aria-hidden="true" />
        <span {...stylex.props(styles.headingText)}>TRENDING</span>
      </div>
      <div {...stylex.props(styles.row)}>
        {coins.map((coin) => (
          <div key={coin.id} {...stylex.props(styles.pill)}>
            <img src={coin.thumb} alt="" width={22} height={22} {...stylex.props(styles.thumb)} />
            <span {...stylex.props(styles.symbol)}>{coin.symbol.toUpperCase()}</span>
            {coin.priceChangePercentage24h !== null && (
              <span
                {...stylex.props(
                  styles.change,
                  coin.priceChangePercentage24h >= 0 ? styles.changeUp : styles.changeDown,
                )}
              >
                {formatPercent(coin.priceChangePercentage24h)}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

const styles = stylex.create({
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.sm,
  },
  heading: {
    display: 'flex',
    alignItems: 'center',
    gap: space.xs,
  },
  headingText: {
    fontFamily: font.sans,
    fontSize: type.captionSize,
    fontWeight: type.captionWeight,
    letterSpacing: type.captionTracking,
    color: colors.foreground,
    opacity: 0.6,
    textTransform: 'uppercase',
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: space.sm,
  },
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: space.sm,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingBlock: space.sm,
    paddingInline: space.lg,
    backgroundColor: colors.background,
  },
  thumb: {
    borderRadius: radius.pill,
    flexShrink: 0,
  },
  symbol: {
    fontFamily: font.mono,
    fontSize: type.bodySize,
    fontWeight: 700,
    color: colors.foreground,
  },
  change: {
    fontFamily: font.mono,
    fontSize: type.bodySize,
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
  },
  changeUp: {
    color: colors.up,
  },
  changeDown: {
    color: colors.down,
  },
})
