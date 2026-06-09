import { useEffect, useMemo } from 'react'
import type { Vehicle, MetricDef, Condition } from '../../lib/types'
import { formatValue, formatTime, type UnitSystem } from '../../lib/units'
import {
  getMetricNumber, getDerivedLabel, getPricePerRange, conditionLabel,
} from '../../lib/derived'
import { getVehiclePrice, getMarketConfig, ALL_MARKET } from '../../lib/markets'
import { useAppStore } from '../../store'
import { Button } from '../../components/ui/Button'

interface VehicleDetailProps {
  vehicle: Vehicle
  metrics: MetricDef[]
  condition: Partial<Condition>
  market: string
  unitSystem: UnitSystem
  onClose: () => void
}

const SECTIONS: { title: string; ids: string[] }[] = [
  { title: 'Charging & road trip', ids: ['range_75pct_km', 'charge_time_75pct', 'charge_speed_75pct', 'roadtrip_1000km_time', 'roadtrip_avg_speed', 'roadtrip_consumption'] },
  { title: 'Performance', ids: ['accel_0_100', 'accel_0_100_1ft', 'hp', 'weight_kg', 'braking_distance'] },
  { title: 'Comfort', ids: ['noise_avg', 'noise_80', 'noise_100', 'noise_120'] },
  { title: 'Practicality', ids: ['cargo_trunk', 'cargo_seats_folded'] },
  { title: 'Battery & longevity', ids: ['battery_capacity', 'degradation_pct'] },
]

const AVAIL_LABEL: Record<string, string> = {
  available: 'Available', upcoming: 'Upcoming', discontinued: 'Discontinued', unavailable: 'Not sold here',
}

