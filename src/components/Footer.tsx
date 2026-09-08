import * as stylex from '@stylexjs/stylex'
import { colors, font, space, type } from '../styles/tokens.stylex'

export default function Footer() {
  return (
    <footer {...stylex.props(styles.footer)}>
      <p {...stylex.props(styles.text)}>CoinPulse — market data by CoinGecko · polled every 60s</p>
      <p {...stylex.props(styles.text)}>TanStack Start × StyleX</p>
    </footer>
  )
}

const styles = stylex.create({
  footer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: space.sm,
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: colors.border,
    paddingBlock: space.lg,
    paddingInline: space.lg,
    maxWidth: 1280,
    marginInline: 'auto',
  },
  text: {
    margin: 0,
    fontFamily: font.sans,
    fontSize: type.captionSize,
    color: colors.foreground,
    opacity: 0.5,
  },
})
