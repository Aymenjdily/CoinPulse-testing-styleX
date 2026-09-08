import * as stylex from '@stylexjs/stylex'
import { colors, font, space, type } from '../styles/tokens.stylex'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer {...stylex.props(styles.footer)}>
      <p {...stylex.props(styles.text)}>&copy; {year} CoinPulse. Data via CoinGecko.</p>
    </footer>
  )
}

const styles = stylex.create({
  footer: {
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: colors.border,
    paddingBlock: space.lg,
    paddingInline: space.lg,
  },
  text: {
    margin: 0,
    fontFamily: font.sans,
    fontSize: type.captionSize,
    color: colors.foreground,
    opacity: 0.5,
    textAlign: 'center',
  },
})
