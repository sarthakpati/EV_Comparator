import { create } from 'zustand'
import type { Dataset, Vehicle, MetricDef } from '../lib/types'

interface AppState {
  dataset: Dataset | null
  loading: boolean
  error: string | null
  compareSet: Set<string>

  setDataset: (d: Dataset) => void
  setLoading: (v: boolean) => void
  setError: (e: string | null) => void
  toggleCompare: (vehicleId: string) => void
  clearCompare: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
  dataset: null,
  loading: true,
  error: null,
  compareSet: new Set(),

  setDataset: (d) => set({ dataset: d, loading: false }),
  setLoading: (v) => set({ loading: v }),
  setError: (e) => set({ error: e, loading: false }),

  toggleCompare: (id) => {
    const next = new Set(get().compareSet)
    if (next.has(id)) {
      next.delete(id)
    } else if (next.size < 5) {
      next.add(id)
    }
    set({ compareSet: next })
  },
  clearCompare: () => set({ compareSet: new Set() }),
}))

// Derived selectors
export const selectVehicles = (state: AppState): Vehicle[] =>
  state.dataset?.vehicles ?? []

export const selectMetrics = (state: AppState): MetricDef[] =>
  state.dataset?.metrics ?? []
