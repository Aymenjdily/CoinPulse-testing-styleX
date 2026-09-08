import * as stylex from '@stylexjs/stylex'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { colors, font, radius, space, type } from '../styles/tokens.stylex'
import { formatPrice } from '../lib/format'

type PriceChartProps = {
  points: [number, number][]
  days: 1 | 7 | 30 | 365
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

type ChartTooltipProps = {
  active?: boolean
  payload?: readonly unknown[]
  days: PriceChartProps['days']
}

function ChartTooltip({ active, payload, days }: ChartTooltipProps) {
  if (!active || !payload?.length) return null
  const point = payload[0] as { payload: { timestamp: number }; value: number }
  const timestamp = point.payload.timestamp
  const price = point.value

  return (
    <div {...stylex.props(styles.tooltip)}>
      <p {...stylex.props(styles.tooltipPrice)}>{formatPrice(price)}</p>
      <p {...stylex.props(styles.tooltipTime)}>
        {days === 1 ? tooltipTimeFormatter.format(timestamp) : dateFormatters[days].format(timestamp)}
      </p>
    </div>
  )
}

function EndBubble({ cx, cy, price }: { cx?: number; cy?: number; price: number }) {
  if (cx === undefined || cy === undefined) return null
  const text = formatPrice(price)
  const width = text.length * 8 + 20

  return (
    <g>
      <rect
        x={cx - 4}
        y={cy - 12}
        width={width}
        height={24}
        rx={12}
        fill={colors.primary}
      />
      <text x={cx + width / 2 - 4} y={cy + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#FFFFFF">
        {text}
      </text>
    </g>
  )
}

export default function PriceChart({ points, days }: PriceChartProps) {
  if (points.length < 2) {
    return <div {...stylex.props(styles.empty)}>Not enough data to chart this range yet.</div>
  }

  const data = points.map(([timestamp, price]) => ({ timestamp, price }))
  const prices = data.map((d) => d.price)
  const maxPrice = Math.max(...prices)
  const minPrice = Math.min(...prices)
  const lastPoint = data[data.length - 1]

  return (
    <div {...stylex.props(styles.wrap)}>
      <ResponsiveContainer width="100%" height={420}>
        <AreaChart data={data} margin={{ top: 24, right: 60, left: 8, bottom: 8 }}>
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
            tick={{ fill: colors.foreground, fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}
            tickLine={false}
            axisLine={{ stroke: colors.border }}
            minTickGap={48}
          />
          <YAxis
            domain={[minPrice, maxPrice]}
            tickFormatter={(value: number) => formatPrice(value)}
            stroke={colors.border}
            tick={{ fill: colors.foreground, fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}
            tickLine={false}
            axisLine={false}
            width={90}
          />
          <Tooltip
            content={(props) => <ChartTooltip {...props} days={days} />}
            cursor={{ stroke: colors.border, strokeDasharray: '4 4' }}
          />
          <ReferenceLine y={maxPrice} stroke={colors.primary} strokeDasharray="4 4" strokeOpacity={0.5} />
          <Area
            type="monotone"
            dataKey="price"
            stroke={colors.chartLine}
            strokeWidth={2}
            fill="url(#priceFill)"
            isAnimationActive={false}
          />
          <ReferenceDot
            x={lastPoint.timestamp}
            y={lastPoint.price}
            r={0}
            shape={(props: { cx?: number; cy?: number }) => (
              <EndBubble cx={props.cx} cy={props.cy} price={lastPoint.price} />
            )}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

const styles = stylex.create({
  wrap: {
    width: '100%',
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
})
