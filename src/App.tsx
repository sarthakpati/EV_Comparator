import { useEffect, useState, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from './app/Header'
import { MatrixView } from './features/matrix/MatrixView'
import { ScatterView } from './features/scatter/ScatterView'
import { CompareView } from './features/compare/CompareView'
import { FilterBar, type FilterState } from './features/filters/FilterBar'
import { About } from './app/About'
import { Spinner } from './components/ui/Spinner'
import { useAppStore } from './store'
import { loadDataset } from './lib/data'
import { getUnitSystem } from './lib/markets'
import type { Condition } from './lib/types'
import type { UnitSystem } from './lib/units'

type ViewMode = 'simple' | 'advanced'

function AppContent() {
  const { dataset, loading, error, setDataset, setLoading, setError } = useAppStore()

  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches
      || document.documentElement.classList.contains('dark')
  })

  const [market, setMarket] = useState('US')
  const [viewMode, setViewMode] = useState<ViewMode>('simple')

  const unitSystem: UnitSystem = getUnitSystem(market)

  const [condition] = useState<Partial<Condition>>({
    speed: 90,
    season: 'summer',
  })

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    makes: [],
    drivetrains: [],
    availableInMarket: false,
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  useEffect(() => {
    setLoading(true)
    loadDataset()
      .then(d => setDataset(d))
      .catch(e => setError(String(e)))
  }, [setDataset, setLoading, setError])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-900">
        <div className="text-center space-y-4">
          <Spinner size="lg" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading EV data…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-900">
        <div className="text-center space-y-2 p-8">
          <p className="text-red-500 font-semibold">Failed to load data</p>
          <p className="text-sm text-slate-500">{error}</p>
          <p className="text-xs text-slate-400">Run <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">pnpm etl</code> to generate the dataset.</p>
        </div>
      </div>
    )
  }

  if (!dataset) return null

  const vehicles = dataset.vehicles
  const metrics = dataset.metrics

  const filteredVehicles = vehicles.filter(v => {
    if (filters.search) {
      const q = filters.search.toLowerCase()
      if (!`${v.make} ${v.model} ${v.variant ?? ''}`.toLowerCase().includes(q)) return false
    }
    if (filters.makes.length > 0 && !filters.makes.includes(v.make)) return false
    if (filters.drivetrains.length > 0 && (!v.drivetrain || !filters.drivetrains.includes(v.drivetrain))) return false
    if (filters.availableInMarket) {
      const mkt = v.markets?.[market as 'US' | 'UK' | 'DE']
      if (!mkt || (mkt.available !== 'available' && mkt.available !== 'upcoming')) return false
    }
    return true
  })

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <Header
        isDark={isDark}
        onToggleDark={() => setIsDark(v => !v)}
        market={market}
        onMarketChange={setMarket}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode(v => v === 'simple' ? 'advanced' : 'simple')}
      />
      <Routes>
        <Route path="/about" element={
          <main className="flex-1 overflow-auto">
            <About />
          </main>
        } />
        <Route path="/compare" element={
          <main className="flex-1 overflow-hidden">
            <CompareView
              vehicles={vehicles}
              metrics={metrics}
              condition={condition}
              isDark={isDark}
              unitSystem={unitSystem}
            />
          </main>
        } />
        <Route path="/scatter" element={
          <main className="flex-1 overflow-hidden flex flex-col">
            <FilterBar
              vehicles={vehicles}
              metrics={metrics}
              filters={filters}
              onChange={setFilters}
              market={market}
              viewMode={viewMode}
            />
            <ScatterView
              vehicles={filteredVehicles}
              metrics={metrics}
              condition={condition}
              isDark={isDark}
              unitSystem={unitSystem}
            />
          </main>
        } />
        <Route path="*" element={
          <main className="flex-1 overflow-hidden flex flex-col">
            <FilterBar
              vehicles={vehicles}
              metrics={metrics}
              filters={filters}
              onChange={setFilters}
              market={market}
              viewMode={viewMode}
            />
            <MatrixView
              vehicles={filteredVehicles}
              metrics={metrics}
              condition={condition}
              marketCode={market}
              searchQuery={filters.search}
              isDark={isDark}
              unitSystem={unitSystem}
              viewMode={viewMode}
            />
          </main>
        } />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Spinner size="lg" /></div>}>
        <AppContent />
      </Suspense>
    </BrowserRouter>
  )
}
