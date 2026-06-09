import { Link, useLocation } from 'react-router-dom'
import { clsx } from 'clsx'
import { useAppStore } from '../store'
import { MARKET_CONFIGS } from '../lib/markets'

type ViewMode = 'simple' | 'advanced'

interface HeaderProps {
  isDark: boolean
  onToggleDark: () => void
  market: string
  onMarketChange: (m: string) => void
  viewMode: ViewMode
  onToggleViewMode: () => void
}

const NAV = [
  { to: '/', label: 'Matrix' },
  { to: '/scatter', label: 'Scatter' },
  { to: '/compare', label: 'Compare' },
  { to: '/about', label: 'About' },
]

export function Header({ isDark, onToggleDark, market, onMarketChange, viewMode, onToggleViewMode }: HeaderProps) {
  const location = useLocation()
  const { compareSet } = useAppStore()

  return (
    <header className="h-14 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center px-4 gap-4 shrink-0 z-30">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 shrink-0">
        <span className="text-xl">⚡</span>
        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm hidden sm:block">
          EV Comparator
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex items-center gap-1">
        {NAV.map(({ to, label }) => {
          const active = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
          return (
            <Link
              key={to}
              to={to}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors relative',
                active
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
              )}
            >
              {label}
              {label === 'Compare' && compareSet.size > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] flex items-center justify-center font-bold">
                  {compareSet.size}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        {/* View mode toggle */}
        <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
          {(['simple', 'advanced'] as ViewMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => viewMode !== mode && onToggleViewMode()}
              className={clsx(
                'px-2.5 py-1 text-xs font-medium rounded-md transition-all capitalize',
                viewMode === mode
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300',
              )}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Market selector */}
        <select
          value={market}
          onChange={e => onMarketChange(e.target.value)}
          className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Select market"
        >
          {MARKET_CONFIGS.map(m => (
            <option key={m.code} value={m.code}>{m.flag} {m.name}</option>
          ))}
        </select>

        {/* Theme toggle */}
        <button
          onClick={onToggleDark}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle dark mode"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  )
}
