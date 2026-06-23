import { Link } from 'react-router-dom'
import type { ArticleProps } from '../types'
import { RankTable } from '../RankTable'
import { rankByMetric } from '../rankings'

export function MostEfficient({ vehicles, unitSystem }: ArticleProps) {
  const efficient = rankByMetric(vehicles, {
    metricId: 'consumption_90_summer', unit: 'Wh/km', direction: 'lower-better', unitSystem, limit: 15,
  })
  const unit = unitSystem === 'imperial' ? 'Wh/mi' : 'Wh/km'

  return (
    <div className="article-content">
      <p>
        Efficiency is the most under-rated number in an EV spec sheet. It is measured in watt-hours
        per kilometre ({unit}) — how much energy the car uses to travel a set distance — and it
        quietly determines your running costs, how often you stop on a road trip, and how much range
        you squeeze from every kilowatt-hour of battery. A more efficient car can out-range a rival
        with a much bigger, heavier, more expensive pack.
      </p>

      <h2>The most efficient EVs at 90 km/h</h2>
      <p>
        These cars sip the least energy at a steady 90 km/h in summer. Lower is better. The table is
        generated live from the current dataset.
      </p>
      <RankTable
        rows={efficient}
        valueHeader={`Consumption (${unit})`}
        caption="Steady 90 km/h, summer; lower is better. Source: Bjørn Nyland real-world tests."
      />

      <h2>What makes an EV efficient</h2>
      <p>Three factors dominate real-world efficiency, especially at motorway speed:</p>
      <ul>
        <li>
          <strong>Aerodynamics.</strong> Above about 70–80 km/h, pushing air aside is the single
          biggest energy cost. A low drag coefficient and small frontal area are why sleek saloons
          consistently beat tall SUVs of similar weight.
        </li>
        <li>
          <strong>Weight.</strong> Heavier cars need more energy to accelerate and climb, and put
          more load on the tyres. Efficiency leaders tend to be lighter, or to carry their weight
          well.
        </li>
        <li>
          <strong>Drivetrain and tyres.</strong> A single, well-tuned motor is usually more
          efficient at a cruise than dual-motor all-wheel drive, and low-rolling-resistance tyres on
          smaller wheels can swing consumption by a noticeable margin.
        </li>
      </ul>

      <h2>Why efficiency matters more than you think</h2>
      <p>
        Efficiency compounds. A car that uses 15% less energy travels 15% further on the same
        battery, costs roughly 15% less to charge, and — crucially — needs less time plugged in on a
        long trip, because it has to replace fewer kilowatt-hours. That is why some efficient cars
        with modest batteries post excellent <Link to="/guides/fastest-charging-evs-for-road-trips">
        road-trip times</Link> despite an unremarkable charging peak.
      </p>
      <p>
        To see efficiency alongside range, charging and price for any car, open the{' '}
        <Link to="/matrix">compare tool</Link> and sort by the Consumption column, or use the
        scatter view to plot efficiency against range and spot the standouts.
      </p>
    </div>
  )
}
