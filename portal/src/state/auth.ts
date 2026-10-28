import { createContext, useContext } from 'react'
import type { Me } from '../api/types'

export type AuthState =
  | { status: 'loading' }
  | { status: 'signedOut' }
  | { status: 'error'; retry: () => void }
  | { status: 'signedIn'; me: Me }

export type AuthContextValue = {
  auth: AuthState
  /** Call with the Me returned by login, invite or reset. */
  signIn: (me: Me) => void
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

/** The signed-in client. Only use inside routes wrapped by <RequireAuth>. */
export function useMe() {
  const { auth } = useAuth()
  return auth.status === 'signedIn' ? auth.me : undefined
}
