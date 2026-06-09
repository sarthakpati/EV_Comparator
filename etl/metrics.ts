import type { MetricDef } from './schema'

export const METRIC_DEFS: MetricDef[] = [
  // Range & efficiency
  {
    id: 'range_90_summer', label: 'Range @ 90 km/h (Summer)', group: 'range',
    unit: 'km', direction: 'higher-better', precision: 0, conditioned: true,
    description: 'Real-world range measured at 90 km/h cruise speed in summer conditions (Bjørn Nyland test).',
  },
  {
    id: 'range_120_summer', label: 'Range @ 120 km/h (Summer)', group: 'range',
    unit: 'km', direction: 'higher-better', precision: 0, conditioned: true,
    description: 'Real-world range measured at 120 km/h cruise speed in summer conditions.',
  },
  {
    id: 'range_90_winter', label: 'Range @ 90 km/h (Winter)', group: 'range',
    unit: 'km', direction: 'higher-better', precision: 0, conditioned: true,
    description: 'Real-world range measured at 90 km/h cruise speed in winter conditions.',
  },
  {
    id: 'range_120_winter', label: 'Range @ 120 km/h (Winter)', group: 'range',
    unit: 'km', direction: 'higher-better', precision: 0, conditioned: true,
    description: 'Real-world range measured at 120 km/h cruise speed in winter conditions.',
  },
  {
    id: 'consumption_90_summer', label: 'Consumption @ 90 (Summer)', group: 'efficiency',
    unit: 'Wh/km', direction: 'lower-better', precision: 0, conditioned: true,
    description: 'Energy consumption per km at 90 km/h in summer.',
  },
  {
    id: 'consumption_120_summer', label: 'Consumption @ 120 (Summer)', group: 'efficiency',
    unit: 'Wh/km', direction: 'lower-better', precision: 0, conditioned: true,
    description: 'Energy consumption per km at 120 km/h in summer.',
  },
  {
    id: 'battery_capacity', label: 'Battery Capacity', group: 'battery',
    unit: 'kWh', direction: 'higher-better', precision: 1,
    description: 'Usable battery capacity as measured during the test.',
  },
  {
    id: 'range_75pct_km', label: '75% Charge Range (km)', group: 'charging',
    unit: 'km', direction: 'higher-better', precision: 0,
    description: 'Range achievable after charging to 75% — Bjørn\'s effective range metric.',
  },
  {
    id: 'charge_time_75pct', label: 'Charge Time to 75%', group: 'charging',
    unit: 'min', direction: 'lower-better', precision: 0,
    description: 'Time in minutes to charge to 75% from near-empty.',
  },
  {
    id: 'charge_speed_75pct', label: 'Effective Speed @ 75%', group: 'charging',
    unit: 'km/h', direction: 'higher-better', precision: 1,
    description: 'Effective travel speed accounting for charge stops: 75% range ÷ charge time.',
  },

  // 1000 km
  {
    id: 'roadtrip_1000km_time', label: '1000 km Trip Time', group: 'charging',
    unit: 'min', direction: 'lower-better', precision: 0,
    description: 'Total time for a 1000 km road trip including all charging stops (Bjørn\'s flagship benchmark).',
  },
  {
    id: 'roadtrip_avg_speed', label: '1000 km Avg Speed', group: 'charging',
    unit: 'km/h', direction: 'higher-better', precision: 1,
    description: 'Average speed including charging during the 1000 km trip.',
  },
  {
    id: 'roadtrip_consumption', label: '1000 km Consumption', group: 'efficiency',
    unit: 'Wh/km', direction: 'lower-better', precision: 0,
    description: 'Average energy consumption during the 1000 km road trip.',
  },
  {
    id: 'roadtrip_stops', label: 'Charging Stops (1000 km)', group: 'charging',
    unit: 'km/h', direction: 'lower-better', precision: 0,
    description: 'Number of charging stops during the 1000 km trip.',
  },

  // Acceleration
  {
    id: 'accel_0_100', label: '0–100 km/h', group: 'performance',
    unit: 's', direction: 'lower-better', precision: 2,
    description: '0–100 km/h acceleration time (rolling start, Bjørn\'s method).',
  },
  {
    id: 'accel_0_100_1ft', label: '0–100 (1 ft start)', group: 'performance',
    unit: 's', direction: 'lower-better', precision: 2,
    description: '0–100 km/h from 1-foot start (standard drag timing).',
  },
  {
    id: 'weight_kg', label: 'Weight', group: 'practicality',
    unit: 'kg', direction: 'lower-better', precision: 0,
    description: 'Curb weight as measured on a scale.',
  },
  {
    id: 'hp', label: 'Horsepower', group: 'performance',
    unit: 'hp', direction: 'higher-better', precision: 0,
    description: 'Peak system power output in horsepower.',
  },

  // Noise
  {
    id: 'noise_80', label: 'Cabin Noise @ 80 km/h', group: 'comfort',
    unit: 'dB', direction: 'lower-better', precision: 1,
    description: 'Cabin noise level at 80 km/h cruise.',
  },
  {
    id: 'noise_100', label: 'Cabin Noise @ 100 km/h', group: 'comfort',
    unit: 'dB', direction: 'lower-better', precision: 1,
    description: 'Cabin noise level at 100 km/h cruise.',
  },
  {
    id: 'noise_120', label: 'Cabin Noise @ 120 km/h', group: 'comfort',
    unit: 'dB', direction: 'lower-better', precision: 1,
    description: 'Cabin noise level at 120 km/h cruise.',
  },
  {
    id: 'noise_avg', label: 'Cabin Noise (Average)', group: 'comfort',
    unit: 'dB', direction: 'lower-better', precision: 1,
    description: 'Average cabin noise across 80/100/120 km/h.',
  },

  // Cargo
  {
    id: 'cargo_trunk', label: 'Trunk (banana boxes)', group: 'practicality',
    unit: 'boxes', direction: 'higher-better', precision: 0,
    description: 'Trunk cargo capacity measured in standard banana boxes.',
  },
  {
    id: 'cargo_seats_folded', label: 'Cargo (seats folded)', group: 'practicality',
    unit: 'boxes', direction: 'higher-better', precision: 0,
    description: 'Cargo capacity with rear seats folded, in banana boxes.',
  },

  // Braking
  {
    id: 'braking_distance', label: 'Braking Distance (100→0)', group: 'performance',
    unit: 'm', direction: 'lower-better', precision: 1,
    description: 'Braking distance from 100 km/h to standstill.',
  },

  // Degradation
  {
    id: 'degradation_pct', label: 'Battery Degradation', group: 'battery',
    unit: '%', direction: 'lower-better', precision: 1,
    description: 'Battery capacity loss as a percentage of original capacity.',
  },

  // Market
  {
    id: 'price_usd', label: 'Starting Price', group: 'cost',
    unit: 'USD', direction: 'lower-better', precision: 0,
    description: 'Approximate starting MSRP (pre-incentive). Shown in the selected market\'s currency, or as a USD range across markets in the "All markets" view.',
  },
  {
    id: 'launch_year', label: 'US Launch Year', group: 'cost',
    unit: 'year', direction: 'neutral', precision: 0,
    description: 'Year the vehicle became available in the US market.',
  },
]

export const METRIC_MAP = new Map(METRIC_DEFS.map(m => [m.id, m]))
