import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import { Button, Card } from '../../components/ui'
import { COACH_NAME } from '../../config'
import { useAuth, type AuthMe } from '../../state/auth'
import { useRealm } from '../../state/realm'
import { authErrorMessage } from './authErrors'

export default function Login() {
  const { signIn } = useAuth()
  const realm = useRealm()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>()
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(undefined)
    try {
      signIn(await api.post<AuthMe>(`${realm.api}/auth/login`, { email: email.trim(), password }))
    } catch (err) {
      setError(authErrorMessage(err, "That email and password don't match our records."))
      setSubmitting(false)
    }
  }

  return (
    <>
      <Card className="auth-card" aria-labelledby="login-h">
        <div>
          <h1 id="login-h" className="auth-title">
            Welcome back.
          </h1>
          <p className="muted">{realm.staff ? 'Sign in to the staff portal.' : 'Sign in to your portal.'}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="input"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <div className="auth-row">
              <label htmlFor="password">Password</label>
              <Link to={`${realm.base}/forgot-password`} className="text-link">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              className="input"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button variant="teal" type="submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </Card>

      {!realm.staff && (
        <p className="muted auth-footnote">
          The portal is by invitation. When you start working with {COACH_NAME}, you'll get an email invite to set up
          your account.
        </p>
      )}
    </>
  )
}
