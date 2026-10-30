import { NavLink, Outlet } from 'react-router-dom'
import { initials } from '../lib/format'
import { useAuth, useStaffMe } from '../state/auth'
import '../components/Layout.css'
import './staff.css'

const links = [
  { to: '/staff', label: 'Overview', end: true },
  { to: '/staff/clients', label: 'Clients' },
  { to: '/staff/inquiries', label: 'Inquiries' },
  { to: '/staff/blueprints', label: 'Blueprints' },
  { to: '/staff/circle', label: 'The Circle' },
]

export default function StaffLayout() {
  const me = useStaffMe()
  const { signOut } = useAuth()

  return (
    <div className="shell">
      <nav className="side side-staff" aria-label="Staff portal">
        <div className="brand">
          In Your <em>Nature</em>
          <span className="brand-tag">Staff</span>
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
              <div className="muted me-program">{me.email}</div>
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
