import * as stylex from '@stylexjs/stylex'
import { duration } from './tokens.stylex'

const skeletonPulse = stylex.keyframes({
  '0%': { opacity: 0.5 },
  '50%': { opacity: 1 },
  '100%': { opacity: 0.5 },
})

// Shared pulse animation for every loading skeleton in the app — respects
// prefers-reduced-motion in one place instead of each skeleton repeating
// the same keyframe + media-query guard.
export const skeleton = stylex.create({
  pulse: {
    animationName: {
      default: skeletonPulse,
      '@media (prefers-reduced-motion: reduce)': 'none',
    },
    animationDuration: duration.slow,
    animationIterationCount: 'infinite',
  },
})
