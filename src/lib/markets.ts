import type { UnitSystem } from './units'

export interface MarketConfig {
  code: string
  name: string
  currency: string
  units: UnitSystem
  flag: string
}

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
  return getMarketConfig(marketCode)?.units ?? 'metric'
}
