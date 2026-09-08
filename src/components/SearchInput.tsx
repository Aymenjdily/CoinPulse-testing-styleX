import * as stylex from '@stylexjs/stylex'
import type { InputHTMLAttributes } from 'react'
import { colors, font, neutral, radius, space, type } from '../styles/tokens.stylex'

type SearchInputProps = InputHTMLAttributes<HTMLInputElement>

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M14 14L11 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

// Presentational only in this phase — debounce and result wiring land in
// tasks/07-search.md.
export default function SearchInput(props: SearchInputProps) {
  return (
    <div {...stylex.props(styles.wrap)}>
      <span {...stylex.props(styles.icon)}>
        <SearchIcon />
      </span>
      <input placeholder="Search coins..." {...stylex.props(styles.input)} {...props} />
      <kbd {...stylex.props(styles.kbd)}>⌘K</kbd>
    </div>
  )
}

const styles = stylex.create({
  wrap: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: space.sm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingBlock: space.sm,
    paddingInline: space.md,
    minWidth: '280px',
  },
  icon: {
    display: 'inline-flex',
    color: neutral.n400,
  },
  input: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '0%',
    borderWidth: 0,
    outline: 'none',
    backgroundColor: 'transparent',
    fontFamily: font.sans,
    fontSize: type.bodySize,
    color: colors.foreground,
    '::placeholder': {
      color: neutral.n400,
    },
  },
  kbd: {
    fontFamily: font.mono,
    fontSize: type.captionSize,
    color: neutral.n500,
    backgroundColor: neutral.n100,
    borderRadius: radius.sm,
    paddingBlock: '2px',
    paddingInline: space.xs,
  },
})
