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

// Dark is secondary (AGENTS.md section 7.5) — derived from the light theme's
// structure rather than a design reference, per explicit user direction
// (tasks/09-dark-theme.md). Same blue hue as light, one step lighter
// (blue-500 instead of blue-600) for contrast against a dark background;
// semantic up/down/warn keep their base hues but use translucent overlays
// instead of pale tints for their soft/border pairs.
export const darkTheme = stylex.createTheme(colors, {
  background: '#0A0A0A',
  foreground: '#FAFAFA',
  primary: '#3B82F6',
  border: '#262626',

  up: '#16A34A',
  upSoft: 'rgba(22, 163, 74, 0.16)',
  upBorder: 'rgba(22, 163, 74, 0.32)',
  down: '#DC2626',
  downSoft: 'rgba(220, 38, 38, 0.16)',
  downBorder: 'rgba(220, 38, 38, 0.32)',
  warn: '#D97706',
  warnSoft: 'rgba(217, 119, 6, 0.16)',
  warnBorder: 'rgba(217, 119, 6, 0.32)',

  chartLine: '#3B82F6',
  chartArea: 'rgba(59, 130, 246, 0.12)',
  chartGrid: '#171717',
  chartCrosshair: '#FAFAFA',
  sparklineUp: '#16A34A',
  sparklineDown: '#DC2626',
})
