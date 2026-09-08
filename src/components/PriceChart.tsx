import { useLayoutEffect, useRef, useState } from 'react'
import * as stylex from '@stylexjs/stylex'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  useCartesianScale,
  XAxis,
  YAxis,
} from 'recharts'
import { colors, duration, font, radius, space, type } from '../styles/tokens.stylex'
import { formatPrice } from '../lib/format'

type PriceChartProps = {
  points: [number, number][]
  days: 1 | 7 | 30 | 365
  isFetching?: boolean
}

const dateFormatters: Record<PriceChartProps['days'], Intl.DateTimeFormat> = {
  1: new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }),
  7: new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', timeZone: 'UTC' }),
  30: new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', timeZone: 'UTC' }),
  365: new Intl.DateTimeFormat('en-US', { month: 'short', year: '2-digit', timeZone: 'UTC' }),
}

const tooltipTimeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'UTC',
})

// Guessing a per-character advance width was unreliable (bold weight, font
// fallback if the mono font isn't loaded yet, "$"/","/"." glyph widths) and
// visibly clipped text in practice. BUBBLE_PADDING_PX is only a fallback
// used for the very first paint before the real text has been measured.
const BUBBLE_PADDING_PX = 20
const TICK_FONT_SIZE = 12

type ChartTooltipProps = {
  active?: boolean
  payload?: readonly unknown[]
  days: PriceChartProps['days']
  startPrice: number
}

function ChartTooltip({ active, payload, days, startPrice }: ChartTooltipProps) {
  if (!active || !payload?.length) return null
  const point = payload[0] as { payload: { timestamp: number }; value: number }
  const timestamp = point.payload.timestamp
  const price = point.value
  const changeFromStart = ((price - startPrice) / startPrice) * 100

  return (
    <div {...stylex.props(styles.tooltip)}>
      <p {...stylex.props(styles.tooltipPrice)}>{formatPrice(price)}</p>
      <p {...stylex.props(styles.tooltipTime)}>
        {days === 1 ? tooltipTimeFormatter.format(timestamp) : dateFormatters[days].format(timestamp)}
      </p>
      <p {...stylex.props(changeFromStart >= 0 ? styles.tooltipChangeUp : styles.tooltipChangeDown)}>
        {changeFromStart >= 0 ? '+' : ''}
        {changeFromStart.toFixed(2)}% from range start
      </p>
    </div>
  )
}

// A recognized Recharts component (ReferenceDot, etc.) still paints inside
// Recharts' own fixed internal layer order regardless of where it sits in
// JSX — that's what left the bubble rendering *behind* the Area's fill.
// Recharts 3 renders genuinely custom, non-Recharts components in true JSX
// order instead, so this reads its own pixel position via useCartesianScale
// and is placed as the AreaChart's last child to guarantee it paints on top
// of everything else.
function EndPriceBubble({ timestamp, price }: { timestamp: number; price: number }) {
  const textRef = useRef<SVGTextElement>(null)
  const [textWidth, setTextWidth] = useState<number | null>(null)
  const text = formatPrice(price)
  const point = useCartesianScale({ x: timestamp, y: price })

  // getBBox() measures the glyphs actually rendered by the browser — the
  // only reliable way to size the pill, since a guessed character width
  // clipped real prices (bold weight + font-fallback widths don't match a
  // flat per-character estimate).
  useLayoutEffect(() => {
    if (textRef.current) {
      setTextWidth(textRef.current.getBBox().width)
    }
  }, [text])

  if (!point) return null
  const { x: cx, y: cy } = point

  const width = textWidth !== null ? textWidth + BUBBLE_PADDING_PX : text.length * 9 + BUBBLE_PADDING_PX
  const centerX = cx - 6 + width / 2

  return (
    <g>
      <rect x={cx - 6} y={cy - 13} width={width} height={26} rx={13} fill={colors.primary} />
      <text
        ref={textRef}
        x={centerX}
        y={cy + 4}
        textAnchor="middle"
        fontSize={TICK_FONT_SIZE}
        fontWeight={700}
        fontFamily="JetBrains Mono, ui-monospace, monospace"
        fill="#FFFFFF"
      >
        {text}
      </text>
    </g>
  )
}

