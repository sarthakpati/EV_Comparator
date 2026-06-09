import type { UnitSystem } from './units'
import { formatValue } from './units'
import type { MarketInfo } from './types'

export interface MarketConfig {
  code: string
  name: string
  currency: string
  units: UnitSystem
  flag: string
}

/** Sentinel for the "show every EV, ignore market availability" view. */
export const ALL_MARKET = 'ALL'

// Ground truth derived from data/markets/*.md frontmatter.
// Update this list whenever a new market file is added.
export const MARKET_CONFIGS: MarketConfig[] = [
  { code: 'US', name: 'United States', currency: 'USD', units: 'imperial', flag: '🇺🇸' },
  { code: 'UK', name: 'United Kingdom', currency: 'GBP', units: 'imperial', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', currency: 'EUR', units: 'metric', flag: '🇩🇪' },
]

export function getMarketConfig(code: string): MarketConfig | undefined {
  return MARKET_CONFIGS.find(m => m.code === code)
}

export function getUnitSystem(marketCode: string): UnitSystem {
  // "All markets" has no single locale → fall back to the dataset's native metric.
  return getMarketConfig(marketCode)?.units ?? 'metric'
}

// Approximate FX → USD, used only to normalize multi-market prices into one
// comparable range in the "All markets" view. Rough and clearly approximate.
export const FX_TO_USD: Record<string, number> = {
  USD: 1,
  GBP: 1.27,
  EUR: 1.08,
  NOK: 0.092,
}

export interface PriceInfo {
  /** Numeric value for sorting/heatmap. Local currency for a specific market; USD-normalized for "All". */
  sortValue: number | null
  /** Formatted string for display. */
  label: string
}

const round500 = (x: number) => Math.round(x / 500) * 500

/**
 * Market-aware starting price for a vehicle.
 * - Specific market: that market's MSRP in its own currency.
 * - "All markets": min–max across markets, normalized to approximate USD.
 */
export function getVehiclePrice(
  markets: Partial<Record<string, MarketInfo>> | undefined,
  market: string,
): PriceInfo {
  if (!markets) return { sortValue: null, label: '—' }

  if (market === ALL_MARKET) {
    const usd: number[] = []
    for (const code of Object.keys(markets)) {
      const msrp = markets[code]?.startingMsrp
      if (msrp && msrp.amount > 0) usd.push(msrp.amount * (FX_TO_USD[msrp.currency] ?? 1))
    }
    if (usd.length === 0) return { sortValue: null, label: '—' }
    const min = Math.min(...usd), max = Math.max(...usd)
    const minR = round500(min), maxR = round500(max)
    const label = minR === maxR
      ? formatValue(minR, 'USD', 0)
      : `${formatValue(minR, 'USD', 0)}–${formatValue(maxR, 'USD', 0)}`
    return { sortValue: min, label }
  }

  const msrp = markets[market]?.startingMsrp
  if (!msrp || msrp.amount <= 0) return { sortValue: null, label: '—' }
  return { sortValue: msrp.amount, label: formatValue(msrp.amount, msrp.currency, 0) }
}

export function getPriceHeaderLabel(market: string): string {
  if (market === ALL_MARKET) return 'Starting Price (USD, est.)'
  return `Starting Price (${getMarketConfig(market)?.currency ?? 'USD'})`
}
