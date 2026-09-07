import * as stylex from '@stylexjs/stylex'
import { colors } from './tokens.stylex'

// Dark is the default and primary identity (AGENTS.md section 7.5).
// A lightTheme will be added here once a light-mode design reference exists —
// do not invent one now.
export const darkTheme = stylex.createTheme(colors, {
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
