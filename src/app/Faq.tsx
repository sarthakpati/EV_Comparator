import { Link } from 'react-router-dom'
import { ContentLayout } from '../components/ContentLayout'
import { ContentAd } from '../components/ads/ContentAd'

interface QA { q: string; a: string }

const FAQ: QA[] = [
  {
    q: 'What is EV Comparator?',
    a: 'EV Comparator is a free tool and guide for comparing electric cars on how they actually perform in the real world — range, charging speed, efficiency, acceleration, cargo, and more. The performance data comes from independent, standardized real-world tests rather than manufacturer or laboratory figures.',
  },
  {
    q: 'Where does the data come from?',
    a: 'All performance figures come from Bjørn Nyland, an independent EV reviewer based in Norway who has published systematic real-world tests since 2015. We reproduce his published data with attribution and add market context such as prices and availability. Market data is community-maintained and approximate.',
  },
  {
    q: 'Why are your range numbers different from the manufacturer’s?',
    a: 'Official range comes from laboratory cycles (WLTP in Europe, EPA in the United States) that blend gentle city and highway driving in mild weather. Our figures are measured at a constant motorway speed, in real conditions, including cold weather — so they are usually lower, but far more representative of a real trip.',
  },
  {
    q: 'What speeds and seasons are tested?',
    a: 'Range and efficiency are measured at a steady 90 km/h and 120 km/h, in both summer and winter. You can switch between these conditions in the compare tool to see how speed and weather change the ranking.',
  },
  {
    q: 'What is the 1000 km road-trip test?',
    a: 'It is the total real-world time to drive 1000 km, including every charging stop. It folds range, charging speed, and efficiency into a single honest number, and is the best summary of how good a car is for long-distance travel.',
  },
  {
    q: 'What is a "banana box" of cargo?',
    a: 'It is Bjørn Nyland’s signature cargo unit — a standard banana box (about 40 × 30 × 24 cm). Counting how many fit gives a repeatable, real-world measure of usable boot space that is more meaningful than a manufacturer’s quoted litre figure.',
  },
  {
    q: 'Do you include hydrogen or hybrid cars?',
    a: 'The dataset is overwhelmingly battery-electric vehicles, but it includes a few non-plug-in reference cars (such as a hydrogen fuel-cell Mirai and petrol "e-Power" hybrids) that Bjørn has tested. We exclude these from charging-speed rankings, where they would be misleading, and label them where relevant.',
  },
  {
    q: 'How current is the data?',
    a: 'The dataset is updated periodically as Bjørn publishes new tests. Rankings on this site are generated live from the latest dataset, so they reflect whatever data is currently loaded. Always confirm specifications with the manufacturer before purchase.',
  },
  {
    q: 'Which markets and prices do you cover?',
    a: 'You can switch between the United States, United Kingdom, and Germany to localize units and filter to cars sold there. Pricing is community-maintained and currently most complete for the US market; treat all prices as approximate, pre-incentive starting figures.',
  },
  {
    q: 'Can I compare in miles instead of kilometres?',
    a: 'Yes. Selecting the United States or United Kingdom switches the units to imperial (miles, Wh/mi). Selecting Germany or "All markets" uses metric units, which match the native test data.',
  },
  {
    q: 'How do I compare specific cars?',
    a: 'Open the compare tool. The matrix view ranks every car on any metric (shift-click for multi-level sorting); the scatter view plots any two metrics against each other; and compare mode pins up to five cars side by side with a radar chart.',
  },
  {
    q: 'Is EV Comparator free?',
    a: 'Yes, completely free, and the application code is open source. The site is supported by advertising, which lets us keep the tool and guides free for everyone.',
  },
  {
    q: 'How is the site funded, and do you show ads?',
    a: 'The site is supported by third-party advertising (Google AdSense) shown alongside our guides and other written content. Ads help cover hosting costs. See our Privacy Policy for how advertising cookies work and how to control ad personalization.',
  },
  {
    q: 'Do you sell my personal data?',
    a: 'No. We do not sell personal data. The site itself does not require an account or collect personal information directly. Third-party advertising partners may use cookies as described in our Privacy Policy, where you will also find opt-out links.',
  },
  {
    q: 'Why does winter range matter so much?',
    a: 'Cold weather reduces battery performance and adds heating loads, so EVs lose a meaningful share of their range in winter. If a route is tight in summer, it may not work in winter — which is why we publish matched summer and winter figures.',
  },
  {
    q: 'Can I contribute or report a correction?',
    a: 'Yes. The project is open source on GitHub. You can contribute price and availability data, fix vehicle name merges, or add body-type and segment information. See the repository linked in the footer.',
  },
]

export function Faq() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <ContentLayout
      title="Frequently asked questions"
      description="Answers about EV Comparator: where the data comes from, how real-world EV testing works, markets and pricing, units, and how the site is funded."
      path="/faq"
      lead="What this site measures, where the numbers come from, and how to use them."
    >
      {/* FAQ structured data for search engines. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="space-y-8">
        {FAQ.slice(0, 8).map(({ q, a }) => (
          <div key={q}>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{q}</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300 leading-relaxed">{a}</p>
          </div>
        ))}
      </div>

      <ContentAd name="faqInline" />

      <div className="space-y-8">
        {FAQ.slice(8).map(({ q, a }) => (
          <div key={q}>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{q}</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300 leading-relaxed">{a}</p>
          </div>
        ))}
      </div>

      <p className="mt-10 text-sm text-slate-500 dark:text-slate-400">
        Still have a question? Read the <Link to="/guides" className="text-blue-600 dark:text-blue-400 hover:underline">guides</Link>{' '}
        or the <Link to="/about" className="text-blue-600 dark:text-blue-400 hover:underline">methodology page</Link>.
      </p>
    </ContentLayout>
  )
}
