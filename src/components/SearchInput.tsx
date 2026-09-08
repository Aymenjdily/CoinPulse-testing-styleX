import * as stylex from '@stylexjs/stylex'
import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { Search } from 'lucide-react'
import { colors, font, neutral, radius, space, type } from '../styles/tokens.stylex'
// `neutral` here is only used for text/icon color (n400/n500), which reads
// fine unchanged in both themes — see the comment on `colors.surfaceSubtle`
// in tokens.stylex.ts for why a *background fill* needs a themed token but
// a muted foreground color doesn't.

type SearchInputProps = InputHTMLAttributes<HTMLInputElement>

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  props,
  ref,
) {
  return (
    <div {...stylex.props(styles.wrap)}>
      <span {...stylex.props(styles.icon)}>
        <Search size={16} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <input
        ref={ref}
        placeholder="Search coins..."
        autoComplete="off"
        {...stylex.props(styles.input)}
        {...props}
      />
      <kbd {...stylex.props(styles.kbd)}>⌘K</kbd>
    </div>
  )
})

export default SearchInput

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
    // The input's own outline is suppressed below (a rectangular native
    // outline would look wrong clipped by this pill's rounded corners), so
    // the focus indicator moves here instead — :focus-within still fires
    // whenever the input inside has focus. Never remove one without the
    // other: a keyboard user must always see something on focus.
    boxShadow: {
      default: 'none',
      ':focus-within': `0 0 0 2px ${colors.primary}`,
    },
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
    backgroundColor: colors.surfaceSubtle,
    borderRadius: radius.sm,
    paddingBlock: '2px',
    paddingInline: space.xs,
  },
})
