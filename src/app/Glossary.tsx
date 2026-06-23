import { Link } from 'react-router-dom'
import { ContentLayout } from '../components/ContentLayout'
import { ContentAd } from '../components/ads/ContentAd'

interface Term { term: string; def: string }

const TERMS: Term[] = [
  { term: 'kWh (kilowatt-hour)', def: 'A unit of energy — effectively the "size of the fuel tank." An EV with a 75 kWh battery stores 75 kilowatt-hours of usable energy.' },
  { term: 'kW (kilowatt)', def: 'A unit of power — the rate of energy flow. It describes how fast a car charges (e.g. 150 kW) or how powerful its motor is.' },
  { term: 'Wh/km (or Wh/mi)', def: 'Energy consumption: watt-hours used to travel one kilometre (or mile). Lower is more efficient. The single best predictor of running cost and range.' },
  { term: 'Real-world range', def: 'Distance travelled on a charge under controlled, real driving conditions (constant speed, real weather) rather than a laboratory cycle.' },
  { term: 'WLTP', def: 'Worldwide Harmonised Light Vehicles Test Procedure — the European lab cycle used for official range and efficiency ratings. Tends to overstate real motorway range.' },
  { term: 'EPA range', def: 'The United States Environmental Protection Agency’s rated range, from a standardized lab cycle. Usually more conservative than WLTP but still gentler than a real road trip.' },
  { term: 'State of charge (SoC)', def: 'How full the battery is, as a percentage. Fast-charging is fastest at low SoC and slows as the battery fills.' },
  { term: 'Charging curve', def: 'How a car’s charging power changes with state of charge. A flat, sustained curve adds more range than a brief high peak that quickly tapers.' },
  { term: 'Charging taper', def: 'The deliberate slowdown of charging as the battery approaches full, which protects the cells. It is why the last 20% takes so long.' },
  { term: '10–80% charging', def: 'The usable fast-charging window most people use on a trip, avoiding the slow final 20%. Charging benchmarks focus on this range.' },
  { term: 'C-rate', def: 'Charging or discharging power relative to battery capacity. Charging a 75 kWh pack at 150 kW is a 2C rate.' },
  { term: '400V / 800V architecture', def: 'The battery system voltage. Higher-voltage (800V) systems sustain high charging power with less heat, enabling faster road-trip charging.' },
  { term: 'Effective charging speed', def: 'Range added per hour of charging at a typical session — a practical way to compare charging ability across cars.' },
  { term: '1000 km test', def: 'Bjørn Nyland’s flagship benchmark: total real-world time to drive 1000 km including all charging stops. The best summary of road-trip ability.' },
  { term: 'Banana box', def: 'A standard banana box (~40 × 30 × 24 cm) used as a repeatable, real-world unit of cargo volume — more meaningful than quoted litres.' },
  { term: 'Heat pump', def: 'An efficient climate system that moves heat rather than generating it electrically. It significantly reduces winter range loss.' },
  { term: 'Pre-conditioning', def: 'Warming (or cooling) the cabin and battery while still plugged in, so the energy comes from the grid and the battery is ready to charge or drive efficiently.' },
  { term: 'Regenerative braking', def: 'Recovering energy by using the motor as a generator when slowing down, feeding it back into the battery. Limited when the battery is cold or full.' },
  { term: 'Drivetrain (RWD / FWD / AWD)', def: 'Which wheels are driven: rear, front, or all. Single-motor RWD/FWD is usually more efficient at a cruise; dual-motor AWD adds traction and performance.' },
  { term: 'Drag coefficient (Cd)', def: 'A measure of how aerodynamic a car’s shape is. Lower Cd means less energy lost to air resistance at speed — crucial for highway range.' },
  { term: 'Frontal area', def: 'The size of the car’s "face" pushing through the air. Combined with drag coefficient, it determines aerodynamic energy loss.' },
  { term: 'MSRP', def: 'Manufacturer’s Suggested Retail Price — the starting list price before options, taxes, or incentives.' },
  { term: 'Price per range', def: 'Starting price divided by real-world range — a quick value measure showing what each kilometre (or mile) of range costs.' },
  { term: 'Battery degradation', def: 'The gradual, permanent loss of battery capacity over years and charge cycles, usually expressed as a percentage of original capacity.' },
  { term: 'Pareto frontier', def: 'In the scatter view, the set of cars that are not beaten on both axes at once — the "best trade-offs" between two metrics.' },
  { term: 'Segment (A–F)', def: 'A European size/class system, from small city cars (A/B) to executive and luxury saloons (E/F), used here to group comparable vehicles.' },
  { term: 'Usable vs gross capacity', def: 'Gross capacity is the total battery size; usable capacity is what you can actually access. Manufacturers reserve a buffer to protect the cells.' },
  { term: 'Vehicle-to-load (V2L)', def: 'The ability to power external devices or appliances from the car’s battery through an adapter or socket.' },
]

export function Glossary() {
  const half = Math.ceil(TERMS.length / 2)
  const render = (list: Term[]) => (
    <dl className="space-y-6">
      {list.map(({ term, def }) => (
        <div key={term}>
          <dt className="font-semibold text-slate-900 dark:text-slate-100">{term}</dt>
          <dd className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">{def}</dd>
        </div>
      ))}
    </dl>
  )

  return (
    <ContentLayout
      title="EV glossary"
      description="Plain-English definitions of the electric-car terms that matter — kWh, charging curve, WLTP, C-rate, heat pump, drag coefficient, and more."
      path="/glossary"
      lead="Plain-English definitions of the electric-car terms worth knowing before you compare or buy."
    >
      {render(TERMS.slice(0, half))}
      <ContentAd name="glossaryInline" />
      {render(TERMS.slice(half))}

      <p className="mt-10 text-sm text-slate-500 dark:text-slate-400">
        See these concepts in action in the <Link to="/guides" className="text-blue-600 dark:text-blue-400 hover:underline">guides</Link>,
        or compare real cars in the <Link to="/matrix" className="text-blue-600 dark:text-blue-400 hover:underline">tool</Link>.
      </p>
    </ContentLayout>
  )
}
