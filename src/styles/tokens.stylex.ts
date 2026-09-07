import * as stylex from '@stylexjs/stylex'

export const colors = stylex.defineVars({
  bg: '#0a0e0f',
  bgElevated: '#12171a',
  surface: '#161c1f',
  border: '#242c30',
  borderStrong: '#333e43',

  textPrimary: '#e8edee',
  textSecondary: '#8a9599',
  textMuted: '#5b6568',

  accent: '#4fb8b2',
  accentStrong: '#6ecfc9',

  up: '#3ecf7e',
  upMuted: 'rgba(62, 207, 126, 0.12)',
  down: '#e6584c',
  downMuted: 'rgba(230, 88, 76, 0.12)',

  focusRing: '#4fb8b2',
})

export const space = stylex.defineVars({
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  xxl: '32px',
})

export const radius = stylex.defineVars({
  sm: '6px',
  md: '10px',
  lg: '16px',
  full: '999px',
})

export const font = stylex.defineVars({
  sans: '"Inter", ui-sans-serif, system-ui, -apple-system, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
})

export const duration = stylex.defineVars({
  fast: '120ms',
  base: '200ms',
  slow: '400ms',
})
