import { useState } from 'react'
import type { Vehicle, MetricDef } from '../../lib/types'
import { Button } from '../../components/ui/Button'

export interface FilterState {
  search: string
  makes: string[]
  drivetrains: ('RWD' | 'AWD' | 'FWD')[]
  availableInMarket: boolean
}

interface FilterBarProps {
  vehicles: Vehicle[]
  metrics: MetricDef[]
  filters: FilterState
  onChange: (f: FilterState) => void
  market: string
  viewMode?: 'simple' | 'advanced'
}

export function FilterBar({ vehicles, filters, onChange, market, viewMode = 'advanced' }: FilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const isSimple = viewMode === 'simple'

  const allMakes = [...new Set(vehicles.map(v => v.make))].sort()

  const update = (patch: Partial<FilterState>) => onChange({ ...filters, ...patch })

  const activeCount = [
    filters.makes.length > 0,
    filters.drivetrains.length > 0,
    filters.availableInMarket,
  ].filter(Boolean).length

  return (
    <div className="border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2 px-4 py-2 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            placeholder="Search vehicles…"
            value={filters.search}
            onChange={e => update({ search: e.target.value })}
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Quick filter: available in market */}
        <label className="flex items-center gap-1.5 text-sm cursor-pointer text-slate-600 dark:text-slate-400">
          <input
            type="checkbox"
            checked={filters.availableInMarket}
            onChange={e => update({ availableInMarket: e.target.checked })}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          Available in {market}
        </label>

        {/* Advanced filters toggle — hidden in simple mode */}
        {!isSimple && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowAdvanced(v => !v)}
            className="relative"
          >
            Filters
            {activeCount > 0 && (
              <span className="ml-1 w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] flex items-center justify-center font-bold">
                {activeCount}
              </span>
            )}
            <svg className={`w-3 h-3 ml-0.5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Button>
        )}

        {activeCount > 0 && (
          <Button
            size="xs"
            variant="ghost"
            onClick={() => onChange({ search: filters.search, makes: [], drivetrains: [], availableInMarket: false })}
          >
            Clear filters
          </Button>
        )}
      </div>

      {!isSimple && showAdvanced && (
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-6">
          {/* Makes */}
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Brand</p>
            <div className="flex flex-wrap gap-1 max-w-lg">
              {allMakes.slice(0, 30).map(make => (
                <button
                  key={make}
                  onClick={() => {
                    const next = filters.makes.includes(make)
                      ? filters.makes.filter(m => m !== make)
                      : [...filters.makes, make]
                    update({ makes: next })
                  }}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    filters.makes.includes(make)
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-300'
                  }`}
                >
                  {make}
                </button>
              ))}
            </div>
          </div>

          {/* Drivetrain */}
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Drivetrain</p>
            <div className="flex gap-1">
              {(['RWD', 'AWD', 'FWD'] as const).map(dt => (
                <button
                  key={dt}
                  onClick={() => {
                    const next = filters.drivetrains.includes(dt)
                      ? filters.drivetrains.filter(d => d !== dt)
                      : [...filters.drivetrains, dt]
                    update({ drivetrains: next })
                  }}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                    filters.drivetrains.includes(dt)
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-300'
                  }`}
                >
                  {dt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
