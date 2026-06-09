# EV Comparator — Build Plan

> A comprehensive, execution-ready plan for a coding agent to build an attractive, ultra-responsive,
> open-source EV comparison web app, deployed on Railway, powered by the dataset in `./data`.

---

## 0. TL;DR for the coding agent

Build a **Vite + React + TypeScript SPA** whose centerpiece is an **interactive vehicle × spec
comparison matrix** (heatmap-colored, sort any column, multi-level sort, filter, save views to a
shareable URL) plus a secondary **scatter / Pareto view** for two-axis trade-off analysis. All data
is **pre-baked into static JSON at build time** by a TypeScript ETL pipeline — no runtime database.
Per-market overlays (price, launch date, availability) layer on top, **starting with the USA**
(`data/usa.md`). Deploy as a static bundle served on Railway.

The product is easy. **The data is the hard part.** Spend Phase 0 entirely on ETL: parsing
European-formatted numbers, resolving 707 messy car-name strings down to canonical vehicles, and
modeling metrics as `(metric, condition)` pairs. Everything else depends on getting that right.

**First commands** are in §16.

---

## 1. Product vision

The user's mental model: *"essentially a customizable graph. One axis = EV models, the other axis =
specs (range, battery, size, charging speed, price). Click Sort By on any axis and it sorts. Do
multi-level sorts, save options."*

That maps to **two complementary views** — build both:

### 1a. The Matrix (primary)
A spreadsheet-grade grid: **rows = EV models, columns = spec metrics, cells = heatmap-colored values.**
- Click any column header → sort by it (toggle asc/desc/off).
- Shift-click additional headers → **multi-level sort** with a visible sort-priority stack you can reorder.
- Cells colored by a good→bad gradient (direction-aware per metric), value always shown as text (never color-only).
- Pick which columns (metrics) and which rows (vehicles / filters) are visible.
- Sticky header + sticky first column; rows **animate to their new positions on sort** (FLIP) — this is the single highest-impact "wow" feature.

### 1b. The Scatter / Pareto (secondary)
Pick any metric for X, any for Y, optional third for bubble size/color (e.g. range vs efficiency,
sized by price). Highlight the **Pareto frontier** so users instantly see objectively best-in-class
trade-offs. This is the literal "graph" interpretation and is a strong differentiator.

Both views read the same in-memory dataset and share the same filter/selection state.

---

## 2. The dataset (`./data`)

**Source: Bjørn Nyland's EV test results** — one of the most respected independent EV test datasets
in the world (Norwegian real-world testing). See §12 for the **mandatory attribution / licensing
gate** before any public launch.

Origin: `TB_test_results.xlsx` is the upstream source of truth. **`data/clean.py`** reads it and emits
**standardized** GitHub-flavored Markdown (one file per sheet) — decimal commas → dots, space
thousands-separators removed, `nan` → empty, dates → ISO, junk columns dropped. Those standardized
`.md` files are the committed, diff-able, contributor-friendly intermediate that the TypeScript ETL
consumes (so contributors edit Markdown/CSV, never the workbook). Re-run `python clean.py` after any
workbook update. (`script.py` was the original raw exporter; `clean.py` supersedes it.)

### Sheet inventory

