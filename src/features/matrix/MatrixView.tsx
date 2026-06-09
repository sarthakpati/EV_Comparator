import { useState, useMemo, useCallback, useRef } from 'react'
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  type SortingState, type ColumnDef,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { Vehicle, MetricDef, Condition } from '../../lib/types'
import type { UnitSystem } from '../../lib/units'

interface MatrixRowData {
  vehicle: Vehicle
  [metricId: string]: number | null | Vehicle
}
import { HeatCell } from './HeatCell'
import { SortRail } from './SortRail'
import { ColumnPicker } from './ColumnPicker'
import { computePercentiles } from '../../lib/colors'
import { getDisplayValue } from '../../lib/metricHelpers'
import { getVehiclePrice, getPriceHeaderLabel, type PriceInfo } from '../../lib/markets'
import { Button } from '../../components/ui/Button'
import { Tooltip } from '../../components/ui/Tooltip'
import { useAppStore } from '../../store'

const DEFAULT_METRICS = [
  'range_90_summer', 'range_120_summer', 'roadtrip_1000km_time',
  'consumption_90_summer', 'accel_0_100', 'noise_avg',
  'cargo_trunk', 'weight_kg', 'price_usd',
]

const SIMPLE_METRICS = [
  'range_90_summer', 'accel_0_100', 'roadtrip_1000km_time',
  'consumption_90_summer', 'cargo_trunk', 'price_usd',
]

const VEHICLE_COL_W = 220
const ROW_H = 48

interface MatrixViewProps {
  vehicles: Vehicle[]
  metrics: MetricDef[]
  condition: Partial<Condition>
  marketCode: string
  searchQuery: string
  isDark: boolean
  unitSystem?: UnitSystem
  viewMode?: 'simple' | 'advanced'
}

