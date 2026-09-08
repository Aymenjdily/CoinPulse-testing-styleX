import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import * as stylex from '@stylexjs/stylex'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { lightTheme } from '../styles/themes.stylex'
import { colors, font } from '../styles/tokens.stylex'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'color-scheme', content: 'light' },
      { title: 'CoinPulse — Crypto Market Tracker' },
      {
        name: 'description',
        content:
          'CoinPulse is a live crypto market dashboard: top coins, price charts, and a personal watchlist — no account required.',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...stylex.props(lightTheme)}>
      <head>
        <HeadContent />
      </head>
      <body {...stylex.props(styles.body)}>
        <Header />
        {children}
        <Footer />
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            { name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}

const styles = stylex.create({
  body: {
    backgroundColor: colors.background,
    color: colors.foreground,
    fontFamily: font.sans,
  },
})
