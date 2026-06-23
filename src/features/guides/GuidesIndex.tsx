import { Link } from 'react-router-dom'
import { ContentLayout } from '../../components/ContentLayout'
import { GUIDES } from './registry'
import type { GuideMeta } from './types'

function GuideCard({ meta }: { meta: GuideMeta }) {
  return (
    <Link
      to={`/guides/${meta.slug}`}
      className="group block rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all bg-white dark:bg-slate-900"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          {meta.category}
        </span>
        <span className="text-slate-300 dark:text-slate-600">·</span>
        <span className="text-[11px] text-slate-400 dark:text-slate-500">{meta.readingTime}</span>
      </div>
      <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
        {meta.title}
      </h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
        {meta.description}
      </p>
    </Link>
  )
}

export function GuidesIndex() {
  return (
    <ContentLayout
      title="EV guides"
      description="Plain-English guides to electric-car range, charging, efficiency, and value — grounded in real-world test data."
      path="/guides"
      wide
      lead="Plain-English guides to range, charging, efficiency, and value — grounded in Bjørn Nyland’s real-world test data, not lab figures."
    >
      <div className="article-content mb-8">
        <p>
          Electric-car specs are full of numbers that do not mean what they seem to. These guides
          explain what actually matters — and back it up with real measurements from hundreds of
          cars, tested the same way. The rankings update automatically as new data is added. When
          you are ready to dig into a specific car, the{' '}
          <Link to="/matrix">interactive compare tool</Link> puts every metric side by side.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {GUIDES.map(g => (
          <GuideCard key={g.meta.slug} meta={g.meta} />
        ))}
      </div>
    </ContentLayout>
  )
}
