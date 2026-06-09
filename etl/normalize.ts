import type { Unit } from './schema'

// Null sentinels
const NULL_STRINGS = new Set(['nan', 'nat', 'none', '-', 'n/a', 'n.a.', ''])

/** Parse a potentially messy numeric cell to a number or null.
 *  Handles: decimal commas, space thousands separators, embedded units,
 *  leading/trailing whitespace, negative values, sentinel strings.
 */
export function parseNumeric(raw: string | number | null | undefined): number | null {
  if (raw === null || raw === undefined) return null
  if (typeof raw === 'number') return isFinite(raw) ? raw : null
  const s = String(raw).trim()
  if (NULL_STRINGS.has(s.toLowerCase())) return null

  // Strip embedded unit suffixes (e.g. "125 kWh", "94.7 %", "250 km/h")
  const stripped = s.replace(/\s*(kWh|Wh\/km|km\/h|km|mi|dB|%|kg|hp|s\b|m\b|h\b|min)\s*$/i, '').trim()

  // Replace decimal comma with dot (only between digits)
  const normalized = stripped.replace(/(\d),(\d)/g, '$1.$2')

  // Remove space/NBSP thousands separators (only between digit groups)
  const cleaned = normalized.replace(/(\d)[  ](\d{3})/g, '$1$2')

  const n = parseFloat(cleaned)
  if (isNaN(n)) return null

  // Sentinel: -1 is used as "N/A" in some sheets
  if (n === -1 && stripped === '-1') return null

  return n
}

/** Parse a temperature range string into {min, max, avg}.
 *  Handles: "7-14°C", "-5-5°C", "-6~-3°C", "16 ~22°C", "10°C" (single value)
 */
export function parseTempRange(raw: string | null | undefined): { min: number; max: number; avg: number } | null {
  if (!raw) return null
  const s = String(raw).replace(/°C/gi, '').trim()
  if (NULL_STRINGS.has(s.toLowerCase())) return null

  // Try to find a separator between two temp values.
  // The tricky case: "-5-5" means "-5 to 5" not "negative 5 minus 5"
  // Strategy: find last occurrence of '~' or '-' that is NOT at the start and NOT after 'e'
  let sepIdx = -1
  let sepChar = ''

  // First try ~
  const tildeIdx = s.indexOf('~')
  if (tildeIdx > 0) {
    sepIdx = tildeIdx
    sepChar = '~'
  } else {
    // Find '-' that acts as separator: must not be at position 0, and must not immediately follow a digit
    // that is itself preceded by a '-' (i.e. we want the dash between -6 and -3 not the sign)
    // Scan right to left for the last '-' that has a digit on both sides (allowing sign on left)
    for (let i = s.length - 1; i > 0; i--) {
      if (s[i] === '-') {
        const rightOk = i < s.length - 1 && (s[i + 1] === '-' || /\d/.test(s[i + 1]))
        const leftOk = /\d/.test(s[i - 1])
        if (leftOk && rightOk) {
          sepIdx = i
          sepChar = '-'
          break
        }
      }
    }
  }

  if (sepIdx > 0) {
    const leftStr = s.slice(0, sepIdx).trim()
    const rightStr = s.slice(sepIdx + 1).trim()
    const min = parseFloat(leftStr)
    const max = parseFloat(rightStr)
    if (!isNaN(min) && !isNaN(max)) {
      return { min, max, avg: (min + max) / 2 }
    }
  }

  // Single value
  const single = parseFloat(s)
  if (!isNaN(single)) return { min: single, max: single, avg: single }
  return null
}

/** Parse an ISO or partial date string. Strips time component. */
export function parseDate(raw: string | null | undefined): string | null {
  if (!raw) return null
  const s = String(raw).trim()
  if (NULL_STRINGS.has(s.toLowerCase())) return null
  // Match YYYY-MM-DD or YYYY-MM or YYYY
  const m = s.match(/^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?/)
  if (!m) return null
  const parts = [m[1]]
  if (m[2]) parts.push(m[2])
  if (m[3]) parts.push(m[3])
  return parts.join('-')
}

/** Parse banana cargo strings: "17+4" → {total:21, components:[17,4]}, "23" → {total:23, components:[23]} */
export function parseBanana(raw: string | null | undefined): { total: number; components: number[] } | null {
  if (!raw) return null
  const s = String(raw).trim()
  if (NULL_STRINGS.has(s.toLowerCase())) return null
  const parts = s.split('+').map(p => parseInt(p.trim(), 10))
  if (parts.some(isNaN)) return null
  return { total: parts.reduce((a, b) => a + b, 0), components: parts }
}

/** Parse percent strings: "94,7 %" → 94.7, "0.0 %" → 0.0 */
export function parsePercent(raw: string | number | null | undefined): number | null {
  if (raw === null || raw === undefined) return null
  if (typeof raw === 'number') return isFinite(raw) ? raw : null
  const s = String(raw).replace(/%/g, '').trim()
  return parseNumeric(s)
}

/** Parse a time string like "08:35" or "1:12:34" into total minutes */
export function parseTimeToMinutes(raw: string | null | undefined): number | null {
  if (!raw) return null
  const s = String(raw).trim()
  if (NULL_STRINGS.has(s.toLowerCase())) return null
  const parts = s.split(':').map(Number)
  if (parts.some(isNaN)) return null
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  if (parts.length === 3) return parts[0] * 60 + parts[1] + parts[2] / 60
  return null
}

/** Extract unit from a cell string like "125 kWh" → {value: 125, unit: 'kWh'} */
export function extractUnit(raw: string | null | undefined): { value: number | null; unit: Unit | null } {
  if (!raw) return { value: null, unit: null }
  const s = String(raw).trim()
  const unitMatch = s.match(/(kWh|Wh\/km|km\/h|km|mi|dB|%|kg|hp|s|m|h|min)\s*$/i)
  const unit = unitMatch ? (unitMatch[1].toLowerCase() as Unit) : null
  const value = parseNumeric(s)
  return { value, unit }
}
