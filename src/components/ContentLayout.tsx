import { clsx } from 'clsx'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Seo } from './Seo'
import { Footer } from '../app/Footer'

interface ContentLayoutProps {
  title?: string
  /** Meta description + subtitle source. */
  description?: string
  /** Route path for canonical/og:url. */
  path?: string
  type?: 'website' | 'article'
  /** Subtitle under the H1. Defaults to nothing; pass to show. */
  lead?: ReactNode
  /** Breadcrumb label shown above the title, e.g. "Guides". */
  breadcrumb?: { label: string; to: string }
  /** Wider container for index/landing-style pages. */
  wide?: boolean
  children: ReactNode
}

/**
 * Scrollable, footed layout for every content (non-tool) page. Provides the
 * single <main> scroll region, per-route SEO head tags, a centered reading
 * column, and the site footer.
 */
export function ContentLayout({
  title, description, path, type = 'website', lead, breadcrumb, wide, children,
}: ContentLayoutProps) {
  return (
    <main className="flex-1 overflow-auto bg-white dark:bg-slate-900 scrollbar-thin">
      <Seo title={title} description={description} path={path} type={type} />
      <div className={clsx('mx-auto px-6 py-10 md:py-14', wide ? 'max-w-5xl' : 'max-w-3xl')}>
        {breadcrumb && (
          <nav className="mb-6 text-sm" aria-label="Breadcrumb">
            <Link to={breadcrumb.to} className="text-blue-600 dark:text-blue-400 hover:underline">
              ← {breadcrumb.label}
            </Link>
          </nav>
        )}
        {title && (
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {title}
            </h1>
            {lead && <p className="mt-3 text-lg text-slate-500 dark:text-slate-400 leading-relaxed">{lead}</p>}
          </header>
        )}
        {children}
      </div>
      <Footer />
    </main>
  )
}
