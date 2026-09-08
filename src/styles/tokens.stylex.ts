import * as stylex from '@stylexjs/stylex'

// Values match design/design-system.png v1.0 exactly. Do not hand-tune a hex,
// spacing, or radius value here without updating that reference too.

export const neutral = stylex.defineVars({
  n50: '#FAFAFA',
  n100: '#F5F5F5',
  n200: '#E5E5E5',
  n300: '#D4D4D4',
  n400: '#A3A3A3',
  n500: '#737373',
  n600: '#525252',
  n700: '#404040',
  n800: '#262626',
  n900: '#171717',
  n950: '#0A0A0A',
})

export const blue = stylex.defineVars({
  b50: '#EFF6FF',
  b100: '#DBEAFE',
  b200: '#BFDBFE',
  b300: '#93C5FD',
  b400: '#60A5FA',
  b500: '#3B82F6',
  b600: '#2563EB', // primary
  b700: '#1D4ED8',
  b800: '#1E40AF',
  b900: '#1E3A8A',
})

export const colors = stylex.defineVars({
  // Semantic aliases (matches the reference's "tokens as code" panel)
  background: '#FFFFFF',
  foreground: '#0A0A0A',
  primary: '#2563EB',
  primaryHover: '#1D4ED8',
  primarySoft: '#EFF6FF',
  border: '#E5E5E5',
  // Theme-aware neutral fills — for backgrounds/hover states that must
  // invert with the theme. The static `neutral` scale above does NOT do
  // this (it's the same hex in both themes), so anything using a neutral
  // shade as a background fill (not just a border/text accent) belongs
  // here instead.
  surfaceSubtle: '#F5F5F5',
  surfaceHover: '#FAFAFA',

  // Price movement — reserved for that purpose only
  up: '#16A34A',
  upSoft: '#F0FDF4',
  upBorder: '#BBF7D0',
  down: '#DC2626',
  downSoft: '#FEF2F2',
  downBorder: '#FECACA',
  warn: '#D97706',
  warnSoft: '#FFFBEB',
  warnBorder: '#FDE68A',

  // Data visualization
  chartLine: '#2563EB',
  chartArea: 'rgba(37, 99, 235, 0.08)',
  chartGrid: '#F0F0F0',
  chartCrosshair: '#0A0A0A',
  sparklineUp: '#16A34A',
  sparklineDown: '#DC2626',
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
  lg: '14px',
  pill: '999px',
})

export const elevation = stylex.defineVars({
  shadowSm: '0 1px 2px rgba(10, 10, 10, 0.05)',
  shadowMd: '0 4px 12px rgba(10, 10, 10, 0.08)',
})

export const font = stylex.defineVars({
  sans: '"Inter", ui-sans-serif, system-ui, -apple-system, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
})

// Inter type ramp: size/weight pairs from design-system.png section 02, plus
// heroSize added for the coin-detail page's price display (page-details.png
// — bigger than any size the original design system defined).
export const type = stylex.defineVars({
  heroSize: '48px',
  heroWeight: '700',
  displaySize: '30px',
  displayWeight: '700',
  titleSize: '24px',
  titleWeight: '700',
  cardTitleSize: '20px',
  cardTitleWeight: '600',
  bodySize: '16px',
  bodyWeight: '400',
  smallSize: '13px',
  smallWeight: '400',
  captionSize: '12px',
  captionWeight: '500',
  captionTracking: '0.04em',
})

export const duration = stylex.defineVars({
  fast: '120ms',
  base: '200ms',
  slow: '320ms',
})

export const easing = stylex.defineVars({
  out: 'cubic-bezier(0.16, 1, 0.3, 1)',
})
