import { memo } from 'react'
import { heatmapColor } from '../../lib/colors'
import { formatValue, formatTime, type UnitSystem } from '../../lib/units'
import type { MetricDef } from '../../lib/types'

interface HeatCellProps {
  value: number | null
  percentile: number | null
  metric: MetricDef
  isDark: boolean
  isBest?: boolean
  unitSystem?: UnitSystem
  /** Pre-formatted display string that overrides the default value formatting (e.g. market-aware price). */
  displayOverride?: string
}

export const HeatCell = memo(function HeatCell({
  value, percentile, metric, isDark, isBest, unitSystem = 'metric', displayOverride,
}: HeatCellProps) {
  if (value === null) {
    return (
      <td className="px-3 py-2 text-center text-xs text-slate-400 dark:text-slate-600 tabular-nums truncate">
        {displayOverride ?? '—'}
      </td>
    )
  }

  const bgColor = percentile !== null
    ? heatmapColor(percentile, metric.direction, isDark)
    : ''

  let display: string
  if (displayOverride !== undefined) {
    display = displayOverride
  } else if (metric.unit === 'min' && metric.id.includes('roadtrip')) {
    display = formatTime(value)
  } else {
    display = formatValue(value, metric.unit, metric.precision, unitSystem)
  }

  return (
    <td
      className="px-3 py-2 text-center text-xs tabular-nums transition-colors relative truncate"
      style={{ backgroundColor: bgColor || undefined }}
    >
      <span className={bgColor ? 'text-slate-900 font-medium' : 'text-slate-700 dark:text-slate-300'}>
        {display}
      </span>
      {isBest && (
        <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-green-500" title="Best in class" />
      )}
    </td>
  )
})
