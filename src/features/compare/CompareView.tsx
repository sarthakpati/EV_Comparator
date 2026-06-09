import { useMemo } from 'react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Legend,
} from 'recharts'
import type { Vehicle, MetricDef, Condition } from '../../lib/types'
import { getMetricNumber, getDerivedLabel, REAL_RANGE_ID, REAL_CONSUMPTION_ID } from '../../lib/derived'
import { formatValue, formatTime, type UnitSystem } from '../../lib/units'
import { useAppStore } from '../../store'
import { Button } from '../../components/ui/Button'

const RADAR_METRICS = [
  REAL_RANGE_ID, 'accel_0_100', REAL_CONSUMPTION_ID,
  'noise_avg', 'cargo_trunk', 'roadtrip_1000km_time',
]

// Curated order for the side-by-side table. Leads with the condition-aware Range,
// Consumption and Value; the fixed per-condition range columns are folded into the
// detail drawer's grid instead of repeated here.
const COMPARE_ORDER = [
  REAL_RANGE_ID, REAL_CONSUMPTION_ID,
  'roadtrip_1000km_time', 'roadtrip_avg_speed', 'roadtrip_stops',
  'range_75pct_km', 'charge_time_75pct', 'charge_speed_75pct',
  'accel_0_100', 'accel_0_100_1ft', 'hp', 'weight_kg', 'braking_distance',
  'noise_avg', 'noise_80', 'noise_100', 'noise_120',
  'cargo_trunk', 'cargo_seats_folded',
  'battery_capacity', 'degradation_pct',
  'price_usd', 'price_per_range',
]

const RADAR_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

interface CompareViewProps {
  vehicles: Vehicle[]
  metrics: MetricDef[]
  condition: Partial<Condition>
  isDark: boolean
  unitSystem?: UnitSystem
  market: string
}

export function CompareView({ vehicles, metrics, condition, isDark, unitSystem = 'metric', market }: CompareViewProps) {
  const { compareSet, toggleCompare, clearCompare } = useAppStore()

  const metricValue = (v: Vehicle, metricId: string): number | null =>
    getMetricNumber(v, metricId, condition, market, unitSystem)

  const compareVehicles = useMemo(
    () => vehicles.filter(v => compareSet.has(v.id)),
    [vehicles, compareSet],
  )

  const radarMetrics = metrics.filter(m => RADAR_METRICS.includes(m.id))
  const metricById = useMemo(() => new Map(metrics.map(m => [m.id, m])), [metrics])
  const orderedMetrics = useMemo(
    () => COMPARE_ORDER.map(id => metricById.get(id)).filter((m): m is MetricDef => !!m),
    [metricById],
  )

  const radarData = useMemo(() => {
    return radarMetrics.map(metric => {
      const vals = compareVehicles.map(v => getMetricNumber(v, metric.id, condition, market, unitSystem))
      const nonNull = vals.filter((v): v is number => v !== null)
      if (nonNull.length === 0) return { metric: metric.label, ...Object.fromEntries(compareVehicles.map(v => [v.id, 0])) }
      const min = Math.min(...nonNull), max = Math.max(...nonNull)
      const range = max - min

      const entry: Record<string, number | string> = { metric: metric.label }
      compareVehicles.forEach((v, i) => {
        const val = vals[i]
        if (val === null || range === 0) { entry[v.id] = 50; return }
        let pct = (val - min) / range
        if (metric.direction === 'lower-better') pct = 1 - pct
        entry[v.id] = Math.round(pct * 100)
      })
      return entry
    })
  }, [compareVehicles, radarMetrics, condition, market, unitSystem])

  if (compareSet.size === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="text-4xl mb-4">⚡</div>
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">No vehicles selected</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          Go to the Matrix or Scatter view and click the checkbox next to a vehicle (or click a dot) to add it to the comparison.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">
            Comparing {compareVehicles.length} vehicle{compareVehicles.length !== 1 ? 's' : ''}
          </h2>
          <div className="flex gap-2 flex-wrap">
            {compareVehicles.map((v, i) => (
              <span key={v.id} className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: RADAR_COLORS[i] }} />
                {v.make} {v.model}
                <button onClick={() => toggleCompare(v.id)} className="ml-0.5 text-slate-400 hover:text-red-500">×</button>
              </span>
            ))}
          </div>
        </div>
        <Button size="sm" variant="ghost" onClick={clearCompare}>Clear all</Button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-auto">
        {/* Radar */}
        <div className="p-4 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Performance Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={isDark ? '#334155' : '#e2e8f0'} />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b' }}
              />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              {compareVehicles.map((v, i) => (
                <Radar
                  key={v.id}
                  name={`${v.make} ${v.model}`}
                  dataKey={v.id}
                  stroke={RADAR_COLORS[i]}
                  fill={RADAR_COLORS[i]}
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              ))}
              <Legend
                formatter={(value) => <span style={{ fontSize: 11 }}>{value}</span>}
              />
            </RadarChart>
          </ResponsiveContainer>
          <p className="text-xs text-slate-400 text-center mt-2">
            Normalized 0–100 · Higher = better on all axes
          </p>
        </div>

        {/* Side-by-side metrics */}
        <div className="p-4 overflow-auto">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Detailed Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-2 px-2 text-xs font-medium text-slate-500 dark:text-slate-400 w-32">Metric</th>
                  {compareVehicles.map((v, i) => (
                    <th key={v.id} className="text-center py-2 px-2 text-xs font-medium" style={{ color: RADAR_COLORS[i] }}>
                      {v.make} {v.model}
                      {v.variant && <span className="block font-normal text-slate-400">{v.variant}</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orderedMetrics.map(metric => {
                  const values = compareVehicles.map(v => metricValue(v, metric.id))
                  if (values.every(v => v === null)) return null
                  const nonNull = values.filter((v): v is number => v !== null)
                  const best = nonNull.length > 0
                    ? metric.direction === 'lower-better'
                      ? Math.min(...nonNull)
                      : Math.max(...nonNull)
                    : null

                  return (
                    <tr key={metric.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20">
                      <td className="py-2 px-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                        {metric.label}
                      </td>
                      {values.map((val, i) => {
                        const isBest = val !== null && val === best
                        const override = getDerivedLabel(compareVehicles[i], metric.id, market, unitSystem)
                        const display = val === null ? '—'
                          : override
                            ?? (metric.unit === 'min' && metric.id.includes('roadtrip')
                              ? formatTime(val)
                              : formatValue(val, metric.unit, metric.precision, unitSystem))

                        return (
                          <td
                            key={compareVehicles[i].id}
                            className={`py-2 px-2 text-center text-xs tabular-nums ${
                              isBest
                                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                                : val === null
                                  ? 'text-slate-400'
                                  : 'text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {display}
                            {isBest && nonNull.length > 1 && ' ✦'}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
