import type { ComponentType } from 'react'
import type { Vehicle } from '../../lib/types'
import type { UnitSystem } from '../../lib/units'

/** Props passed to every guide article body so data-driven sections can render live tables. */
export interface ArticleProps {
  vehicles: Vehicle[]
  unitSystem: UnitSystem
  market: string
}

export interface GuideMeta {
  slug: string
  title: string
  /** One-sentence summary — used for the card blurb and the meta description. */
  description: string
  category: 'Rankings' | 'Explainers' | 'Buying'
  /** ISO date, shown as "Updated …". */
  updated: string
  readingTime: string
  /** True when the article contains tables computed from the live dataset. */
  dataDriven?: boolean
}

export interface Guide {
  meta: GuideMeta
  Body: ComponentType<ArticleProps>
}
