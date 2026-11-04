'use client'

import * as React from 'react'

const THEME_KEY = 'dayflow-theme'
export type Theme = 'light' | 'dark' | 'system' | 'hunter'

export function useTheme() {
  const [theme, setThemeState] = React.useState<Theme>('hunter')
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(THEME_KEY) as Theme | null
    if (stored === 'light' || stored === 'dark' || stored === 'system' || stored === 'hunter') {
      setThemeState(stored)
    }
  }, [])

  React.useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    const resolved = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme
    // 'hunter' is a dark theme with the Solo Leveling "System" look layered on top.
    if (resolved === 'dark' || resolved === 'hunter') root.classList.add('dark')
    else root.classList.remove('dark')
    if (resolved === 'hunter') root.classList.add('hunter')
    else root.classList.remove('hunter')
  }, [theme, mounted])

  const setTheme = (next: Theme) => {
    setThemeState(next)
    localStorage.setItem(THEME_KEY, next)
  }

  return { theme, setTheme, mounted }
}
