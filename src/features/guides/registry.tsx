import type { Guide } from './types'
import { RealWorldRange } from './articles/realWorldRange'
import { LongestRange } from './articles/longestRange'
import { MostEfficient } from './articles/mostEfficient'
import { RangeWinter } from './articles/rangeWinter'
import { HighwaySpeed } from './articles/highwaySpeed'
import { FastestCharging } from './articles/fastestCharging'
import { BestValue } from './articles/bestValue'
import { ChargingExplained } from './articles/chargingExplained'

const UPDATED = '2026-06-23'

/**
 * The guide library. Order here is the order shown on the /guides index.
 * Slugs are stable URLs — changing one breaks inbound links and the sitemap.
 */
export const GUIDES: Guide[] = [
  {
    meta: {
      slug: 'understanding-real-world-ev-range',
      title: 'Understanding real-world EV range (and why EPA & WLTP mislead)',
      description:
        'Why official EV range numbers run optimistic, how independent real-world testing closes the gap, and how to read the figures in this tool.',
      category: 'Explainers',
      updated: UPDATED,
      readingTime: '5 min read',
      dataDriven: true,
    },
    Body: RealWorldRange,
  },
  {
    meta: {
      slug: 'longest-range-electric-cars',
      title: 'The longest-range electric cars, by real-world test',
      description:
        'The EVs that travel furthest on a real motorway — ranked at 90 km/h, 120 km/h, and in winter — from Bjørn Nyland’s constant-speed tests.',
      category: 'Rankings',
      updated: UPDATED,
      readingTime: '4 min read',
      dataDriven: true,
    },
    Body: LongestRange,
  },
  {
    meta: {
      slug: 'most-efficient-electric-cars',
      title: 'The most efficient electric cars (real-world Wh/km)',
      description:
        'The EVs that use the least energy at a steady cruise, why efficiency drives range and charging time, and what makes a car efficient.',
      category: 'Rankings',
      updated: UPDATED,
      readingTime: '4 min read',
      dataDriven: true,
    },
    Body: MostEfficient,
  },
  {
    meta: {
      slug: 'fastest-charging-evs-for-road-trips',
      title: 'The fastest-charging EVs for road trips',
      description:
        'Why charging speed beats maximum range on a long drive, ranked by real 1000 km road-trip time and effective charging speed.',
      category: 'Rankings',
      updated: UPDATED,
      readingTime: '5 min read',
      dataDriven: true,
    },
    Body: FastestCharging,
  },
  {
    meta: {
      slug: 'ev-range-in-winter',
      title: 'How much range do EVs lose in winter?',
      description:
        'Measured cold-weather range loss across cars tested in both seasons, why it happens, and how to lose less of it.',
      category: 'Explainers',
      updated: UPDATED,
      readingTime: '4 min read',
      dataDriven: true,
    },
    Body: RangeWinter,
  },
  {
    meta: {
      slug: 'highway-speed-and-ev-range',
      title: 'Highway speed and EV range: 90 vs 120 km/h',
      description:
        'How much range you lose by driving faster, the physics behind it, and which cars hold their range best at motorway speed.',
      category: 'Explainers',
      updated: UPDATED,
      readingTime: '4 min read',
      dataDriven: true,
    },
    Body: HighwaySpeed,
  },
  {
    meta: {
      slug: 'best-value-electric-cars',
      title: 'Best value EVs: price per mile of real range',
      description:
        'A simple, honest value measure — starting price divided by real-world range — plus what it leaves out before you buy.',
      category: 'Buying',
      updated: UPDATED,
      readingTime: '4 min read',
      dataDriven: true,
    },
    Body: BestValue,
  },
  {
    meta: {
      slug: 'ev-charging-explained',
      title: 'EV charging explained: kW, curves, and 800V',
      description:
        'The handful of charging concepts that actually matter — power, the charging curve, the 10–80% rule, C-rate, and architecture.',
      category: 'Explainers',
      updated: UPDATED,
      readingTime: '5 min read',
    },
    Body: ChargingExplained,
  },
]

export function getGuide(slug: string | undefined): Guide | undefined {
  return GUIDES.find(g => g.meta.slug === slug)
}

/** Slugs in index order — used to build the sitemap and prev/next links. */
export const GUIDE_SLUGS = GUIDES.map(g => g.meta.slug)
