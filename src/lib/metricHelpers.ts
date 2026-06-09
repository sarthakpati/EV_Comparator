import type { Vehicle, MetricValue, Condition } from './types'

/** Get the best MetricValue for a vehicle metric given a condition preference. */
export function getMetricValue(
  vehicle: Vehicle,
  metricId: string,
  condition?: Partial<Condition>,
): MetricValue | null {
  const values = vehicle.metrics[metricId]
  if (!values || values.length === 0) return null

  if (!condition) return values[0]

  // Score each value by how well it matches the condition
  const scored = values.map(mv => {
    let score = 0
    const c = mv.condition
    if (!c) return { mv, score: 0 }
    if (condition.speed !== undefined && c.speed === condition.speed) score += 3
    if (condition.season !== undefined && c.season === condition.season) score += 2
    if (condition.surface !== undefined && c.surface === condition.surface) score += 1
    return { mv, score }
  })

  scored.sort((a, b) => b.score - a.score)
  return scored[0].mv
}

/** Get the canonical display value for a metric across all conditions. */
export function getCanonicalValue(
  vehicle: Vehicle,
  metricId: string,
  preferredCondition: Partial<Condition> = { speed: 90, season: 'summer' },
): number | null {
  const mv = getMetricValue(vehicle, metricId, preferredCondition)
  return mv?.value ?? null
}

/** Get display value for a metric. Returns the best matching value number. */
export function getDisplayValue(
  vehicle: Vehicle,
  metricId: string,
  condition: Partial<Condition> = { speed: 90, season: 'summer' },
): number | null {
  return getCanonicalValue(vehicle, metricId, condition)
}
