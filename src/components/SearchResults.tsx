import * as stylex from '@stylexjs/stylex'
import type { SearchResult } from '../lib/types'
import { colors, elevation, font, radius, space, type } from '../styles/tokens.stylex'

type SearchResultsProps = {
  results: SearchResult[]
  query: string
  isLoading: boolean
  highlightedIndex: number
  onSelect: (result: SearchResult) => void
}

// Coin detail pages don't exist yet (tasks/05-coin-detail.md) — selecting a
// result just closes the dropdown for now rather than linking somewhere
// fake.
export default function SearchResults({
  results,
  query,
  isLoading,
  highlightedIndex,
  onSelect,
}: SearchResultsProps) {
  if (query.trim().length === 0) return null

  return (
    <div role="listbox" {...stylex.props(styles.dropdown)}>
      {isLoading && <p {...stylex.props(styles.message)}>Searching…</p>}
      {!isLoading && results.length === 0 && (
        <p {...stylex.props(styles.message)}>No matches for "{query}"</p>
      )}
      {!isLoading &&
        results.map((result, index) => (
          <button
            key={result.id}
            type="button"
            role="option"
            aria-selected={index === highlightedIndex}
            onClick={() => onSelect(result)}
            {...stylex.props(styles.option, index === highlightedIndex && styles.optionActive)}
          >
            <img src={result.thumb} alt="" width={20} height={20} {...stylex.props(styles.thumb)} />
            <span {...stylex.props(styles.name)}>{result.name}</span>
            <span {...stylex.props(styles.symbol)}>{result.symbol.toUpperCase()}</span>
          </button>
        ))}
    </div>
  )
}

const styles = stylex.create({
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: radius.md,
    boxShadow: elevation.shadowMd,
    maxHeight: '320px',
    overflowY: 'auto',
    zIndex: 60,
  },
  message: {
    margin: 0,
    padding: space.md,
    fontFamily: font.sans,
    fontSize: type.smallSize,
    color: colors.foreground,
    opacity: 0.5,
  },
  option: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    gap: space.sm,
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingBlock: space.sm,
    paddingInline: space.md,
    cursor: 'pointer',
    textAlign: 'left',
  },
  optionActive: {
    backgroundColor: colors.primarySoft,
  },
  thumb: {
    borderRadius: radius.pill,
    flexShrink: 0,
  },
  name: {
    fontFamily: font.sans,
    fontSize: type.smallSize,
    fontWeight: 600,
    color: colors.foreground,
  },
  symbol: {
    fontFamily: font.mono,
    fontSize: type.captionSize,
    color: colors.foreground,
    opacity: 0.5,
  },
})
