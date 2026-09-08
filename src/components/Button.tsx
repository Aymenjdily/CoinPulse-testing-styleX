import * as stylex from '@stylexjs/stylex'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { colors, duration, font, radius, space, type } from '../styles/tokens.stylex'

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  icon?: ReactNode
}

export default function Button({
  variant = 'primary',
  icon,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      {...stylex.props(
        styles.base,
        styles[variant],
        disabled && styles.disabled,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}

const styles = stylex.create({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
    fontFamily: font.sans,
    fontSize: type.bodySize,
    fontWeight: 600,
    lineHeight: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'transparent',
    paddingBlock: space.sm,
    paddingInline: space.lg,
    cursor: 'pointer',
    transitionProperty: 'background-color, border-color, color, opacity',
    transitionDuration: duration.fast,
  },
  primary: {
    backgroundColor: {
      default: colors.primary,
      ':hover': colors.primaryHover,
    },
    color: '#FFFFFF',
  },
  secondary: {
    backgroundColor: {
      default: colors.background,
      ':hover': colors.surfaceHover,
    },
    color: colors.foreground,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.surfaceSubtle,
    },
    color: colors.foreground,
  },
  destructive: {
    backgroundColor: colors.down,
    color: '#FFFFFF',
    opacity: {
      default: 1,
      ':hover': 0.9,
    },
  },
  disabled: {
    backgroundColor: colors.surfaceSubtle,
    color: colors.foreground,
    opacity: 0.4,
    borderColor: colors.border,
    cursor: 'not-allowed',
  },
})
