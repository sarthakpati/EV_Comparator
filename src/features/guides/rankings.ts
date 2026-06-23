// Data-driven rankings computed from Bjørn Nyland's test data. These power the
// homepage "featured" tables and the data-driven guide articles, so each page
// carries unique, substantive content rather than a bare interactive widget.

import type { Vehicle, Condition } from '../../lib/types'
import { getDisplayValue } from '../../lib/metricHelpers'
import { getPricePerRange } from '../../lib/derived'
import { formatValue, formatTime, type UnitSystem } from '../../lib/units'

/** Canonical reference condition for standalone article rankings: steady 90 km/h, summer. */
export const CANON: Partial<Condition> = { speed: 90, season: 'summer' }

export function vehicleName(v: Vehicle): string {
  return [v.make, v.model, v.variant].filter(Boolean).join(' ')
}

export interface RankRow {
  id: string
  name: string
  /** Raw numeric value used for sorting (native metric units). */
  value: number
  /** Display string, unit-formatted. */
  label: string
}

interface RankOptions {
  metricId: string
  unit: string
  direction: 'higher-better' | 'lower-better'
  unitSystem?: UnitSystem
  limit?: number
  precision?: number
  condition?: Partial<Condition>
  /** 'time' formats minutes as h:mm (for road-trip durations). */
  format?: 'value' | 'time'
  /** Skip vehicles whose display name matches (e.g. exclude hydrogen / hybrid reference cars). */
  exclude?: RegExp
}

/** Rank vehicles by a single fixed metric, formatted for display. */
export function rankByMetric(vehicles: Vehicle[], opts: RankOptions): RankRow[] {
  const cond = opts.condition ?? CANON
  const rows: RankRow[] = []
  for (const v of vehicles) {
    if (opts.exclude && opts.exclude.test(vehicleName(v))) continue
    const value = getDisplayValue(v, opts.metricId, cond)
    if (value == null) continue
    const label = opts.format === 'time'
      ? formatTime(value)
      : formatValue(value, opts.unit, opts.precision ?? 0, opts.unitSystem)
    rows.push({ id: v.id, name: vehicleName(v), value, label })
  }
  rows.sort((a, b) => opts.direction === 'lower-better' ? a.value - b.value : b.value - a.value)
  return rows.slice(0, opts.limit ?? 10)
}

/** Rank by best value: lowest price per unit of real-world range, in the market's currency. */
export function rankByValue(
  vehicles: Vehicle[],
  market: string,
  unitSystem: UnitSystem = 'metric',
  limit = 10,
): RankRow[] {
  const rows: RankRow[] = []
  for (const v of vehicles) {
    const pr = getPricePerRange(v, market, unitSystem)
    if (pr.sortValue == null) continue
    rows.push({ id: v.id, name: vehicleName(v), value: pr.sortValue, label: pr.label })
  }
  rows.sort((a, b) => a.value - b.value)
  return rows.slice(0, limit)
}

export interface SeasonLossRow extends RankRow {
  summer: number
  winter: number
  /** Fractional loss, 0..1. */
  loss: number
}

/** Vehicles tested at 90 km/h in both summer and winter, sorted by smallest % range lost in cold. */
export function rankByWinterRetention(
  vehicles: Vehicle[],
  unitSystem: UnitSystem = 'metric',
  limit = 10,
): SeasonLossRow[] {
  const rows: SeasonLossRow[] = []
  for (const v of vehicles) {
    const summer = getDisplayValue(v, 'range_90_summer', CANON)
    const winter = getDisplayValue(v, 'range_90_winter', { speed: 90, season: 'winter' })
    if (summer == null || winter == null || summer <= 0) continue
    // Skip cross-test artifacts: winter range physically cannot exceed summer range,
    // so a recorded "gain" means the two figures aren't comparable (different test runs).
    if (winter >= summer) continue
    const loss = 1 - winter / summer
    rows.push({
      id: v.id,
      name: vehicleName(v),
      value: loss,
      summer,
      winter,
      loss,
      label: `${formatValue(winter, 'km', 0, unitSystem)} · −${Math.round(loss * 100)}%`,
    })
  }
  rows.sort((a, b) => a.loss - b.loss)
  return rows.slice(0, limit)
}

/**
 * Mean fractional range loss from condition A → B across all vehicles tested in both.
 * With `clampGains`, physically-impossible "gains" (a harsher condition yielding more
 * range — always a cross-test artifact) are clamped to zero loss rather than dragging
 * the average down.
 */
export function meanLoss(vehicles: Vehicle[], fromId: string, toId: string,
  fromCond: Partial<Condition>, toCond: Partial<Condition>,
  opts: { clampGains?: boolean } = {}): { mean: number; count: number } {
  const losses: number[] = []
  for (const v of vehicles) {
    const a = getDisplayValue(v, fromId, fromCond)
    const b = getDisplayValue(v, toId, toCond)
    if (a == null || b == null || a <= 0) continue
    let loss = 1 - b / a
    if (opts.clampGains) loss = Math.max(0, loss)
    losses.push(loss)
  }
  if (losses.length === 0) return { mean: 0, count: 0 }
  return { mean: losses.reduce((x, y) => x + y, 0) / losses.length, count: losses.length }
}

/** Count of vehicles with at least one recorded value for a metric. */
export function coverageCount(vehicles: Vehicle[], metricId: string): number {
  return vehicles.filter(v => getDisplayValue(v, metricId, CANON) != null).length
}
