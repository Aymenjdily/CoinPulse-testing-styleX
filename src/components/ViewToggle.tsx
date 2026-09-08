import * as stylex from '@stylexjs/stylex'
import { Star } from 'lucide-react'
import { colors, duration, elevation, font, neutral, radius, space, type } from '../styles/tokens.stylex'

type View = 'all' | 'watchlist'

type ViewToggleProps = {
  view: View
  watchlistCount: number
  onChange: (view: View) => void
}

export default function ViewToggle({ view, watchlistCount, onChange }: ViewToggleProps) {
  return (
    <div role="tablist" aria-label="Markets view" {...stylex.props(styles.track)}>
      <button
        type="button"
        role="tab"
        aria-selected={view === 'all'}
        onClick={() => onChange('all')}
        {...stylex.props(styles.tab, view === 'all' && styles.tabActive)}
      >
        All coins
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={view === 'watchlist'}
        onClick={() => onChange('watchlist')}
        {...stylex.props(styles.tab, view === 'watchlist' && styles.tabActive)}
      >
        <Star size={12} strokeWidth={2} aria-hidden="true" /> Watchlist · {watchlistCount}
      </button>
    </div>
  )
}

const styles = stylex.create({
  track: {
    display: 'inline-flex',
    gap: space.xs,
    backgroundColor: neutral.n100,
    borderRadius: radius.md,
    padding: space.xs,
  },
  tab: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: space.xs,
    fontFamily: font.sans,
    fontSize: type.smallSize,
    fontWeight: 600,
    color: colors.foreground,
    opacity: 0.6,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderRadius: radius.sm,
    paddingBlock: space.xs,
    paddingInline: space.md,
    cursor: 'pointer',
    transitionProperty: 'background-color, opacity, box-shadow',
    transitionDuration: duration.fast,
  },
  tabActive: {
    opacity: 1,
    backgroundColor: colors.background,
    boxShadow: elevation.shadowSm,
  },
})
