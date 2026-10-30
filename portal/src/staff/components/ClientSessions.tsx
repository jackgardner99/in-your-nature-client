import { useState, type FormEvent } from 'react'
import { api } from '../../api/client'
import type { ActionItem, ClientDetail, SessionKind, SessionStatus, StaffSession } from '../../api/staffTypes'
import { useApi } from '../../api/useApi'
import LoadState from '../../components/LoadState'
import { Button, Card, Chip } from '../../components/ui'
import { fullDate, longDate, timeRange } from '../../lib/format'
import {
  SESSION_KIND_LABEL,
  SESSION_STATUS_LABEL,
  fromLocalInput,
  options,
  toLocalInput,
  useAction,
} from '../../lib/staff'
import { Field, FormError, Select } from '../forms'

const endOf = (s: StaffSession) => new Date(Date.parse(s.startsAt) + s.durationMin * 60000).toISOString()

export default function ClientSessions({ client, onChanged }: { client: ClientDetail; onChanged: () => void }) {
  const sessions = useApi<StaffSession[]>(`/staff/clients/${client.id}/sessions`)
  const [adding, setAdding] = useState(false)

  const replace = (next: StaffSession) =>
    sessions.setData((list) => list.map((s) => (s.id === next.id ? next : s)))
  const changed = (next: StaffSession) => {
    replace(next)
    // Program progress on this page counts completed sessions.
    onChanged()
  }

  return (
    <Card flat aria-labelledby="sessions-h">
      <div className="staff-head">
        <h2 id="sessions-h" className="staff-h2">
          Sessions
        </h2>
        {!adding && (
          <Button variant="ghost" className="btn-sm" onClick={() => setAdding(true)}>
            Schedule session
          </Button>
        )}
      </div>
      {adding && (
        <AddSession
          client={client}
          onDone={(created) => {
            setAdding(false)
            if (created) {
              sessions.reload()
              onChanged()
            }
          }}
        />
      )}
      {!sessions.data ? (
        <LoadState {...sessions} />
      ) : sessions.data.length === 0 ? (
        !adding && <p className="empty">No sessions yet.</p>
      ) : (
        <div className="rows">
          {sessions.data.map((s) => (
            <SessionRecord key={s.id} session={s} client={client} onSaved={changed} onItemsChanged={replace} />
          ))}
        </div>
      )}
    </Card>
  )
}

function statusChip(status: SessionStatus) {
  const variant = status === 'completed' ? 'active' : status === 'scheduled' ? 'scheduled' : 'due'
  return <Chip variant={variant}>{SESSION_STATUS_LABEL[status]}</Chip>
}

type RecordProps = {
  session: StaffSession
  client: ClientDetail
  onSaved: (s: StaffSession) => void
  onItemsChanged: (s: StaffSession) => void
}

