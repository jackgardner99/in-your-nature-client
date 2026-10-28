import { Button } from './ui'

type LoadStateProps = {
  error?: Error
  reload?: () => void
}

/** Placeholder shown while data loads, or an error with a retry button. */
export default function LoadState({ error, reload }: LoadStateProps) {
  if (!error) return <p className="muted small">Loading…</p>
  return (
    <div role="alert" style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
      <p className="muted small">Something went wrong loading this.</p>
      {reload && (
        <Button variant="ghost" onClick={reload}>
          Try again
        </Button>
      )}
    </div>
  )
}
