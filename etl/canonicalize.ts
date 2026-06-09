import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

// ── Brand synonym map ──────────────────────────────────────────────────────
const KNOWN_MAKES = [
  'Tesla', 'BMW', 'Audi', 'Mercedes', 'Volkswagen', 'VW', 'Porsche', 'Hyundai', 'Kia',
  'Ford', 'Chevrolet', 'Rivian', 'Lucid', 'Fisker', 'Polestar', 'Volvo', 'Jaguar',
  'Nio', 'Xpeng', 'BYD', 'Geely', 'Zeekr', 'Lynk', 'Smart', 'Dacia', 'Renault',
  'Opel', 'Vauxhall', 'Seat', 'Cupra', 'Skoda', 'Citroen', 'Peugeot', 'Fiat',
  'Alfa Romeo', 'Lancia', 'MG', 'Maxus', 'Seres', 'Leapmotor', 'Lotus', 'McLaren',
  'Rivian', 'Jeep', 'Ram', 'Honda', 'Toyota', 'Lexus', 'Mazda', 'Subaru', 'Mitsubishi',
  'Nissan', 'Kia', 'Genesis', 'Land Rover', 'Bentley', 'Rolls-Royce', 'Ferrari', 'Lamborghini',
  'Maserati', 'Aston Martin', 'McLaren', 'Bugatti', 'Koenigsegg', 'Rimac', 'Pininfarina',
  'MINI', 'Mini', 'Ineos', 'GWM', 'Chery', 'BAIC', 'FAW', 'Hongqi', 'Wuling', 'Neta',
  'HiPhi', 'Lixiang', 'Li', 'Huawei', 'Aito', 'Avatr', 'Deepal', 'Denza', 'Voyah',
  'Xpeng', 'Nio', 'Ora', 'Great Wall', 'Haval', 'Tank', 'WEY', 'Skywell', 'Aiways',
  'Piaggio', 'Citroën', 'Peugeot', 'DS', 'Alpine', 'Stellantis', 'Vauxhall', 'Opel',
  'Genesis', 'Ioniq', 'Toyota', 'Lexus', 'Suzuki', 'Isuzu', 'Mazda',
  'KGM', 'SsangYong', 'Mahindra', 'Tata', 'ATTO', 'Rivian',
]

// Trim synonym normalization
const TRIM_SYNONYMS: Record<string, string> = {
  'long range': 'LR',
  'Long Range': 'LR',
  'standard range plus': 'SR+',
  'Standard Range Plus': 'SR+',
  'standard range': 'SR',
  'Standard Range': 'SR',
  'dual motor': 'AWD',
  'Dual Motor': 'AWD',
  'single motor': 'RWD',
  'Single Motor': 'RWD',
  'performance rwd': 'Performance RWD',
}

// Generation tags that MUST stay distinct
const GENERATION_TAGS = [
  'Highland', 'Juniper', 'Palladium', 'Raven', 'Refresh', 'Facelift',
  'Gen1', 'Gen2', 'Gen3', 'Mk1', 'Mk2',
  'FL', 'Phase1', 'Phase2',
]

const DRIVETRAIN_TOKENS: Record<string, 'RWD' | 'AWD' | 'FWD'> = {
  'RWD': 'RWD', 'AWD': 'AWD', 'FWD': 'FWD',
  '4Matic': 'AWD', 'xDrive': 'AWD', 'Quattro': 'AWD', 'quattro': 'AWD',
  'e-4orce': 'AWD', 'e4orce': 'AWD',
  'DM': 'AWD', 'SM': 'RWD',
  '4WD': 'AWD', '4x4': 'AWD',
}

export interface CanonicalResult {
  id: string
  make: string
  model: string
  variant?: string
  modelYear?: number
  batteryKwh?: number
  drivetrain?: 'RWD' | 'AWD' | 'FWD'
  confidence: number
  raw: string
}

export interface AliasEntry {
  id: string
  make?: string
  model?: string
  variant?: string
  batteryKwh?: number
}

let aliasMap: Map<string, AliasEntry> = new Map()
let aliasesLoaded = false

export function loadAliases(dataDir: string): void {
  const aliasFile = path.join(dataDir, 'aliases.yml')
  if (!fs.existsSync(aliasFile)) { aliasesLoaded = true; return }
  const raw = yaml.load(fs.readFileSync(aliasFile, 'utf-8')) as Record<string, AliasEntry>
  aliasMap = new Map(Object.entries(raw || {}))
  aliasesLoaded = true
}

