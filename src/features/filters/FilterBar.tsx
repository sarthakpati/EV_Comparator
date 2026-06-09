import { useState } from 'react'
import type { Vehicle, MetricDef } from '../../lib/types'
import { Button } from '../../components/ui/Button'
import { ALL_MARKET } from '../../lib/markets'

export interface FilterState {
  search: string
  makes: string[]
  drivetrains: ('RWD' | 'AWD' | 'FWD')[]
  bodyTypes: string[]
  segments: string[]
  availability: string[]
}

interface FilterBarProps {
  vehicles: Vehicle[]
  metrics: MetricDef[]
  filters: FilterState
  onChange: (f: FilterState) => void
  viewMode?: 'simple' | 'advanced'
  market?: string
}

const AVAIL_OPTIONS: { key: string; label: string }[] = [
  { key: 'available', label: 'Available' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'discontinued', label: 'Discontinued' },
]

const chipBase = 'text-xs px-2.5 py-1 rounded-full border transition-colors'
const chipOn = 'bg-blue-500 border-blue-500 text-white'
const chipOff = 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-300'

export function FilterBar({ vehicles, filters, onChange, viewMode = 'advanced', market = ALL_MARKET }: FilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const isSimple = viewMode === 'simple'

  const allMakes = [...new Set(vehicles.map(v => v.make))].sort()
  const allBodies = [...new Set(vehicles.map(v => v.bodyType).filter((b): b is string => !!b))].sort()
  const allSegments = [...new Set(vehicles.map(v => v.segment).filter((s): s is string => !!s))].sort()
  const showAvailability = market !== ALL_MARKET

  const update = (patch: Partial<FilterState>) => onChange({ ...filters, ...patch })
  const toggle = (key: keyof FilterState, val: string) => {
    const cur = filters[key] as string[]
    update({ [key]: cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val] } as Partial<FilterState>)
  }

  const activeCount = [
    filters.makes.length > 0,
    filters.drivetrains.length > 0,
    filters.bodyTypes.length > 0,
    filters.segments.length > 0,
    filters.availability.length > 0,
  ].filter(Boolean).length

  const clearAll = () =>
    onChange({ search: filters.search, makes: [], drivetrains: [], bodyTypes: [], segments: [], availability: [] })

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
          <Button size="xs" variant="ghost" onClick={clearAll}>
            Clear filters
          </Button>
        )}
      </div>

      {!isSimple && showAdvanced && (
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-6">
          {/* Makes */}
          <FilterGroup label="Brand">
            <div className="flex flex-wrap gap-1 max-w-lg">
              {allMakes.slice(0, 30).map(make => (
                <button key={make} onClick={() => toggle('makes', make)}
                  className={`${chipBase} ${filters.makes.includes(make) ? chipOn : chipOff}`}>
                  {make}
                </button>
              ))}
            </div>
          </FilterGroup>

          {/* Body style */}
          {allBodies.length > 0 && (
            <FilterGroup label="Body style">
              <div className="flex flex-wrap gap-1 max-w-md">
                {allBodies.map(b => (
                  <button key={b} onClick={() => toggle('bodyTypes', b)}
                    className={`${chipBase} ${filters.bodyTypes.includes(b) ? chipOn : chipOff}`}>
                    {b}
                  </button>
                ))}
              </div>
            </FilterGroup>
          )}

          {/* Segment */}
          {allSegments.length > 0 && (
            <FilterGroup label="Segment">
              <div className="flex flex-wrap gap-1 max-w-md">
                {allSegments.map(s => (
                  <button key={s} onClick={() => toggle('segments', s)}
                    className={`${chipBase} ${filters.segments.includes(s) ? chipOn : chipOff}`}>
                    {s}
                  </button>
                ))}
              </div>
            </FilterGroup>
          )}

          {/* Drivetrain */}
          <FilterGroup label="Drivetrain">
            <div className="flex gap-1">
              {(['RWD', 'AWD', 'FWD'] as const).map(dt => (
                <button key={dt} onClick={() => toggle('drivetrains', dt)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                    filters.drivetrains.includes(dt) ? chipOn : chipOff}`}>
                  {dt}
                </button>
              ))}
            </div>
          </FilterGroup>

          {/* Availability — only meaningful for a specific market */}
          {showAvailability && (
            <FilterGroup label="Availability">
              <div className="flex gap-1">
                {AVAIL_OPTIONS.map(opt => (
                  <button key={opt.key} onClick={() => toggle('availability', opt.key)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                      filters.availability.includes(opt.key) ? chipOn : chipOff}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </FilterGroup>
          )}
        </div>
      )}
    </div>
  )
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">{label}</p>
      {children}
    </div>
  )
}
