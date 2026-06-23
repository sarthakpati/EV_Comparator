import { Link } from 'react-router-dom'
import { ContentLayout } from '../components/ContentLayout'

export function NotFound() {
  return (
    <ContentLayout
      title="Page not found"
      description="The page you were looking for could not be found."
      path="/404"
    >
      <div className="article-content">
        <p>
          Sorry — we couldn’t find that page. It may have moved or never existed. Try one of these
          instead:
        </p>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/matrix">The EV compare tool</Link></li>
          <li><Link to="/guides">Guides</Link></li>
          <li><Link to="/faq">FAQ</Link></li>
        </ul>
      </div>
    </ContentLayout>
  )
}