| Sheet | Rows | What it measures | Key columns | Direction notes |
|---|---|---|---|---|
| **Range** | 656 | Steady-speed range & consumption | Speed (90/120), Wh/km, Capacity, km, mi, 75% charging time, 75% km/h | range↑, Wh/km↓ |
| **1000 km** | 229 | Real road-trip time incl. charging stops | Time, km/h (avg), Wh/km, Stops, Temp | time↓ (flagship metric) |
| **Acceleration** | 205 | 0–10 … 0–100, vs spec | 0-100, 0-100 (1ft), Hp, Weight, Hp/weight | time↓ |
| **Weight** | 254 | Mass & distribution | Total, Front, Rear, Distribution, Battery | context |
| **Noise** | 249 | Cabin dB @ 80/100/120 | 80/100/120 km/h, Average | dB↓ |
| **Banana** | 182 | Cargo in **banana boxes** (Bjørn's signature unit) | Trunk, Seats folded | boxes↑ |
| **Braking** | 65 | 100→0 km/h | Distance, 100-0 km/h, Weight | distance↓ |
| **Degradation** | 62 | Battery capacity loss | Age, Odo, Cycles, kWh new/test, Degradation % | degr↓ |
| **Zeva** | 33 | Detailed battery state-of-health | SoH, Chem, AC/DC charge, Cap new/test | SoH↑ |
| **Sunday / Geilo / Arctic Circle / Bangkok / 500 km / Zero mile** | small | Specific route / edge tests | route time, Wh/km, occasionally Price | varies |

**Scale:** ~2,300 test rows; **707 distinct "Car" strings** that collapse to an estimated ~250–350
canonical vehicles after entity resolution.

**Market overlays.** The test data is market-agnostic and (critically) has **almost no price**. Market
specifics — **price, launch date, availability** — live in per-market files: **`data/usa.md`** today,
`data/eu.md` / `data/uk.md` / … later. Each is a standardized Markdown table joined to vehicles by
make + model (+ variant). See §3.6, §5.7.

---

## 3. Data challenges & decisions (read this twice)

These are the make-or-break realities of this dataset. Each has a **recommended decision** — follow it
unless you find a reason not to.

### 3.1 European number formatting — everywhere
- **Decimal comma:** `94,7 %`, `0,0 %`, `2,8 kWh` → parse to `94.7`, `0.0`, `2.8`.
- **Space thousands separator:** `1 134`, `11 000`, `1 200` → `1134`, `11000`, `1200`.
- **Embedded units:** `125 kWh`, `3333 km`, `20 km` → split into `{value, unit}`.
- **Decision:** `data/clean.py` already standardizes these at the source (commas→dots, thousands spaces
  removed, `nan`→empty, ISO dates), so the ETL ingests clean Markdown. Still ship one hardened
  `parseNumeric(raw)` utility as a **defensive second line** (embedded units, stray edge cases) and
  unit-test it against the real ugly strings (see §11) — never assume upstream is perfect.

### 3.2 Missing values
`nan` (literal string), empty cells, `-1 km` sentinels. **Decision:** normalize all to `null`; never
let `"nan"` reach the UI. Render missing cells as an explicit muted "—", and surface a **per-vehicle
coverage score**.

### 3.3 Temperature & range strings
`-5-5°C`, `-6~-3°C`, `16 ~22°C`, `7-14°C` (note: leading-negative ranges are ambiguous to a naive
split). **Decision:** robust regex → `{min, max, avg}`. Keep `T avg` where the sheet already provides it.

### 3.4 Entity resolution — THE core problem
The same vehicle appears as many strings:
- `Hyundai Ioniq 28 kWh` (Range) vs `2016 Hyundai Ioniq 28 kWh` (Degradation) — year prefix optional.
- `2019 Model 3 Performance` vs `2020 Tesla Model 3 Performance` — brand sometimes omitted.
- `2021 Tesla Model 3 LR` vs `...LR (82 kWh)` vs `...LR 82 kWh` vs `...Long Range 82 kWh` — trim/battery noise.
- `Tesla Model 3 LR Highland` vs older Model 3 — generation matters and must stay distinct.

**Decision:** hybrid resolver — automated normalization + a human-reviewed override file.
1. Auto-normalize (algorithm in §5.3) to a canonical slug and parse out year/battery/trim/drivetrain.
2. Emit a `canonicalization-report.md` listing every raw string → proposed canonical id, flagging
   low-confidence/ambiguous merges.
3. A maintained **`data/aliases.yml`** override map gets the final word (manual always wins).
4. CI fails if a new raw string can't be resolved and has no alias entry → forces a human decision.

Do **not** try to make this fully automatic. Generations (Highland vs pre-Highland), battery sizes,
and drivetrains are real distinctions that must not be merged away.

### 3.5 Multiple rows per vehicle per metric — model conditions, don't average
Range has rows at **90 and 120 km/h**, **summer and winter**, different tires. Naively averaging mixes
incomparable conditions. **Decision:** model every metric as `(metricId, condition)` pairs (e.g.
`range @ {speed:90, season:summer}`). The matrix shows one canonical condition by default
(recommend **90 km/h, summer**) with a global condition switcher; missing conditions show as "—".

### 3.6 Price & launch date come from market overlays, not the test data
The test data has **almost no price** (only a few route-test rows, tens of points, NOK-thousands,
Norway-specific) and **no launch dates at all**. Price/launch are inherently **market-specific** anyway
(a Model 3's US price, launch, and availability differ from the EU's), so they don't belong in the
market-agnostic test data.

**Decision:** price, launch date, and availability live in **per-market overlay files** (§5.7),
**starting with `data/usa.md`** (USD MSRP + US launch year + status). This makes price a **real,
first-class axis per selected market** — populated where data exists, honestly blank where it doesn't.
- The matrix/scatter expose price & launch as **market-aware** metrics; switching market re-keys them.
- Overlays are **community-maintained Markdown** — easy to extend and correct via PR.
- Never let the heatmap imply coverage we don't have — vehicles with no entry for the selected market
  show blank price/launch and (optionally) a "not sold here" badge.
- MSRPs are **approximate starting prices, pre-incentive** (see the disclaimer in `usa.md`); display
  them with currency + "approx." and the source market, never as authoritative quotes.

### 3.7 Banana cargo format
`17+4`, `2+15`, `23` → store `{total, components}` (e.g. trunk + frunk). Sort by total.

### 3.8 Metric semantics to verify against source
`75 % km/h` and `75 % charging time` (Range) encode Bjørn's charging/effective-trip-speed metric;
the `1000 km` time is the flagship road-trip benchmark. **Confirm exact semantics against Bjørn's
published methodology** before writing metric descriptions/tooltips — don't guess in user-facing copy.

---

## 4. Canonical data model (TypeScript)

```ts
// Direction drives heatmap coloring and "best" highlighting.
type MetricDirection = 'higher-better' | 'lower-better' | 'neutral';

type Unit =
  | 'km' | 'mi' | 'kWh' | 'Wh/km' | 'kg' | 'dB' | 's' | 'm'
  | 'boxes' | '%' | 'hp' | 'km/h' | 'NOK' | 'EUR' | 'USD' | 'GBP' | 'year';

type MetricGroup =
  | 'range' | 'efficiency' | 'charging' | 'performance'
  | 'comfort' | 'practicality' | 'battery' | 'cost';

interface MetricDef {
  id: string;                 // 'range', 'consumption', 'accel_0_100', 'noise_avg', 'cargo', ...
  label: string;              // 'Range'
  group: MetricGroup;
  unit: Unit;
  direction: MetricDirection;
  precision: number;          // decimals for display
  description: string;        // tooltip + methodology page
  conditioned?: boolean;      // true if value depends on a Condition (e.g. speed/season)
}

interface Condition { speed?: number; season?: 'summer' | 'winter'; surface?: 'dry' | 'wet'; temp?: number; }

interface MetricValue {
  value: number | null;
  unit: Unit;
  condition?: Condition;
  date?: string;              // ISO
  source: string;             // sheet name / test id (for provenance)
  raw?: string;               // original cell, kept for audit
}

type MarketCode = 'US' | 'EU' | 'UK' | 'NO';          // extend as overlays are added

interface Money { amount: number; currency: Unit; }    // currency ∈ USD|EUR|GBP|NOK

interface MarketInfo {
  market: MarketCode;
  available: 'available' | 'upcoming' | 'discontinued' | 'unavailable';
  launchYear?: number;        // year of market availability
  launchDate?: string;        // ISO, when the month/day is known
  startingMsrp?: Money;       // approximate base price, pre-incentive
  approximate?: boolean;      // true for est./community-sourced values
  source: string;             // overlay file, e.g. 'usa.md'
  notes?: string;
}

interface Vehicle {
  id: string;                 // canonical slug, e.g. 'tesla-model-3-lr-highland'
  make: string;               // 'Tesla'
  model: string;              // 'Model 3'
  variant?: string;           // 'LR Highland'
  modelYear?: number | [number, number];
  batteryKwh?: number;
  drivetrain?: 'RWD' | 'AWD' | 'FWD';
  bodyType?: string;          // from enrichment / market overlay
  segment?: string;           // from enrichment (e.g. 'D-segment', 'SUV')
  markets: Partial<Record<MarketCode, MarketInfo>>;  // price/launch/availability per market (§5.7)
  aliases: string[];          // every raw string that maps here (provenance + debugging)
  metrics: Record<string, MetricValue[]>;  // metricId -> values across conditions
  coverage: number;           // 0..1 fraction of tracked metrics present
}

interface Dataset {
  vehicles: Vehicle[];
  metrics: MetricDef[];
  markets: MarketCode[];      // markets with overlay data loaded (e.g. ['US'])
  generatedAt: string;        // ISO, stamped by ETL
  sourceAttribution: string;
}
```

Validate the emitted JSON with **Zod** at build time; fail the build on schema drift.

---

## 5. ETL pipeline (Phase 0 — de-risk the data first)

Location: `etl/`. Language: **TypeScript** (run with `tsx`), so contributors need only the Node
toolchain. The ETL consumes the **standardized Markdown** that `data/clean.py` emits (test sheets) plus
the **market overlays** (`usa.md`, …) via a small GFM table parser — `clean.py` (Python) is the only
step that touches the workbook, so no SheetJS is needed in the ETL.

### 5.1 Stages
```
clean.py:  xlsx ──▶ standardized .md            (upstream, Python; re-run on workbook updates)

ETL (TS):  parse .md tables ──▶ normalize cells ──▶ resolve entities ──▶ assemble vehicles
        ──▶ merge enrichment.csv ──▶ join market overlays (usa.md, …) ──▶ compute coverage
        ──▶ validate (Zod) ──▶ emit JSON + reports
```

### 5.2 Normalization utilities (`etl/normalize.ts`) — fully unit-tested
- `parseNumeric(raw)` — handles `,` decimals, space thousands, embedded units, `nan`/empty → `null`.
- `parseTempRange(raw)` → `{min, max, avg}` (handle leading negatives & `~`/`-` separators).
- `parseDate(raw)` → ISO (strip `00:00:00`).
- `parseBanana(raw)` → `{total, components[]}`.
- `parsePercent(raw)` → number (handles `94,7 %`).

Inputs are pre-standardized by `clean.py`, so these run as a defensive layer (embedded units, edge cases).

### 5.3 Canonicalization (`etl/canonicalize.ts`)
```
function canonicalize(rawName):
  1. trim + collapse whitespace
  2. extract & strip leading 4-digit year  → modelYear
  3. extract battery size tokens (e.g. "82 kWh", "(82 kWh)") → batteryKwh; de-duplicate
  4. extract drivetrain tokens (RWD/AWD/FWD/4Matic/xDrive/Quattro/DM/SM) → drivetrain
  5. if no known make prefix, infer via brandSynonyms map ("Model 3" -> "Tesla Model 3")
  6. normalize trim synonyms: "Long Range"->"LR", "Standard Range Plus"->"SR+", keep generation tags
     that are semantically distinct (e.g. "Highland", "Juniper", "Palladium", "Raven")
  7. build slug from {make, model, variant, batteryKwh, generation}
  8. OVERRIDE: if raw string or slug appears in aliases.yml, use the mapped canonical id (manual wins)
  9. record confidence; push low-confidence/ambiguous to canonicalization-report.md
```
- `data/aliases.yml` — human-maintained `rawString -> canonicalId` (and canonical metadata) overrides.
- `data/brand-synonyms.yml` — make inference + trim normalization tables.

### 5.4 Enrichment overlay (`data/enrichment.csv`) — community-editable, **market-agnostic**
Market-independent facts the test data can't provide: `bodyType, segment, seats, drivetrain (fallback),
wltpRange, imageUrl, officialUrl`. Joined by canonical id. **Price/launch/availability are NOT here** —
those are market-specific and live in the market overlays (§5.7).

### 5.5 Outputs (to `public/data/`)
- `dataset.json` — the full `Dataset` (vehicles + metrics + **per-market price/launch/availability** +
  provenance). Expected < 500 KB raw, ~50 KB gzipped.
- `coverage.json` — per-metric / per-vehicle coverage for UI badges and honest empty cells.
- `canonicalization-report.md` — auditable raw→canonical mapping (committed; reviewed on data updates).

### 5.6 Validation & guards
- Zod schema validation; **build fails** on violation.
- **Fail CI** if any raw "Car" string is unresolved and absent from `aliases.yml`.
- Warn on metric values outside sane physical bounds (range 0–1500 km, 0-100 in 1.5–20 s, dB 50–80, etc.).

### 5.7 Market overlays (`data/usa.md`, future `eu.md`/`uk.md`/…) — community-editable
Each market file is a **standardized Markdown table** carrying market-specific data — at minimum
**launch date and price**, plus availability/body. Current schema (see `data/usa.md`):
`Make | Model | Variant | Body | US launch | Starting MSRP (USD) | Status | Notes`.
- **Parsing:** read the **first GFM table** in the file (prose/notes above and below are ignored).
- **Matching:** resolve each row's `Make + Model (+ Variant)` through the **same canonicalizer** as the
  test rows, then attach a `MarketInfo` to the matched vehicle's `markets[CODE]`. A variant row overrides;
  a model-level row applies to all variants of that model lacking a more specific match.
- **Currency/units:** per-market (USD for `usa.md`; EUR/GBP/NOK later), carried in `Money.currency`.
- **Status → `available`:** map `Available|Upcoming|Discontinued|CA-only` to the `MarketInfo.available`
  enum; blank MSRP ⇒ `startingMsrp` omitted (common for `Upcoming`).
- **Coverage honesty:** a vehicle with no row for a market gets no `MarketInfo` → blank price/launch and an
  optional "not sold here" badge. A market file deliberately omits vehicles not sold there.
- **Guards:** warn on overlay rows that match **no** vehicle (naming drift → add an alias); flag prices
  outside sane bounds. Unmatched rows go to the canonicalization report, never silently dropped.
- **Values are approximate** (starting MSRP, pre-incentive) and community-maintained — set `approximate`
  and surface the file's disclaimer in the UI.

---

## 6. Architecture & tech stack

**SPA, static data, no runtime DB.** Rationale: the whole dataset is tiny and static; shipping it as
pre-built JSON makes the app blazing fast (no API latency → "super responsive"), trivial/cheap to host
on Railway, and frictionless for contributors (no DB setup).

| Concern | Choice | Why |
|---|---|---|
| Framework | **Vite + React 18 + TypeScript** | App-like, heavy client interactivity; per global config, Astro is the wrong tool here and Next.js/SSR buys nothing for a static-data tool. |
| Grid logic | **TanStack Table v8** (headless) | Best-in-class sorting incl. **built-in multi-sort (shift-click)**, column visibility/order, filtering. We render cells ourselves for full heatmap control. |
| Row virtualization | **TanStack Virtual** | Smooth with hundreds of rows, especially mobile. |
| Charts (scatter/radar) | **Recharts** (or **ECharts** if zoom/perf demands) | Clean, responsive, attractive scatter + radar with minimal code. |
| Styling | **Tailwind CSS** | Fast, consistent, responsive-first. |
| Accessible primitives | **shadcn/ui** (Radix) | Accessible dialogs (save-view), comboboxes (metric/vehicle pickers), tooltips, dropdowns. |
| Animation | **Framer Motion** | FLIP layout animations on sort (the "wow"); respects `prefers-reduced-motion`. |
| URL/shareable state | **nuqs** (or hand-rolled `URLSearchParams`) | Every view is a shareable link — no backend needed for "save options". |
| Ephemeral UI state | **Zustand** | Light global store for selection/compare set. |
| Data fetch/cache | static `fetch('/data/dataset.json')` + small loader | No server. |
| Validation | **Zod** | Shared types ETL ↔ app; runtime safety. |

> Future option (not v1): if per-vehicle SEO landing pages become a goal, add Next.js SSG for those
> routes only. Not needed for the tool itself.

---

## 7. Feature spec & UX

### 7.1 Matrix view
- **Columns:** each visible metric; sticky header; sticky first column (vehicle name + tiny make logo).
- **Sorting:** click cycles asc → desc → off; **shift-click** adds to a multi-sort stack; a visible
  **"Sort by" chip rail** shows priority order and lets users drag-reorder / remove levels.
- **Heatmap cells:** direction-aware gradient (color-blind-safe palette, toggle), value as text,
  best-in-column gets a subtle marker. Normalization toggle: **absolute / percentile / per-segment**.
- **Animated reordering:** Framer Motion `layout` so rows slide to new positions on sort/filter.
- **Column picker:** group metrics by `MetricGroup`; quick presets ("Road-trip", "Performance",
  "Efficiency", "Family/practicality").
- **Condition switcher:** 90 vs 120 km/h, summer vs winter (§3.5).
- **Empty cells:** explicit muted "—" + coverage badge; never fabricate.

### 7.2 Filtering & search
Make, body type, model year range, drivetrain, battery-size range, price range (in the selected
market's currency), **market availability** (e.g. "sold in US"; hide upcoming/discontinued), test
condition. Full-text search on vehicle name. Filters reflected in URL.

### 7.3 Saved views ("save options")
A "view" = `{market, visible metrics, sort stack, filters, condition, normalization, view type}`.
- **URL-encoded** (shareable link) — the primary mechanism, zero backend.
- **Named presets** in `localStorage` (save/rename/delete), with a few **built-in presets** shipped.
- "Copy link" + "Reset" actions.

### 7.4 Scatter / Pareto view
X metric, Y metric, optional bubble size + color metric; hover tooltip with full vehicle card; click
to pin into compare set; **Pareto frontier** highlighted; same filters as matrix.

### 7.5 Compare mode
Pin 2–5 vehicles → side-by-side detail with a **radar chart** (normalized across key metrics) +
per-metric provenance (which test, date, conditions). This is the natural mobile-first entry point.

### 7.6 Units & i18n of values
Toggles: km ↔ mi, °C ↔ °F. **Price currency follows the selected market** (USD/EUR/GBP/NOK); an optional
manual currency override can convert for cross-market comparison (with an FX-caveat note). Persist preference.

### 7.7 Responsiveness (must be excellent — "super responsive")
- **Desktop:** full matrix with frozen header + first column, horizontal scroll for extra metrics.
- **Tablet:** fewer default columns; horizontal scroll with frozen vehicle column.
- **Mobile:** default to **Compare mode / card list** (pick vehicles, scroll metric cards) rather than
  cramming a wide grid; matrix still reachable with frozen first column + horizontal scroll.
- Container queries + Tailwind breakpoints; virtualization on; touch-friendly hit targets; test on real
  small viewports.

### 7.8 Accessibility
Keyboard-navigable grid; `aria-sort` on headers; color-blind-safe + never color-only (numbers always
present); `prefers-reduced-motion` disables FLIP; focus-visible rings; semantic headings; Lighthouse
a11y ≥ 95.

### 7.9 Visual design language (the "super attractive" part)
- Modern, data-forward, **dark + light themes** (system-aware, toggle). High-contrast, generous
  whitespace, crisp typography (e.g. Inter / Geist), tabular-figures for numbers.
- Restrained accent color; heatmap is the visual hero — pick a perceptually-uniform palette
  (e.g. viridis/CET diverging) so good→bad reads instantly and is color-blind safe.
- Micro-interactions: animated sort, hover row highlight + cross-hair to header, smooth theme switch.
- Make logos/wordmarks (small, from a static set) and a tasteful empty/loading state.
- Follow the `frontend-design` skill's guidance to avoid generic "AI default" aesthetics.

### 7.10 Extras that make it better
- **Export** current view → CSV; matrix/scatter → PNG (for sharing/embedding in forums).
- **Embeddable widget** (`/embed` route, iframe-friendly) — valuable for the EV community.
- **About / Methodology** page: explain every metric, conditions, and **prominently credit Bjørn Nyland**.
- **Data coverage** indicator per vehicle.
- **"Last updated"** stamp from `dataset.generatedAt`.
- **Deep-linkable vehicle** focus (`?focus=tesla-model-3-lr-highland`).

### 7.11 Market selector (price & launch are market-aware)
- A prominent **market switcher** (default **USA**) in the header; the choice is part of URL / saved-view
  state (`?market=US`).
- Selecting a market re-keys the **Price** and **Launch date** columns/axes to that market's overlay,
  switches the price currency, and powers the "available in market" filter.
- Vehicles not sold in the selected market show blank price/launch (+ optional "not sold here" badge),
  never fabricated values.
- Built to scale to multiple markets; ships with USA, more overlays drop in as `data/<market>.md`.

---

## 8. Information architecture / routes

```
/                      Matrix view (default)         — all state in query params
/scatter               Scatter / Pareto view
/compare               Compare set (also reachable as a panel)
/about                 Methodology + attribution + licensing + how-to-contribute
/embed                 Minimal iframe-friendly matrix/scatter
```
State (**market**, metrics, sort, filters, condition, view) lives in the **URL query string** so every
screen is shareable and back/forward works.

---

## 9. Repository structure

```
EV_Comparator/
├─ data/                      # source + standardized intermediates
│  ├─ TB_test_results.xlsx    # upstream source of truth
│  ├─ clean.py                # xlsx -> standardized .md (re-run on workbook updates)
│  ├─ *.md                    # standardized test sheets (committed, consumed by ETL)
│  ├─ usa.md                  # USA market overlay: launch date + price + availability
│  ├─ <market>.md             # future markets: eu.md, uk.md, … (same shape as usa.md)
│  ├─ aliases.yml             # NEW: human-maintained canonical overrides
│  ├─ brand-synonyms.yml      # NEW: make inference + trim normalization
│  └─ enrichment.csv          # NEW: market-agnostic bodyType/segment/images (community-editable)
├─ etl/                       # TypeScript ETL
│  ├─ index.ts                # orchestration
│  ├─ parseMarkdown.ts        # GFM table parser (test sheets + market overlays)
│  ├─ normalize.ts            # parseNumeric/parseTempRange/parseDate/parseBanana
│  ├─ canonicalize.ts         # entity resolution (shared by tests + market rows)
│  ├─ markets.ts              # load + join market overlays -> Vehicle.markets
│  ├─ metrics.ts              # MetricDef registry (labels, units, directions, descriptions)
│  ├─ schema.ts               # Zod schemas + inferred TS types (shared with app)
│  └─ __tests__/              # Vitest: real ugly-string fixtures
├─ public/
│  └─ data/                   # ETL OUTPUTS (gitignored or committed — see §10)
│     ├─ dataset.json
│     └─ coverage.json
├─ src/
│  ├─ app/                    # routes, layout, theme provider
│  ├─ features/
│  │  ├─ matrix/              # TanStack Table + heatmap cells + sort rail
│  │  ├─ scatter/             # Recharts scatter + Pareto
│  │  ├─ compare/             # radar + side-by-side
│  │  ├─ filters/             # filter bar + search
│  │  └─ views/               # save/load views (URL + localStorage presets)
│  ├─ components/ui/          # shadcn/ui
│  ├─ lib/                    # data loader, url-state, units, color scales
│  └─ store/                  # Zustand
├─ docs/
│  └─ canonicalization-report.md   # generated, reviewed on data updates
├─ Dockerfile                 # Railway build/serve
├─ railway.json               # Railway config
├─ nixpacks.toml              # (alt to Dockerfile)
├─ .github/workflows/ci.yml
├─ LICENSE                    # code license (MIT/Apache-2.0)
├─ DATA_LICENSE / NOTICE      # data attribution + terms (see §12)
├─ CONTRIBUTING.md
└─ README.md
```

---

## 10. Build, CI & Railway deployment

### Build flow
`pnpm etl` (xlsx → `public/data/*.json`) → `pnpm typecheck` → `pnpm build` (Vite → `dist/`).
> Decision: **run ETL in CI/build** and commit outputs too (so the report is reviewable and the app
> works without re-running ETL). Pick one and be consistent; recommended: commit `dataset.json` +
> `coverage.json` + `canonicalization-report.md` so data changes are visible in diffs/PRs.

### Railway
Static SPA must listen on `$PORT`. Two supported paths — provide both, default to Dockerfile:

**Dockerfile (recommended, reproducible):**
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm etl && pnpm build

FROM node:20-alpine
WORKDIR /app
RUN npm i -g sirv-cli
COPY --from=build /app/dist ./dist
ENV PORT=8080
EXPOSE 8080
CMD ["sh", "-c", "sirv dist --host 0.0.0.0 --port ${PORT} --single"]
```
`railway.json`:
```json
{ "$schema": "https://railway.app/railway.schema.json",
  "build": { "builder": "DOCKERFILE", "dockerfilePath": "Dockerfile" },
  "deploy": { "healthcheckPath": "/", "restartPolicyType": "ON_FAILURE" } }
```
- `--single` ⇒ SPA fallback so deep links / refresh work.
- **Alternative:** Nixpacks with `nixpacks.toml` start `sirv dist --single --host 0.0.0.0 --port $PORT`.

### CI (`.github/workflows/ci.yml`)
`pnpm install` → `pnpm etl` → **Zod validation + unresolved-alias check** → `pnpm test` →
`pnpm typecheck` → `pnpm build`. Optionally auto-deploy to Railway on `main` via Railway's GitHub
integration or `railway up` with a token secret.

---

## 11. Testing strategy

- **Unit (Vitest) — highest priority:** `normalize.ts` against real fixtures:
  `"1 134"→1134`, `"94,7 %"→94.7`, `"-6~-3°C"→{min:-6,max:-3,avg:-4.5}`, `"2+15"→{total:17}`,
  `"nan"→null`, `"125 kWh"→{value:125,unit:'kWh'}`.
- **Canonicalization tests:** the known-hard cases from §3.4 resolve correctly (and Highland ≠ pre-Highland).
- **Schema test:** emitted `dataset.json` passes Zod.
- **Component tests (React Testing Library):** sort toggles, multi-sort stack, filter logic, URL round-trip.
- **E2E (Playwright):** sort a column, add a 2nd sort level, apply a filter, save+reload a view via URL,
  mobile layout switches to compare/cards. Run headed locally; headless in CI.

---

## 12. Open-source & data attribution (a launch gate — do not skip)

- **Code license:** MIT or Apache-2.0 (recommend MIT for max adoption).
- **Data:** This is **Bjørn Nyland's** test data. Before any public deployment:
  1. **Confirm usage rights / terms** for redistributing the dataset (action item for the user — this
     is a real legal/ethical gate, not optional).
  2. **Credit prominently** — README, About page, footer, and a `NOTICE`/`DATA_LICENSE` file: source,
     link to his channel/spreadsheet, "data © Bjørn Nyland, reproduced with attribution under <terms>".
  3. Keep data provenance per value (`MetricValue.source`) so every number is traceable.
- **CONTRIBUTING.md:** how to extend `aliases.yml`, `enrichment.csv`, add metrics; how ETL/CI works;
  the "every raw string must resolve" rule. Issue/PR templates for "add price/body data" and "fix a merge".

---

## 13. Performance budget ("super responsive")

- Initial JS < 200 KB gzipped (excl. data); data < 60 KB gzipped.
- TTI < 2 s on mid mobile; sort/filter re-render < 16 ms frame budget (virtualization + memoized cells).
- Lighthouse: Perf ≥ 90, A11y ≥ 95, Best-practices ≥ 95.
- No layout shift on theme/sort; FLIP animations capped (~200 ms) and disabled under reduced-motion.

---

## 14. Phased roadmap with acceptance criteria

**Phase 0 — Data foundation (de-risk first).**
`clean.py` standardizes the sheets (done); ETL parses all 15 sheets + the **USA market overlay**;
normalization unit tests green; canonicalization produces `canonicalization-report.md`; `aliases.yml`
seeded; `usa.md` rows join to vehicles (unmatched rows flagged); `dataset.json` (with `markets`) +
`coverage.json` emitted and Zod-valid. ✅ *Done when:* every raw string resolves (or is flagged), a
spot-check of 10 known vehicles shows correct merged metrics, and US price/launch attach correctly.

**Phase 1 — Matrix MVP.**
TanStack Table grid; heatmap cells; single + **multi-sort**; column picker; basic filters; sticky
header/first-col; responsive shell; dark/light. ✅ *Done when:* user can sort any column, shift-add a
2nd sort level, hide/show metrics, and it's usable on mobile.

**Phase 2 — Save & explore.**
URL-encoded views + named localStorage presets + built-ins; **market selector (default USA) with
market-aware price/launch columns + availability filter**; scatter/Pareto; compare mode + radar;
condition + unit toggles. ✅ *Done when:* a configured view (incl. market) survives copy-link/reload,
price/launch re-key on market switch, and scatter highlights the Pareto frontier.

**Phase 3 — Polish & extras.**
FLIP animations; full a11y pass; CSV/PNG export; `/embed`; About/methodology + attribution;
enrichment/price overlay wired; coverage badges. ✅ *Done when:* Lighthouse targets met and About page
credits the source.

**Phase 4 — Ship.**
Dockerfile/railway.json; CI green (ETL+tests+build); deployed on Railway with SPA fallback + health
check; README/CONTRIBUTING/LICENSE/NOTICE complete. ✅ *Done when:* a fresh clone → `pnpm i && pnpm etl
&& pnpm dev` works, and the Railway URL is live.

---

## 15. Open decisions (recommendations made; confirm if you disagree)

1. **Price & launch** → delivered via **per-market overlays** (§3.6, §5.7), seeded with `data/usa.md`
   (USD MSRP + US launch). Values are **approximate/community-maintained**, not authoritative quotes.
   *Confirm* the default market (recommend **USA**) and which markets to add next (EU/UK).
2. **Data license / redistribution rights** → must confirm with the source before public deploy (§12).
   (Market-overlay values are independently/community sourced — attribute them separately from Bjørn
   Nyland's test data.)
3. **Default condition** for the matrix → 90 km/h, summer. Easy to change.
4. **Charts lib** → Recharts (swap to ECharts only if scatter perf/zoom needs it).
5. **Commit ETL outputs** → yes (reviewable diffs), vs build-only.

---

## 16. Quick-start (first commands for the coding agent)

```bash
# 0. (re)standardize the data from the workbook — already done; re-run after any xlsx update
python data/clean.py

# scaffold
pnpm create vite@latest . --template react-ts
pnpm add @tanstack/react-table @tanstack/react-virtual recharts framer-motion zustand nuqs zod
pnpm add -D tailwindcss postcss autoprefixer vitest @testing-library/react @playwright/test tsx js-yaml
pnpm dlx tailwindcss init -p
# shadcn/ui
pnpm dlx shadcn@latest init

# Phase 0 first: build the ETL before any UI (consumes the standardized .md + usa.md)
#   etl/normalize.ts (+ tests) -> etl/parseMarkdown.ts -> etl/canonicalize.ts
#   -> etl/markets.ts (join usa.md) -> etl/index.ts
#   output public/data/dataset.json, then load it in a trivial table to verify, THEN build the matrix.
```

**Build order is non-negotiable: ETL and data model first, UI second.** The app is only as good as the
canonicalization.
