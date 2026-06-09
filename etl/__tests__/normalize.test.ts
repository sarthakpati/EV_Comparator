import { describe, it, expect } from 'vitest'
import {
  parseNumeric, parseTempRange, parseDate, parseBanana, parsePercent, parseTimeToMinutes,
} from '../normalize'

describe('parseNumeric', () => {
  it('handles clean integers', () => { expect(parseNumeric('225')).toBe(225) })
  it('handles decimal dots', () => { expect(parseNumeric('94.7')).toBeCloseTo(94.7) })
  it('handles decimal comma', () => { expect(parseNumeric('94,7')).toBeCloseTo(94.7) })
  it('removes space thousands separator', () => { expect(parseNumeric('1 134')).toBe(1134) })
  it('removes NBSP thousands separator', () => { expect(parseNumeric('11 000')).toBe(11000) })
  it('returns null for "nan"', () => { expect(parseNumeric('nan')).toBeNull() })
  it('returns null for empty string', () => { expect(parseNumeric('')).toBeNull() })
  it('returns null for null', () => { expect(parseNumeric(null)).toBeNull() })
  it('returns null for undefined', () => { expect(parseNumeric(undefined)).toBeNull() })
  it('handles negative values', () => { expect(parseNumeric('-5')).toBe(-5) })
  it('strips embedded kWh unit', () => { expect(parseNumeric('125 kWh')).toBe(125) })
  it('strips embedded % unit', () => { expect(parseNumeric('94.7 %')).toBeCloseTo(94.7) })
  it('strips embedded km unit', () => { expect(parseNumeric('3333 km')).toBe(3333) })
  it('passthrough for numeric type', () => { expect(parseNumeric(42)).toBe(42) })
  it('returns null for Infinity', () => { expect(parseNumeric(Infinity)).toBeNull() })
  it('handles float with comma decimals', () => { expect(parseNumeric('2,8')).toBeCloseTo(2.8) })
  it('large spaced number', () => { expect(parseNumeric('90 000')).toBe(90000) })
})

describe('parseTempRange', () => {
  it('simple range 7-14', () => {
    const r = parseTempRange('7-14°C')
    expect(r).toEqual({ min: 7, max: 14, avg: 10.5 })
  })
  it('negative min: -5-5', () => {
    const r = parseTempRange('-5-5°C')
    expect(r).toEqual({ min: -5, max: 5, avg: 0 })
  })
  it('both negative: -6~-3', () => {
    const r = parseTempRange('-6~-3°C')
    expect(r).toEqual({ min: -6, max: -3, avg: -4.5 })
  })
  it('tilde separator with spaces', () => {
    const r = parseTempRange('16 ~22°C')
    expect(r).toEqual({ min: 16, max: 22, avg: 19 })
  })
  it('single value', () => {
    const r = parseTempRange('10°C')
    expect(r).toEqual({ min: 10, max: 10, avg: 10 })
  })
  it('returns null for empty', () => { expect(parseTempRange('')).toBeNull() })
  it('returns null for null', () => { expect(parseTempRange(null)).toBeNull() })
})

describe('parseDate', () => {
  it('parses YYYY-MM-DD', () => { expect(parseDate('2023-03-26')).toBe('2023-03-26') })
  it('strips time component', () => { expect(parseDate('2023-03-26 00:00:00')).toBe('2023-03-26') })
  it('parses YYYY-MM', () => { expect(parseDate('2023-03')).toBe('2023-03') })
  it('parses YYYY', () => { expect(parseDate('2023')).toBe('2023') })
  it('returns null for empty', () => { expect(parseDate('')).toBeNull() })
  it('returns null for null', () => { expect(parseDate(null)).toBeNull() })
})

describe('parseBanana', () => {
  it('parses simple number', () => {
    expect(parseBanana('23')).toEqual({ total: 23, components: [23] })
  })
  it('parses compound 17+4', () => {
    expect(parseBanana('17+4')).toEqual({ total: 21, components: [17, 4] })
  })
  it('parses 2+15', () => {
    expect(parseBanana('2+15')).toEqual({ total: 17, components: [2, 15] })
  })
  it('returns null for empty', () => { expect(parseBanana('')).toBeNull() })
  it('returns null for nan', () => { expect(parseBanana('nan')).toBeNull() })
})

describe('parsePercent', () => {
  it('parses "94,7 %"', () => { expect(parsePercent('94,7 %')).toBeCloseTo(94.7) })
  it('parses "0.0 %"', () => { expect(parsePercent('0.0 %')).toBeCloseTo(0) })
  it('passthrough number', () => { expect(parsePercent(50.5)).toBeCloseTo(50.5) })
  it('returns null for empty', () => { expect(parsePercent('')).toBeNull() })
})

describe('parseTimeToMinutes', () => {
  it('parses HH:MM', () => { expect(parseTimeToMinutes('08:35')).toBe(515) })
  it('parses HH:MM:SS', () => { expect(parseTimeToMinutes('01:12:30')).toBeCloseTo(72.5) })
  it('returns null for empty', () => { expect(parseTimeToMinutes('')).toBeNull() })
})
