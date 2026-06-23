import { Link } from 'react-router-dom'
import type { ArticleProps } from '../types'
import { RankTable } from '../RankTable'
import { rankByMetric } from '../rankings'

export function LongestRange({ vehicles, unitSystem }: ArticleProps) {
  const summer90 = rankByMetric(vehicles, {
    metricId: 'range_90_summer', unit: 'km', direction: 'higher-better', unitSystem, limit: 15,
  })
  const summer120 = rankByMetric(vehicles, {
    metricId: 'range_120_summer', unit: 'km', direction: 'higher-better', unitSystem, limit: 10,
  })
  const winter90 = rankByMetric(vehicles, {
    metricId: 'range_90_winter', unit: 'km', direction: 'higher-better',
    unitSystem, limit: 10, condition: { speed: 90, season: 'winter' },
  })

  return (
    <div className="article-content">
      <p>
        Which electric cars actually go the furthest on a single charge — not on paper, but on a
        real motorway? These rankings come from Bjørn Nyland's standardized constant-speed range
        tests, so every car is measured the same way. All tables are generated live from the current
        dataset and re-rank as new tests are added.
      </p>

      <h2>Longest range at 90 km/h (summer)</h2>
      <p>
        This is the fairest "best case" cruising figure: a steady 90 km/h in mild weather. It rewards
        a combination of battery size and efficiency, which is why the leaderboard is dominated by
        slippery saloons and well-packaged SUVs rather than simply the cars with the biggest packs.
      </p>
      <RankTable
        rows={summer90}
        valueHeader="Range @ 90 km/h"
        caption="Steady 90 km/h, summer. Source: Bjørn Nyland real-world tests."
      />

      <h2>Longest range at 120 km/h (summer)</h2>
      <p>
        Raise the speed to 120 km/h and the order shifts. Aerodynamic drag rises with the square of
        speed, so the most slippery cars hold on to their range best while boxier vehicles fall back.
        If you spend most of your miles at motorway speed, this is the table to trust.
      </p>
      <RankTable
        rows={summer120}
        valueHeader="Range @ 120 km/h"
        caption="Steady 120 km/h, summer. Source: Bjørn Nyland real-world tests."
      />

      <h2>Longest range in winter (90 km/h)</h2>
      <p>
        Cold weather is where range claims go to die. These cars retain the most usable distance in
        winter conditions — a mix of large batteries and efficient heat-pump climate systems. For
        the full breakdown of cold-weather losses, see{' '}
        <Link to="/guides/ev-range-in-winter">how much range EVs lose in winter</Link>.
      </p>
      <RankTable
        rows={winter90}
        valueHeader="Range @ 90 km/h (winter)"
        caption="Steady 90 km/h, winter. Source: Bjørn Nyland real-world tests."
      />

      <h2>How to use these rankings</h2>
      <p>
        A long maximum range is only useful if it matches your driving. Before you fixate on the top
        of any list, decide which row applies to you: a 90 km/h commuter and a 120 km/h motorway
        driver in a cold climate are shopping for very different cars. Open the{' '}
        <Link to="/matrix">compare tool</Link> to filter by body type, segment, or market and re-rank
        on the exact condition you drive in. And remember that the longest range rarely means the
        best road-trip car — fast charging often matters more, as we cover in{' '}
        <Link to="/guides/fastest-charging-evs-for-road-trips">the fastest-charging EVs for road
        trips</Link>.
      </p>
    </div>
  )
}
