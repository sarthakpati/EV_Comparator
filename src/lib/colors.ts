import type { MetricDirection } from './types'

/** Map a 0..1 percentile to a heatmap color.
 *  direction: higher-better → green at 1, red at 0
 *             lower-better  → green at 0, red at 1
 *             neutral       → no color
 */
export function heatmapColor(
  percentile: number,
  direction: MetricDirection,
  isDark: boolean,
): string {
  if (direction === 'neutral') return ''
  const p = direction === 'higher-better' ? percentile : 1 - percentile

  // Viridis-inspired perceptually uniform palette — color-blind safe
  // Low (0) → deep purple/indigo → cyan → green-yellow → high (1)
  // But we simplify to: low=blue-ish, mid=neutral, high=green
  const stops = isDark
    ? [
        { p: 0,   r: 59,  g: 30,  b: 100 }, // deep purple
        { p: 0.25,r: 30,  g: 100, b: 140 }, // blue-teal
        { p: 0.5, r: 30,  g: 140, b: 120 }, // teal
        { p: 0.75,r: 80,  g: 150, b: 60  }, // green-yellow
        { p: 1,   r: 120, g: 170, b: 40  }, // chartreuse
      ]
    : [
        { p: 0,   r: 220, g: 180, b: 200 }, // light pink
        { p: 0.25,r: 200, g: 210, b: 230 }, // light blue
        { p: 0.5, r: 220, g: 240, b: 220 }, // light neutral green
        { p: 0.75,r: 180, g: 230, b: 180 }, // green
        { p: 1,   r: 140, g: 210, b: 140 }, // vibrant green
      ]

  // Find segment
  let i = 0
  while (i < stops.length - 2 && p > stops[i + 1].p) i++
  const lo = stops[i], hi = stops[i + 1]
  const t = (p - lo.p) / (hi.p - lo.p)
  const r = Math.round(lo.r + t * (hi.r - lo.r))
  const g = Math.round(lo.g + t * (hi.g - lo.g))
  const b = Math.round(lo.b + t * (hi.b - lo.b))
  return `rgb(${r},${g},${b})`
}

/** Compute per-column percentiles for all vehicles. */
export function computePercentiles(
  values: (number | null)[],
  direction: MetricDirection,
): (number | null)[] {
  const nonNull = values.filter((v): v is number => v !== null).sort((a, b) => a - b)
  if (nonNull.length === 0) return values.map(() => null)
  const min = nonNull[0], max = nonNull[nonNull.length - 1]
  const range = max - min

  return values.map(v => {
    if (v === null) return null
    if (range === 0) return 0.5
    return (v - min) / range
  })
}
