import { NavLink, Outlet } from 'react-router-dom'
import { initials } from '../lib/format'
import { useAuth, useMe } from '../state/auth'
import './Layout.css'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/blueprint', label: 'My Blueprint' },
  { to: '/sessions', label: 'Sessions' },
  { to: '/billing', label: 'Billing' },
  { to: '/circle', label: 'The Circle' },
]

export default function Layout() {
  const me = useMe()
  const { signOut } = useAuth()

  return (
    <div className="shell">
      <nav className="side" aria-label="Portal">
        <div className="brand">
          In Your <em>Nature</em>
        </div>
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end} className="nav">
            {link.label}
          </NavLink>
        ))}
        {me && (
          <div className="me">
            <div className="avatar" aria-hidden="true">
              {initials(me.fullName)}
            </div>
            <div className="me-text">
              <div className="me-name">{me.fullName}</div>
              <div className="muted me-program">{me.programName}</div>
              <button type="button" className="link-button sign-out" onClick={signOut}>
                Sign out
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
