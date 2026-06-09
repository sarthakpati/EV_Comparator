import fs from 'fs'
import path from 'path'
import { parseMarkdownTable } from './parseMarkdown'
import {
  parseNumeric, parseBanana, parsePercent, parseTimeToMinutes,
} from './normalize'
import { canonicalize, loadAliases } from './canonicalize'
import { loadMarketOverlay } from './markets'
import { METRIC_DEFS } from './metrics'
import { DatasetSchema, CoverageSchema } from './schema'
import type { Vehicle, MetricValue, Condition, MarketCode, MarketConfig } from './schema'

const DATA_DIR = path.resolve(process.cwd(), 'data')
const OUT_DIR = path.resolve(process.cwd(), 'public', 'data')
const DOCS_DIR = path.resolve(process.cwd(), 'docs')

fs.mkdirSync(OUT_DIR, { recursive: true })
fs.mkdirSync(DOCS_DIR, { recursive: true })

// ── Load aliases ──────────────────────────────────────────────────────────
loadAliases(DATA_DIR)

// ── Vehicle accumulator ───────────────────────────────────────────────────
const vehicleMap = new Map<string, Vehicle>()

function getOrCreate(rawName: string): Vehicle {
  const canon = canonicalize(rawName)
  let v = vehicleMap.get(canon.id)
  if (!v) {
    v = {
      id: canon.id,
      make: canon.make,
      model: canon.model,
      variant: canon.variant,
      modelYear: canon.modelYear,
      batteryKwh: canon.batteryKwh,
      drivetrain: canon.drivetrain,
      markets: {},
      aliases: [rawName],
      metrics: {},
      coverage: 0,
    }
    vehicleMap.set(canon.id, v)
  } else {
    if (!v.aliases.includes(rawName)) v.aliases.push(rawName)
    if (!v.modelYear && canon.modelYear) v.modelYear = canon.modelYear
    if (!v.batteryKwh && canon.batteryKwh) v.batteryKwh = canon.batteryKwh
    if (!v.drivetrain && canon.drivetrain) v.drivetrain = canon.drivetrain
  }
  return v
}

function addMetric(vehicle: Vehicle, metricId: string, mv: MetricValue) {
  if (!vehicle.metrics[metricId]) vehicle.metrics[metricId] = []
  vehicle.metrics[metricId].push(mv)
}

// ── Parse Range sheet ─────────────────────────────────────────────────────
console.log('Parsing Range...')
{
  const rows = parseMarkdownTable(path.join(DATA_DIR, 'Range.md'))
  for (const row of rows) {
    const carName = row['Car'] || ''
    if (!carName) continue
    const v = getOrCreate(carName)

    const speed = parseNumeric(row['Speed']) ?? 90
    const season = (row['Season'] || '').toLowerCase().includes('winter') ? 'winter' : 'summer'
    const surface = (row['Surface'] || '').toLowerCase().includes('wet') ? 'wet' : 'dry'
    const temp = parseNumeric(row['Temp'])
    const condition: Condition = { speed, season, surface, temp: temp ?? undefined }

    const km = parseNumeric(row['km'])
    const wh_km = parseNumeric(row['Wh/km'])
    const capacity = parseNumeric(row['Capacity'])
    const pct75km = parseNumeric(row['75 % range'])
    const pct75time = parseNumeric(row['75 % charging time'])
    const pct75speed = parseNumeric(row['75 % km/h'])

    const rangeMetric = speed === 90
      ? (season === 'summer' ? 'range_90_summer' : 'range_90_winter')
      : (season === 'summer' ? 'range_120_summer' : 'range_120_winter')

    const consumptionMetric = speed === 90
      ? (season === 'summer' ? 'consumption_90_summer' : 'consumption_90_winter')
      : (season === 'summer' ? 'consumption_120_summer' : 'consumption_120_winter')

    if (km != null) addMetric(v, rangeMetric, { value: km, unit: 'km', condition, source: 'Range' })
    if (wh_km != null) addMetric(v, consumptionMetric, { value: wh_km, unit: 'Wh/km', condition, source: 'Range' })
    if (capacity != null) addMetric(v, 'battery_capacity', { value: capacity, unit: 'kWh', condition, source: 'Range' })
    if (pct75km != null) addMetric(v, 'range_75pct_km', { value: pct75km, unit: 'km', condition, source: 'Range' })
    if (pct75time != null) addMetric(v, 'charge_time_75pct', { value: pct75time, unit: 'min', condition, source: 'Range' })
    if (pct75speed != null) addMetric(v, 'charge_speed_75pct', { value: pct75speed, unit: 'km/h', condition, source: 'Range' })
  }
}

