import { ContentLayout } from '../components/ContentLayout'

const LAST_UPDATED = 'June 23, 2026'

export function Privacy() {
  return (
    <ContentLayout
      title="Privacy policy"
      description="How EV Comparator handles data, cookies, and third-party advertising, and how to control ad personalization."
      path="/privacy"
      lead={`Last updated ${LAST_UPDATED}`}
    >
      <div className="article-content">
        <p>
          This Privacy Policy explains how EV Comparator (“we”, “us”, or “the site”) handles
          information when you visit. We have tried to keep it short and plain. In summary: the site
          does not require an account and does not ask you for personal information, but it does show
          third-party advertising, and ad providers may use cookies as described below.
        </p>

        <h2>Information we collect</h2>
        <p>
          <strong>We do not directly collect personal information.</strong> There is no sign-up, no
          login, and no contact form that stores your details. We do not ask for your name, email
          address, or payment information.
        </p>
        <p>
          Like most websites, our hosting provider may automatically process basic technical
          information (such as your IP address, browser type, and the pages requested) in server
          logs for security and reliability. This is standard operational data and is not used to
          identify you.
        </p>

        <h2>Cookies and local storage</h2>
        <p>The site itself uses your browser’s local storage only for your own convenience — for example:</p>
        <ul>
          <li>remembering your light/dark theme preference;</li>
          <li>remembering which vehicles you have selected to compare.</li>
        </ul>
        <p>
          This information stays in your browser, is not sent to us, and you can clear it at any time
          through your browser settings. Separately, our advertising partner uses cookies as
          described in the next section.
        </p>

        <h2>Advertising</h2>
        <p>
          This site is supported by third-party advertising provided by{' '}
          <strong>Google AdSense</strong>. Advertising helps keep the tool and guides free.
        </p>
        <ul>
          <li>
            Third-party vendors, including Google, use cookies to serve ads based on your prior
            visits to this and other websites.
          </li>
          <li>
            Google’s use of advertising cookies enables it and its partners to serve ads to you based
            on your visit to this site and/or other sites on the Internet.
          </li>
          <li>
            You can opt out of personalized advertising by visiting{' '}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
              Google Ads Settings
            </a>
            . You can also opt out of some third-party vendors’ use of cookies for personalized
            advertising at{' '}
            <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
              aboutads.info
            </a>{' '}
            (US) or{' '}
            <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer">
              youronlinechoices.eu
            </a>{' '}
            (EU).
          </li>
        </ul>
        <p>
          For more information about how Google uses data when you use our partners’ sites or apps,
          see{' '}
          <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
            Google’s Privacy &amp; Terms
          </a>
          .
        </p>

        <h2>Analytics</h2>
        <p>
          We do not run our own analytics or tracking scripts. Any measurement is limited to what our
          advertising and hosting providers perform as described above.
        </p>

        <h2>Your choices</h2>
        <ul>
          <li>You can block or delete cookies in your browser settings.</li>
          <li>You can opt out of personalized ads using the links in the Advertising section.</li>
          <li>You can clear the site’s local storage (theme and compare selections) at any time.</li>
        </ul>

        <h2>Do Not Track</h2>
        <p>
          Some browsers offer a “Do Not Track” signal. There is no industry-standard response to this
          signal, so we do not currently respond to it. You can still control advertising cookies
          using the opt-out links above.
        </p>

        <h2>Children’s privacy</h2>
        <p>
          This site is intended for a general audience and is not directed at children under 13. We do
          not knowingly collect personal information from children.
        </p>

        <h2>International visitors</h2>
        <p>
          The site is operated as an independent project and may be accessed worldwide. By using it,
          you understand that any technical data described above may be processed by our service
          providers in the countries where they operate.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We may update this policy from time to time. Material changes will be reflected by updating
          the “Last updated” date at the top of this page.
        </p>

        <h2>Contact</h2>
        <p>
          For privacy questions, you can reach us through the project’s{' '}
          <a href="https://github.com/sarthakpati/EV_Comparator/issues" target="_blank" rel="noopener noreferrer">
            GitHub repository
          </a>
          .
        </p>
      </div>
    </ContentLayout>
  )
}
