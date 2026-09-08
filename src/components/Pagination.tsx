import * as stylex from '@stylexjs/stylex'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { colors, font, radius, space, type } from '../styles/tokens.stylex'

type PaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

function pageList(page: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages = new Set([1, 2, totalPages - 1, totalPages, page - 1, page, page + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)

  const result: (number | 'ellipsis')[] = []
  let previous = 0
  for (const p of sorted) {
    if (previous && p - previous > 1) result.push('ellipsis')
    result.push(p)
    previous = p
  }
  return result
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Markets table pages" {...stylex.props(styles.nav)}>
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        {...stylex.props(styles.arrowButton)}
      >
        <ChevronLeft size={16} aria-hidden="true" />
      </button>

      {pageList(page, totalPages).map((entry, index) =>
        entry === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} {...stylex.props(styles.ellipsis)}>
            <MoreHorizontal size={14} aria-hidden="true" />
          </span>
        ) : (
          <button
            key={entry}
            type="button"
            onClick={() => onPageChange(entry)}
            aria-current={entry === page ? 'page' : undefined}
            {...stylex.props(styles.pageButton, entry === page && styles.pageButtonActive)}
          >
            {entry}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        {...stylex.props(styles.arrowButton)}
      >
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </nav>
  )
}

const styles = stylex.create({
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: space.xs,
  },
  arrowButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: {
      default: colors.background,
      ':hover': colors.surfaceHover,
    },
    color: colors.foreground,
    cursor: 'pointer',
    opacity: {
      default: 1,
      ':disabled': 0.3,
    },
  },
  pageButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '32px',
    height: '32px',
    paddingInline: space.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: colors.background,
    color: colors.foreground,
    fontFamily: font.mono,
    fontSize: type.smallSize,
    cursor: 'pointer',
  },
  pageButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    color: '#FFFFFF',
  },
  ellipsis: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    color: colors.foreground,
    opacity: 0.4,
  },
})
