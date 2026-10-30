import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import type { ClientDetail, ClientRow, ClientStage } from '../../api/staffTypes'
import { useApi } from '../../api/useApi'
import LoadState from '../../components/LoadState'
import { Button, Card, Chip } from '../../components/ui'
import { ACCOUNT_LABEL, ENROLLMENT_LABEL, STAGE_LABEL, useAction } from '../../lib/staff'
import { Field, FormError } from '../forms'

const STAGES: (ClientStage | 'all')[] = ['all', 'lead', 'active', 'alumni', 'archived']

export default function Clients() {
  const [q, setQ] = useState('')
  const [stage, setStage] = useState<ClientStage | 'all'>('all')
  const [adding, setAdding] = useState(false)
  const params = new URLSearchParams()
  if (q.trim()) params.set('q', q.trim())
  if (stage !== 'all') params.set('stage', stage)
  const clients = useApi<ClientRow[]>(`/staff/clients${params.size ? `?${params}` : ''}`)

  return (
    <>
      <header className="staff-head">
        <div className="staff-head-text">
          <p className="eyebrow">Clients</p>
          <h1 className="staff-title">Everyone you work with</h1>
        </div>
        {!adding && (
          <Button variant="teal" onClick={() => setAdding(true)}>
            Add client
          </Button>
        )}
      </header>

      {adding && <AddClient onCancel={() => setAdding(false)} />}

      <Card flat>
        <div className="toolbar">
          <input
            className="input"
            type="search"
            placeholder="Search by name or email"
            aria-label="Search clients"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {STAGES.map((s) => (
            <button key={s} type="button" className="filter" aria-pressed={stage === s} onClick={() => setStage(s)}>
              {s === 'all' ? 'All' : STAGE_LABEL[s]}
            </button>
          ))}
        </div>

        {!clients.data ? (
          <LoadState {...clients} />
        ) : clients.data.length === 0 ? (
          <p className="empty">No clients match.</p>
        ) : (
          <div className="rows">
            {clients.data.map((c) => (
              <Link key={c.id} to={`/staff/clients/${c.id}`} className="row">
                <div className="row-main">
                  <span className="row-title">{c.fullName}</span>
                  <span className="row-meta">
                    {c.email}
                    {c.programName && ` · ${c.programName}`}
                    {c.enrollmentStatus && c.enrollmentStatus !== 'active' && ` (${ENROLLMENT_LABEL[c.enrollmentStatus]})`}
                  </span>
                </div>
                <div className="row-side">
                  {c.isCircleMember && <Chip variant="plum">Circle</Chip>}
                  <Chip variant="outline">{STAGE_LABEL[c.stage]}</Chip>
                  <Chip variant={c.account === 'active' ? 'active' : c.account === 'invited' ? 'due' : 'scheduled'}>
                    {ACCOUNT_LABEL[c.account]}
                  </Chip>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </>
  )
}

function AddClient({ onCancel }: { onCancel: () => void }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', sendInvite: true })
  const save = useAction((body: object) => api.post<ClientDetail>('/staff/clients', body))

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const client = await save.run({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim() || null,
      email: form.email.trim(),
      sendInvite: form.sendInvite,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
    if (client) navigate(`/staff/clients/${client.id}`)
  }

  return (
    <Card aria-labelledby="add-h">
      <h2 id="add-h" className="staff-h2">
        Add a client
      </h2>
      <form className="form" onSubmit={handleSubmit}>
        <FormError error={save.error} />
        <div className="form-grid">
          <Field label="First name" htmlFor="new-first">
            <input
              id="new-first"
              className="input"
              required
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
          </Field>
          <Field label="Last name" htmlFor="new-last">
            <input
              id="new-last"
              className="input"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </Field>
          <Field label="Email" htmlFor="new-email">
            <input
              id="new-email"
              className="input"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
        </div>
        <label className="staff-check">
          <input
            type="checkbox"
            checked={form.sendInvite}
            onChange={(e) => setForm({ ...form, sendInvite: e.target.checked })}
          />
          Email them an invite to the portal now
        </label>
        <div className="form-actions">
          <Button variant="teal" type="submit" disabled={save.pending}>
            {save.pending ? 'Adding…' : 'Add client'}
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
