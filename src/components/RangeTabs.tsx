import * as stylex from '@stylexjs/stylex'
import { colors, duration, elevation, font, radius, space, type } from '../styles/tokens.stylex'

type RangeTabsProps<T extends string> = {
  options: readonly T[]
  value: T
  onChange: (value: T) => void
  'aria-label': string
}

export default function RangeTabs<T extends string>({
  options,
  value,
  onChange,
  ...rest
}: RangeTabsProps<T>) {
  return (
    <div role="tablist" {...rest} {...stylex.props(styles.track)}>
      {options.map((option) => {
        const active = option === value
        return (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option)}
            {...stylex.props(styles.tab, active && styles.tabActive)}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}

const styles = stylex.create({
  track: {
    display: 'inline-flex',
    gap: space.xs,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: radius.md,
    padding: space.xs,
  },
  tab: {
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
