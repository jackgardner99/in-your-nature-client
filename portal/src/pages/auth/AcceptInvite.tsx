import { Link, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import type { Invite, Me } from '../../api/types'
import { useApi } from '../../api/useApi'
import LoadState from '../../components/LoadState'
import { Card } from '../../components/ui'
import { COACH_NAME } from '../../config'
import { useAuth } from '../../state/auth'
import { isExpiredLink } from './authErrors'
import SetPasswordForm from './SetPasswordForm'

export default function AcceptInvite() {
  const { token = '' } = useParams()
  const { signIn } = useAuth()
  const path = `/auth/invite/${encodeURIComponent(token)}`
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
              This invite link has expired or has already been used. Ask {COACH_NAME} to send you a new one.
            </p>
            <Link to="/login" className="text-link">
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
        <p className="muted">{COACH_NAME} has invited you to your portal. Choose a password to finish setting up.</p>
      </div>
      <SetPasswordForm
        submitLabel="Create my account"
        onSubmit={async (password) => signIn(await api.post<Me>(path, { password }))}
      >
        <div className="field">
          <label htmlFor="invite-email">Email</label>
          <input id="invite-email" className="input" type="email" autoComplete="username" value={invite.data.email} disabled />
        </div>
      </SetPasswordForm>
    </Card>
  )
}
