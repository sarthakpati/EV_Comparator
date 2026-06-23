import { useEffect } from 'react'
import { SITE_NAME, SITE_DESCRIPTION, canonicalUrl } from '../lib/site'

interface SeoProps {
  /** Page title, suffixed with the site name. Pass the bare page title. */
  title?: string
  description?: string
  /** Route pathname, used for the canonical / og:url tag. */
  path?: string
  /** og:type — 'website' for pages, 'article' for guides. */
  type?: 'website' | 'article'
}

/** Upsert a <meta> tag identified by name/property. */
function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!href) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Per-route document head: title, meta description, canonical and Open Graph tags.
 * Renders nothing; updates the head imperatively on mount and when props change.
 * Used on every route so titles/canonicals stay correct across client-side navigation.
 */
export function Seo({ title, description, path, type = 'website' }: SeoProps) {
  const fullTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} — ${SITE_DESCRIPTION}`
  const desc = description ?? SITE_DESCRIPTION
  const url = path ? canonicalUrl(path) : ''

  useEffect(() => {
    document.title = fullTitle
    setMeta('name', 'description', desc)
    setMeta('property', 'og:title', title ?? SITE_NAME)
    setMeta('property', 'og:description', desc)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:site_name', SITE_NAME)
    if (url) setMeta('property', 'og:url', url)
    setCanonical(url)
  }, [fullTitle, desc, url, title, type])

  return null
}
