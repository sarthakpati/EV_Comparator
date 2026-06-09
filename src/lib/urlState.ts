import { parseAsString, parseAsArrayOf, parseAsBoolean, parseAsInteger } from 'nuqs'

export const marketParser = parseAsString.withDefault('US')
export const conditionSpeedParser = parseAsInteger.withDefault(90)
export const conditionSeasonParser = parseAsString.withDefault('summer')
export const unitSystemParser = parseAsString.withDefault('metric')
export const visibleMetricsParser = parseAsArrayOf(parseAsString).withDefault([])
export const sortStateParser = parseAsString.withDefault('')
export const filtersParser = parseAsString.withDefault('')
export const viewTypeParser = parseAsString.withDefault('matrix')
export const compareIdsParser = parseAsArrayOf(parseAsString).withDefault([])
export const darkModeParser = parseAsBoolean.withDefault(false)
export const focusVehicleParser = parseAsString
