import { Link, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import type { Invite } from '../../api/types'
import { useApi } from '../../api/useApi'
import LoadState from '../../components/LoadState'
import { Card } from '../../components/ui'
import { COACH_NAME } from '../../config'
import { useAuth, type AuthMe } from '../../state/auth'
import { useRealm } from '../../state/realm'
import { isExpiredLink } from './authErrors'
import SetPasswordForm from './SetPasswordForm'

export default function AcceptInvite() {
  const { token = '' } = useParams()
  const { signIn } = useAuth()
  const realm = useRealm()
  const path = `${realm.api}/auth/invite/${encodeURIComponent(token)}`
  const invite = useApi<Invite>(path)

  if (!invite.data) {
    return (
      <Card className="auth-card" aria-labelledby="invite-h">
        <h1 id="invite-h" className="auth-title">
          Your invitation
        </h1>
        {isExpiredLink(invite.error) ? (
          <>
            <p className="muted">
              This invite link has expired or has already been used.{' '}
              {realm.staff ? 'Ask for a new one.' : `Ask ${COACH_NAME} to send you a new one.`}
            </p>
            <Link to={`${realm.base}/login`} className="text-link">
              Already set up? Sign in
            </Link>
          </>
        ) : (
          <LoadState {...invite} />
        )}
      </Card>
    )
  }

  return (
    <Card className="auth-card" aria-labelledby="invite-h">
      <div>
        <h1 id="invite-h" className="auth-title">
          Welcome, {invite.data.firstName}.
        </h1>
        <p className="muted">
          {realm.staff ? "You've been given access to the staff portal." : `${COACH_NAME} has invited you to your portal.`}{' '}
          Choose a password to finish setting up.
        </p>
      </div>
      <SetPasswordForm
        submitLabel="Create my account"
        onSubmit={async (password) => signIn(await api.post<AuthMe>(path, { password }))}
      >
        <div className="field">
          <label htmlFor="invite-email">Email</label>
          <input id="invite-email" className="input" type="email" autoComplete="username" value={invite.data.email} disabled />
        </div>
      </SetPasswordForm>
    </Card>
  )
}
