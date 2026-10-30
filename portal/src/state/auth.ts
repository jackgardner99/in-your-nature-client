import { createContext, useContext } from 'react'
import type { Me } from '../api/types'
import type { StaffMe } from '../api/staffTypes'

/** /me for clients, /staff/me for staff. */
export type AuthMe = Me | StaffMe

export type AuthState =
  | { status: 'loading' }
  | { status: 'signedOut' }
  | { status: 'error'; retry: () => void }
  | { status: 'signedIn'; me: AuthMe }

export type AuthContextValue = {
  auth: AuthState
  /** Call with the account returned by login, invite or reset. */
  signIn: (me: AuthMe) => void
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

/** The signed-in client. Only use inside client routes wrapped by <RequireAuth>. */
export function useMe() {
  const { auth } = useAuth()
  return auth.status === 'signedIn' ? (auth.me as Me) : undefined
}

/** The signed-in staff user. Only use inside staff routes wrapped by <RequireAuth>. */
export function useStaffMe() {
  const { auth } = useAuth()
  return auth.status === 'signedIn' ? (auth.me as StaffMe) : undefined
}
