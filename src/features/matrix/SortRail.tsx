import type { SortingState } from '@tanstack/react-table'
import type { MetricDef } from '../../lib/types'

interface SortRailProps {
  sorting: SortingState
  metrics: MetricDef[]
  onRemove: (id: string) => void
  onToggle: (id: string) => void
}

export function SortRail({ sorting, metrics, onRemove, onToggle }: SortRailProps) {
  if (sorting.length === 0) return null

  const metricMap = new Map(metrics.map(m => [m.id, m]))

  return (
    <div className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/50 flex-wrap">
      <span className="text-xs font-medium text-blue-700 dark:text-blue-400 shrink-0">Sort by:</span>
      {sorting.map((sort, i) => {
        const metric = metricMap.get(sort.id)
        const label = metric?.label ?? sort.id
        return (
          <div
            key={sort.id}
            className="inline-flex items-center gap-1 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 rounded-full px-2 py-0.5 text-xs"
          >
            <span className="text-slate-500 dark:text-slate-500">{i + 1}.</span>
            <button
              onClick={() => onToggle(sort.id)}
              className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
            >
              {label}
            </button>
            <span className="text-slate-400">
              {sort.desc ? '↓' : '↑'}
            </span>
            <button
              onClick={() => onRemove(sort.id)}
              className="text-slate-400 hover:text-red-500 ml-0.5 leading-none"
              aria-label={`Remove ${label} sort`}
            >
              ×
            </button>
          </div>
        )
      })}
    </div>
  )
}
