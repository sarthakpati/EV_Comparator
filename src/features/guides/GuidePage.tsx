import { Link, useParams } from 'react-router-dom'
import { ContentLayout } from '../../components/ContentLayout'
import { ContentAd } from '../../components/ads/ContentAd'
import { getGuide, GUIDES } from './registry'
import type { Vehicle } from '../../lib/types'
import type { UnitSystem } from '../../lib/units'

interface GuidePageProps {
  vehicles: Vehicle[]
  unitSystem: UnitSystem
  market: string
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function GuidePage({ vehicles, unitSystem, market }: GuidePageProps) {
  const { slug } = useParams<{ slug: string }>()
  const guide = getGuide(slug)

  if (!guide) {
    return (
      <ContentLayout
        title="Guide not found"
        description="This guide could not be found."
        path={`/guides/${slug ?? ''}`}
        breadcrumb={{ label: 'All guides', to: '/guides' }}
      >
        <div className="article-content">
          <p>
            We couldn’t find that guide. It may have moved or been renamed.{' '}
            <Link to="/guides">Browse all guides</Link>.
          </p>
        </div>
      </ContentLayout>
    )
  }

  const { meta, Body } = guide
  const related = GUIDES.filter(g => g.meta.slug !== meta.slug).slice(0, 3)

  return (
    <ContentLayout
      title={meta.title}
      description={meta.description}
      path={`/guides/${meta.slug}`}
      type="article"
      breadcrumb={{ label: 'All guides', to: '/guides' }}
    >
      <p className="-mt-4 mb-6 text-sm text-slate-400 dark:text-slate-500">
        {meta.category} · {meta.readingTime} · Updated {formatDate(meta.updated)}
        {meta.dataDriven && ' · Live data'}
      </p>

      <ContentAd name="guideTop" />

      <Body vehicles={vehicles} unitSystem={unitSystem} market={market} />

      <ContentAd name="guideBottom" />

      <section className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Read next</h2>
        <ul className="space-y-3">
          {related.map(g => (
            <li key={g.meta.slug}>
              <Link
                to={`/guides/${g.meta.slug}`}
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                {g.meta.title}
              </Link>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{g.meta.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 p-6">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
          Compare these cars yourself
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Put every metric side by side, filter by market and body type, and re-rank on the exact
          conditions you drive in.
        </p>
        <Link
          to="/matrix"
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium transition-colors"
        >
          Open the compare tool →
        </Link>
      </div>
    </ContentLayout>
  )
}
