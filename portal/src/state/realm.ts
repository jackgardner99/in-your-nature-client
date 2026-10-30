import { createContext, useContext } from 'react'

/**
 * Which side of the portal we're in. Clients and staff (Kadi) sign in the same way, but the
 * API routes live under different prefixes and the app under different paths.
 */
export type Realm = {
  staff: boolean
  /** Prefix for auth API routes: '' → /auth/login, '/staff' → /staff/auth/login. */
  api: '' | '/staff'
  /** Where this side of the app lives: '' → /login, '/staff' → /staff/login. */
  base: '' | '/staff'
}

export const CLIENT_REALM: Realm = { staff: false, api: '', base: '' }
export const STAFF_REALM: Realm = { staff: true, api: '/staff', base: '/staff' }

export const RealmContext = createContext<Realm>(CLIENT_REALM)

export const useRealm = () => useContext(RealmContext)
