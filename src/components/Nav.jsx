import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import Logo from './Logo.jsx'

function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <nav>
      <div className="wrap nav-in">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <Logo />
          In Your Nature
        </Link>
        <button
          type="button"
          className="nav-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
            <path
              d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        {/* a click on any link in the menu closes it */}
        <div
          id="nav-menu"
          className={`nav-links${open ? ' open' : ''}`}
          onClick={() => setOpen(false)}
        >
          <Link to="/#blueprint">The Blueprint</Link>
          <Link to="/#work">Work with me</Link>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            About
          </NavLink>
          <Link to="/#contact" className="btn btn-ghost">
            Book a free call
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Nav
