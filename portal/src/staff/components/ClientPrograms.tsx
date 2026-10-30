import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import type { ClientDetail, Enrollment, EnrollmentStatus, ProgramRow } from '../../api/staffTypes'
import { Button, Card, Chip, Progress } from '../../components/ui'
import { fullDate, usd } from '../../lib/format'
import { BLUEPRINT_LABEL, ENROLLMENT_LABEL, options, todayIso, useAction } from '../../lib/staff'
import { Field, FormError, Select } from '../forms'

type Props = { client: ClientDetail; programs: ProgramRow[]; onChanged: () => void }

export default function ClientPrograms({ client, programs, onChanged }: Props) {
  const [adding, setAdding] = useState(false)

  return (
    <Card flat aria-labelledby="programs-h">
      <div className="staff-head">
        <h2 id="programs-h" className="staff-h2">
          Programs
        </h2>
        {!adding && (
          <Button variant="ghost" className="btn-sm" onClick={() => setAdding(true)}>
            Add program
          </Button>
        )}
      </div>
      {adding && (
        <AddEnrollment
          client={client}
          programs={programs}
          onDone={(changed) => {
            setAdding(false)
            if (changed) onChanged()
          }}
        />
      )}
      {client.enrollments.length === 0 ? (
        !adding && <p className="empty">Not on a program yet.</p>
      ) : (
        <div className="rows">
          {client.enrollments.map((e) => (
            <EnrollmentRow key={e.id} enrollment={e} onChanged={onChanged} />
          ))}
        </div>
      )}
    </Card>
  )
}

function EnrollmentRow({ enrollment: e, onChanged }: { enrollment: Enrollment; onChanged: () => void }) {
  const [form, setForm] = useState({ status: e.status, startsOn: e.startsOn ?? '', endsOn: e.endsOn ?? '' })
  const save = useAction((body: object) => api.patch(`/staff/enrollments/${e.id}`, body))
  const dirty = form.status !== e.status || form.startsOn !== (e.startsOn ?? '') || form.endsOn !== (e.endsOn ?? '')

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    const ok = await save.run({ status: form.status, startsOn: form.startsOn || null, endsOn: form.endsOn || null })
    if (ok !== undefined) onChanged()
  }

  async function toggleGuarantee(invoked: boolean) {
    if ((await save.run({ guaranteeInvoked: invoked })) !== undefined) onChanged()
  }

  return (
    <div className="record">
      <div className="form">
        <div className="row-side">
          <span className="row-title">{e.programName}</span>
          <Chip variant={e.status === 'active' ? 'active' : 'outline'}>{ENROLLMENT_LABEL[e.status]}</Chip>
          <span className="row-meta">{usd(e.pricePaid)}</span>
        </div>
        <Progress
          label="Sessions completed"
          value={`${e.sessionsCompleted} of ${e.sessionsTotal}`}
          percent={e.sessionsTotal ? Math.min(100, (e.sessionsCompleted / e.sessionsTotal) * 100) : 0}
        />
        <form className="form" onSubmit={handleSubmit}>
          <FormError error={save.error} />
          <div className="form-grid">
            <Field label="Status" htmlFor={`st-${e.id}`}>
              <Select<EnrollmentStatus>
                id={`st-${e.id}`}
                value={form.status}
                options={options(ENROLLMENT_LABEL)}
                onChange={(status) => setForm({ ...form, status })}
              />
            </Field>
            <Field label="Starts" htmlFor={`start-${e.id}`}>
              <input
                id={`start-${e.id}`}
                className="input"
                type="date"
                value={form.startsOn}
                onChange={(ev) => setForm({ ...form, startsOn: ev.target.value })}
              />
            </Field>
            <Field label="Ends" htmlFor={`end-${e.id}`}>
              <input
                id={`end-${e.id}`}
                className="input"
                type="date"
                value={form.endsOn}
                onChange={(ev) => setForm({ ...form, endsOn: ev.target.value })}
              />
            </Field>
          </div>
          <div className="form-actions">
            {dirty && (
              <Button variant="teal" type="submit" className="btn-sm" disabled={save.pending}>
                Save changes
              </Button>
            )}
            {e.blueprintId && (
              <Link to={`/staff/blueprints/${e.blueprintId}`} className="text-link">
                Blueprint: {BLUEPRINT_LABEL[e.blueprintStatus!]} →
              </Link>
            )}
          </div>
        </form>
        <label className="staff-check small">
          <input
            type="checkbox"
            checked={e.guaranteeInvokedAt !== null}
            disabled={save.pending}
            onChange={(ev) => toggleGuarantee(ev.target.checked)}
          />
          Clarity guarantee in use
          {e.guaranteeInvokedAt && ` (since ${fullDate(e.guaranteeInvokedAt)})`}
        </label>
      </div>
    </div>
  )
}

function AddEnrollment({
  client,
  programs,
  onDone,
}: {
  client: ClientDetail
  programs: ProgramRow[]
  onDone: (changed: boolean) => void
}) {
  const [form, setForm] = useState({
    programId: programs[0]?.id ?? '',
    startsOn: todayIso(),
    price: '',
    upgradedFromId: '',
  })
  const program = programs.find((p) => p.id === form.programId)
  const save = useAction((body: object) => api.post(`/staff/clients/${client.id}/enrollments`, body))

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const ok = await save.run({
      programId: form.programId,
      startsOn: form.startsOn || null,
      pricePaid: form.price === '' ? null : Number(form.price),
      upgradedFromId: form.upgradedFromId || null,
    })
    if (ok !== undefined) onDone(true)
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <FormError error={save.error} />
      <div className="form-grid">
        <Field label="Program" htmlFor="add-program">
          <Select
            id="add-program"
            value={form.programId}
            options={programs.map((p) => ({ value: p.id, label: `${p.name} (${usd(p.price)})` }))}
            onChange={(programId) => setForm({ ...form, programId })}
          />
        </Field>
        <Field
          label="Start date"
          htmlFor="add-start"
          hint={program?.durationMonths ? `Ends ${program.durationMonths} months later.` : undefined}
        >
          <input
            id="add-start"
            className="input"
            type="date"
            value={form.startsOn}
            onChange={(e) => setForm({ ...form, startsOn: e.target.value })}
          />
        </Field>
        <Field label="Price paid" htmlFor="add-price" hint={program ? `Leave blank for ${usd(program.price)}.` : undefined}>
          <input
            id="add-price"
            className="input"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </Field>
        {client.enrollments.length > 0 && (
          <Field label="Upgrading from" htmlFor="add-from" hint="Keeps the Blueprint already written.">
            <Select
              id="add-from"
              value={form.upgradedFromId}
              options={[
                { value: '', label: 'Not an upgrade' },
                ...client.enrollments.map((e) => ({ value: e.id, label: e.programName })),
              ]}
              onChange={(upgradedFromId) => setForm({ ...form, upgradedFromId })}
            />
          </Field>
        )}
      </div>
      <div className="form-actions">
        <Button variant="teal" type="submit" disabled={save.pending || !form.programId}>
          {save.pending ? 'Adding…' : 'Add program'}
        </Button>
        <Button variant="ghost" onClick={() => onDone(false)}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
