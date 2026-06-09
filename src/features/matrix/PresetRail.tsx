import { REAL_RANGE_ID, REAL_CONSUMPTION_ID, PRICE_PER_RANGE_ID } from '../../lib/derived'

export interface Preset {
  id: string
  label: string
  icon: string
  metricId: string
  /** Sort descending? (true = biggest first, for higher-better metrics) */
  desc: boolean
}

// EV Database-style one-click rankings. Each applies a single-column sort and,
// if needed, brings that column into view. Mirrors EV Database's preset filters
// ("Longest range", "Highest charging power", "Most efficient", …).
export const PRESETS: Preset[] = [
  { id: 'range', label: 'Longest range', icon: '🔋', metricId: REAL_RANGE_ID, desc: true },
  { id: 'efficient', label: 'Most efficient', icon: '🌱', metricId: REAL_CONSUMPTION_ID, desc: false },
  { id: 'roadtrip', label: 'Fastest road trip', icon: '🛣️', metricId: 'roadtrip_1000km_time', desc: false },
  { id: 'charge', label: 'Fastest charging', icon: '⚡', metricId: 'charge_speed_75pct', desc: true },
  { id: 'quick', label: 'Quickest 0–100', icon: '🏁', metricId: 'accel_0_100', desc: false },
  { id: 'value', label: 'Best value', icon: '💰', metricId: PRICE_PER_RANGE_ID, desc: false },
  { id: 'cheap', label: 'Most affordable', icon: '🏷️', metricId: 'price_usd', desc: false },
  { id: 'cargo', label: 'Biggest cargo', icon: '📦', metricId: 'cargo_trunk', desc: true },
  { id: 'quiet', label: 'Quietest', icon: '🔇', metricId: 'noise_avg', desc: false },
  { id: 'light', label: 'Lightest', icon: '🪶', metricId: 'weight_kg', desc: false },
]

interface PresetRailProps {
  activeId: string | null
  onApply: (preset: Preset) => void
}

export function PresetRail({ activeId, onApply }: PresetRailProps) {
  return (
    <div className="flex items-center gap-1.5 px-4 py-2 overflow-x-auto scrollbar-thin border-b border-slate-200 dark:border-slate-700">
      <span className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500 font-semibold shrink-0 pr-1">
        Browse by
      </span>
      {PRESETS.map(p => {
        const active = activeId === p.id
        return (
          <button
            key={p.id}
            onClick={() => onApply(p)}
            className={`shrink-0 flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
              active
                ? 'bg-blue-500 border-blue-500 text-white shadow-sm'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            aria-pressed={active}
          >
            <span aria-hidden>{p.icon}</span>
            {p.label}
          </button>
        )
      })}
    </div>
  )
}
