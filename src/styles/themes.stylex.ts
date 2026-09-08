import * as stylex from '@stylexjs/stylex'
import { colors } from './tokens.stylex'

// Light is the default and primary identity (AGENTS.md section 7.5, updated
// 2026-09-08 to match design/design-system.png v1.0).
export const lightTheme = stylex.createTheme(colors, {
  background: '#FFFFFF',
  foreground: '#0A0A0A',
  primary: '#2563EB',
  border: '#E5E5E5',

  up: '#16A34A',
  upSoft: '#F0FDF4',
  upBorder: '#BBF7D0',
  down: '#DC2626',
  downSoft: '#FEF2F2',
  downBorder: '#FECACA',
  warn: '#D97706',
  warnSoft: '#FFFBEB',
  warnBorder: '#FDE68A',

  chartLine: '#2563EB',
  chartArea: 'rgba(37, 99, 235, 0.08)',
  chartGrid: '#F0F0F0',
  chartCrosshair: '#0A0A0A',
  sparklineUp: '#16A34A',
  sparklineDown: '#DC2626',
})

// Dark is a future secondary theme (tasks/09-dark-theme.md) — blocked on a
// dark-mode design reference. Do not invent one here.
