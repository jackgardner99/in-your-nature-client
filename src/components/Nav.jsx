import { Link, NavLink } from 'react-router'
import Logo from './Logo.jsx'

function Nav() {
  return (
    <nav>
      <div className="wrap nav-in">
        <Link to="/" className="brand">
          <Logo />
          In Your Nature
        </Link>
        <div className="nav-links">
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
