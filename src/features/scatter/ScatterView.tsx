import { useState, useMemo } from 'react'
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Label, ReferenceLine,
} from 'recharts'
import type { Vehicle, MetricDef, Condition } from '../../lib/types'
import { getDisplayValue } from '../../lib/metricHelpers'
import { formatValue, type UnitSystem } from '../../lib/units'
import { useAppStore } from '../../store'

interface ScatterViewProps {
  vehicles: Vehicle[]
  metrics: MetricDef[]
  condition: Partial<Condition>
  isDark: boolean
  unitSystem?: UnitSystem
}

interface ScatterPoint {
  x: number
  y: number
  vehicle: Vehicle
  isPareto: boolean
}

function computePareto(
  points: ScatterPoint[],
  xMetric: MetricDef,
  yMetric: MetricDef,
): ScatterPoint[] {
  const xBetter = (a: number, b: number) =>
    xMetric.direction === 'lower-better' ? a < b : a > b
  const yBetter = (a: number, b: number) =>
    yMetric.direction === 'lower-better' ? a < b : a > b

  return points.map(p => {
    const dominated = points.some(other =>
      other.vehicle.id !== p.vehicle.id &&
      (xBetter(other.x, p.x) || other.x === p.x) &&
      (yBetter(other.y, p.y) || other.y === p.y) &&
      (xBetter(other.x, p.x) || yBetter(other.y, p.y))
    )
    return { ...p, isPareto: !dominated }
  })
}

const CustomDot = (props: Record<string, unknown>) => {
  const { cx, cy, payload } = props as { cx: number; cy: number; payload: ScatterPoint }
  const { compareSet, toggleCompare } = useAppStore()
  const inCompare = compareSet.has(payload.vehicle.id)
  const isPareto = payload.isPareto

  return (
    <circle
      cx={cx}
      cy={cy}
      r={inCompare ? 8 : isPareto ? 6 : 4}
      fill={inCompare ? '#3b82f6' : isPareto ? '#10b981' : '#94a3b8'}
      stroke={isPareto ? '#059669' : inCompare ? '#1d4ed8' : 'none'}
      strokeWidth={2}
      opacity={0.8}
      className="cursor-pointer hover:opacity-100 transition-opacity"
      onClick={() => toggleCompare(payload.vehicle.id)}
    />
  )
}

export function ScatterView({ vehicles, metrics, condition, isDark, unitSystem = 'metric' }: ScatterViewProps) {
  const defaultX = metrics.find(m => m.id === 'range_90_summer')?.id ?? metrics[0]?.id ?? ''
  const defaultY = metrics.find(m => m.id === 'consumption_90_summer')?.id ?? metrics[1]?.id ?? ''

  const [xMetricId, setXMetricId] = useState(defaultX)
  const [yMetricId, setYMetricId] = useState(defaultY)

  const xMetric = metrics.find(m => m.id === xMetricId)
  const yMetric = metrics.find(m => m.id === yMetricId)

  const points: ScatterPoint[] = useMemo(() => {
    if (!xMetric || !yMetric) return []
    const raw = vehicles.flatMap(v => {
      const x = getDisplayValue(v, xMetricId, condition)
      const y = getDisplayValue(v, yMetricId, condition)
      if (x === null || y === null) return []
      return [{ x, y, vehicle: v, isPareto: false }]
    })
    return computePareto(raw, xMetric, yMetric)
  }, [vehicles, xMetricId, yMetricId, condition, xMetric, yMetric])

  const paretoPoints = points.filter(p => p.isPareto)
  const nonParetoPoints = points.filter(p => !p.isPareto)

  const CustomTooltip = ({ active, payload }: Record<string, unknown>) => {
    const typedPayload = payload as Array<{ payload: ScatterPoint }> | undefined
    if (!active || !typedPayload?.length) return null
    const { vehicle, x, y, isPareto } = typedPayload[0].payload

    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-3 max-w-xs">
        <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">
          {vehicle.make} {vehicle.model}
        </p>
        {vehicle.variant && (
          <p className="text-xs text-slate-500">{vehicle.variant}</p>
        )}
        <div className="mt-2 space-y-1">
          {xMetric && (
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {xMetric.label}: {formatValue(x, xMetric.unit, xMetric.precision, unitSystem)}
            </p>
          )}
          {yMetric && (
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {yMetric.label}: {formatValue(y, yMetric.unit, yMetric.precision, unitSystem)}
            </p>
          )}
        </div>
        {isPareto && (
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1.5">
            ✦ Pareto frontier
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400">X Axis:</label>
          <select
            value={xMetricId}
            onChange={e => setXMetricId(e.target.value)}
            className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            {metrics.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Y Axis:</label>
          <select
            value={yMetricId}
            onChange={e => setYMetricId(e.target.value)}
            className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            {metrics.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Pareto frontier
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> In compare
          </span>
          <span className="text-slate-400">Click a dot to add to compare</span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 p-4 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? '#334155' : '#e2e8f0'}
            />
            <XAxis
              type="number"
              dataKey="x"
              name={xMetric?.label}
              domain={['auto', 'auto']}
              tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }}
              tickLine={false}
            >
              <Label
                value={xMetric?.label ?? ''}
                position="insideBottom"
                offset={-20}
                style={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
              />
            </XAxis>
            <YAxis
              type="number"
              dataKey="y"
              name={yMetric?.label}
              domain={['auto', 'auto']}
              tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }}
              tickLine={false}
            >
              <Label
                value={yMetric?.label ?? ''}
                angle={-90}
                position="insideLeft"
                offset={10}
                style={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
              />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            <Scatter
              data={nonParetoPoints}
              shape={<CustomDot />}
            />
            <Scatter
              data={paretoPoints}
              shape={<CustomDot />}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-400">
        {points.length} vehicles · {paretoPoints.length} on Pareto frontier
      </div>
    </div>
  )
}
