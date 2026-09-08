import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useSyncExternalStore } from 'react'
import * as stylex from '@stylexjs/stylex'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { darkTheme, lightTheme } from '../styles/themes.stylex'
import { colors, font } from '../styles/tokens.stylex'
import {
  THEME_STORAGE_KEY,
  ThemeContext,
  getThemeServerSnapshot,
  getThemeSnapshot,
  subscribeTheme,
  writeThemeMode,
} from '../theme/theme-context'

import appCss from '../styles.css?url'

const LIGHT_CLASS = stylex.props(lightTheme).className ?? ''
const DARK_CLASS = stylex.props(darkTheme).className ?? ''

// Runs before hydration so the correct theme paints immediately — this is
// intentionally outside React (see `suppressHydrationWarning` below).
// AGENTS.md section 7.5: dark must not flash on load.
const THEME_INIT_SCRIPT = `(function(){try{var stored=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});var mode=stored==='dark'?'dark':'light';var root=document.documentElement;root.className=mode==='dark'?${JSON.stringify(
  DARK_CLASS,
)}:${JSON.stringify(LIGHT_CLASS)};root.style.colorScheme=mode;}catch(e){}})();`

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

  // THEME_INIT_SCRIPT has already painted the real stored theme directly on
  // the DOM before hydration; useSyncExternalStore picks up that same
  // localStorage value without a manual hydration-guard effect (the
  // server/first-client snapshot is always 'light', matching what
  // suppressHydrationWarning below allows the script to have overridden).
  const mode = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot)

  function toggle() {
    writeThemeMode(mode === 'light' ? 'dark' : 'light')
  }

  return (
    <html lang="en" suppressHydrationWarning {...stylex.props(mode === 'dark' ? darkTheme : lightTheme)}>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
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
        <ThemeContext.Provider value={{ mode, toggle }}>
          <QueryClientProvider client={queryClient}>
            <Header />
            {children}
            <Footer />
          </QueryClientProvider>
        </ThemeContext.Provider>
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