export default function PriceChart({ points, days, isFetching = false }: PriceChartProps) {
  if (points.length < 2) {
    return <div {...stylex.props(styles.empty)}>Not enough data to chart this range yet.</div>
  }

  const data = points.map(([timestamp, price]) => ({ timestamp, price }))
  const prices = data.map((d) => d.price)
  const maxPrice = Math.max(...prices)
  const minPrice = Math.min(...prices)
  const lastPoint = data[data.length - 1]
  const startPrice = data[0].price

  // Asymmetric headroom: flush at the bottom, breathing room at the top so
  // the max-value guide line and the end-price bubble don't collide with
  // the plot's top edge.
  const priceRange = maxPrice - minPrice || maxPrice * 0.01
  const yDomain: [number, number] = [minPrice - priceRange * 0.02, maxPrice + priceRange * 0.12]

  return (
    <div {...stylex.props(styles.wrap)}>
      <div {...stylex.props(styles.chartArea, isFetching && styles.chartAreaFetching)}>
        <ResponsiveContainer width="100%" height={420}>
          <AreaChart data={data} margin={{ top: 24, right: 64, left: 8, bottom: 8 }} accessibilityLayer>
            <defs>
              <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.chartLine} stopOpacity={0.2} />
                <stop offset="100%" stopColor={colors.chartLine} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={colors.chartGrid} vertical={false} />
            <XAxis
              dataKey="timestamp"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(value: number) => dateFormatters[days].format(value)}
              stroke={colors.border}
              tick={{ fill: colors.foreground, fontSize: TICK_FONT_SIZE, fontFamily: font.mono }}
              tickLine={false}
              axisLine={{ stroke: colors.border }}
              minTickGap={48}
            />
            <YAxis
              domain={yDomain}
              tickFormatter={(value: number) => formatPrice(value)}
              stroke={colors.border}
              tick={{ fill: colors.foreground, fontSize: TICK_FONT_SIZE, fontFamily: font.mono }}
              tickLine={false}
              axisLine={false}
              width={90}
            />
            <Tooltip
              content={(props) => <ChartTooltip {...props} days={days} startPrice={startPrice} />}
              cursor={{ stroke: colors.border, strokeDasharray: '4 4' }}
              isAnimationActive={false}
            />
            <ReferenceLine y={maxPrice} stroke={colors.primary} strokeDasharray="4 4" strokeOpacity={0.5} />
            <Area
              type="monotone"
              dataKey="price"
              stroke={colors.chartLine}
              strokeWidth={2}
              fill="url(#priceFill)"
              isAnimationActive={false}
              dot={false}
              activeDot={{ r: 5, fill: colors.primary, stroke: colors.background, strokeWidth: 2 }}
            />
            <EndPriceBubble timestamp={lastPoint.timestamp} price={lastPoint.price} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const styles = stylex.create({
  wrap: {
    width: '100%',
  },
  chartArea: {
    transitionProperty: 'opacity',
    transitionDuration: duration.base,
  },
  chartAreaFetching: {
    opacity: 0.5,
  },
  empty: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 420,
    fontFamily: font.sans,
    fontSize: type.smallSize,
    color: colors.foreground,
    opacity: 0.5,
  },
  tooltip: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingBlock: space.sm,
    paddingInline: space.md,
  },
  tooltipPrice: {
    margin: 0,
    fontFamily: font.mono,
    fontSize: type.smallSize,
    fontWeight: 700,
    color: colors.foreground,
  },
  tooltipTime: {
    margin: 0,
    fontFamily: font.sans,
    fontSize: type.captionSize,
    color: colors.foreground,
    opacity: 0.5,
  },
  tooltipChangeUp: {
    margin: 0,
    fontFamily: font.mono,
    fontSize: type.captionSize,
    color: colors.up,
  },
  tooltipChangeDown: {
    margin: 0,
    fontFamily: font.mono,
    fontSize: type.captionSize,
    color: colors.down,
  },
})
