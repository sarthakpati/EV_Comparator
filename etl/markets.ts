import fs from 'fs'
import path from 'path'
import { parseMarkdownTable } from './parseMarkdown'
import { canonicalize } from './canonicalize'
import type { MarketInfo, MarketCode, MarketConfig, Vehicle } from './schema'
import { parseNumeric } from './normalize'

interface MarketRow {
  Make: string
  Model: string
  Variant: string
  Body: string
  Launch: string
  'Starting MSRP': string
  Status: string
  Notes: string
}

const STATUS_MAP: Record<string, MarketInfo['available']> = {
  available: 'available',
  upcoming: 'upcoming',
  discontinued: 'discontinued',
  'ca-only': 'available',
  unavailable: 'unavailable',
}

export interface MarketWarning {
  row: string
  message: string
}

function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/<!--\s*([\s\S]*?)\s*-->/)
  if (!match) return {}
  const result: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) continue
    const key = line.slice(0, colonIdx).trim()
    const val = line.slice(colonIdx + 1).trim()
    if (key) result[key] = val
  }
  return result
}

const FILE_MAP: Record<string, string> = {
  US: 'us.md',
  UK: 'uk.md',
  DE: 'de.md',
  EU: 'eu.md',
  NO: 'no.md',
}

export function loadMarketOverlay(
  dataDir: string,
  market: MarketCode,
  vehicles: Vehicle[],
): { warnings: MarketWarning[], config: MarketConfig | null } {
  const fileName = FILE_MAP[market]
  const filePath = path.join(dataDir, 'markets', fileName)

  let content: string
  try {
    content = fs.readFileSync(filePath, 'utf-8')
  } catch {
    return { warnings: [], config: null }
  }

  const frontmatter = parseFrontmatter(content)
  const config: MarketConfig | null = frontmatter.code ? {
    code: frontmatter.code as MarketCode,
    name: frontmatter.name ?? market,
    currency: (frontmatter.currency ?? 'USD') as MarketConfig['currency'],
    units: (frontmatter.units ?? 'metric') as 'metric' | 'imperial',
    flag: frontmatter.flag ?? '',
  } : null

  let rows: Record<string, string>[]
  try {
    rows = parseMarkdownTable(filePath)
  } catch {
    return { warnings: [], config }
  }

  const warnings: MarketWarning[] = []
  const vehicleById = new Map(vehicles.map(v => [v.id, v]))
  const currency = config?.currency ?? 'USD'

  for (const row of rows) {
    const r = row as unknown as MarketRow
    if (!r.Make && !r.Model) continue

    const parts = [r.Make, r.Model, r.Variant].filter(Boolean)
    const rawStr = parts.join(' ')

    const canon = canonicalize(rawStr)

    let vehicle = vehicleById.get(canon.id)

    if (!vehicle) {
      const makeModel = [r.Make, r.Model].join(' ').toLowerCase().replace(/\s+/g, ' ')
      vehicle = vehicles.find(v =>
        `${v.make} ${v.model}`.toLowerCase().startsWith(makeModel) ||
        v.aliases.some(a => a.toLowerCase().includes(makeModel))
      )
    }

    if (!vehicle) {
      warnings.push({ row: rawStr, message: `No matching vehicle found for "${rawStr}" (id: ${canon.id})` })
      continue
    }

    const launchStr = (r.Launch || '').trim()
    let launchYear: number | undefined
    let launchDate: string | undefined
    if (/^\d{4}$/.test(launchStr)) {
      launchYear = parseInt(launchStr, 10)
    } else if (/^\d{4}-\d{2}/.test(launchStr)) {
      launchDate = launchStr
      launchYear = parseInt(launchStr.split('-')[0], 10)
    }

    const msrpRaw = r['Starting MSRP']
    const msrpVal = parseNumeric(msrpRaw)
    const startingMsrp = msrpVal != null && msrpVal > 0
      ? { amount: msrpVal, currency: currency as 'USD' | 'EUR' | 'GBP' | 'NOK' }
      : undefined

    const statusRaw = (r.Status || '').toLowerCase().trim()
    const available = STATUS_MAP[statusRaw] ?? 'available'

    const marketInfo: MarketInfo = {
      market,
      available,
      launchYear,
      launchDate,
      startingMsrp,
      approximate: true,
      source: fileName,
      notes: r.Notes || undefined,
    }

    if (!vehicle.markets) (vehicle as { markets: Partial<Record<MarketCode, MarketInfo>> }).markets = {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(vehicle.markets as any)[market] = marketInfo

    if (r.Body && !vehicle.bodyType) {
      (vehicle as { bodyType?: string }).bodyType = r.Body
    }
  }

  return { warnings, config }
}
