import { Link } from 'react-router-dom'
import { ContentLayout } from '../components/ContentLayout'

const LAST_UPDATED = 'June 23, 2026'

export function Terms() {
  return (
    <ContentLayout
      title="Terms & disclaimer"
      description="The terms of use for EV Comparator, including data-accuracy disclaimers, attribution, and limitation of liability."
      path="/terms"
      lead={`Last updated ${LAST_UPDATED}`}
    >
      <div className="article-content">
        <p>
          By using EV Comparator (“the site”), you agree to these terms. If you do not agree, please
          do not use the site. The site is a free, independent, open-source project provided for
          general information.
        </p>

        <h2>Information only — not advice</h2>
        <p>
          All content on this site, including performance figures, rankings, prices, and guides, is
          provided for general informational purposes only. It is not purchasing, financial,
          engineering, or safety advice. Always confirm specifications, pricing, incentives, and
          availability directly with the manufacturer or dealer before making any decision.
        </p>

        <h2>Accuracy of data</h2>
        <p>
          Performance data is sourced from independent real-world tests and is reproduced in good
          faith. Test results depend on conditions and can vary; figures may contain errors, may be
          incomplete, or may become out of date. Market data such as prices and availability is
          community-maintained and approximate. We make no warranty that any figure is accurate,
          current, or fit for a particular purpose.
        </p>

        <h2>Attribution and intellectual property</h2>
        <ul>
          <li>
            <strong>Test data</strong> is © Bjørn Nyland and is reproduced with attribution. This
            site is an independent project and is not affiliated with, sponsored by, or endorsed by
            Bjørn Nyland.
          </li>
          <li>
            <strong>Vehicle names, logos, and trademarks</strong> belong to their respective
            manufacturers. Their use here is for identification and comparison only and does not imply
            any affiliation or endorsement.
          </li>
          <li>
            <strong>The application code</strong> is open source under the MIT License. See the
            project repository linked in the footer.
          </li>
        </ul>

        <h2>Advertising disclosure</h2>
        <p>
          The site displays third-party advertising to cover its costs. Advertisements are clearly
          labelled. We do not control the content of third-party ads, and their appearance does not
          constitute an endorsement. See our{' '}
          <Link to="/privacy">Privacy Policy</Link> for how advertising cookies work.
        </p>

        <h2>Third-party links</h2>
        <p>
          The site may link to third-party websites for reference. We are not responsible for the
          content, policies, or practices of those sites.
        </p>

        <h2>No warranty</h2>
        <p>
          The site is provided “as is” and “as available”, without warranties of any kind, express or
          implied, including fitness for a particular purpose and non-infringement. We do not warrant
          that the site will be uninterrupted, error-free, or secure.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, we shall not be liable for any direct, indirect,
          incidental, consequential, or other damages arising from your use of, or inability to use,
          the site or its data — including any decision made in reliance on its content.
        </p>

        <h2>Changes to these terms</h2>
        <p>
          We may update these terms from time to time. Continued use of the site after changes
          constitutes acceptance of the revised terms. The “Last updated” date above reflects the
          latest revision.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms can be raised through the project’s{' '}
          <a href="https://github.com/sarthakpati/EV_Comparator/issues" target="_blank" rel="noopener noreferrer">
            GitHub repository
          </a>
          .
        </p>
      </div>
    </ContentLayout>
  )
}
