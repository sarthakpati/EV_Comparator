import { Link } from 'react-router-dom'
import type { ArticleProps } from '../types'
import { RankTable } from '../RankTable'
import { rankByValue } from '../rankings'

export function BestValue({ vehicles }: ArticleProps) {
  // Starting prices are only well covered for the US market, so anchor the value
  // table there and label it clearly rather than showing empty rows for markets
  // we don't have prices for.
  const value = rankByValue(vehicles, 'US', 'imperial', 12)

  return (
    <div className="article-content">
      <p>
        "Value" in an EV is easy to feel and hard to define. One useful, honest measure is{' '}
        <strong>price per unit of real-world range</strong>: take the starting price and divide it by
        how far the car actually travels on a charge. It tells you what each mile of usable range
        costs you — a quick way to spot cars that deliver a lot of capability per dollar.
      </p>

      <h2>Best value: price per mile of real range</h2>
      <p>
        Lower is better — fewer dollars per mile of range. These figures use US starting prices
        (pre-incentive) and real-world range at a steady 90 km/h.
      </p>
      <RankTable
        rows={value}
        valueHeader="Price / mile of range"
        caption="US starting MSRP ÷ real-world range. Lower is better. Pricing coverage is partial — see note below."
      />
      <blockquote>
        Price data is community-maintained and currently best for the US market, so this ranking
        covers the subset of cars with a known starting price. Treat it as a starting point, not the
        last word — always confirm current pricing and incentives with the manufacturer.
      </blockquote>

      <h2>Why price-per-range beats sticker price alone</h2>
      <p>
        A cheap car with very little range is not necessarily good value, and an expensive car with
        huge range can be. Dividing one by the other normalizes the comparison. It rewards cars that
        are efficient and sensibly priced, and it exposes cars that charge a premium for a badge
        rather than for capability.
      </p>

      <h2>What price-per-range leaves out</h2>
      <p>
        No single number captures value completely. Before you decide, weigh the factors this metric
        ignores:
      </p>
      <ul>
        <li><strong>Charging speed</strong> — vital for road trips; a long-range car that charges slowly can still be tiring to travel in. See <Link to="/guides/fastest-charging-evs-for-road-trips">road-trip charging</Link>.</li>
        <li><strong>Efficiency and running costs</strong> — a more <Link to="/guides/most-efficient-electric-cars">efficient car</Link> is cheaper to live with over years of driving.</li>
        <li><strong>Incentives and total cost of ownership</strong> — tax credits, insurance, depreciation, and home-charging access can dwarf the sticker gap.</li>
        <li><strong>Space, comfort, and winter range</strong> — practical fit for your life matters more than any ratio.</li>
      </ul>

      <p>
        Build your own value view in the <Link to="/matrix">compare tool</Link>: switch to your
        market to localize prices and units, then sort by the Price / Range column to rank every car
        we have a price for.
      </p>
    </div>
  )
}
