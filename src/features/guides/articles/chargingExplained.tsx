import { Link } from 'react-router-dom'
import type { ArticleProps } from '../types'

export function ChargingExplained(_props: ArticleProps) {
  return (
    <div className="article-content">
      <p>
        Charging is where EVs feel most different from petrol cars, and where the jargon is
        thickest. This guide explains the handful of concepts that actually matter — power, the
        charging curve, the 10–80% rule, and architecture — so you can read charging numbers with
        confidence.
      </p>

      <h2>Power: kilowatts, not just "fast"</h2>
      <p>
        Charging speed is measured in kilowatts (kW) — the rate of energy transfer. Home charging is
        typically 7–11 kW; public rapid chargers run from 50 kW to 350 kW. But a charger's maximum
        and a car's maximum are two different things: you only ever get the lower of the two. Plug a
        car that peaks at 150 kW into a 350 kW charger and it still charges at 150 kW.
      </p>

      <h2>The charging curve matters more than the peak</h2>
      <p>
        A battery does not charge at a constant rate. It accepts the most power when fairly empty,
        then tapers as it fills to protect the cells — this profile is the <strong>charging
        curve</strong>. A car that holds 150 kW steadily from 10% to 70% can add more range in ten
        minutes than a car that briefly spikes to 250 kW and then collapses. When you compare cars,
        a flat, sustained curve beats a tall, narrow spike. This is exactly why a single "peak kW"
        figure is a poor guide, and why a real road-trip test tells you more.
      </p>

      <h2>Why everyone charges to 80%</h2>
      <p>
        Because of the taper, the last 20% can take as long as the first 80%. On a road trip it is
        usually faster to stop more often and charge in the quick 10–80% window than to wait for a
        full battery. That is also why charging benchmarks — including the ones in this tool —
        focus on the usable middle of the curve rather than a 100% charge.
      </p>

      <h2>C-rate: speed relative to battery size</h2>
      <p>
        A "C-rate" expresses charging power relative to capacity. Charging a 75 kWh battery at 150 kW
        is a 2C rate; the same 150 kW into a 100 kWh battery is 1.5C. A bigger battery can absorb
        more kW for the same stress on the cells, which is one reason large packs often post higher
        peak charging numbers — but, again, what you feel on a trip is the curve and the car's
        efficiency, not the headline.
      </p>

      <h2>400 V vs 800 V architecture</h2>
      <p>
        Most EVs use a roughly 400-volt system; a growing number use 800 V. Higher voltage moves the
        same power with less current, which means less heat and the ability to sustain high charging
        rates for longer. It also enables faster, lighter wiring. An 800 V car on a capable charger is
        often the difference between a relaxed road trip and a frustrating one.
      </p>

      <h2>Efficiency closes the loop</h2>
      <p>
        Finally, remember that charging only exists to replace the energy you used. A more{' '}
        <Link to="/guides/most-efficient-electric-cars">efficient car</Link> needs fewer
        kilowatt-hours to go the same distance, so it spends less time charging even at the same
        power. Range, efficiency, and charging are not separate stats — they combine into the only
        number that really matters on a long drive, which is total travel time. See{' '}
        <Link to="/guides/fastest-charging-evs-for-road-trips">the fastest-charging EVs for road
        trips</Link> to see how it all nets out.
      </p>
    </div>
  )
}
