import { useMemo } from 'react'
import type { Vehicle, MetricDef, Condition } from '../../lib/types'
import { getDisplayValue } from '../../lib/metricHelpers'
import { computePercentiles } from '../../lib/colors'

export interface MatrixRow {
  vehicle: Vehicle
  values: Record<string, number | null>
}

export interface MatrixColumn {
  metric: MetricDef
  percentiles: Record<string, number | null>
}

export function useMatrixData(
  vehicles: Vehicle[],
  visibleMetricIds: string[],
  metrics: MetricDef[],
  condition: Partial<Condition>,
  filters: {
    search?: string
    makes?: string[]
    drivetrains?: ('RWD' | 'AWD' | 'FWD')[]
    market?: string
    availableInMarket?: boolean
  },
  marketCode: string,
) {
  const visibleMetrics = useMemo(
    () => metrics.filter(m => visibleMetricIds.includes(m.id)),
    [metrics, visibleMetricIds],
  )

  const filteredVehicles = useMemo(() => {
    let vs = vehicles

    if (filters.search) {
      const q = filters.search.toLowerCase()
      vs = vs.filter(v =>
        `${v.make} ${v.model} ${v.variant ?? ''}`.toLowerCase().includes(q)
      )
    }

    if (filters.makes && filters.makes.length > 0) {
      vs = vs.filter(v => filters.makes!.includes(v.make))
    }

    if (filters.drivetrains && filters.drivetrains.length > 0) {
      vs = vs.filter(v => v.drivetrain && filters.drivetrains!.includes(v.drivetrain))
    }

    if (filters.availableInMarket && marketCode) {
      vs = vs.filter(v => {
        const mkt = v.markets?.[marketCode as 'US' | 'EU' | 'UK' | 'NO']
        return mkt && (mkt.available === 'available' || mkt.available === 'upcoming')
      })
    }

    return vs
  }, [vehicles, filters, marketCode])

  const rows: MatrixRow[] = useMemo(() => filteredVehicles.map(vehicle => ({
    vehicle,
    values: Object.fromEntries(
      visibleMetrics.map(m => [m.id, getDisplayValue(vehicle, m.id, condition)])
    ),
  })), [filteredVehicles, visibleMetrics, condition])

  const columns: MatrixColumn[] = useMemo(() => visibleMetrics.map(metric => {
    const rawValues = rows.map(r => r.values[metric.id] ?? null)
    const pcts = computePercentiles(rawValues, metric.direction)
    const percentiles: Record<string, number | null> = {}
    rows.forEach((r, i) => { percentiles[r.vehicle.id] = pcts[i] })
    return { metric, percentiles }
  }), [rows, visibleMetrics])

  return { rows, columns, filteredVehicles }
}
