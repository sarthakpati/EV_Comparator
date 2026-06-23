import { Link } from 'react-router-dom'
import type { ArticleProps } from '../types'
import { RankTable } from '../RankTable'
import { rankByMetric } from '../rankings'

// Bjørn's dataset includes a few non-plug-in reference cars (a hydrogen fuel-cell
// Mirai, petrol "e-Power" hybrids). They refuel like a petrol car, so including them
// in a charging-speed ranking would be misleading — exclude them by name.
const NON_BEV = /mirai|e-power|phev/i

export function FastestCharging({ vehicles, unitSystem }: ArticleProps) {
  const roadtrip = rankByMetric(vehicles, {
    metricId: 'roadtrip_1000km_time', unit: 'min', direction: 'lower-better',
    format: 'time', limit: 12, exclude: NON_BEV,
  })
  const effSpeed = rankByMetric(vehicles, {
    metricId: 'charge_speed_75pct', unit: 'km/h', direction: 'higher-better',
    unitSystem, limit: 10, exclude: NON_BEV,
  })

  return (
    <div className="article-content">
      <p>
        For long-distance driving, charging speed matters more than maximum range. A car with a
        modest battery that charges quickly will often beat a long-range car that charges slowly,
        because you spend less of your trip parked at a charger. Bjørn Nyland's 1000 km road-trip
        test captures exactly this — the total time to cover 1000 km including every charging stop.
      </p>

      <h2>Fastest 1000 km road-trip time</h2>
      <p>
        Lower is better: this is real elapsed time, driving plus charging, over a fixed 1000 km
        route. It is the single best summary of road-trip ability because it folds range, charging
        speed, and efficiency into one honest number.
      </p>
      <RankTable
        rows={roadtrip}
        valueHeader="1000 km time (h:mm)"
        caption="Total time incl. charging stops; lower is better. Hydrogen/hybrid reference cars excluded. Source: Bjørn Nyland."
      />
      <p>
        A note on the leaders: cars from <strong>Nio</strong> can use battery <em>swap</em> stations,
        which replace the whole pack in minutes rather than charging it, so their road-trip times
        reflect that infrastructure rather than charging speed alone. Where swap stations do not
        exist, their real-world times will differ.
      </p>

      <h2>What makes an EV charge fast</h2>
      <ul>
        <li>
          <strong>High peak power — but the curve matters more.</strong> A car that holds a high
          charging rate from 10% to 70% adds more range than one that briefly spikes then tapers.
        </li>
        <li>
          <strong>800-volt architecture.</strong> Higher-voltage systems can sustain high power with
          less heat, which is why several of the quickest road-trippers use 800 V packs.
        </li>
        <li>
          <strong>Efficiency.</strong> An efficient car needs fewer kilowatt-hours to go the same
          distance, so even at the same charging power it is "done" sooner. This is why some efficient
          cars punch above their charging peak — see{' '}
          <Link to="/guides/most-efficient-electric-cars">the most efficient EVs</Link>.
        </li>
        <li>
          <strong>Battery pre-conditioning.</strong> A pack warmed to its ideal window before arrival
          accepts far more power, which is why cold-weather charging is slower.
        </li>
      </ul>

      <h2>Effective charging speed</h2>
      <p>
        Another way to read charging ability is "effective speed" — how many kilometres of range you
        gain per hour of charging at a typical session. Higher is better:
      </p>
      <RankTable
        rows={effSpeed}
        valueHeader="Effective speed"
        caption="Range gained per hour around the 75% point; higher is better. Source: Bjørn Nyland."
      />

      <p>
        Plan a realistic trip by opening the <Link to="/matrix">compare tool</Link> and sorting by
        the 1000 km time or charging columns, then narrow to cars sold in your market. For the
        underlying concepts, read <Link to="/guides/ev-charging-explained">EV charging explained</Link>.
      </p>
    </div>
  )
}
