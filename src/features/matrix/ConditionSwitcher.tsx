import type { Condition } from '../../lib/types'

interface ConditionSwitcherProps {
  condition: Partial<Condition>
  onChange: (c: Partial<Condition>) => void
}

const SEG = 'px-2 py-1 text-xs font-medium rounded-md transition-all'

/**
 * EV Database-style conditional-range control. Range & Consumption columns
 * (and the detail grid) re-key to the chosen speed × season. Kept honest to
 * Bjørn Nyland's actual steady-speed test conditions rather than inventing
 * a city/highway split the data doesn't have.
 */
export function ConditionSwitcher({ condition, onChange }: ConditionSwitcherProps) {
  const speed = condition.speed === 120 ? 120 : 90
  const season = condition.season === 'winter' ? 'winter' : 'summer'

  return (
    <div className="flex items-center gap-1.5" title="Range & Consumption columns re-key to these conditions">
      <span className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500 font-semibold hidden md:inline">
        Conditions
      </span>
      <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
        {([90, 120] as const).map(s => (
          <button
            key={s}
            onClick={() => onChange({ ...condition, speed: s })}
            className={`${SEG} ${speed === s
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
            aria-pressed={speed === s}
          >
            {s} km/h
          </button>
        ))}
      </div>
      <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
        {([['summer', '☀️ Summer'], ['winter', '❄️ Winter']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => onChange({ ...condition, season: key })}
            className={`${SEG} ${season === key
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
            aria-pressed={season === key}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
