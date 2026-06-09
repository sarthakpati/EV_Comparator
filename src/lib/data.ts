import type { Dataset, Coverage } from './types'

let datasetCache: Dataset | null = null
let coverageCache: Coverage | null = null

export async function loadDataset(): Promise<Dataset> {
  if (datasetCache) return datasetCache
  const res = await fetch('/data/dataset.json')
  if (!res.ok) throw new Error(`Failed to load dataset: ${res.status}`)
  datasetCache = await res.json() as Dataset
  return datasetCache
}

export async function loadCoverage(): Promise<Coverage> {
  if (coverageCache) return coverageCache
  const res = await fetch('/data/coverage.json')
  if (!res.ok) throw new Error(`Failed to load coverage: ${res.status}`)
  coverageCache = await res.json() as Coverage
  return coverageCache
}
