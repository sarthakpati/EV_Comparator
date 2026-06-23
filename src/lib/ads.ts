/**
 * Google AdSense configuration.
 *
 * The publisher (client) id is public — it already ships in index.html and ads.txt,
 * so there is nothing secret here and no env var is needed.
 *
 * Ad *slots* are created per placement in the AdSense dashboard
 * (Ads → By ad unit → Display ad). Paste each numeric slot id below. An empty
 * slot renders nothing, so a placement stays invisible until you wire its id.
 *
 * POLICY: every slot here is rendered only via <ContentAd> inside content pages
 * (guides, FAQ, glossary, about, home). Ads must never be placed on the bare
 * tool screens (matrix / scatter / compare), the loading screen, or the error
 * screen — that is what triggers AdSense's "ads on screens without publisher
 * content" violation. Keep new placements inside genuine content.
 */
export const AD_CLIENT = 'ca-pub-8681706562642737'

export type AdSlotName =
  | 'homeInline'
  | 'guideTop'
  | 'guideBottom'
  | 'faqInline'
  | 'glossaryInline'
  | 'aboutInline'

export const AD_SLOTS: Record<AdSlotName, string> = {
  // Responsive in-content units. Paste the slot id from the AdSense dashboard to enable each.
  homeInline: '2044623687',
  guideTop: '',
  guideBottom: '',
  faqInline: '',
  glossaryInline: '',
  aboutInline: '',
}