// ── Parse 1000 km sheet ───────────────────────────────────────────────────
console.log('Parsing 1000_km...')
{
  const rows = parseMarkdownTable(path.join(DATA_DIR, '1000_km.md'))
  for (const row of rows) {
    const carName = row['Car'] || ''
    if (!carName) continue
    const v = getOrCreate(carName)
    const date = row['Date'] || undefined
    const source = '1000_km'

    const timeMin = parseTimeToMinutes(row['Time'])
    const avgSpeed = parseNumeric(row['km/h'])
    const whKm = parseNumeric(row['Wh/km'])

    if (timeMin != null) addMetric(v, 'roadtrip_1000km_time', { value: timeMin, unit: 'min', date, source })
    if (avgSpeed != null) addMetric(v, 'roadtrip_avg_speed', { value: avgSpeed, unit: 'km/h', date, source })
    if (whKm != null) addMetric(v, 'roadtrip_consumption', { value: whKm, unit: 'Wh/km', date, source })
  }
}

// ── Parse Acceleration sheet ───────────────────────────────────────────────
console.log('Parsing Acceleration...')
{
  const rows = parseMarkdownTable(path.join(DATA_DIR, 'Acceleration.md'))
  for (const row of rows) {
    const carName = row['Car'] || ''
    if (!carName) continue
    const v = getOrCreate(carName)
    const date = row['Date'] || undefined
    const source = 'Acceleration'

    const accel100 = parseNumeric(row['0-100'])
    const accel100ft = parseNumeric(row['0-100 (1 ft)'])
    const weight = parseNumeric(row['Weight'])
    const hp = parseNumeric(row['Hp'])

    if (accel100 != null) addMetric(v, 'accel_0_100', { value: accel100, unit: 's', date, source })
    if (accel100ft != null) addMetric(v, 'accel_0_100_1ft', { value: accel100ft, unit: 's', date, source })
    if (weight != null) addMetric(v, 'weight_kg', { value: weight, unit: 'kg', date, source })
    if (hp != null) addMetric(v, 'hp', { value: hp, unit: 'hp', date, source })

    const drive = row['Drive'] || ''
    const canon = canonicalize(carName)
    const existing = vehicleMap.get(canon.id)
    if (existing && !existing.drivetrain) {
      if (/AWD/i.test(drive)) existing.drivetrain = 'AWD'
      else if (/RWD/i.test(drive)) existing.drivetrain = 'RWD'
      else if (/FWD/i.test(drive)) existing.drivetrain = 'FWD'
    }
  }
}

// ── Parse Weight sheet ────────────────────────────────────────────────────
console.log('Parsing Weight...')
{
  const rows = parseMarkdownTable(path.join(DATA_DIR, 'Weight.md'))
  for (const row of rows) {
    const carName = row['Car'] || ''
    if (!carName) continue
    const v = getOrCreate(carName)
    const source = 'Weight'
    const total = parseNumeric(row['Total'])
    if (total != null) addMetric(v, 'weight_kg', { value: total, unit: 'kg', source })
  }
}

// ── Parse Noise sheet ─────────────────────────────────────────────────────
console.log('Parsing Noise...')
{
  const rows = parseMarkdownTable(path.join(DATA_DIR, 'Noise.md'))
  for (const row of rows) {
    const carName = row['Car'] || ''
    if (!carName) continue
    const v = getOrCreate(carName)
    const source = 'Noise'
    const season = (row['Season'] || '').toLowerCase().includes('winter') ? 'winter' : 'summer'
    const condition: Condition = { season }

    const n80 = parseNumeric(row['80 km/h'])
    const n100 = parseNumeric(row['100 km/h'])
    const n120 = parseNumeric(row['120 km/h'])
    const avg = parseNumeric(row['Average'])

    if (n80 != null) addMetric(v, 'noise_80', { value: n80, unit: 'dB', condition, source })
    if (n100 != null) addMetric(v, 'noise_100', { value: n100, unit: 'dB', condition, source })
    if (n120 != null) addMetric(v, 'noise_120', { value: n120, unit: 'dB', condition, source })
    if (avg != null) addMetric(v, 'noise_avg', { value: avg, unit: 'dB', condition, source })
  }
}

