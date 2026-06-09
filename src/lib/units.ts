export type UnitSystem = 'metric' | 'imperial'

export function kmToMi(km: number): number { return km * 0.621371 }
export function miToKm(mi: number): number { return mi * 1.60934 }

export function formatValue(
  value: number | null,
  unit: string,
  precision: number,
  unitSystem: UnitSystem = 'metric',
): string {
  if (value === null) return '—'

  let v = value
  let u = unit

  if (unitSystem === 'imperial') {
    if (unit === 'km') { v = kmToMi(v); u = 'mi' }
    else if (unit === 'km/h') { v = v * 0.621371; u = 'mph' }
    else if (unit === 'kg') { v = v * 2.20462; u = 'lbs' }
    else if (unit === 'm') { v = v * 3.28084; u = 'ft' }
    else if (unit === 'Wh/km') { v = v * 1.60934; u = 'Wh/mi' }
  }

  const formatted = v.toLocaleString('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })

  const unitLabel: Record<string, string> = {
    km: 'km', mi: 'mi', kWh: 'kWh', 'Wh/km': 'Wh/km', 'Wh/mi': 'Wh/mi',
    kg: 'kg', lbs: 'lbs', dB: 'dB', s: 's', m: 'm', ft: 'ft',
    boxes: 'boxes', '%': '%', hp: 'hp', 'km/h': 'km/h', mph: 'mph',
    USD: '$', EUR: '€', GBP: '£', NOK: 'kr',
    min: 'min', h: 'h', year: '',
  }

  const lbl = unitLabel[u] ?? u
  if (u === 'USD') return `$${formatted}`
  if (u === 'EUR') return `€${formatted}`
  if (u === 'GBP') return `£${formatted}`
  if (u === 'NOK') return `kr ${formatted}`
  if (u === 'year') return formatted
  return `${formatted} ${lbl}`.trim()
}

export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  return `${h}:${String(m).padStart(2, '0')}`
}
