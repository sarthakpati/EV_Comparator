import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { Footer } from './Footer'
import { ContentAd } from '../components/ads/ContentAd'
import { RankTable } from '../features/guides/RankTable'
import { rankByMetric } from '../features/guides/rankings'
import { GUIDES } from '../features/guides/registry'
import type { Vehicle } from '../lib/types'
import type { UnitSystem } from '../lib/units'

interface HomeProps {
  vehicles: Vehicle[]
  unitSystem: UnitSystem
  market: string
}

const NON_BEV = /mirai|e-power|phev/i

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">{value}</div>
      <div className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">{label}</div>
    </div>
  )
}

function FeaturedCard({
  title, rows, valueHeader, href,
}: {
  title: string
  rows: ReturnType<typeof rankByMetric>
  valueHeader: string
  href: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <RankTable rows={rows} valueHeader={valueHeader} />
      <Link to={href} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
        Full ranking →
      </Link>
    </div>
  )
}

export function Home({ vehicles, unitSystem, market }: HomeProps) {
  const makes = new Set(vehicles.map(v => v.make)).size

  const longestRange = rankByMetric(vehicles, {
    metricId: 'range_90_summer', unit: 'km', direction: 'higher-better', unitSystem, limit: 5,
  })
  const mostEfficient = rankByMetric(vehicles, {
    metricId: 'consumption_90_summer', unit: 'Wh/km', direction: 'lower-better', unitSystem, limit: 5,
  })
  const fastestTrip = rankByMetric(vehicles, {
    metricId: 'roadtrip_1000km_time', unit: 'min', direction: 'lower-better',
    format: 'time', limit: 5, exclude: NON_BEV,
  })

  const featuredGuides = GUIDES.slice(0, 4)

  return (
    <main className="flex-1 overflow-auto bg-white dark:bg-slate-900 scrollbar-thin">
      <Seo path="/" />

      {/* Hero */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-blue-50/60 to-white dark:from-blue-950/20 dark:to-slate-900">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">
            Real-world data, not lab numbers
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100 max-w-3xl">
            Compare electric cars on how they actually perform
          </h1>
          <p className="mt-5 text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Range, charging speed, and efficiency for {makes} brands and hundreds of EVs — measured
            on real motorways by independent reviewer Bjørn Nyland, then put side by side so you can
            compare honestly. Free and open source.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/matrix"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-sm font-semibold transition-colors shadow-sm"
            >
              Open the compare tool →
            </Link>
            <Link
              to="/guides"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-5 py-2.5 text-sm font-semibold transition-colors"
            >
              Read the guides
            </Link>
          </div>
          <div className="mt-12 flex gap-10">
            <Stat value={`${vehicles.length}`} label="Cars tested" />
            <Stat value={`${makes}`} label="Brands" />
            <Stat value="Since 2015" label="Independent testing" />
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-14">
        {/* Why it's different */}
        <section className="max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Why real-world numbers matter
          </h2>
          <div className="article-content mt-4">
            <p>
              The range on an EV's window sticker comes from a laboratory cycle — WLTP in Europe, EPA
              in the United States — that blends gentle city and highway driving in mild weather.
              It's repeatable, but it isn't the motorway you actually drive on at speed, in the cold,
              with the heater running.
            </p>
            <p>
              Every figure here comes instead from a standardized real-world test: constant-speed
              range at 90 and 120 km/h, in summer and winter, plus a full 1000 km road trip including
              charging stops. Because every car is measured the same way, the comparisons are honest —
              unlike mixing one brand's WLTP figure with another's EPA number.{' '}
              <Link to="/guides/understanding-real-world-ev-range">
                Read how real-world range works →
              </Link>
            </p>
          </div>
        </section>

        {/* Featured rankings */}
        <section className="mt-14">
          <div className="flex items-end justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Featured rankings</h2>
            <Link to="/guides" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap">
              All guides →
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <FeaturedCard
              title="Longest real-world range"
              rows={longestRange}
              valueHeader="@ 90 km/h"
              href="/guides/longest-range-electric-cars"
            />
            <FeaturedCard
              title="Most efficient"
              rows={mostEfficient}
              valueHeader={unitSystem === 'imperial' ? 'Wh/mi' : 'Wh/km'}
              href="/guides/most-efficient-electric-cars"
            />
            <FeaturedCard
              title="Fastest 1000 km trip"
              rows={fastestTrip}
              valueHeader="h:mm"
              href="/guides/fastest-charging-evs-for-road-trips"
            />
          </div>
          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
            Generated live from Bjørn Nyland's test data. Steady-speed, summer conditions unless noted.
          </p>
        </section>

        <ContentAd name="homeInline" />

        {/* Guides preview */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Learn before you buy
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {featuredGuides.map(g => (
              <Link
                key={g.meta.slug}
                to={`/guides/${g.meta.slug}`}
                className="group block rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all"
              >
                <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {g.meta.category}
                </span>
                <h3 className="mt-1.5 font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                  {g.meta.title}
                </h3>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {g.meta.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Methodology teaser */}
        <section className="mt-14 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Where the data comes from
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            All performance figures are from <strong>Bjørn Nyland</strong>, an independent EV reviewer
            in Norway who has published systematic, real-world tests since 2015. We reproduce his data
            with attribution and add market context (prices, availability). Read about the test
            methodology, what each metric means, and our data sources on the{' '}
            <Link to="/about" className="text-blue-600 dark:text-blue-400 hover:underline">
              About &amp; methodology
            </Link>{' '}
            page.
          </p>
        </section>
      </div>

      <Footer />
    </main>
  )
}