function SessionRecord({ session: s, client, onSaved, onItemsChanged }: RecordProps) {
  const program = client.enrollments.find((e) => e.id === s.enrollmentId)
  const [form, setForm] = useState({
    status: s.status,
    startsAt: toLocalInput(s.startsAt),
    durationMin: String(s.durationMin),
    meetingUrl: s.meetingUrl ?? '',
    countsTowardPlan: s.countsTowardPlan,
    clientNotes: s.clientNotes ?? '',
    coachPrivateNotes: s.coachPrivateNotes ?? '',
  })
  const [saved, setSaved] = useState(false)
  const save = useAction((body: object) => api.patch<StaffSession>(`/staff/sessions/${s.id}`, body))

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaved(false)
    const next = await save.run({
      status: form.status,
      startsAt: fromLocalInput(form.startsAt),
      durationMin: Number(form.durationMin),
      meetingUrl: form.meetingUrl.trim(),
      countsTowardPlan: form.countsTowardPlan,
      clientNotes: form.clientNotes.trim(),
      coachPrivateNotes: form.coachPrivateNotes.trim(),
    })
    if (next) {
      onSaved(next)
      setSaved(true)
    }
  }

  return (
    <details className="record">
      <summary>
        <div className="row-main">
          <span className="row-title">
            {SESSION_KIND_LABEL[s.kind]}
            {program && <span className="muted"> · {program.programName}</span>}
          </span>
          <span className="row-meta">
            {longDate(s.startsAt)}, {timeRange(s.startsAt, endOf(s))}
            {s.actionItems.length > 0 && ` · ${s.actionItems.length} next step${s.actionItems.length === 1 ? '' : 's'}`}
          </span>
        </div>
        {statusChip(s.status)}
      </summary>

      <div className="record-body">
        <form className="form" onSubmit={handleSubmit}>
          <FormError error={save.error} />
          <div className="form-grid">
            <Field label="Status" htmlFor={`ss-${s.id}`}>
              <Select<SessionStatus>
                id={`ss-${s.id}`}
                value={form.status}
                options={options(SESSION_STATUS_LABEL)}
                onChange={(status) => setForm({ ...form, status })}
              />
            </Field>
            <Field label="Starts" htmlFor={`sa-${s.id}`}>
              <input
                id={`sa-${s.id}`}
                className="input"
                type="datetime-local"
                required
                value={form.startsAt}
                onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
              />
            </Field>
            <Field label="Minutes" htmlFor={`sd-${s.id}`}>
              <input
                id={`sd-${s.id}`}
                className="input"
                type="number"
                min="5"
                step="5"
                required
                value={form.durationMin}
                onChange={(e) => setForm({ ...form, durationMin: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Meeting link" htmlFor={`su-${s.id}`}>
            <input
              id={`su-${s.id}`}
              className="input"
              type="url"
              placeholder="https://"
              value={form.meetingUrl}
              onChange={(e) => setForm({ ...form, meetingUrl: e.target.value })}
            />
          </Field>
          <Field label="Notes for the client" htmlFor={`sn-${s.id}`} hint={`${client.firstName} sees these in their portal.`}>
            <textarea
              id={`sn-${s.id}`}
              className="input"
              value={form.clientNotes}
              onChange={(e) => setForm({ ...form, clientNotes: e.target.value })}
            />
          </Field>
          <Field label="Private notes" htmlFor={`sp-${s.id}`} hint="Only you see these.">
            <textarea
              id={`sp-${s.id}`}
              className="input"
              value={form.coachPrivateNotes}
              onChange={(e) => setForm({ ...form, coachPrivateNotes: e.target.value })}
            />
          </Field>
          {s.kind !== 'intro' && (
            <label className="staff-check small">
              <input
                type="checkbox"
                checked={form.countsTowardPlan}
                onChange={(e) => setForm({ ...form, countsTowardPlan: e.target.checked })}
              />
              Counts toward the program's included sessions
            </label>
          )}
          <div className="form-actions">
            <Button variant="teal" type="submit" className="btn-sm" disabled={save.pending}>
              {save.pending ? 'Saving…' : 'Save session'}
            </Button>
            {saved && (
              <span className="saved-note" role="status">
                Saved
              </span>
            )}
          </div>
        </form>

        <NextSteps session={s} onChanged={onItemsChanged} />
      </div>
    </details>
  )
}

function NextSteps({ session, onChanged }: { session: StaffSession; onChanged: (s: StaffSession) => void }) {
  const [text, setText] = useState('')
  const [dueOn, setDueOn] = useState('')
  const add = useAction((body: object) => api.post<ActionItem>(`/staff/sessions/${session.id}/action-items`, body))
  const update = useAction((id: string, body: object) => api.patch<ActionItem>(`/staff/action-items/${id}`, body))
  const remove = useAction((id: string) => api.delete(`/staff/action-items/${id}`).then(() => true))

  const withItems = (items: ActionItem[]) => onChanged({ ...session, actionItems: items })

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    const item = await add.run({ text: text.trim(), dueOn: dueOn || null })
    if (item) {
      withItems([...session.actionItems, item])
      setText('')
      setDueOn('')
    }
  }

  async function toggle(item: ActionItem) {
    const next = await update.run(item.id, { done: !item.done })
    if (next) withItems(session.actionItems.map((i) => (i.id === next.id ? next : i)))
  }

  async function del(item: ActionItem) {
    if (await remove.run(item.id)) withItems(session.actionItems.filter((i) => i.id !== item.id))
  }

  return (
    <div className="form">
      <h3 className="small">Next steps</h3>
      <FormError error={add.error ?? update.error ?? remove.error} />
      {session.actionItems.length === 0 ? (
        <p className="empty small">None yet. They show up on the client's home page and Sessions page.</p>
      ) : (
        <div className="steps">
          {session.actionItems.map((item) => (
            <div key={item.id} className={`step${item.done ? ' step-done' : ''}`}>
              <input
                type="checkbox"
                aria-label={`Done: ${item.text}`}
                checked={item.done}
                onChange={() => toggle(item)}
              />
              <span className="step-text">
                {item.text}
                {item.dueOn && <span className="muted small"> · due {fullDate(item.dueOn)}</span>}
              </span>
              <button type="button" className="link-button small" onClick={() => del(item)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
      <form className="toolbar" onSubmit={handleAdd}>
        <input
          className="input input-sm"
          aria-label="New next step"
          placeholder="Add a next step"
          required
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          className="input input-sm"
          type="date"
          aria-label="Due date (optional)"
          value={dueOn}
          onChange={(e) => setDueOn(e.target.value)}
        />
        <Button variant="ghost" type="submit" className="btn-sm" disabled={add.pending}>
          Add
        </Button>
      </form>
    </div>
  )
}

function AddSession({ client, onDone }: { client: ClientDetail; onDone: (created: boolean) => void }) {
  const live = client.enrollments.filter((e) => e.status !== 'canceled' && e.status !== 'completed')
  const [form, setForm] = useState({
    kind: (live.length ? 'coaching' : 'intro') as SessionKind,
    enrollmentId: live[0]?.id ?? '',
    startsAt: '',
    durationMin: '60',
    meetingUrl: '',
  })
  const save = useAction((body: object) => api.post(`/staff/clients/${client.id}/sessions`, body))
  const needsProgram = form.kind !== 'intro'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const ok = await save.run({
      kind: form.kind,
      enrollmentId: needsProgram ? form.enrollmentId || null : null,
      startsAt: fromLocalInput(form.startsAt),
      durationMin: Number(form.durationMin),
      meetingUrl: form.meetingUrl.trim() || null,
    })
    if (ok !== undefined) onDone(true)
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <FormError error={save.error} />
      {needsProgram && client.enrollments.length === 0 && (
        <p className="form-error">Add a program first. Only intro calls can be scheduled outside a program.</p>
      )}
      <div className="form-grid">
        <Field label="Type" htmlFor="ns-kind">
          <Select<SessionKind>
            id="ns-kind"
            value={form.kind}
            options={options(SESSION_KIND_LABEL)}
            onChange={(kind) => setForm({ ...form, kind })}
          />
        </Field>
        {needsProgram && client.enrollments.length > 0 && (
          <Field label="Program" htmlFor="ns-program">
            <Select
              id="ns-program"
              value={form.enrollmentId}
              options={client.enrollments.map((e) => ({ value: e.id, label: e.programName }))}
              onChange={(enrollmentId) => setForm({ ...form, enrollmentId })}
            />
          </Field>
        )}
        <Field label="Starts" htmlFor="ns-start" hint="In your time zone.">
          <input
            id="ns-start"
            className="input"
            type="datetime-local"
            required
            value={form.startsAt}
            onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
          />
        </Field>
        <Field label="Minutes" htmlFor="ns-min">
          <input
            id="ns-min"
            className="input"
            type="number"
            min="5"
            step="5"
            required
            value={form.durationMin}
            onChange={(e) => setForm({ ...form, durationMin: e.target.value })}
          />
        </Field>
      </div>
      <Field label="Meeting link" htmlFor="ns-url">
        <input
          id="ns-url"
          className="input"
          type="url"
          placeholder="https://"
          value={form.meetingUrl}
          onChange={(e) => setForm({ ...form, meetingUrl: e.target.value })}
        />
      </Field>
      <div className="form-actions">
        <Button
          variant="teal"
          type="submit"
          disabled={save.pending || (needsProgram && !form.enrollmentId)}
        >
          {save.pending ? 'Scheduling…' : 'Schedule'}
        </Button>
        <Button variant="ghost" onClick={() => onDone(false)}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
