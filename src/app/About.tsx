export function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 prose prose-slate dark:prose-invert">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">About & Methodology</h1>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Data provenance, test conditions, and how to contribute</p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">Data Source</h2>
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-4">
          <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
            ⚡ Test data: © <strong>Bjørn Nyland</strong> — reproduced with attribution.
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
            Bjørn Nyland is one of the most respected independent EV reviewers in the world, based in Norway. His systematic,
            real-world tests have been running since 2015. All performance data in this tool comes from his published spreadsheet.
            Visit his channel and support his work: <a href="https://www.youtube.com/@BjornNyland" className="underline" target="_blank" rel="noopener">YouTube</a>.
          </p>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Market overlay data (prices, launch dates, availability) is community-maintained and approximate —
          see <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">data/usa.md</code> and similar files.
          MSRPs are starting prices, pre-incentive, for informational purposes only.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">Test Metrics Explained</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Range @ 90 / 120 km/h</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Measured on a Norwegian motorway at constant cruise speed, starting from ~97% charge down to a few percent remaining.
              Tests run in both summer and winter conditions. This is the most comparable, controlled range metric available.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">1000 km Road Trip Time</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Bjørn's flagship benchmark: the total real-world time to drive 1000 km from Oslo to Aurland and back, including all
              necessary charging stops. Lower is better. This is the gold-standard real-world long-distance metric.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">75% Charging Metrics</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              75% km/h = effective trip speed when you factor in charge time: (range to 75% SoC) ÷ (time to charge to 75%).
              This combines range and charging speed into a single road-trip efficiency number.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Banana Boxes (Cargo)</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Bjørn's signature cargo unit. A standard banana box (~40 cm × 30 cm × 24 cm) provides a
              repeatable, real-world measurement of cargo volume — more meaningful than manufacturer-quoted liters.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Noise Levels</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Cabin noise in dB measured at 80, 100, and 120 km/h cruise on Norwegian highways. Recorded at the driver's ear position.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">Data Conditions</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          Range and efficiency vary significantly with conditions. This tool shows:
        </p>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc ml-4">
          <li><strong>Summer:</strong> typically 10–28°C, dry or wet roads</li>
          <li><strong>Winter:</strong> typically −15°C to +5°C, winter tires</li>
          <li>Both 90 km/h (steady highway) and 120 km/h (fast highway) constant-speed runs</li>
        </ul>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
          Use the <strong>condition switcher</strong> in the matrix toolbar to re-key the Range and Consumption
          columns to your preferred speed and season — the rankings update live. Open any vehicle to see its full
          <strong> Real range by condition</strong> grid.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">Reading the tool</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Browse-by presets</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              The chip rail above the matrix is one-click ranking: longest range, most efficient, fastest charging,
              quickest, best value, and more. Each applies a sort and brings the relevant column into view.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Price / Range (value)</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Starting price divided by real-world range — what each km (or mile) of range costs you, in the selected
              market's currency. Lower is better value. It's blank where we don't have a price for that market.
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-4">
          The conditional-range presentation, the browse-by rankings, and the price-per-range value cue are inspired by
          <a href="https://ev-database.org/" className="underline" target="_blank" rel="noopener"> EV Database</a>,
          adapted to Bjørn Nyland's real-world measurements.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">Contributing</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          This is open-source. You can contribute by:
        </p>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc ml-4">
          <li>Fixing or adding price/launch data in <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">data/usa.md</code></li>
          <li>Adding EU/UK market overlay files (<code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">data/eu.md</code>, etc.)</li>
          <li>Fixing vehicle name merges in <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">data/aliases.yml</code></li>
          <li>Adding body type / segment data in <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">data/enrichment.csv</code></li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">License</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Application code: MIT License. Test data: © Bjørn Nyland, reproduced with attribution.
          Market overlay data: community-contributed, approximate values — not financial or purchasing advice.
          Always verify prices with the manufacturer before making a purchase decision.
        </p>
      </section>

      <footer className="text-xs text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-6 mt-8">
        <p>EV Comparator · Open source · Data from Bjørn Nyland's independent tests</p>
      </footer>
    </div>
  )
}
