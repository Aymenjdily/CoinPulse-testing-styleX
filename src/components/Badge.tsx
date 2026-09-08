import * as stylex from '@stylexjs/stylex'
import type { ReactNode } from 'react'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { colors, font, neutral, radius, space, type } from '../styles/tokens.stylex'

type BadgeProps = {
  variant: 'up' | 'down' | 'neutral' | 'rank' | 'live'
  children: ReactNode
}

export default function Badge({ variant, children }: BadgeProps) {
  return (
    <span {...stylex.props(styles.base, styles[variant])}>
      {variant === 'up' && <ArrowUp size={10} strokeWidth={2.5} aria-hidden="true" />}
      {variant === 'down' && <ArrowDown size={10} strokeWidth={2.5} aria-hidden="true" />}
      {variant === 'live' && <span {...stylex.props(styles.liveDot)} />}
      {children}
    </span>
  )
}

const styles = stylex.create({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: space.xs,
    fontFamily: font.mono,
    fontSize: type.smallSize,
    fontWeight: 600,
    lineHeight: 1,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderStyle: 'solid',
    paddingBlock: space.xs,
    paddingInline: space.sm,
  },
  up: {
    color: colors.up,
    backgroundColor: colors.upSoft,
    borderColor: colors.upBorder,
  },
  down: {
    color: colors.down,
    backgroundColor: colors.downSoft,
    borderColor: colors.downBorder,
  },
  neutral: {
    color: colors.foreground,
    backgroundColor: neutral.n100,
    borderColor: neutral.n200,
    fontFamily: font.sans,
  },
  rank: {
    color: colors.foreground,
    backgroundColor: neutral.n100,
    borderColor: neutral.n200,
    fontFamily: font.mono,
  },
  live: {
    color: colors.up,
    backgroundColor: colors.upSoft,
    borderColor: colors.upBorder,
    fontFamily: font.sans,
    textTransform: 'uppercase',
    letterSpacing: type.captionTracking,
  },
  liveDot: {
    width: '6px',
    height: '6px',
    borderRadius: radius.pill,
    backgroundColor: colors.up,
  },
})
