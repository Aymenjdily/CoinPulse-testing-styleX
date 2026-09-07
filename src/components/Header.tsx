import { Link } from '@tanstack/react-router'
import * as stylex from '@stylexjs/stylex'
import { colors, font, space } from '../styles/tokens.stylex'

export default function Header() {
  return (
    <header {...stylex.props(styles.header)}>
      <nav {...stylex.props(styles.nav)}>
        <Link to="/" {...stylex.props(styles.brand)}>
          CoinPulse
        </Link>
      </nav>
    </header>
  )
}

const styles = stylex.create({
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.border,
    backgroundColor: colors.bgElevated,
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    maxWidth: 1280,
    marginInline: 'auto',
    paddingBlock: space.md,
    paddingInline: space.lg,
  },
  brand: {
    fontFamily: font.mono,
    fontWeight: 700,
    fontSize: 16,
    letterSpacing: '0.02em',
    color: colors.textPrimary,
    textDecoration: 'none',
  },
})