// ── Parse Banana sheet ────────────────────────────────────────────────────
console.log('Parsing Banana...')
{
  const rows = parseMarkdownTable(path.join(DATA_DIR, 'Banana.md'))
  for (const row of rows) {
    const carName = row['Car'] || ''
    if (!carName) continue
    const v = getOrCreate(carName)
    const source = 'Banana'

    const trunkRaw = row['Trunk'] || ''
    const foldedRaw = row['Seats folded'] || ''

    const trunk = parseBanana(trunkRaw)
    const folded = parseNumeric(foldedRaw)

    if (trunk) addMetric(v, 'cargo_trunk', { value: trunk.total, unit: 'boxes', source, raw: trunkRaw })
    if (folded != null) addMetric(v, 'cargo_seats_folded', { value: folded, unit: 'boxes', source })
  }
}

// ── Parse Braking sheet ────────────────────────────────────────────────────
console.log('Parsing Braking...')
{
  const rows = parseMarkdownTable(path.join(DATA_DIR, 'Braking.md'))
  for (const row of rows) {
    const carName = row['Car'] || ''
    if (!carName) continue
    const v = getOrCreate(carName)
    const source = 'Braking'

    const dist = parseNumeric(row['Distance'])
    if (dist != null) addMetric(v, 'braking_distance', { value: dist, unit: 'm', source })
  }
}

// ── Parse Degradation sheet ───────────────────────────────────────────────
console.log('Parsing Degradation...')
{
  const rows = parseMarkdownTable(path.join(DATA_DIR, 'Degradation.md'))
  for (const row of rows) {
    const carName = row['Car'] || ''
    if (!carName) continue
    const v = getOrCreate(carName)
    const source = 'Degradation'

    const degradPct = parsePercent(row['Degradation %'] || row['Degradation'])
    if (degradPct != null) addMetric(v, 'degradation_pct', { value: degradPct, unit: '%', source })
  }
}

// ── Parse remaining route-specific sheets (best-effort) ──────────────────
const routeSheets = ['Sunday', 'Geilo', 'Arctic_Circle', 'Bangkok', '500_km', 'Zero_mile', 'Zeva']
for (const sheet of routeSheets) {
  const filePath = path.join(DATA_DIR, `${sheet}.md`)
  if (!fs.existsSync(filePath)) continue
  console.log(`Parsing ${sheet}...`)
  const rows = parseMarkdownTable(filePath)
  for (const row of rows) {
    const carName = row['Car'] || ''
    if (!carName) continue
    getOrCreate(carName)
  }
}

// ── Enrich from enrichment.csv (if present) ───────────────────────────────
const enrichmentPath = path.join(DATA_DIR, 'enrichment.csv')
if (fs.existsSync(enrichmentPath)) {
  console.log('Loading enrichment.csv...')
  const lines = fs.readFileSync(enrichmentPath, 'utf-8').split('\n').filter(Boolean)
  if (lines.length > 1) {
    const headers = lines[0].split(',').map(h => h.trim())
    for (const line of lines.slice(1)) {
      const cells = line.split(',').map(c => c.trim())
      const row: Record<string, string> = {}
      headers.forEach((h, i) => { row[h] = cells[i] || '' })
      const id = row['id']
      if (!id) continue
      const v = vehicleMap.get(id)
      if (!v) continue
      if (row['bodyType'] && !v.bodyType) (v as { bodyType?: string }).bodyType = row['bodyType']
      if (row['segment'] && !v.segment) (v as { segment?: string }).segment = row['segment']
      if (row['imageUrl'] && !v.imageUrl) (v as { imageUrl?: string }).imageUrl = row['imageUrl']
      if (row['officialUrl'] && !v.officialUrl) (v as { officialUrl?: string }).officialUrl = row['officialUrl']
    }
  }
}

// ── Load market overlays ──────────────────────────────────────────────────
const vehicles = [...vehicleMap.values()]
const allWarnings: string[] = []
const marketConfigs: MarketConfig[] = []

const marketsToLoad: MarketCode[] = ['US', 'UK', 'DE']
for (const market of marketsToLoad) {
  console.log(`Loading ${market} market overlay...`)
  const { warnings, config } = loadMarketOverlay(DATA_DIR, market, vehicles)
  warnings.forEach(w => allWarnings.push(`[${market}] ${w.row}: ${w.message}`))
  if (config) marketConfigs.push(config)
}

