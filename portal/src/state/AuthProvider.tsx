import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { ApiError, api, onUnauthorized } from '../api/client'
import { AuthContext, type AuthMe, type AuthState } from './auth'
import { useRealm } from './realm'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)
  const { api: prefix } = useRealm()

  useEffect(() => {
    const retry = () => {
      setAuth({ status: 'loading' })
      setAttempt((n) => n + 1)
    }
    api.get<AuthMe>(`${prefix}/me`).then(
      (me) => setAuth({ status: 'signedIn', me }),
      (err) => setAuth(err instanceof ApiError && err.status === 401 ? { status: 'signedOut' } : { status: 'error', retry }),
    )
  }, [attempt, prefix])

  // A 401 from any data request means the session expired mid-visit.
  useEffect(() => onUnauthorized(() => setAuth({ status: 'signedOut' })), [])

  const signIn = useCallback((me: AuthMe) => setAuth({ status: 'signedIn', me }), [])
  const signOut = useCallback(async () => {
    try {
      await api.post(`${prefix}/auth/logout`)
    } finally {
      setAuth({ status: 'signedOut' })
    }
  }, [prefix])

  return <AuthContext.Provider value={{ auth, signIn, signOut }}>{children}</AuthContext.Provider>
}
