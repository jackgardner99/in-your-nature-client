import { Link } from 'react-router'
import Logo from './Logo.jsx'

function Footer({ heading, children }) {
  return (
    <footer>
      <div className="wrap">
        <h2>{heading}</h2>
        <p>{children}</p>
        <div className="foot-row">
          <Link to="/#contact" className="btn btn-solid">
            Book a free intro call
          </Link>
          <div className="foot-brand">
            <Logo leaf="#A7C0BA" stem="#E4EEEA" size={26} />
            In Your Nature
          </div>
        </div>
        <div className="foot-links">
          <Link to="/#blueprint">The Blueprint</Link>
          <Link to="/#work">Work with me</Link>
          <Link to="/about">About</Link>
          {/* The portal is a separate app under /portal/, so this is a full page load, not a router link. */}
          <a href="/portal/">Client login</a>
          <a href="mailto:getinyournature@gmail.com">getinyournature@gmail.com</a>
        </div>
        <p className="foot-fine">
          In Your Nature provides coaching and personal-development guidance intended to support
          your own growth and decisions. It is not a substitute for licensed therapy, medical,
          legal, or financial advice. Any wellbeing suggestions are shared from personal and
          client experience, not as professional or medical direction.
        </p>
        <p className="foot-credit">
          Site built by{' '}
          <a href="https://gardnersolutions.co/" target="_blank" rel="noopener noreferrer">
            Gardner Solutions
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
