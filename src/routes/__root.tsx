import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
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
    links: [
      { rel: 'stylesheet', href: appCss },
      // @stylexjs/unplugin appends compiled CSS into the real asset above
      // only during a production build. In dev it serves compiled styles
      // through this virtual module instead — without it, StyleX classes
      // are present in the markup but resolve to nothing.
      ...(import.meta.env.DEV ? [{ rel: 'stylesheet', href: '/virtual:stylex.css' }] : []),
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  // Created via useState so each client gets its own instance (the
  // standard SSR-safe TanStack Query pattern) rather than a module-level
  // singleton shared across requests.
  const [queryClient] = useState(() => new QueryClient())

  return (
    <html lang="en" {...stylex.props(lightTheme)}>
      <head>
        <HeadContent />
        {import.meta.env.DEV && (
          <script
            type="module"
            // Keeps StyleX's dev CSS endpoint in sync across HMR edits —
            // see the links[] comment above for why this is dev-only.
            dangerouslySetInnerHTML={{ __html: "import('/@id/virtual:stylex:runtime')" }}
          />
        )}
      </head>
      <body {...stylex.props(styles.body)}>
        <QueryClientProvider client={queryClient}>
          <Header />
          {children}
          <Footer />
        </QueryClientProvider>
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