// ── Compute coverage ──────────────────────────────────────────────────────
const trackedMetricIds = METRIC_DEFS.map(m => m.id)
for (const v of vehicles) {
  const present = trackedMetricIds.filter(id => {
    const vals = v.metrics[id]
    return vals && vals.length > 0 && vals.some(mv => mv.value != null)
  }).length
  v.coverage = present / trackedMetricIds.length
}

// ── Add price metrics from market data ─────────────────────────────────────
for (const v of vehicles) {
  const usMarket = v.markets?.['US']
  if (usMarket?.startingMsrp) {
    addMetric(v, 'price_usd', {
      value: usMarket.startingMsrp.amount,
      unit: 'USD',
      source: 'us.md',
    })
  }
  if (usMarket?.launchYear) {
    addMetric(v, 'launch_year', {
      value: usMarket.launchYear,
      unit: 'year',
      source: 'us.md',
    })
  }
}

// ── Validate with Zod ─────────────────────────────────────────────────────
console.log('Validating schema...')
const loadedMarkets = marketConfigs.map(c => c.code) as MarketCode[]

const dataset = {
  vehicles,
  metrics: METRIC_DEFS,
  markets: loadedMarkets.length > 0 ? loadedMarkets : ['US'] as MarketCode[],
  marketConfigs,
  generatedAt: new Date().toISOString(),
  sourceAttribution: 'Test data: Bjørn Nyland (bjornyland.com) — reproduced with attribution. Market overlays: community-maintained, approximate prices pre-incentive.',
}

const parseResult = DatasetSchema.safeParse(dataset)
if (!parseResult.success) {
  console.error('Schema validation FAILED:')
  console.error(JSON.stringify(parseResult.error.issues.slice(0, 10), null, 2))
  parseResult.error.issues.forEach(issue => {
    const p = issue.path
    if (p[0] === 'vehicles' && typeof p[1] === 'number') {
      const veh = vehicles[p[1] as number]
      if (veh) console.error('Offending vehicle:', JSON.stringify({ id: veh.id, variant: veh.variant, make: veh.make, model: veh.model }))
    }
  })
  process.exit(1)
}

// ── Compute coverage report ───────────────────────────────────────────────
const byVehicle: Record<string, number> = {}
const byMetric: Record<string, number> = {}

for (const v of vehicles) {
  byVehicle[v.id] = v.coverage
}

for (const metricId of trackedMetricIds) {
  const withData = vehicles.filter(v => {
    const vals = v.metrics[metricId]
    return vals && vals.length > 0 && vals.some(mv => mv.value != null)
  }).length
  byMetric[metricId] = vehicles.length > 0 ? withData / vehicles.length : 0
}

const coverageData = { byVehicle, byMetric }
CoverageSchema.parse(coverageData)

// ── Write outputs ─────────────────────────────────────────────────────────
fs.writeFileSync(path.join(OUT_DIR, 'dataset.json'), JSON.stringify(parseResult.data, null, 2))
fs.writeFileSync(path.join(OUT_DIR, 'coverage.json'), JSON.stringify(coverageData, null, 2))

// ── Write canonicalization report ─────────────────────────────────────────
const reportLines = [
  '# Canonicalization Report',
  '',
  `Generated: ${new Date().toISOString()}`,
  `Vehicles: ${vehicles.length}`,
  '',
  '## Vehicles',
  '',
  '| ID | Make | Model | Variant | Battery | Drivetrain | Aliases | Coverage |',
  '|---|---|---|---|---|---|---|---|',
  ...vehicles.map(v =>
    `| ${v.id} | ${v.make} | ${v.model} | ${v.variant ?? ''} | ${v.batteryKwh ? v.batteryKwh + ' kWh' : ''} | ${v.drivetrain ?? ''} | ${v.aliases.length} | ${(v.coverage * 100).toFixed(0)}% |`
  ),
  '',
  '## Market Overlay Warnings',
  '',
  allWarnings.length === 0 ? '_No warnings._' : allWarnings.map(w => `- ${w}`).join('\n'),
]

fs.writeFileSync(path.join(DOCS_DIR, 'canonicalization-report.md'), reportLines.join('\n'))

console.log(`\nETL complete:`)
console.log(`  ${vehicles.length} vehicles`)
marketsToLoad.forEach(m => {
  console.log(`  ${vehicles.filter(v => v.markets?.[m]).length} with ${m} market data`)
})
console.log(`  ${allWarnings.length} market overlay warnings`)
console.log(`  Written: public/data/dataset.json, public/data/coverage.json, docs/canonicalization-report.md`)
