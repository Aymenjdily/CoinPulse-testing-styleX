import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import * as stylex from '@stylexjs/stylex'
import { Moon, Star, Sun } from 'lucide-react'
import { searchCoins } from '../lib/server/search'
import type { SearchResult } from '../lib/types'
import { SEARCH_DEBOUNCE_MS } from '../lib/data-policy'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useTheme } from '../theme/theme-context'
import { colors, font, radius, space, type } from '../styles/tokens.stylex'
import SearchInput from './SearchInput'
import SearchResults from './SearchResults'
import Badge from './Badge'

export default function Header() {
  const { mode, toggle } = useTheme()
  const navigate = useNavigate()
  const search = useSearch({ strict: false }) as { view?: string }
  const activeView = search.view === 'watchlist' ? 'watchlist' : 'all'

  const [query, setQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS)

  const { data, isFetching } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchCoins({ data: { query: debouncedQuery } }),
    enabled: debouncedQuery.trim().length > 0,
  })
  const results: SearchResult[] = data?.data ?? []

  function closeDropdown() {
    setIsOpen(false)
    setHighlightedIndex(0)
  }

  function handleSelect(result: SearchResult) {
    setQuery(result.name)
    closeDropdown()
    inputRef.current?.blur()
  }

  function handleKeyboardSelect(result: SearchResult) {
    handleSelect(result)
    navigate({ to: '/coin/$coinId', params: { coinId: result.id } })
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || results.length === 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlightedIndex((index) => (index + 1) % results.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlightedIndex((index) => (index - 1 + results.length) % results.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      handleKeyboardSelect(results[highlightedIndex])
    } else if (event.key === 'Escape') {
      closeDropdown()
      inputRef.current?.blur()
    }
  }

  return (
    <header {...stylex.props(styles.header)}>
      <nav {...stylex.props(styles.nav)}>
        <Link to="/" {...stylex.props(styles.brand)}>
          <span {...stylex.props(styles.brandDot)} />
          CoinPulse
        </Link>

        <div {...stylex.props(styles.navLinks)}>
          <Link
            to="/"
            search={{ view: undefined }}
            {...stylex.props(styles.navLink, activeView === 'all' && styles.navLinkActive)}
          >
            Markets
          </Link>
          <Link
            to="/"
            search={{ view: 'watchlist' }}
            {...stylex.props(styles.navLink, activeView === 'watchlist' && styles.navLinkActive)}
          >
            <Star size={14} strokeWidth={2} aria-hidden="true" /> Watchlist
          </Link>
        </div>

        <div {...stylex.props(styles.searchWrap)}>
          <SearchInput
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setIsOpen(true)
              setHighlightedIndex(0)
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(closeDropdown, 150)}
            onKeyDown={handleKeyDown}
          />
          {isOpen && (
            <SearchResults
              results={results}
              query={debouncedQuery}
              isLoading={isFetching}
              highlightedIndex={highlightedIndex}
              onSelect={handleSelect}
            />
          )}
        </div>

        <div {...stylex.props(styles.rightGroup)}>
          <Badge variant="live">Live</Badge>
          <button
            type="button"
            onClick={toggle}
            aria-label={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            {...stylex.props(styles.themeToggle)}
          >
            {mode === 'dark' ? (
              <Sun size={16} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Moon size={16} strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        </div>
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
    backgroundColor: colors.background,
  },
  nav: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space.lg,
    maxWidth: 1280,
    marginInline: 'auto',
    paddingBlock: space.md,
    paddingInline: space.lg,
  },
  brand: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: space.xs,
    fontFamily: font.mono,
    fontWeight: 700,
    fontSize: type.bodySize,
    letterSpacing: '0.02em',
    color: colors.foreground,
    textDecoration: 'none',
    flexShrink: 0,
  },
  brandDot: {
    width: '8px',
    height: '8px',
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: space.lg,
    flexShrink: 0,
  },
  navLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: space.xs,
    fontFamily: font.sans,
    fontSize: type.smallSize,
    fontWeight: 600,
    color: colors.foreground,
    opacity: 0.5,
    textDecoration: 'none',
    paddingBlock: space.xs,
    borderBottomWidth: 2,
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
  },
  navLinkActive: {
    opacity: 1,
    color: colors.primary,
    borderBottomColor: colors.primary,
  },
  searchWrap: {
    position: 'relative',
    width: 420,
    maxWidth: '100%',
  },
  rightGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: space.sm,
    marginLeft: 'auto',
    flexShrink: 0,
  },
  themeToggle: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: {
      default: colors.background,
      ':hover': colors.border,
    },
    color: colors.foreground,
    cursor: 'pointer',
  },
})
