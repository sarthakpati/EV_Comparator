// Ambient typing for the global injected by the AdSense loader script in index.html.
export {}

declare global {
  interface Window {
    /** Queue the adsbygoogle.js library drains to render units. We only ever push({}). */
    adsbygoogle: unknown[]
  }
}
