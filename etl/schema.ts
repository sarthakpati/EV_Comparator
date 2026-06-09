import { z } from 'zod'

export const MetricDirectionSchema = z.enum(['higher-better', 'lower-better', 'neutral'])
export type MetricDirection = z.infer<typeof MetricDirectionSchema>

export const UnitSchema = z.enum([
  'km', 'mi', 'kWh', 'Wh/km', 'kg', 'dB', 's', 'm',
  'boxes', '%', 'hp', 'km/h', 'NOK', 'EUR', 'USD', 'GBP', 'year', 'min', 'h',
])
export type Unit = z.infer<typeof UnitSchema>

export const MetricGroupSchema = z.enum([
  'range', 'efficiency', 'charging', 'performance',
  'comfort', 'practicality', 'battery', 'cost',
])
export type MetricGroup = z.infer<typeof MetricGroupSchema>

export const MetricDefSchema = z.object({
  id: z.string(),
  label: z.string(),
  group: MetricGroupSchema,
  unit: UnitSchema,
  direction: MetricDirectionSchema,
  precision: z.number().int().min(0).max(4),
  description: z.string(),
  conditioned: z.boolean().optional(),
})
export type MetricDef = z.infer<typeof MetricDefSchema>

export const ConditionSchema = z.object({
  speed: z.number().optional(),
  season: z.enum(['summer', 'winter']).optional(),
  surface: z.enum(['dry', 'wet']).optional(),
  temp: z.number().optional(),
})
export type Condition = z.infer<typeof ConditionSchema>

export const MetricValueSchema = z.object({
  value: z.number().nullable(),
  unit: UnitSchema,
  condition: ConditionSchema.optional(),
  date: z.string().optional(),
  source: z.string(),
  raw: z.string().optional(),
})
export type MetricValue = z.infer<typeof MetricValueSchema>

export const MarketCodeSchema = z.enum(['US', 'EU', 'UK', 'NO', 'DE'])
export type MarketCode = z.infer<typeof MarketCodeSchema>

export const MoneySchema = z.object({
  amount: z.number(),
  currency: z.enum(['USD', 'EUR', 'GBP', 'NOK']),
})
export type Money = z.infer<typeof MoneySchema>

export const MarketInfoSchema = z.object({
  market: MarketCodeSchema,
  available: z.enum(['available', 'upcoming', 'discontinued', 'unavailable']),
  launchYear: z.number().int().optional(),
  launchDate: z.string().optional(),
  startingMsrp: MoneySchema.optional(),
  approximate: z.boolean().optional(),
  source: z.string(),
  notes: z.string().optional(),
})
export type MarketInfo = z.infer<typeof MarketInfoSchema>

export const MarketConfigSchema = z.object({
  code: MarketCodeSchema,
  name: z.string(),
  currency: z.enum(['USD', 'EUR', 'GBP', 'NOK']),
  units: z.enum(['metric', 'imperial']),
  flag: z.string(),
})
export type MarketConfig = z.infer<typeof MarketConfigSchema>

export const VehicleSchema = z.object({
  id: z.string(),
  make: z.string(),
  model: z.string(),
  variant: z.string().optional(),
  modelYear: z.union([z.number().int(), z.tuple([z.number().int(), z.number().int()])]).optional(),
  batteryKwh: z.number().optional(),
  drivetrain: z.enum(['RWD', 'AWD', 'FWD']).optional(),
  bodyType: z.string().optional(),
  segment: z.string().optional(),
  imageUrl: z.string().optional(),
  officialUrl: z.string().optional(),
  markets: z.record(MarketCodeSchema, MarketInfoSchema).optional(),
  aliases: z.array(z.string()),
  metrics: z.record(z.string(), z.array(MetricValueSchema)),
  coverage: z.number().min(0).max(1),
})
export type Vehicle = z.infer<typeof VehicleSchema>

export const DatasetSchema = z.object({
  vehicles: z.array(VehicleSchema),
  metrics: z.array(MetricDefSchema),
  markets: z.array(MarketCodeSchema),
  marketConfigs: z.array(MarketConfigSchema).optional(),
  generatedAt: z.string(),
  sourceAttribution: z.string(),
})
export type Dataset = z.infer<typeof DatasetSchema>

export const CoverageSchema = z.object({
  byVehicle: z.record(z.string(), z.number()),
  byMetric: z.record(z.string(), z.number()),
})
export type Coverage = z.infer<typeof CoverageSchema>
