import { useState, type FormEvent } from 'react'
import { api } from '../../api/client'
import type { ClientDetail, MembershipStatus } from '../../api/staffTypes'
import { Button, Card, Chip } from '../../components/ui'
import { fullDate, usd } from '../../lib/format'
import { MEMBERSHIP_LABEL, options, useAction } from '../../lib/staff'
import { Field, FormError, Select } from '../forms'

function monthFromToday() {
  const d = new Date()
  d.setMonth(d.getMonth() + 1)
  return d.toISOString().slice(0, 10)
}

export default function ClientCircle({ client, onChanged }: { client: ClientDetail; onChanged: () => void }) {
  const m = client.membership
  const [periodEnd, setPeriodEnd] = useState(m ? m.currentPeriodEnd.slice(0, 10) : monthFromToday())
  const join = useAction((body: object) => api.post(`/staff/clients/${client.id}/membership`, body))
  const update = useAction((body: object) => api.patch(`/staff/memberships/${m!.id}`, body))
  const live = m && m.status !== 'canceled'

  async function handleJoin(e: FormEvent) {
    e.preventDefault()
    // Noon UTC keeps the date the same in every US time zone.
    if ((await join.run({ currentPeriodEnd: `${periodEnd}T12:00:00Z` })) !== undefined) onChanged()
  }

  async function setStatus(status: MembershipStatus) {
    if ((await update.run({ status })) !== undefined) onChanged()
  }

  async function savePeriodEnd() {
    if ((await update.run({ currentPeriodEnd: `${periodEnd}T12:00:00Z` })) !== undefined) onChanged()
  }

  return (
    <Card flat aria-labelledby="circle-h">
      <div className="staff-head">
        <h2 id="circle-h" className="staff-h2">
          The Circle
        </h2>
        {m && <Chip variant={live ? 'plum' : 'outline'}>{MEMBERSHIP_LABEL[m.status]}</Chip>}
      </div>
      {live ? (
        <div className="form">
          <p className="muted small">
            Member since {fullDate(m.startedAt)} · {usd(m.monthlyAmount)}/month
          </p>
          <FormError error={update.error} />
          <div className="form-grid">
            <Field label="Status" htmlFor="m-status">
              <Select<MembershipStatus>
                id="m-status"
                value={m.status}
                options={options(MEMBERSHIP_LABEL)}
                onChange={setStatus}
                disabled={update.pending}
              />
            </Field>
            <Field label="Paid through" htmlFor="m-end">
              <input
                id="m-end"
                className="input"
                type="date"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
                onBlur={() => periodEnd !== m.currentPeriodEnd.slice(0, 10) && savePeriodEnd()}
              />
            </Field>
          </div>
        </div>
      ) : (
        <form className="form" onSubmit={handleJoin}>
          <p className="muted small">
            {m ? `Left The Circle on ${fullDate(m.canceledAt!)}.` : `${client.firstName} isn't a Circle member.`} Adding
            them gives access to the Circle page in their portal.
          </p>
          <FormError error={join.error} />
          <div className="form-grid">
            <Field label="Paid through" htmlFor="m-new-end">
              <input
                id="m-new-end"
                className="input"
                type="date"
                required
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
              />
            </Field>
          </div>
          <div className="form-actions">
            <Button variant="teal" type="submit" disabled={join.pending}>
              {m ? 'Rejoin The Circle' : 'Add to The Circle'}
            </Button>
          </div>
        </form>
      )}
    </Card>
  )
}

