import * as stylex from '@stylexjs/stylex'
import type { ReactNode } from 'react'
import { colors, font, neutral, radius, space, type } from '../styles/tokens.stylex'

type BadgeProps = {
  variant: 'up' | 'down' | 'neutral' | 'rank' | 'live'
  children: ReactNode
}

function ArrowUp() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M5 8V2M5 2L2 5M5 2L8 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ArrowDown() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M5 2V8M5 8L2 5M5 8L8 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Badge({ variant, children }: BadgeProps) {
  return (
    <span {...stylex.props(styles.base, styles[variant])}>
      {variant === 'up' && <ArrowUp />}
      {variant === 'down' && <ArrowDown />}
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
