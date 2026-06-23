/**
 * Site-wide metadata, navigation, and canonical URL config.
 *
 * SITE_URL is the production origin — used for canonical/og:url tags, robots.txt,
 * and sitemap.xml. Keep it in sync with the deployed domain. Set to '' to disable
 * absolute canonical/og:url emission (tags are skipped when empty).
 */
export const SITE_URL = 'https://evcomparator.up.railway.app'
export const SITE_NAME = 'EV Comparator'
export const SITE_TAGLINE = 'Real-world electric car data'
export const SITE_DESCRIPTION =
  'Compare real-world EV range, charging speed, and efficiency from Bjørn Nyland’s ' +
  'independent highway tests — 500+ electric cars, side by side, free.'

/** Canonical/og:url for a route path. Returns '' when SITE_URL is unset. */
export function canonicalUrl(path: string): string {
  if (!SITE_URL) return ''
  return SITE_URL.replace(/\/$/, '') + (path === '/' ? '' : path)
}

export interface NavLink {
  to: string
  label: string
}

export interface FooterSection {
  title: string
  links: NavLink[]
}

/** Footer link columns — gives crawlers a path to every content page. */
export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: 'Compare',
    links: [
      { to: '/matrix', label: 'Matrix' },
      { to: '/scatter', label: 'Scatter / Pareto' },
      { to: '/compare', label: 'Side-by-side' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { to: '/guides', label: 'Guides' },
      { to: '/faq', label: 'FAQ' },
      { to: '/glossary', label: 'Glossary' },
      { to: '/about', label: 'About & methodology' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/privacy', label: 'Privacy policy' },
      { to: '/terms', label: 'Terms & disclaimer' },
    ],
  },
]