export function MatrixView({ vehicles, metrics, condition, marketCode, searchQuery, isDark, unitSystem = 'metric', viewMode = 'advanced' }: MatrixViewProps) {
  const isSimple = viewMode === 'simple'
  const [sorting, setSorting] = useState<SortingState>([])
  const [visibleMetricIds, setVisibleMetricIds] = useState(DEFAULT_METRICS)
  const [showColumnPicker, setShowColumnPicker] = useState(false)
  const tableRef = useRef<HTMLDivElement>(null)
  const { compareSet, toggleCompare } = useAppStore()

  const activeMetricIds = isSimple ? SIMPLE_METRICS : visibleMetricIds

  const visibleMetrics = useMemo(
    () => metrics.filter(m => activeMetricIds.includes(m.id)),
    [metrics, activeMetricIds],
  )

  const filteredVehicles = useMemo(() => {
    let vs = vehicles
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      vs = vs.filter(v => `${v.make} ${v.model} ${v.variant ?? ''}`.toLowerCase().includes(q))
    }
    return vs
  }, [vehicles, searchQuery])

  // Market-aware price (local currency for a specific market, USD range for "All").
  const priceInfo = useMemo(() => {
    const map: Record<string, PriceInfo> = {}
    for (const v of filteredVehicles) map[v.id] = getVehiclePrice(v.markets, marketCode)
    return map
  }, [filteredVehicles, marketCode])

  const data = useMemo((): MatrixRowData[] => filteredVehicles.map(v => {
    const row: MatrixRowData = { vehicle: v }
    for (const m of visibleMetrics) {
      row[m.id] = m.id === 'price_usd'
        ? (priceInfo[v.id]?.sortValue ?? null)
        : getDisplayValue(v, m.id, condition)
    }
    return row
  }), [filteredVehicles, visibleMetrics, condition, priceInfo])

  const percentileMap = useMemo(() => {
    const map: Record<string, Record<string, number | null>> = {}
    for (const metric of visibleMetrics) {
      const vals = data.map(row => (row[metric.id] as number | null) ?? null)
      const pcts = computePercentiles(vals, metric.direction)
      map[metric.id] = {}
      data.forEach((row, i) => { map[metric.id][(row.vehicle as Vehicle).id] = pcts[i] })
    }
    return map
  }, [data, visibleMetrics])

  const bestMap = useMemo(() => {
    const map: Record<string, string | null> = {}
    for (const metric of visibleMetrics) {
      const withVal = data.filter(r => (r[metric.id] as number | null) != null)
      if (withVal.length === 0) { map[metric.id] = null; continue }
      const sorted = [...withVal].sort((a, b) => {
        const av = a[metric.id] as number
        const bv = b[metric.id] as number
        return metric.direction === 'lower-better' ? av - bv : bv - av
      })
      map[metric.id] = (sorted[0].vehicle as Vehicle).id
    }
    return map
  }, [data, visibleMetrics])

  const columns = useMemo((): ColumnDef<typeof data[0]>[] => [
    {
      id: 'vehicle',
      header: 'Vehicle',
      accessorFn: row => `${row.vehicle.make} ${row.vehicle.model} ${row.vehicle.variant ?? ''}`,
      cell: ({ row }) => {
        const v = row.original.vehicle as Vehicle
        const inCompare = compareSet.has(v.id)
        return (
          <td className="sticky left-0 z-10 bg-white dark:bg-slate-900 px-3 py-2 border-r border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleCompare(v.id)}
                className={`w-4 h-4 rounded border flex-shrink-0 transition-colors ${inCompare ? 'bg-blue-500 border-blue-500' : 'border-slate-300 dark:border-slate-600 hover:border-blue-400'}`}
                aria-label={inCompare ? 'Remove from compare' : 'Add to compare'}
                title={inCompare ? 'Remove from compare' : 'Add to compare (max 5)'}
              >
                {inCompare && <span className="text-white text-[8px] flex items-center justify-center leading-none">✓</span>}
              </button>
              <div className="min-w-0">
                <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                  {v.make} {v.model}
                </div>
                {v.variant && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{v.variant}</div>
                )}
              </div>
              {v.coverage > 0 && (
                <Tooltip content={`Data coverage: ${Math.round(v.coverage * 100)}%`}>
                  <div className="ml-auto flex-shrink-0 w-1 h-6 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="bg-blue-400 rounded-full transition-all"
                      style={{ height: `${v.coverage * 100}%`, marginTop: `${(1 - v.coverage) * 100}%` }}
                    />
                  </div>
                </Tooltip>
              )}
            </div>
          </td>
        )
      },
      size: VEHICLE_COL_W,
      enableSorting: true,
    },
    ...visibleMetrics.map((metric): ColumnDef<typeof data[0]> => ({
      id: metric.id,
      accessorKey: metric.id,
      header: metric.label,
      enableSorting: true,
      cell: ({ row }) => {
        const value = row.original[metric.id] as number | null
        const vehicleId = (row.original.vehicle as Vehicle).id
        const percentile = percentileMap[metric.id]?.[vehicleId] ?? null
        const isBest = bestMap[metric.id] === vehicleId && value !== null
        const displayOverride = metric.id === 'price_usd' ? priceInfo[vehicleId]?.label : undefined
        return (
          <HeatCell
            value={value}
            percentile={percentile}
            metric={metric}
            isDark={isDark}
            isBest={isBest}
            unitSystem={unitSystem}
            displayOverride={displayOverride}
          />
        )
      },
      size: 130,
    })),
  ], [visibleMetrics, percentileMap, bestMap, isDark, compareSet, toggleCompare, unitSystem, priceInfo])

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    isMultiSortEvent: (e) => (e as MouseEvent).shiftKey,
  })

  const { rows } = table.getRowModel()

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableRef.current,
    estimateSize: () => ROW_H,
    overscan: 12,
  })

  const virtualItems = rowVirtualizer.getVirtualItems()
  const totalSize = rowVirtualizer.getTotalSize()
  const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0
  const paddingBottom = virtualItems.length > 0 ? totalSize - virtualItems[virtualItems.length - 1].end : 0
  const colCount = visibleMetrics.length + 1

  const removeSortLevel = useCallback((id: string) => {
    setSorting(prev => prev.filter(s => s.id !== id))
  }, [])

  const toggleSortLevel = useCallback((id: string) => {
    setSorting(prev => prev.map(s => s.id === id ? { ...s, desc: !s.desc } : s))
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-200 dark:border-slate-700 flex-wrap">
        {!isSimple && (
          <Button size="sm" variant="secondary" onClick={() => setShowColumnPicker(true)}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0v10m0-10a2 2 0 012 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            Columns ({visibleMetricIds.length})
          </Button>
        )}
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {filteredVehicles.length} vehicles
          {!isSimple && sorting.length > 0 && ' · Shift+click header to add sort level'}
        </span>
        {!isSimple && sorting.length > 0 && (
          <Button size="xs" variant="ghost" onClick={() => setSorting([])}>
            Clear sort
          </Button>
        )}
        {isSimple && (
          <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">
            Switch to <span className="text-blue-500">Advanced</span> for more columns & sorting
          </span>
        )}
      </div>

      {/* Sort rail — advanced only */}
      {!isSimple && (
        <SortRail
          sorting={sorting}
          metrics={metrics}
          onRemove={removeSortLevel}
          onToggle={toggleSortLevel}
        />
      )}

      {/* Table */}
      <div ref={tableRef} className="flex-1 overflow-auto scrollbar-thin">
        <table
          className="w-full border-collapse text-sm"
          style={{ tableLayout: 'fixed', minWidth: `${VEHICLE_COL_W + visibleMetrics.length * 130}px` }}
        >
          <colgroup>
            <col style={{ width: VEHICLE_COL_W }} />
            {visibleMetrics.map(m => <col key={m.id} />)}
          </colgroup>
          <thead className="sticky top-0 z-20 bg-white dark:bg-slate-900">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="border-b border-slate-200 dark:border-slate-700">
                {headerGroup.headers.map(header => {
                  const metric = metrics.find(m => m.id === header.id)
                  const sortDir = header.column.getIsSorted()
                  const sortIdx = sorting.findIndex(s => s.id === header.id)
                  const headerLabel = header.id === 'vehicle'
                    ? 'Vehicle'
                    : header.id === 'price_usd'
                      ? getPriceHeaderLabel(marketCode)
                      : (metric?.label ?? header.id)

                  return (
                    <th
                      key={header.id}
                      className={`
                        px-3 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400
                        select-none whitespace-nowrap cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50
                        transition-colors
                        ${header.id === 'vehicle' ? 'sticky left-0 z-20 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800' : ''}
                      `}
                      onClick={header.column.getToggleSortingHandler()}
                      aria-sort={sortDir === 'asc' ? 'ascending' : sortDir === 'desc' ? 'descending' : 'none'}
                    >
                      <Tooltip content={metric?.description ?? header.id} side="bottom">
                        <span className="flex items-center gap-1 truncate">
                          <span className="truncate">{headerLabel}</span>
                          {sortDir && (
                            <span className="text-blue-500 shrink-0">
                              {sortDir === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                          {sortIdx > -1 && (
                            <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] flex items-center justify-center font-bold shrink-0">
                              {sortIdx + 1}
                            </span>
                          )}
                        </span>
                      </Tooltip>
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {paddingTop > 0 && (
              <tr aria-hidden="true">
                <td colSpan={colCount} style={{ height: paddingTop, padding: 0, border: 'none' }} />
              </tr>
            )}
            {virtualItems.map(virtualRow => {
              const row = rows[virtualRow.index]
              return (
                <tr
                  key={row.id}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  style={{ height: ROW_H }}
                >
                  {row.getVisibleCells().map(cell => (
                    cell.column.columnDef.cell
                      ? (cell.column.columnDef.cell as Function)({ row: cell.row, getValue: cell.getValue.bind(cell) })
                      : null
                  ))}
                </tr>
              )
            })}
            {paddingBottom > 0 && (
              <tr aria-hidden="true">
                <td colSpan={colCount} style={{ height: paddingBottom, padding: 0, border: 'none' }} />
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showColumnPicker && (
        <ColumnPicker
          metrics={metrics}
          visible={visibleMetricIds}
          onChange={setVisibleMetricIds}
          onClose={() => setShowColumnPicker(false)}
        />
      )}
    </div>
  )
}
