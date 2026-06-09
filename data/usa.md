# USA market data

Market-specific overlay for the **United States**. Joins to the test data by vehicle
(make + model, with variant where given). This is the first of potentially several market
files (`usa.md`, future `eu.md`, `uk.md`, …). See `../PLAN.md` §3.6 / §5.4 for how the ETL
ingests it.

**Conventions & caveats (read before trusting a number):**
- **US launch** = calendar year the model became available/orderable in the US market
  (`YYYY`, or `YYYY-MM` where notable). Not the model year.
- **Starting MSRP (USD)** = approximate base price, **pre-incentive**, excluding destination/options,
  for the most representative recent model year. EV prices change frequently — treat as a starting
  point and **verify against the manufacturer before relying on it.**
- **Status**: `Available` · `Upcoming` (confirmed for US, not yet on sale — MSRP often TBD) ·
  `Discontinued` (was sold in US, no longer) · `CA-only` (California-only).
- Blank MSRP = not yet announced / to be confirmed.
- This file is **community-maintained**. PRs to correct prices, dates, and add trims are welcome.
- Many vehicles in the test data are **not sold in the US** and are intentionally absent (see the
  list below the table). Their cells will simply have no US data.

| Make | Model | Variant | Body | US launch | Starting MSRP (USD) | Status | Notes |
|:-----|:------|:--------|:-----|:----------|--------------------:|:-------|:------|
| Tesla | Model 3 | RWD | Sedan | 2024 | 42490 | Available | Highland refresh |
| Tesla | Model 3 | Long Range AWD | Sedan | 2024 | 47490 | Available | |
| Tesla | Model 3 | Performance | Sedan | 2024 | 54990 | Available | |
| Tesla | Model 3 | Standard | Sedan | 2025-10 | 36990 | Available | Stripped "Standard" trim |
| Tesla | Model Y | RWD | SUV | 2025 | 44990 | Available | Juniper refresh |
| Tesla | Model Y | Long Range AWD | SUV | 2025 | 48990 | Available | |
| Tesla | Model Y | Performance | SUV | 2025 | 51490 | Available | |
| Tesla | Model S | Long Range | Sedan | 2021 | 74990 | Available | Palladium |
| Tesla | Model S | Plaid | Sedan | 2021 | 89990 | Available | |
| Tesla | Model X | Long Range | SUV | 2021 | 79990 | Available | |
| Tesla | Model X | Plaid | SUV | 2021 | 94990 | Available | |
| Tesla | Cybertruck | AWD | Pickup | 2024 | 79990 | Available | |
| Tesla | Cybertruck | Long Range RWD | Pickup | 2025 | 69990 | Available | dataset: "Cybertruck Long Range" |
| Hyundai | Ioniq 5 | RWD | SUV | 2021 | 42600 | Available | US-built from 2025 |
| Hyundai | Ioniq 5 | N | SUV | 2024 | 66200 | Available | Performance |
| Hyundai | Ioniq 6 | RWD | Sedan | 2023 | 37850 | Available | |
| Hyundai | Ioniq 9 | AWD | SUV | 2025 | 58955 | Available | 3-row |
| Hyundai | Kona Electric | | SUV | 2019 | 32675 | Available | 2nd gen 2024 |
| Hyundai | Ioniq Electric | 28/38 kWh | Hatchback | 2017 | 33045 | Discontinued | US ended 2021; dataset: "Ioniq 28/38 kWh" |
| Kia | EV6 | RWD | SUV | 2022 | 42600 | Available | Facelift 2025 |
| Kia | EV6 | GT | SUV | 2023 | 61600 | Available | |
| Kia | EV9 | | SUV | 2024 | 54900 | Available | 3-row |
| Kia | Niro EV | | SUV | 2019 | 39600 | Available | 1st gen "e-Niro"; 2nd gen 2023 |
| Kia | Soul EV | | SUV | 2015 | 33950 | Discontinued | US sales ended ~2020 |
| Kia | EV4 | | Sedan | 2026 | | Upcoming | US launch ~2026, price TBD |
| Kia | EV3 | | SUV | 2026 | | Upcoming | US launch TBD |
| Ford | Mustang Mach-E | | SUV | 2021 | 39995 | Available | |
| Ford | Mustang Mach-E | GT | SUV | 2021 | 53995 | Available | |
| Ford | F-150 Lightning | | Pickup | 2022 | 54995 | Available | Pro trim; "SR" = standard range |
| BMW | i4 | eDrive40 | Sedan | 2022 | 57300 | Available | |
| BMW | i4 | M50 | Sedan | 2022 | 69700 | Available | |
| BMW | i5 | eDrive40 | Sedan | 2024 | 67100 | Available | |
| BMW | i5 | M60 | Sedan | 2024 | 84100 | Available | |
| BMW | i7 | xDrive60 | Sedan | 2023 | 105700 | Available | |
| BMW | iX | xDrive50 | SUV | 2022 | 87250 | Available | |
| BMW | iX3 | 50 xDrive | SUV | 2026 | | Upcoming | Neue Klasse; price TBD (~60000 est.) |
| BMW | i3 | | Hatchback | 2014 | 44450 | Discontinued | US ended 2021 |
| Mercedes | EQS | 450+ | Sedan | 2022 | 104400 | Available | |
| Mercedes | EQS | 580 4Matic | Sedan | 2022 | 126000 | Available | |
| Mercedes | EQS SUV | | SUV | 2023 | 105550 | Available | |
| Mercedes | EQS SUV | Maybach 680 | SUV | 2024 | 179900 | Available | |
| Mercedes | EQE | 350 | Sedan | 2023 | 74900 | Available | |
| Mercedes | EQE SUV | | SUV | 2023 | 77900 | Available | |
| Mercedes | EQE | 53 AMG | Sedan | 2023 | 107400 | Available | AMG |
| Mercedes | EQB | 250+ | SUV | 2022 | 52750 | Available | |
| Mercedes | G580 | | SUV | 2025 | 162650 | Available | Electric G-Class |
| Mercedes | CLA | | Sedan | 2026 | | Upcoming | New CLA EV; price TBD (~50000 est.) |
| Audi | Q8 e-tron | 55 | SUV | 2019 | 74400 | Available | Launched as "e-tron 55", renamed 2024 |
| Audi | e-tron GT | | Sedan | 2021 | 106500 | Available | |
| Audi | RS e-tron GT | | Sedan | 2021 | 148000 | Available | RS / performance |
| Audi | Q4 e-tron | | SUV | 2022 | 49800 | Available | |
| Audi | Q6 e-tron | | SUV | 2025 | 63800 | Available | |
| Audi | A6 e-tron | | Sedan | 2026 | | Upcoming | US ~2025/26; price TBD (~66000 est.) |
| VW | ID.4 | | SUV | 2021 | 39735 | Available | dataset: "ID4" |
| VW | ID. Buzz | | Van | 2024 | 59995 | Available | US gets LWB "Pro S"; dataset: "ID Buzz" |
| VW | ID.7 | | Sedan | | Upcoming | US launch postponed/uncertain |
| Volvo | EX90 | | SUV | 2025 | 79995 | Available | |
| Volvo | XC40 | | SUV | 2021 | 53000 | Available | Renamed EX40 in 2024 |
| Volvo | C40 | | SUV | 2022 | 53000 | Available | Renamed EC40 in 2024 |
| Volvo | EX30 | | SUV | 2025 | 44900 | Available | Delayed; ~46195 in 2025 |
| Volvo | ES90 | | Sedan | 2026 | | Upcoming | US availability TBD |
| Polestar | Polestar 2 | | Sedan | 2021 | 49900 | Available | |
| Polestar | Polestar 3 | | SUV | 2025 | 67500 | Available | |
| Polestar | Polestar 4 | | SUV | 2025 | 54900 | Available | |
| Porsche | Taycan | | Sedan | 2020 | 99400 | Available | Refreshed 2025 |
| Porsche | Taycan | Turbo S | Sedan | 2020 | 209000 | Available | |
| Porsche | Macan | 4 | SUV | 2025 | 78800 | Available | |
| Porsche | Macan | Turbo | SUV | 2025 | 105300 | Available | |
| Nissan | Leaf | | Hatchback | 2011 | 28140 | Available | New gen 2025/26 |
| Nissan | Ariya | | SUV | 2023 | 39590 | Available | |
| Mini | Cooper SE | | Hatchback | 2020 | 30900 | Discontinued | 1st-gen US ended 2024 |
| Mini | Countryman SE | All4 | SUV | 2025 | 45200 | Available | |
| Lexus | RZ | 450e | SUV | 2023 | 58150 | Available | |
| Lexus | RZ | 550e F Sport | SUV | 2025 | 62000 | Available | price est. |
| Jaguar | I-Pace | | SUV | 2018 | 69900 | Discontinued | US ended ~2023 |
| Lucid | Air | | Sedan | 2021 | 69900 | Available | Dream Edition was launch-limited |
| Fisker | Ocean | Extreme | SUV | 2023 | 61499 | Discontinued | Fisker bankrupt 2024 |
| Toyota | bZ4X | | SUV | 2022 | 42000 | Available | |
| Toyota | Mirai | | Sedan | 2021 | 50190 | CA-only | Hydrogen FCEV; California only |
| Lotus | Eletre | | SUV | 2024 | 107000 | Available | |
| Lotus | Emeya | | Sedan | 2025 | | Upcoming | price TBD (~100000 est.) |

## Not sold in the US (intentionally excluded)

Brands in the test data with **no US passenger-EV sales** (as of early 2026): Nio, Xpeng, BYD, Zeekr,
MG / MG4 / MGS5 / MGS6 / MG5, Maxus, Hongqi, Renault, Opel, Citroën, Peugeot, Škoda, Cupra, DS, Fiat,
Deepal, HiPhi, Ora, Leapmotor, Seres, Voyah, JAC, Jaecoo, GAC, Denza, Avatr, Smart, KGM/SsangYong.

Model-level exclusions from brands that *do* sell in the US: Honda e / e:Ny1, Mazda 6e, Mazda MX-30
(US run was CA-only and ended ~2023), Jeep Avenger, Hyundai Inster, VW ID.3 / ID.5 / e-Up / e-Golf
(e-Golf was US 2015–2019) / e-Crafter, Mercedes EQA / EQC / EQV / eVito, Kia PV5 / Ceed, Nissan
X-Trail e-Power / Townstar / e-NV200, BMW iX1 / iX2, Lexus UX 300e.
