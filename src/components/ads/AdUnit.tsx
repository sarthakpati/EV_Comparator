import { useEffect, useRef, type CSSProperties } from 'react'
import { clsx } from 'clsx'
import { AD_CLIENT } from '../../lib/ads'

interface AdUnitProps {
  /** Numeric ad-unit slot id from the AdSense dashboard. Empty string → renders nothing. */
  slot: string
  /** AdSense format hint. 'auto' = responsive display unit. */
  format?: string
  /** data-ad-layout, for in-article / in-feed units. */
  layout?: string
  /** Let the unit grow to the full container width on small screens. */
  responsive?: boolean
  className?: string
  style?: CSSProperties
}

/**
 * Renders one AdSense display unit, SPA-safe:
 *  - pushes exactly once per mounted <ins> — guards React StrictMode's double-invoked
 *    effect and an element AdSense has already filled;
 *  - re-renders correctly across client-side route changes, since each route mounts a
 *    fresh <ins> that gets its own push;
 *  - fails silently when the adsbygoogle script is blocked or not yet loaded.
 */
export function AdUnit({ slot, format = 'auto', layout, responsive = true, className, style }: AdUnitProps) {
  const insRef = useRef<HTMLModElement>(null)
  const pushed = useRef(false)

  useEffect(() => {
    if (!slot || pushed.current) return
    // Skip if AdSense has already populated this exact element.
    if (insRef.current?.getAttribute('data-adsbygoogle-status')) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      pushed.current = true
    } catch {
      // Script blocked (ad blocker) or not ready — leave the slot empty.
    }
  }, [slot])

  if (!slot) return null

  return (
    <ins
      ref={insRef}
      className={clsx('adsbygoogle', className)}
      style={{ display: 'block', ...style }}
      data-ad-client={AD_CLIENT}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? 'true' : 'false'}
      {...(layout ? { 'data-ad-layout': layout } : {})}
    />
  )
}
