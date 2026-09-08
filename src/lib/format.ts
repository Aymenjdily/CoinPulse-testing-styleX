const compactUsd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 2,
})

const preciseUsd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 6,
})

const percent = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const compactNumber = new Intl.NumberFormat('en-US', { notation: 'compact' })

export function formatCompactUsd(value: number): string {
  return compactUsd.format(value)
}

// Full precision for prices — never compact-notate an actual coin price.
export function formatPrice(value: number): string {
  return preciseUsd.format(value)
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${percent.format(value)}%`
}

export function formatCompactNumber(value: number): string {
  return compactNumber.format(value)
}
