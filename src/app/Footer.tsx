import { Link } from 'react-router-dom'
import { FOOTER_SECTIONS, SITE_NAME } from '../lib/site'

/** Site-wide footer. Present on every content page; links give crawlers a path
 *  to every page and signal a real, navigable site (an AdSense review criterion). */
export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
      <div className="max-w-6xl mx-auto px-6 py-12 grid gap-10 grid-cols-2 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl" aria-hidden>⚡</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">{SITE_NAME}</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Independent, real-world EV performance — range, charging, and efficiency from Bjørn
            Nyland’s standardized highway tests. Free and open source.
          </p>
          <div className="flex gap-3 mt-4 text-sm">
            <a
              href="https://www.youtube.com/@BjornNyland"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Data source ↗
            </a>
            <a
              href="https://github.com/sarthakpati/EV_Comparator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              GitHub ↗
            </a>
          </div>
        </div>

        {FOOTER_SECTIONS.map(section => (
          <div key={section.title}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              {section.title}
            </h3>
            <ul className="space-y-2">
              {section.links.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
            © {year} {SITE_NAME}. Test data © Bjørn Nyland, reproduced with attribution. This is an
            independent project — not affiliated with, sponsored by, or endorsed by Bjørn Nyland or
            any vehicle manufacturer. All figures are real-world test results provided for
            informational purposes only and are not purchasing, financial, or safety advice. Verify
            specifications and prices with the manufacturer before making any decision.
          </p>
        </div>
      </div>
    </footer>
  )
}
