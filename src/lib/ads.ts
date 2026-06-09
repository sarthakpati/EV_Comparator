/**
 * Google AdSense configuration.
 *
 * The publisher (client) id is public — it already ships in index.html and ads.txt,
 * so there is nothing secret here and no env var is needed.
 *
 * Ad *slots* are created per placement in the AdSense dashboard
 * (Ads → By ad unit → Display ad). Paste each numeric slot id below. An empty
 * slot renders nothing, so a placement stays invisible until you wire its id.
 */
export const AD_CLIENT = 'ca-pub-8681706562642737'

export type AdSlotName = 'aboutInline'

export const AD_SLOTS: Record<AdSlotName, string> = {
  // Responsive in-content unit on the About page. Paste the slot id to enable.
  aboutInline: '',
}
