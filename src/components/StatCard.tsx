import * as stylex from '@stylexjs/stylex'
import { colors, font, radius, space, type } from '../styles/tokens.stylex'
import Badge from './Badge'

type StatCardProps = {
  label: string
  value: string
  delta?: { direction: 'up' | 'down'; text: string }
  note?: string
}

export default function StatCard({ label, value, delta, note }: StatCardProps) {
  return (
    <div {...stylex.props(styles.card)}>
      <p {...stylex.props(styles.label)}>{label}</p>
      <p {...stylex.props(styles.value)}>{value}</p>
      {/* Always reserve this row's height so cards without a delta yet
          (e.g. waiting on a second poll) don't collapse shorter than
          their siblings and throw off the row. */}
      <div {...stylex.props(styles.footer)}>
        {delta && <Badge variant={delta.direction}>{delta.text}</Badge>}
        {note && <p {...stylex.props(styles.note)}>{note}</p>}
      </div>
    </div>
  )
}

const styles = stylex.create({
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.sm,
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
    fontSize: type.titleSize,
    fontWeight: type.titleWeight,
    color: colors.foreground,
    fontVariantNumeric: 'tabular-nums',
  },
  note: {
    margin: 0,
    fontFamily: font.sans,
    fontSize: type.smallSize,
    color: colors.foreground,
    opacity: 0.5,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    minHeight: '26px',
    marginTop: 'auto',
  },
})
