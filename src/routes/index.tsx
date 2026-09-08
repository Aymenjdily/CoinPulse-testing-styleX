import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import * as stylex from '@stylexjs/stylex'
import { colors, font, radius, space, type } from '../styles/tokens.stylex'
import Button from '../components/Button'
import Badge from '../components/Badge'
import RangeTabs from '../components/RangeTabs'
import SearchInput from '../components/SearchInput'
import StatCard from '../components/StatCard'
import { MarketsTableHeader, MarketsTableRow, type MarketsTableRow as Row } from '../components/MarketsTableShell'

export const Route = createFileRoute('/')({ component: App })

const RANGES = ['24H', '7D', '30D', '1Y'] as const

const demoRows: Row[] = [
  {
    rank: 1,
    name: 'Bitcoin',
    symbol: 'BTC',
    iconColor: '#F7931A',
    price: '$67,432.10',
    change1h: { direction: 'up', text: '+0.32%' },
    change24h: { direction: 'up', text: '+2.34%' },
    change7d: { direction: 'up', text: '+5.18%' },
    sparkline: [10, 12, 11, 13, 15, 14, 17],
    marketCap: '$1.31T',
  },
  {
    rank: 2,
    name: 'Ethereum',
    symbol: 'ETH',
    iconColor: '#627EEA',
    price: '$3,512.44',
    change1h: { direction: 'up', text: '+0.18%' },
    change24h: { direction: 'up', text: '+1.02%' },
    change7d: { direction: 'up', text: '+2.44%' },
    sparkline: [12, 11, 13, 12, 14, 13, 15],
    marketCap: '$422.8B',
  },
  {
    rank: 3,
    name: 'Solana',
    symbol: 'SOL',
    iconColor: '#9945FF',
    price: '$142.07',
    change1h: { direction: 'down', text: '-0.44%' },
    change24h: { direction: 'down', text: '-1.12%' },
    change7d: { direction: 'down', text: '-3.36%' },
    sparkline: [17, 16, 15, 14, 13, 12, 11],
    marketCap: '$76.5B',
  },
]

function App() {
  const [range, setRange] = useState<(typeof RANGES)[number]>('7D')

  return (
    <main {...stylex.props(styles.main)}>
      <h1 {...stylex.props(styles.title)}>Markets dashboard coming soon</h1>
      <p {...stylex.props(styles.subtitle)}>
        Design system primitives are wired up. The live markets table, coin detail
        pages, and watchlist land in following approved prompts.
      </p>

      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.sectionTitle)}>Buttons</h2>
        <div {...stylex.props(styles.row)}>
          <Button variant="primary">Add to Watchlist</Button>
          <Button variant="secondary">Export CSV</Button>
          <Button variant="ghost">View all</Button>
          <Button variant="destructive">Delete</Button>
          <Button variant="secondary" disabled>
            Disabled
          </Button>
        </div>
      </section>

      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.sectionTitle)}>Badges</h2>
        <div {...stylex.props(styles.row)}>
          <Badge variant="up">+2.34%</Badge>
          <Badge variant="down">-1.12%</Badge>
          <Badge variant="neutral">BTC</Badge>
          <Badge variant="rank">#1</Badge>
          <Badge variant="live">Live</Badge>
        </div>
      </section>

      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.sectionTitle)}>Range tabs & search</h2>
        <div {...stylex.props(styles.row)}>
          <RangeTabs options={RANGES} value={range} onChange={setRange} aria-label="Chart range" />
          <SearchInput />
        </div>
      </section>

      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.sectionTitle)}>Stat cards</h2>
        <div {...stylex.props(styles.statGrid)}>
          <StatCard label="Total market cap" value="$2.31T" delta={{ direction: 'up', text: '+1.8% today' }} />
          <StatCard label="BTC dominance" value="54.2%" delta={{ direction: 'down', text: '-0.3% today' }} />
          <StatCard label="24h volume" value="$82.4B" delta={{ direction: 'up', text: '+4.6% today' }} />
        </div>
      </section>

      <section {...stylex.props(styles.section)}>
        <h2 {...stylex.props(styles.sectionTitle)}>Markets table</h2>
        <div {...stylex.props(styles.tableShell)}>
          <MarketsTableHeader />
          {demoRows.map((row) => (
            <MarketsTableRow key={row.symbol} row={row} />
          ))}
        </div>
      </section>
    </main>
  )
}

const styles = stylex.create({
  main: {
    maxWidth: 1280,
    marginInline: 'auto',
    paddingInline: space.lg,
    paddingBlock: space.xxl,
  },
  title: {
    fontFamily: font.sans,
    fontSize: type.titleSize,
    fontWeight: type.titleWeight,
    color: colors.foreground,
    margin: 0,
    marginBottom: space.md,
  },
  subtitle: {
    fontSize: type.bodySize,
    lineHeight: 1.6,
    color: colors.foreground,
    opacity: 0.6,
    maxWidth: 560,
    margin: 0,
  },
  section: {
    marginTop: space.xxl,
  },
  sectionTitle: {
    fontFamily: font.sans,
    fontSize: type.cardTitleSize,
    fontWeight: type.cardTitleWeight,
    color: colors.foreground,
    margin: 0,
    marginBottom: space.lg,
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space.md,
  },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: space.lg,
  },
  tableShell: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
})
