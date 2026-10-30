import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import { Card } from '../../components/ui'
import { useAuth, type AuthMe } from '../../state/auth'
import { useRealm } from '../../state/realm'
import { isExpiredLink } from './authErrors'
import SetPasswordForm from './SetPasswordForm'

export default function ResetPassword() {
  const { token = '' } = useParams()
  const { signIn } = useAuth()
  const realm = useRealm()
  const [expired, setExpired] = useState(false)

  async function reset(password: string) {
    try {
      signIn(await api.post<AuthMe>(`${realm.api}/auth/reset-password`, { token, password }))
    } catch (err) {
      if (isExpiredLink(err)) setExpired(true)
      else throw err
    }
  }

  return (
    <Card className="auth-card" aria-labelledby="reset-h">
      <div>
        <h1 id="reset-h" className="auth-title">
          Choose a new password
        </h1>
        {!expired && <p className="muted">You'll be signed in once it's saved.</p>}
      </div>
      {expired ? (
        <>
          <p className="muted">This reset link has expired or has already been used.</p>
          <Link to={`${realm.base}/forgot-password`} className="text-link">
            Send a new link
          </Link>
        </>
      ) : (
        <SetPasswordForm submitLabel="Save password" onSubmit={reset} />
      )}
    </Card>
  )
}
