import { Link } from 'react-router-dom'
import type { ArticleProps } from '../types'
import { RankTable } from '../RankTable'
import { rankByMetric, meanLoss } from '../rankings'

export function HighwaySpeed({ vehicles, unitSystem }: ArticleProps) {
  const { mean, count } = meanLoss(
    vehicles, 'range_90_summer', 'range_120_summer',
    { speed: 90, season: 'summer' }, { speed: 120, season: 'summer' },
    { clampGains: true },
  )
  const pct = Math.round(mean * 100)
  const best120 = rankByMetric(vehicles, {
    metricId: 'range_120_summer', unit: 'km', direction: 'higher-better', unitSystem, limit: 10,
  })

  return (
    <div className="article-content">
      <p>
        The fastest way to drain an electric car is to drive it fast. In Bjørn Nyland's data, going
        from a steady 90 km/h to 120 km/h costs the average car about <strong>{pct}%</strong> of its
        range ({count} cars tested at both speeds, summer conditions). Understanding why explains a
        lot about how to plan a trip — and which cars to trust on the motorway.
      </p>

      <h2>The physics: drag rises with the square of speed</h2>
      <p>
        At low speed, most of an EV's energy goes into rolling resistance and accessories. Once you
        are cruising, the dominant cost is aerodynamic drag — and drag force grows with the{' '}
        <em>square</em> of speed, while the power needed to overcome it grows with the{' '}
        <em>cube</em>. Going 33% faster (90 → 120 km/h) therefore demands far more than 33% more
        energy per kilometre. That is the single biggest reason the WLTP and EPA sticker numbers,
        which include lots of slower driving, overstate true motorway range.
      </p>

      <h2>Why some cars lose less than others</h2>
      <p>
        The cars that hold their range best at speed are the slippery ones: a low drag coefficient
        and a small frontal area beat brute battery size. That is why aerodynamic saloons keep more
        of their range at 120 km/h than tall, boxy SUVs with the same pack. Here are the cars that go
        furthest at a steady 120 km/h:
      </p>
      <RankTable
        rows={best120}
        valueHeader="Range @ 120 km/h"
        caption="Steady 120 km/h, summer. Source: Bjørn Nyland real-world tests."
      />

      <h2>What this means for your driving</h2>
      <ul>
        <li>
          <strong>Match the number to your speed.</strong> If you cruise at 120–130 km/h, read the
          120 km/h column, not the headline range. The gap is large.
        </li>
        <li>
          <strong>Easing off pays back quickly.</strong> Dropping from 120 to 110 km/h on a long
          drive can claw back meaningful range and shave a charging stop, because of that
          cube-law relationship.
        </li>
        <li>
          <strong>Aero beats battery for motorway range.</strong> Two cars with the same battery can
          differ by 100 km or more at speed purely on shape and efficiency.
        </li>
      </ul>

      <p>
        Compare any car at both speeds using the condition switcher in the{' '}
        <Link to="/matrix">compare tool</Link>, and see{' '}
        <Link to="/guides/most-efficient-electric-cars">the most efficient EVs</Link> for the cars
        that waste the least energy at a cruise.
      </p>
    </div>
  )
}
