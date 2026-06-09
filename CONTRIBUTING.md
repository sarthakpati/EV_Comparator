# Contributing to EV Comparator

Thanks for improving the data or app! Here's what's most useful:

## Adding/fixing prices and availability

Edit `data/usa.md` (or create `data/eu.md`, `data/uk.md`). Format:

```markdown
| Make | Model | Variant | Body | US launch | Starting MSRP (USD) | Status | Notes |
|:-----|:------|:--------|:-----|:----------|--------------------:|:-------|:------|
| Tesla | Model 3 | Long Range AWD | Sedan | 2024 | 47490 | Available | |
```

Rules:
- MSRP = starting price, pre-incentive, most recent model year
- Status: `Available` / `Upcoming` / `Discontinued`
- Leave MSRP blank for Upcoming if price is TBD

## Fixing vehicle name merges

Add or correct entries in `data/aliases.yml`:

```yaml
"Raw String From Data":
  id: canonical-vehicle-id
  make: Brand
  model: Model Name
  variant: Trim Name     # optional
  batteryKwh: 82          # optional
```

Run `pnpm etl` and check `docs/canonicalization-report.md` to see the result.

## Running the ETL

```bash
pnpm etl                          # builds public/data/dataset.json
cat docs/canonicalization-report.md  # review mappings
```

The ETL will warn on:
- Market overlay rows that don't match any vehicle (needs an alias)
- Values outside sane physical bounds

## Running tests

```bash
pnpm test          # unit tests
pnpm typecheck     # TypeScript
pnpm build         # full build
```

## Rule: every raw string must resolve

CI fails if any "Car" string in the test data can't be canonicalized and isn't in `aliases.yml`. This forces a human decision rather than silently dropping data.
