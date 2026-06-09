# EV Comparator

An interactive, open-source EV comparison tool powered by **Bjørn Nyland's** real-world test data.

Compare range, charging speed, efficiency, acceleration, noise, cargo, and more across hundreds of EVs — with a heatmap matrix, scatter/Pareto view, and side-by-side compare mode.

**[Live demo →](#)** (deploy to Railway to get your URL)

---

## Features

- **Matrix view** — heatmap-colored grid with multi-level sort (Shift+click), column picker, sticky header
- **Scatter / Pareto** — pick any two metrics for X/Y, Pareto frontier highlighted
- **Compare mode** — pin up to 5 vehicles for side-by-side comparison with radar chart
- **Market overlay** — US price + launch data via `data/usa.md`; market-aware filter
- **Dark/light theme**, responsive (works on mobile)
- **Shareable URLs** — all state in query params

## Quick start

```bash
# Prerequisites: Node 20+, pnpm
pnpm install
pnpm etl      # builds public/data/dataset.json from data/*.md
pnpm dev      # http://localhost:5173
```

> Run `python data/clean.py` from the `data/` directory if you update `TB_test_results.xlsx`.

## Data

Test data: © **Bjørn Nyland** — reproduced with attribution. See [his YouTube channel](https://www.youtube.com/@BjornNyland).

Market overlay (`data/usa.md`): community-maintained, approximate MSRPs pre-incentive. PRs welcome.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Common contributions:
- Fix/add prices in `data/usa.md`
- Fix vehicle name merges in `data/aliases.yml`
- Add EU/UK overlay files (`data/eu.md`, `data/uk.md`)
- Add body/segment data in `data/enrichment.csv`

## Deploy to Railway

```bash
# One-click: link repo in Railway and it uses Dockerfile automatically
# Or:
railway up
```

## License

Code: MIT. Data: © Bjørn Nyland (see [NOTICE](NOTICE)).
