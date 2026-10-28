import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { ApiError, api, onUnauthorized } from '../api/client'
import type { Me } from '../api/types'
import { AuthContext, type AuthState } from './auth'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const retry = () => {
      setAuth({ status: 'loading' })
      setAttempt((n) => n + 1)
    }
    api.get<Me>('/me').then(
      (me) => setAuth({ status: 'signedIn', me }),
      (err) => setAuth(err instanceof ApiError && err.status === 401 ? { status: 'signedOut' } : { status: 'error', retry }),
    )
  }, [attempt])

  // A 401 from any data request means the session expired mid-visit.
  useEffect(() => onUnauthorized(() => setAuth({ status: 'signedOut' })), [])

  const signIn = useCallback((me: Me) => setAuth({ status: 'signedIn', me }), [])
  const signOut = useCallback(async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      setAuth({ status: 'signedOut' })
    }
  }, [])

  return <AuthContext.Provider value={{ auth, signIn, signOut }}>{children}</AuthContext.Provider>
}
