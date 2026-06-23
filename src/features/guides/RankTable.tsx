import { clsx } from 'clsx'
import type { RankRow } from './rankings'

interface RankTableProps {
  rows: RankRow[]
  /** Header for the value column, e.g. "Range @ 90 km/h". */
  valueHeader: string
  caption?: string
}

/** A compact, styled ranking table for data-driven content sections. */
export function RankTable({ rows, valueHeader, caption }: RankTableProps) {
  if (rows.length === 0) {
    return (
      <p className="my-6 text-sm text-slate-500 dark:text-slate-400 italic">
        Ranking data is loading or unavailable.
      </p>
    )
  }
  return (
    <figure className="my-6 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/60 text-left">
            <th className="px-3 py-2.5 w-10 font-semibold text-slate-500 dark:text-slate-400">#</th>
            <th className="px-3 py-2.5 font-semibold text-slate-700 dark:text-slate-300">Vehicle</th>
            <th className="px-3 py-2.5 text-right font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
              {valueHeader}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.id}
              className={clsx(
                'border-t border-slate-100 dark:border-slate-800',
                i === 0 && 'bg-amber-50/60 dark:bg-amber-950/20',
              )}
            >
              <td className="px-3 py-2.5 text-slate-400 dark:text-slate-500 tabular-nums">{i + 1}</td>
              <td className="px-3 py-2.5 font-medium text-slate-800 dark:text-slate-200">{r.name}</td>
              <td className="px-3 py-2.5 text-right tabular-nums font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                {r.label}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {caption && (
        <figcaption className="px-3 py-2 text-xs text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
