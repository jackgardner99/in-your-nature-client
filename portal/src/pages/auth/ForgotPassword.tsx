import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import { Button, Card } from '../../components/ui'
import { useRealm } from '../../state/realm'
import { authErrorMessage } from './authErrors'

export default function ForgotPassword() {
  const realm = useRealm()
  const [email, setEmail] = useState('')
  const [sentTo, setSentTo] = useState<string>()
  const [error, setError] = useState<string>()
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(undefined)
    try {
      await api.post(`${realm.api}/auth/forgot-password`, { email: email.trim() })
      setSentTo(email.trim())
    } catch (err) {
      setError(authErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="auth-card" aria-labelledby="forgot-h">
      <div>
        <h1 id="forgot-h" className="auth-title">
          Reset your password
        </h1>
        <p className="muted">Enter the email you use for the portal and we'll send you a link.</p>
      </div>

      {sentTo ? (
        <p className="auth-notice" role="status">
          If there's a portal account for {sentTo}, a reset link is on its way. It can take a few minutes to arrive.
        </p>
      ) : (
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
          <Button variant="teal" type="submit" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send reset link'}
          </Button>
        </form>
      )}

      <Link to={`${realm.base}/login`} className="text-link">
        Back to sign in
      </Link>
    </Card>
  )
}
