import { useState, type FormEvent, type ReactNode } from 'react'
import { Button } from '../../components/ui'
import { MIN_PASSWORD_LENGTH } from '../../config'
import { authErrorMessage } from './authErrors'

type SetPasswordFormProps = {
  submitLabel: string
  onSubmit: (password: string) => Promise<void>
  /** Rendered above the password fields, e.g. a read-only email for password managers. */
  children?: ReactNode
}

export default function SetPasswordForm({ submitLabel, onSubmit, children }: SetPasswordFormProps) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string>()
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Use at least ${MIN_PASSWORD_LENGTH} characters.`)
      return
    }
    if (password !== confirm) {
      setError("Those passwords don't match.")
      return
    }
    setSubmitting(true)
    setError(undefined)
    try {
      await onSubmit(password)
    } catch (err) {
      setError(authErrorMessage(err, "That password wasn't accepted. Try a different one."))
      setSubmitting(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}
      {children}
      <div className="field">
        <label htmlFor="new-password">Password</label>
        <input
          id="new-password"
          className="input"
          type="password"
          autoComplete="new-password"
          aria-describedby="password-hint"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span id="password-hint" className="field-hint">
          At least {MIN_PASSWORD_LENGTH} characters.
        </span>
      </div>
      <div className="field">
        <label htmlFor="confirm-password">Confirm password</label>
        <input
          id="confirm-password"
          className="input"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </div>
      <Button variant="teal" type="submit" disabled={submitting}>
        {submitting ? 'Saving…' : submitLabel}
      </Button>
    </form>
  )
}
