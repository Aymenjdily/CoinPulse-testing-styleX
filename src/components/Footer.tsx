import * as stylex from '@stylexjs/stylex'
import { colors, space } from '../styles/tokens.stylex'

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
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
})
