import * as stylex from '@stylexjs/stylex'
import type { ReactNode } from 'react'
import { colors, font, radius, space, type } from '../styles/tokens.stylex'

type DetailStatCardProps = {
  label: string
  value: string
  children?: ReactNode
}

// Unlike StatCard (pill-badge deltas, used on the home page), this page's
// reference (design/page-details.png) uses plain colored captions instead
// of badges — a genuinely different treatment for this page, not an
// inconsistency to fix.
export default function DetailStatCard({ label, value, children }: DetailStatCardProps) {
  return (
    <div {...stylex.props(styles.card)}>
      <p {...stylex.props(styles.label)}>{label}</p>
      <p {...stylex.props(styles.value)}>{value}</p>
      <div {...stylex.props(styles.footer)}>{children}</div>
    </div>
  )
}

export function StatCaption({ tone = 'muted', children }: { tone?: 'up' | 'down' | 'muted'; children: ReactNode }) {
  return <span {...stylex.props(styles.caption, styles[tone])}>{children}</span>
}

const styles = stylex.create({
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.xs,
    height: '100%',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: space.lg,
  },
  label: {
    margin: 0,
    fontFamily: font.sans,
    fontSize: type.captionSize,
    fontWeight: type.captionWeight,
    letterSpacing: type.captionTracking,
    textTransform: 'uppercase',
    color: colors.foreground,
    opacity: 0.5,
  },
  value: {
    margin: 0,
    fontFamily: font.mono,
    fontSize: type.cardTitleSize,
    fontWeight: type.cardTitleWeight,
    color: colors.foreground,
    fontVariantNumeric: 'tabular-nums',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: space.xs,
    minHeight: '18px',
    marginTop: 'auto',
  },
  caption: {
    fontFamily: font.sans,
    fontSize: type.smallSize,
    fontVariantNumeric: 'tabular-nums',
  },
  up: { color: colors.up },
  down: { color: colors.down },
  muted: { color: colors.foreground, opacity: 0.5 },
})
