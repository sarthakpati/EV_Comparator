import { Link } from 'react-router-dom'
import type { ArticleProps } from '../types'
import { RankTable } from '../RankTable'
import { rankByMetric } from '../rankings'

export function RealWorldRange({ vehicles, unitSystem }: ArticleProps) {
  const top = rankByMetric(vehicles, {
    metricId: 'range_90_summer', unit: 'km', direction: 'higher-better', unitSystem, limit: 10,
  })
  return (
    <div className="article-content">
      <p>
        Range is the number every EV shopper looks at first — and the number most likely to mislead
        you. The figure on the window sticker comes from a laboratory cycle, not from the motorway
        you actually drive on. This guide explains why official range numbers run optimistic, how
        independent real-world testing closes the gap, and how to read the figures in this tool so
        you can compare cars honestly.
      </p>

      <h2>Why the sticker number is optimistic</h2>
      <p>
        Two test cycles dominate the industry. In Europe, cars are rated on <strong>WLTP</strong>
        (Worldwide Harmonised Light Vehicles Test Procedure); in the United States, the{' '}
        <strong>EPA</strong> cycle. Both blend city and highway driving at relatively moderate
        speeds, in mild temperatures, with climate control off or minimal. They are repeatable and
        useful for ranking cars against each other — but they are not a promise of how far you will
        go at 120 km/h on a cold day.
      </p>
      <p>
        WLTP in particular tends to overstate steady highway range, because a large share of the
        cycle is low-speed driving where EVs are extremely efficient. Drive the same car at a
        constant motorway speed and consumption climbs sharply, so the real distance falls well
        below the rated figure. EPA numbers are usually more conservative than WLTP, but they still
        assume gentler conditions than a real road trip.
      </p>

      <h2>What "real-world" testing measures instead</h2>
      <p>
        The data in this tool comes from <strong>Bjørn Nyland</strong>, an independent reviewer in
        Norway who has run a standardized test protocol since 2015. Instead of a lab cycle, he
        drives each car on public roads under controlled, repeatable conditions:
      </p>
      <ul>
        <li>
          <strong>Steady-speed range</strong> at a constant 90 km/h and 120 km/h, from near-full
          charge down to nearly empty — the closest thing to "how far can I actually cruise."
        </li>
        <li>
          <strong>Both seasons.</strong> Summer and winter runs capture how much cold weather costs
          you, which the lab cycles largely ignore.
        </li>
        <li>
          <strong>A full 1000 km road trip</strong> including every charging stop, which turns range
          and charging speed into a single, honest travel time.
        </li>
      </ul>
      <p>
        Because the method is the same for every car, the numbers are directly comparable in a way
        that mixing one brand's WLTP figure with another's EPA figure never is.
      </p>

      <h2>The longest real-world range, tested</h2>
      <p>
        Here are the cars that travel furthest at a steady 90 km/h in summer — the gentlest of the
        real-world conditions, and the fairest "best case" cruising figure. The table is generated
        live from the current dataset, so it updates as new tests are added.
      </p>
      <RankTable
        rows={top}
        valueHeader="Range @ 90 km/h"
        caption="Steady 90 km/h, summer conditions. Source: Bjørn Nyland real-world tests."
      />
      <p>
        Notice that the leaders are mostly large, aerodynamic saloons and efficient SUVs with big
        batteries — not the cars with the highest sticker numbers. Aerodynamics and efficiency
        matter as much as battery size once you are cruising.
      </p>

      <h2>How to read range in this tool</h2>
      <p>
        Open the <Link to="/matrix">compare tool</Link> and use the condition switcher to set the
        speed and season you care about; the Range column re-ranks instantly. A commuter who rarely
        exceeds 90 km/h should read the 90 km/h figure; someone who lives on the motorway should
        read 120 km/h, and anyone in a cold climate should check the winter column before trusting
        any range claim. For the full picture of how speed and weather interact, see{' '}
        <Link to="/guides/highway-speed-and-ev-range">highway speed and EV range</Link> and{' '}
        <Link to="/guides/ev-range-in-winter">how much range EVs lose in winter</Link>.
      </p>
    </div>
  )
}
