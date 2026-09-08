import { createContext, useContext } from 'react'

export type ThemeMode = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'coinpulse:theme'

const listeners = new Set<() => void>()

function emitChange() {
  for (const listener of listeners) listener()
}

export function subscribeTheme(callback: () => void) {
  listeners.add(callback)
  window.addEventListener('storage', callback)
  return () => {
    listeners.delete(callback)
    window.removeEventListener('storage', callback)
  }
}

// Always 'light' for both the server snapshot and the very first client
// snapshot — matches THEME_INIT_SCRIPT's DOM-level correction in
// __root.tsx, which paints the real stored theme before React ever
// reconciles. useSyncExternalStore then picks up the true value on the
// next read without a manual hydration-guard effect.
export function getThemeSnapshot(): ThemeMode {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function getThemeServerSnapshot(): ThemeMode {
  return 'light'
}

export function writeThemeMode(mode: ThemeMode) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode)
  } catch {
    // localStorage unavailable — theme still switches for this session via
    // emitChange, just won't survive reload.
  }
  emitChange()
}

export const ThemeContext = createContext<{
  mode: ThemeMode
  toggle: () => void
} | null>(null)

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within the root theme provider')
  return ctx
}