export function canonicalize(rawName: string): CanonicalResult {
  if (!aliasesLoaded) {
    throw new Error('Call loadAliases() before canonicalize()')
  }

  const original = rawName

  // 1. Trim + collapse whitespace
  let s = rawName.replace(/\s+/g, ' ').trim()

  // 2. Check aliases map first (raw string lookup)
  const aliasEntry = aliasMap.get(s) ?? aliasMap.get(s.toLowerCase())
  if (aliasEntry) {
    return buildFromAlias(aliasEntry, s, original)
  }

  // 3. Extract leading year
  let modelYear: number | undefined
  const yearMatch = s.match(/^(20\d{2}|19\d{2})\s+/)
  if (yearMatch) {
    modelYear = parseInt(yearMatch[1], 10)
    s = s.slice(yearMatch[0].length).trim()
  }

  // 4. Extract battery size
  let batteryKwh: number | undefined
  s = s.replace(/\((\d+(?:\.\d+)?)\s*kWh\)/gi, (_, kw) => { batteryKwh = parseFloat(kw); return '' })
  s = s.replace(/\b(\d+(?:\.\d+)?)\s*kWh\b/gi, (_, kw) => {
    const v = parseFloat(kw)
    if (v >= 5 && v <= 200) { batteryKwh = v; return '' }
    return _
  })
  s = s.replace(/\s+/g, ' ').trim()

  // 5. Extract drivetrain tokens
  let drivetrain: 'RWD' | 'AWD' | 'FWD' | undefined
  for (const [token, dt] of Object.entries(DRIVETRAIN_TOKENS)) {
    const re = new RegExp(`\\b${token}\\b`, 'i')
    if (re.test(s)) {
      drivetrain = dt
      break
    }
  }

  // 6. Identify make
  let make = ''
  let rest = s
  for (const m of KNOWN_MAKES) {
    if (s.startsWith(m + ' ') || s === m) {
      make = m
      rest = s.slice(m.length).trim()
      break
    }
  }

  // Fallback: Tesla brand inference for known Tesla models
  if (!make) {
    if (/^Model [SXY3]|^Cybertruck|^Roadster/i.test(s)) {
      make = 'Tesla'
    } else if (/^Model X/i.test(s)) {
      make = 'Tesla'
    }
  }

  // Normalize VW -> Volkswagen (for display; slug uses VW)
  const makeSlugPart = make === 'Volkswagen' ? 'vw' : slugify(make)

  // 7. Normalize trim synonyms
  for (const [from, to] of Object.entries(TRIM_SYNONYMS)) {
    const re = new RegExp(`\\b${escapeRegex(from)}\\b`, 'gi')
    rest = rest.replace(re, to)
  }

  // 8. Parse model + variant from rest
  const parts = rest.split(/\s+/)
  const model = make ? parts.slice(0, guessModelWords(parts)).join(' ') : s
  const variantParts = make ? parts.slice(guessModelWords(parts)) : []

  // Keep generation tags in variant
  const variant = variantParts.length > 0 ? variantParts.join(' ').trim() : undefined

  // 9. Build slug
  const slugParts = [makeSlugPart, slugify(model)]
  if (variant) slugParts.push(slugify(variant))
  if (batteryKwh) slugParts.push(`${batteryKwh}kwh`)
  const id = slugParts.filter(Boolean).join('-').replace(/-+/g, '-').toLowerCase()

  // Check alias again by proposed id
  const idAlias = [...aliasMap.entries()].find(([, v]) => v.id === id)
  if (idAlias) {
    return buildFromAlias(idAlias[1], s, original)
  }

  const confidence = make ? (variant ? 0.85 : 0.75) : 0.4

  return { id, make: make || 'Unknown', model, variant, modelYear, batteryKwh, drivetrain, confidence, raw: original }
}

function buildFromAlias(entry: AliasEntry, _s: string, original: string): CanonicalResult {
  return {
    id: entry.id,
    make: entry.make ?? 'Unknown',
    model: entry.model ?? entry.id,
    variant: entry.variant != null ? String(entry.variant) : undefined,
    batteryKwh: entry.batteryKwh,
    confidence: 1.0,
    raw: original,
  }
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function guessModelWords(parts: string[]): number {
  // Heuristic: most EV model names are 1-2 words
  // Examples: "Model 3", "Ioniq 5", "e-tron", "EQC", "iX", "i4"
  if (parts.length <= 1) return 1
  // If second part is a number, letter-number combo, or short code → it's part of the model name
  if (/^[A-Z]?\d+$/.test(parts[1]) || /^[A-Z]{1,3}$/.test(parts[1]) || /^e-/.test(parts[1])) {
    return 2
  }
  return 1
}
