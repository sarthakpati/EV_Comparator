import { useState } from 'react'
import type { MetricDef, MetricGroup } from '../../lib/types'
import { Button } from '../../components/ui/Button'

const GROUP_LABELS: Record<MetricGroup, string> = {
  range: 'Range', efficiency: 'Efficiency', charging: 'Charging',
  performance: 'Performance', comfort: 'Comfort', practicality: 'Practicality',
  battery: 'Battery', cost: 'Cost',
}

const PRESETS: Record<string, string[]> = {
  'Road-trip': ['range_90_summer', 'roadtrip_1000km_time', 'roadtrip_avg_speed', 'charge_time_75pct', 'price_usd'],
  'Performance': ['accel_0_100', 'hp', 'weight_kg', 'braking_distance'],
  'Efficiency': ['consumption_90_summer', 'consumption_120_summer', 'range_90_summer', 'range_120_summer'],
  'Family': ['cargo_trunk', 'cargo_seats_folded', 'noise_avg', 'weight_kg', 'price_usd'],
}

interface ColumnPickerProps {
  metrics: MetricDef[]
  visible: string[]
  onChange: (ids: string[]) => void
  onClose: () => void
}

export function ColumnPicker({ metrics, visible, onChange, onClose }: ColumnPickerProps) {
  const [selected, setSelected] = useState(new Set(visible))

  const grouped = metrics.reduce<Record<string, MetricDef[]>>((acc, m) => {
    if (!acc[m.group]) acc[m.group] = []
    acc[m.group].push(m)
    return acc
  }, {})

  const toggle = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id); else next.add(id)
    setSelected(next)
  }

  const applyPreset = (ids: string[]) => {
    setSelected(new Set(ids))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col m-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Choose Columns</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
        </div>

        {/* Presets */}
        <div className="px-6 py-3 border-b flex gap-2 flex-wrap">
          <span className="text-xs font-medium text-slate-500 self-center">Presets:</span>
          {Object.entries(PRESETS).map(([name, ids]) => (
            <button
              key={name}
              onClick={() => applyPreset(ids)}
              className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-slate-700 dark:text-slate-300 transition-colors"
            >
              {name}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-6">
          {(Object.keys(GROUP_LABELS) as MetricGroup[]).map(group => {
            const mets = grouped[group]
            if (!mets || mets.length === 0) return null
            return (
              <div key={group}>
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  {GROUP_LABELS[group]}
                </h3>
                <div className="grid grid-cols-2 gap-1.5">
                  {mets.map(m => (
                    <label key={m.id} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selected.has(m.id)}
                        onChange={() => toggle(m.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {m.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex justify-between items-center px-6 py-4 border-t">
          <span className="text-sm text-slate-500">{selected.size} selected</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={() => { onChange([...selected]); onClose() }}>
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
