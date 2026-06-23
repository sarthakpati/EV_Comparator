import { Link } from 'react-router-dom'
import type { ArticleProps } from '../types'
import { RankTable } from '../RankTable'
import { rankByWinterRetention, meanLoss } from '../rankings'

export function RangeWinter({ vehicles, unitSystem }: ArticleProps) {
  const retention = rankByWinterRetention(vehicles, unitSystem, 12)
  const { mean, count } = meanLoss(
    vehicles, 'range_90_summer', 'range_90_winter',
    { speed: 90, season: 'summer' }, { speed: 90, season: 'winter' },
    { clampGains: true },
  )
  const pct = Math.round(mean * 100)

  return (
    <div className="article-content">
      <p>
        Every EV loses range in the cold — the only question is how much. Because Bjørn Nyland runs
        the same constant-speed test in both summer and winter, his data lets us measure the gap
        directly instead of guessing. Across the {count} cars tested at 90 km/h in both seasons, the
        average car gave up about <strong>{pct}%</strong> of its summer range in winter conditions.
      </p>

      <h2>Why cold weather costs you range</h2>
      <p>Several effects stack up at once when the temperature drops:</p>
      <ul>
        <li>
          <strong>Battery chemistry slows down.</strong> Lithium-ion cells deliver and accept energy
          less readily when cold, which reduces usable capacity and limits regenerative braking until
          the pack warms up.
        </li>
        <li>
          <strong>Cabin heating draws real power.</strong> Unlike a petrol car, an EV has no waste
          engine heat, so warming the cabin can pull a kilowatt or more straight from the battery.
        </li>
        <li>
          <strong>Battery pre-conditioning and heating.</strong> The car spends energy keeping the
          pack in its happy temperature window, especially before fast charging.
        </li>
        <li>
          <strong>Denser air and winter tyres.</strong> Cold air adds aerodynamic drag and winter
          rubber adds rolling resistance — small effects individually, but they add up.
        </li>
      </ul>

      <h2>Which cars cope best with the cold</h2>
      <p>
        These cars retained the largest share of their summer range in winter testing — lower
        percentage loss is better. A modern <strong>heat pump</strong>, good battery thermal
        management, and efficient packaging are the common threads.
      </p>
      <RankTable
        rows={retention}
        valueHeader="Winter range · loss"
        caption="90 km/h, winter range and % lost vs the same car's summer figure. Source: Bjørn Nyland."
      />

      <h2>How to lose less range in winter</h2>
      <ul>
        <li><strong>Pre-condition while plugged in</strong> so heating the cabin and battery draws from the grid, not your range.</li>
        <li><strong>Use seat and steering-wheel heaters</strong> instead of blasting cabin air — they warm you for a fraction of the energy.</li>
        <li><strong>Pre-heat the battery before fast charging</strong> so it accepts a higher charging rate in the cold.</li>
        <li><strong>Plan for the winter number, not the summer one.</strong> If your route is tight on range in July, it will not work in January.</li>
      </ul>

      <p>
        Want the cold-weather figure for a specific car? Open the{' '}
        <Link to="/matrix">compare tool</Link>, set the condition switcher to winter, and the Range
        and Consumption columns re-rank for cold conditions. See also{' '}
        <Link to="/guides/longest-range-electric-cars">the longest-range EVs</Link> for the cars that
        keep the most usable distance when it counts.
      </p>
    </div>
  )
}
