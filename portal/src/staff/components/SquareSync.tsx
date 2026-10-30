import { useState } from 'react'
import { api } from '../../api/client'
import type { SquareSyncReport } from '../../api/staffTypes'
import { Button, Card } from '../../components/ui'
import { useAction } from '../../lib/staff'
import { FormError } from '../forms'

/** Invoices normally arrive by webhook; this re-copies them all, e.g. after adding a client. */
export default function SquareSync() {
  const sync = useAction(() => api.post<SquareSyncReport>('/staff/square/sync'))
  const [report, setReport] = useState<SquareSyncReport>()

  async function run() {
    setReport(undefined)
    setReport(await sync.run())
  }

  return (
    <Card flat aria-labelledby="square-h">
      <h2 id="square-h" className="staff-h2">
        Square invoices
      </h2>
      <p>
        Invoices you send from Square appear on the client's Billing page automatically, matched by their email.
        If one was sent before the client was added here or enrolled in a program, sync to pick it up.
      </p>
      <FormError error={sync.error} />
      <div className="form-actions">
        <Button variant="teal" onClick={run} disabled={sync.pending}>
          {sync.pending ? 'Syncing…' : 'Sync from Square'}
        </Button>
        {report && (
          <span className="saved-note" role="status">
            {report.synced} invoice{report.synced === 1 ? '' : 's'} up to date
          </span>
        )}
      </div>
      {report && report.unmatched.length > 0 && (
        <>
          <p className="small">These couldn't be matched. Add the client (same email) and enroll them, then sync again:</p>
          <div className="rows">
            {report.unmatched.map((u) => (
              <div key={u.invoiceNumber} className="row">
                <div className="row-main">
                  <span className="row-title">
                    #{u.invoiceNumber}
                    {u.name && ` · ${u.name}`}
                  </span>
                  <span className="row-meta">
                    {u.email || 'No email on invoice'} · {u.reason}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  )
}
