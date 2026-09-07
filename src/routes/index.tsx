import { createFileRoute } from '@tanstack/react-router'
import * as stylex from '@stylexjs/stylex'
import { colors, font, space } from '../styles/tokens.stylex'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main {...stylex.props(styles.main)}>
      <h1 {...stylex.props(styles.title)}>Markets dashboard coming soon</h1>
      <p {...stylex.props(styles.subtitle)}>
        Project scaffold is live — TanStack Start + StyleX are wired up. The markets
        table, coin detail pages, and watchlist land in following approved prompts.
      </p>
    </main>
  )
}

const styles = stylex.create({
  main: {
    maxWidth: 1280,
    marginInline: 'auto',
    paddingInline: space.lg,
    paddingBlock: space.xxl,
  },
  title: {
    fontFamily: font.sans,
    fontSize: 28,
    fontWeight: 700,
    color: colors.textPrimary,
    margin: 0,
    marginBottom: space.md,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 1.6,
    color: colors.textSecondary,
    maxWidth: 560,
    margin: 0,
  },
})
