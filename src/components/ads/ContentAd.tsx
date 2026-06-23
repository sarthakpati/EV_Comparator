import { AdUnit } from './AdUnit'
import { AD_SLOTS, type AdSlotName } from '../../lib/ads'

interface ContentAdProps {
  /** Named slot from AD_SLOTS. Renders nothing until its id is set in lib/ads.ts. */
  name: AdSlotName
}

/**
 * A clearly-labelled in-content ad placement. Renders nothing when the slot id
 * is empty, so ads never appear until explicitly enabled — and, by construction,
 * only ever inside content pages that import this component (never on the bare
 * tool screens, loading, or error states). This is what keeps the site compliant
 * with AdSense's "no ads on screens without publisher content" policy.
 */
export function ContentAd({ name }: ContentAdProps) {
  const slot = AD_SLOTS[name]
  if (!slot) return null
  return (
    <div className="my-10">
      <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center mb-1">
        Advertisement
      </p>
      <AdUnit slot={slot} />
    </div>
  )
}