export function VehicleDetail({ vehicle: v, metrics, condition, market, unitSystem, onClose }: VehicleDetailProps) {
  const { compareSet, toggleCompare } = useAppStore()
  const metricMap = useMemo(() => new Map(metrics.map(m => [m.id, m])), [metrics])
  const inCompare = compareSet.has(v.id)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const fmt = (metricId: string): string => {
    const num = getMetricNumber(v, metricId, condition, market, unitSystem)
    if (num == null) return '—'
    const override = getDerivedLabel(v, metricId, market, unitSystem)
    if (override) return override
    const m = metricMap.get(metricId)
    if (!m) return String(num)
    if (m.unit === 'min' && metricId.includes('roadtrip')) return formatTime(num)
    return formatValue(num, m.unit, m.precision, unitSystem)
  }

  // Raw range/consumption lookups for the Real Range grid (bypasses condition scoring).
  const cell = (id: string): number | null => {
    const hit = v.metrics[id]?.find(x => x.value != null)
    return hit?.value ?? null
  }
  const rangeStr = (speed: number, season: string) => {
    const n = cell(`range_${speed}_${season}`)
    return n == null ? '—' : formatValue(n, 'km', 0, unitSystem)
  }
  const consStr = (speed: number, season: string) => {
    const n = cell(`consumption_${speed}_${season}`)
    return n == null ? '—' : formatValue(n, 'Wh/km', 0, unitSystem)
  }

  const mkt = market !== ALL_MARKET ? v.markets?.[market as 'US' | 'UK' | 'DE'] : undefined
  const price = getVehiclePrice(v.markets, market)
  const value = getPricePerRange(v, market, unitSystem)
  const cfg = getMarketConfig(market)

  const badges = [
    typeof v.modelYear === 'number' ? String(v.modelYear) : Array.isArray(v.modelYear) ? `${v.modelYear[0]}–${v.modelYear[1]}` : null,
    v.drivetrain,
    v.batteryKwh ? `${v.batteryKwh} kWh` : null,
    v.bodyType,
    v.segment,
  ].filter(Boolean) as string[]

  const activeSpeed = condition.speed === 120 ? 120 : 90
  const activeSeason = condition.season === 'winter' ? 'winter' : 'summer'

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={`${v.make} ${v.model} details`}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md h-full bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto scrollbar-thin border-l border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">
                {v.make} {v.model}
              </h2>
              {v.variant && <p className="text-sm text-slate-500 dark:text-slate-400">{v.variant}</p>}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
              aria-label="Close"
            >✕</button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {badges.map(b => (
              <span key={b} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{b}</span>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-3">
            <Button size="sm" variant={inCompare ? 'secondary' : 'primary'} onClick={() => toggleCompare(v.id)}>
              {inCompare ? '✓ In compare' : '+ Add to compare'}
            </Button>
            <span className="text-xs text-slate-400">Data coverage {Math.round(v.coverage * 100)}%</span>
          </div>
        </div>

        <div className="px-5 py-4 space-y-6">
          {/* Market */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-2">
              Market {market === ALL_MARKET ? '· all' : `· ${cfg?.flag ?? ''} ${cfg?.name ?? market}`}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Starting price" value={price.label} />
              <Stat label="Value (price / range)" value={value.label} />
              <Stat label="Availability" value={mkt ? (AVAIL_LABEL[mkt.available] ?? mkt.available) : market === ALL_MARKET ? '—' : 'Not listed'} />
              <Stat label="Launch year" value={mkt?.launchYear ? String(mkt.launchYear) : '—'} />
            </div>
            {price.label !== '—' && (
              <p className="text-[11px] text-slate-400 mt-1.5">Approximate starting MSRP, pre-incentive · community-maintained.</p>
            )}
          </section>

          {/* Real Range grid — the EV Database idea, on Bjørn's real conditions */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-2">
              Real range — by condition
            </h3>
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400">
                    <th className="py-1.5 px-2 text-left text-xs font-medium"></th>
                    <th className="py-1.5 px-2 text-center text-xs font-medium">☀️ Summer</th>
                    <th className="py-1.5 px-2 text-center text-xs font-medium">❄️ Winter</th>
                  </tr>
                </thead>
                <tbody>
                  {[90, 120].map(speed => (
                    <tr key={speed} className="border-t border-slate-100 dark:border-slate-800">
                      <td className="py-1.5 px-2 text-xs font-medium text-slate-500 dark:text-slate-400">{speed} km/h</td>
                      {['summer', 'winter'].map(season => {
                        const isActive = speed === activeSpeed && season === activeSeason
                        return (
                          <td
                            key={season}
                            className={`py-1.5 px-2 text-center tabular-nums ${isActive ? 'bg-blue-50 dark:bg-blue-950/40 ring-1 ring-inset ring-blue-400/50' : ''}`}
                          >
                            <div className="font-semibold text-slate-800 dark:text-slate-100">{rangeStr(speed, season)}</div>
                            <div className="text-[11px] text-slate-400">{consStr(speed, season)}</div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Steady-speed range &amp; consumption (Bjørn Nyland). Highlighted cell = active condition ({conditionLabel(condition)}).
              Conditional-range layout inspired by EV Database.
            </p>
          </section>

          {/* Spec sections */}
          {SECTIONS.map(sec => {
            const rows = sec.ids
              .map(id => ({ id, m: metricMap.get(id), val: fmt(id) }))
              .filter(r => r.m && r.val !== '—')
            if (rows.length === 0) return null
            return (
              <section key={sec.title}>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-2">{sec.title}</h3>
                <div className="space-y-1">
                  {rows.map(r => (
                    <div key={r.id} className="flex items-baseline justify-between gap-3 py-1 border-b border-slate-50 dark:border-slate-800/50">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{r.m!.label}</span>
                      <span className="text-sm font-medium tabular-nums text-slate-900 dark:text-slate-100">{r.val}</span>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}

          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            Test data © Bjørn Nyland, reproduced with attribution. Every figure is a real-world measurement; blanks mean "not tested," never zero.
          </p>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 px-3 py-2">
      <div className="text-[11px] text-slate-400 dark:text-slate-500">{label}</div>
      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 tabular-nums">{value}</div>
    </div>
  )
}
