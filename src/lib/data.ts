import type { Dataset, Coverage } from './types'
import { DERIVED_METRICS } from './derived'

let datasetCache: Dataset | null = null
let coverageCache: Coverage | null = null

export async function loadDataset(): Promise<Dataset> {
  if (datasetCache) return datasetCache
  const res = await fetch('/data/dataset.json')
  if (!res.ok) throw new Error(`Failed to load dataset: ${res.status}`)
  const ds = await res.json() as Dataset
  // Merge in render-computed derived metrics (Real Range, Consumption, Price/Range)
  // so they appear in the column picker, sort rail, presets and compare like any metric.
  const have = new Set(ds.metrics.map(m => m.id))
  for (const m of DERIVED_METRICS) if (!have.has(m.id)) ds.metrics.push(m)
  datasetCache = ds
  return datasetCache
}

export async function loadCoverage(): Promise<Coverage> {
  if (coverageCache) return coverageCache
  const res = await fetch('/data/coverage.json')
  if (!res.ok) throw new Error(`Failed to load coverage: ${res.status}`)
  coverageCache = await res.json() as Coverage
  return coverageCache
}
