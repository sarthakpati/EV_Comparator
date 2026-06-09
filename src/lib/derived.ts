// Render-computed / market-aware metrics, inspired by EV Database.
//
// Two ideas borrowed from ev-database.org:
//   1. Conditional "Real Range" — one Range figure you switch across driving
//      conditions, instead of a wall of fixed columns. Bjørn's data gives us
//      speed (90/120 km/h) × season (summer/winter); the switcher picks one.
//   2. "Price per range" value metric — how much each km (or mi) of real range
//      costs, in the selected market's currency. EV Database's signature value cue.
//
// These are computed at render (not baked into the ETL) so they stay market-aware
// and follow the condition switcher exactly. They are registered as MetricDefs so
// they appear in the column picker, sort rail, presets and compare like any metric.

import type { Vehicle, MetricDef, Condition } from './types'
import { getDisplayValue } from './metricHelpers'
import { getVehiclePrice, getMarketConfig, ALL_MARKET } from './markets'
import { kmToMi, type UnitSystem } from './units'

export const REAL_RANGE_ID = 'range_real'
export const REAL_CONSUMPTION_ID = 'consumption_real'
export const PRICE_PER_RANGE_ID = 'price_per_range'

export const DERIVED_METRIC_IDS = [REAL_RANGE_ID, REAL_CONSUMPTION_ID, PRICE_PER_RANGE_ID]

/** Metric defs merged into the dataset at load time (see lib/data.ts). */
export const DERIVED_METRICS: MetricDef[] = [
  {
    id: REAL_RANGE_ID, label: 'Range', group: 'range',
    unit: 'km', direction: 'higher-better', precision: 0, conditioned: true,
    description:
      'Real-world steady-speed range at the selected speed & season (Bjørn Nyland). ' +
      'Use the condition switcher to change speed (90 / 120 km/h) and weather (summer / winter) — ' +
      'the EV Database-style conditional range view, kept honest to Bjørn’s actual test conditions.',
  },
  {
    id: REAL_CONSUMPTION_ID, label: 'Consumption', group: 'efficiency',
    unit: 'Wh/km', direction: 'lower-better', precision: 0, conditioned: true,
    description: 'Energy consumption at the selected speed & season. Cold weather and 120 km/h both push this up.',
  },
  {
    id: PRICE_PER_RANGE_ID, label: 'Price / Range', group: 'cost',
    unit: 'USD', direction: 'lower-better', precision: 0, conditioned: true,
    description:
      'Starting price ÷ real-world range = cost per km (or mi) of range. Lower is better value. ' +
      'Inspired by EV Database’s price-per-range; uses the selected market’s price & currency.',
  },
]

const RANGE_PREFERENCE = ['range_90_summer', 'range_120_summer', 'range_90_winter', 'range_120_winter']

/** Map the active condition to the underlying fixed range / consumption metric id. */
export function rangeIdFor(c: Partial<Condition>): string {
  const speed = c.speed === 120 ? 120 : 90
  const season = c.season === 'winter' ? 'winter' : 'summer'
  return `range_${speed}_${season}`
}
export function consumptionIdFor(c: Partial<Condition>): string {
  const speed = c.speed === 120 ? 120 : 90
  const season = c.season === 'winter' ? 'winter' : 'summer'
  return `consumption_${speed}_${season}`
}

/** Best available steady-speed range (km), preferring the canonical 90 km/h summer figure.
 *  Used as a stable reference for the value metric so it doesn't swing with the switcher. */
export function getReferenceRange(v: Vehicle): number | null {
  for (const id of RANGE_PREFERENCE) {
    const vals = v.metrics[id]
    const hit = vals?.find(x => x.value != null)
    if (hit?.value != null) return hit.value
  }
  return null
}

const CURRENCY_SYMBOL: Record<string, string> = { USD: '$', GBP: '£', EUR: '€', NOK: 'kr ' }

export interface DerivedValue { sortValue: number | null; label: string }

/** Market-aware price-per-range. Numeric value is currency-per-distance (USD-normalized in "All"). */
export function getPricePerRange(v: Vehicle, market: string, unitSystem: UnitSystem = 'metric'): DerivedValue {
  const price = getVehiclePrice(v.markets, market)
  const range = getReferenceRange(v)
  if (price.sortValue == null || range == null || range <= 0) return { sortValue: null, label: '—' }
  const currency = market === ALL_MARKET ? 'USD' : (getMarketConfig(market)?.currency ?? 'USD')
  const sym = CURRENCY_SYMBOL[currency] ?? ''
  const dist = unitSystem === 'imperial' ? kmToMi(range) : range
  const perDist = price.sortValue / dist
  return { sortValue: perDist, label: `${sym}${Math.round(perDist)}/${unitSystem === 'imperial' ? 'mi' : 'km'}` }
}

/**
 * Single source of truth for a metric's numeric value across all views.
 * Handles the derived/market-aware/conditioned metrics; everything else falls
 * through to the standard condition-scored lookup.
 */
export function getMetricNumber(
  v: Vehicle,
  metricId: string,
  condition: Partial<Condition>,
  market: string,
  unitSystem: UnitSystem = 'metric',
): number | null {
  switch (metricId) {
    case PRICE_PER_RANGE_ID: return getPricePerRange(v, market, unitSystem).sortValue
    case REAL_RANGE_ID: return getDisplayValue(v, rangeIdFor(condition), condition)
    case REAL_CONSUMPTION_ID: return getDisplayValue(v, consumptionIdFor(condition), condition)
    case 'price_usd': return getVehiclePrice(v.markets, market).sortValue
    default: return getDisplayValue(v, metricId, condition)
  }
}

/** Pre-formatted display string for metrics that need a market-aware label; undefined otherwise. */
export function getDerivedLabel(v: Vehicle, metricId: string, market: string, unitSystem: UnitSystem = 'metric'): string | undefined {
  if (metricId === 'price_usd') return getVehiclePrice(v.markets, market).label
  if (metricId === PRICE_PER_RANGE_ID) return getPricePerRange(v, market, unitSystem).label
  return undefined
}

/** Human label for the active condition, e.g. "90 km/h · Summer". */
export function conditionLabel(c: Partial<Condition>): string {
  const speed = c.speed === 120 ? '120 km/h' : '90 km/h'
  const season = c.season === 'winter' ? 'Winter' : 'Summer'
  return `${speed} · ${season}`
}
