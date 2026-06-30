import { create } from 'zustand'

type ThemeMode = 'light' | 'dark'

interface ThemeState {
  mode: ThemeMode
  toggleTheme: () => void
  setTheme: (mode: ThemeMode) => void
}

function getInitialTheme(): ThemeMode {
  const stored = localStorage.getItem('erinde-theme') as ThemeMode | null
  if (stored === 'light' || stored === 'dark') return stored
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

function applyTheme(mode: ThemeMode) {
  localStorage.setItem('erinde-theme', mode)
  if (mode === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export const useThemeStore = create<ThemeState>()((set) => {
  const initial = getInitialTheme()
  applyTheme(initial)

  return {
    mode: initial,
    toggleTheme: () =>
      set((state) => {
        const next = state.mode === 'light' ? 'dark' : 'light'
        applyTheme(next)
        return { mode: next }
      }),
    setTheme: (mode) => {
      applyTheme(mode)
      set({ mode })
    },
  }
})
