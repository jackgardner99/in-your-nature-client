import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../state/auth'
import { Button } from './ui'
import './AuthLayout.css'

/** Gate for the portal: sends signed-out visitors to /login and brings them back afterwards. */
export default function RequireAuth({ children }: { children: ReactNode }) {
  const { auth } = useAuth()
  const location = useLocation()

  if (auth.status === 'signedIn') return children
  if (auth.status === 'signedOut') return <Navigate to="/login" replace state={{ from: location }} />

  return (
    <div className="auth-splash" role={auth.status === 'error' ? 'alert' : 'status'}>
      {auth.status === 'loading' ? (
        <p className="muted">Loading…</p>
      ) : (
        <>
          <p className="muted">We couldn't reach the portal. Check your connection and try again.</p>
          <Button variant="ghost" onClick={auth.retry}>
            Try again
          </Button>
        </>
      )}
    </div>
  )
}
