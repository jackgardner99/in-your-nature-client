import { Navigate, Outlet, useLocation, type Location } from 'react-router-dom'
import { useAuth } from '../state/auth'
import './AuthLayout.css'

/** Centered shell for the signed-out pages. Once signed in, visitors go back to where they were headed. */
export default function AuthLayout() {
  const { auth } = useAuth()
  const location = useLocation()

  if (auth.status === 'signedIn') {
    const from = (location.state as { from?: Location } | null)?.from
    return <Navigate to={from ? `${from.pathname}${from.search}${from.hash}` : '/'} replace />
  }

  return (
    <div className="auth-page">
      <div className="auth-brand">
        In Your <em>Nature</em>
      </div>
      <Outlet />
    </div>
  )
}
