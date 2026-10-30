import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import type { GroupCallDetail } from '../../api/staffTypes'
import { useApi } from '../../api/useApi'
import LoadState from '../../components/LoadState'
import { Button, Card } from '../../components/ui'
import { longDate } from '../../lib/format'
import { fromLocalInput, toLocalInput, useAction } from '../../lib/staff'
import { Field, FormError } from '../forms'

export default function CallDetail() {
  const { callId = '' } = useParams()
  const path = `/staff/circle/calls/${encodeURIComponent(callId)}`
  const call = useApi<GroupCallDetail>(path)
  const c = call.data
  const replace = (next: GroupCallDetail) => call.setData(() => next)

  return (
    <>
      <Link to="/staff/circle" className="back-link">
        ← The Circle
      </Link>
      {!c ? (
        <LoadState {...call} />
      ) : (
        <>
          <header className="staff-head">
            <div className="staff-head-text">
              <p className="eyebrow">Group call · {longDate(c.startsAt)}</p>
              <h1 className="staff-title">{c.topic}</h1>
              <p className="muted">
                {c.goingCount} going · {c.attendedCount} attended
              </p>
            </div>
          </header>
          <div className="grid2">
            <CallForm call={c} path={path} onSaved={replace} />
            <Attendance call={c} path={path} onSaved={replace} />
          </div>
        </>
      )}
    </>
  )
}

type Props = { call: GroupCallDetail; path: string; onSaved: (c: GroupCallDetail) => void }

function CallForm({ call, path, onSaved }: Props) {
  const [form, setForm] = useState({
    topic: call.topic,
    startsAt: toLocalInput(call.startsAt),
    durationMin: String(call.durationMin),
    meetingUrl: call.meetingUrl,
    recordingUrl: call.recordingUrl ?? '',
  })
  const [saved, setSaved] = useState(false)
  const save = useAction((body: object) => api.patch<GroupCallDetail>(path, body))

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaved(false)
    const next = await save.run({
      topic: form.topic.trim(),
      startsAt: fromLocalInput(form.startsAt),
      durationMin: Number(form.durationMin),
      meetingUrl: form.meetingUrl.trim(),
      recordingUrl: form.recordingUrl.trim(),
    })
    if (next) {
      onSaved(next)
      setSaved(true)
    }
  }

  return (
    <Card flat aria-labelledby="call-h">
      <h2 id="call-h" className="staff-h2">
        Details
      </h2>
      <form className="form" onSubmit={handleSubmit}>
        <FormError error={save.error} />
        <Field label="Topic" htmlFor="c-topic">
          <input
            id="c-topic"
            className="input"
            required
            value={form.topic}
            onChange={(e) => setForm({ ...form, topic: e.target.value })}
          />
        </Field>
        <div className="form-grid">
          <Field label="Starts" htmlFor="c-start">
            <input
              id="c-start"
              className="input"
              type="datetime-local"
              required
              value={form.startsAt}
              onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
            />
          </Field>
          <Field label="Minutes" htmlFor="c-min">
            <input
              id="c-min"
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
        <Field label="Meeting link" htmlFor="c-url">
          <input
            id="c-url"
            className="input"
            type="url"
            required
            value={form.meetingUrl}
            onChange={(e) => setForm({ ...form, meetingUrl: e.target.value })}
          />
        </Field>
        <Field label="Recording link" htmlFor="c-rec" hint="Once added, members see it under past calls.">
          <input
            id="c-rec"
            className="input"
            type="url"
            placeholder="https://"
            value={form.recordingUrl}
            onChange={(e) => setForm({ ...form, recordingUrl: e.target.value })}
          />
        </Field>
        <div className="form-actions">
          <Button variant="teal" type="submit" disabled={save.pending}>
            {save.pending ? 'Saving…' : 'Save'}
          </Button>
          {saved && (
            <span className="saved-note" role="status">
              Saved
            </span>
          )}
        </div>
      </form>
    </Card>
  )
}

function Attendance({ call, path, onSaved }: Props) {
  const mark = useAction((membershipId: string, attended: boolean) =>
    api.put<GroupCallDetail>(`${path}/attendance/${membershipId}`, { attended }),
  )

  async function toggle(membershipId: string, attended: boolean) {
    const next = await mark.run(membershipId, attended)
    if (next) onSaved(next)
  }

  return (
    <Card flat aria-labelledby="att-h">
      <h2 id="att-h" className="staff-h2">
        Attendance
      </h2>
      <FormError error={mark.error} />
      {call.attendance.length === 0 ? (
        <p className="empty">No Circle members yet.</p>
      ) : (
        <div className="steps">
          {call.attendance.map((a) => (
            <label key={a.membershipId} className="staff-check">
              <input
                type="checkbox"
                checked={a.attended}
                disabled={mark.pending}
                onChange={(e) => toggle(a.membershipId, e.target.checked)}
              />
              <span>
                {a.clientName}
                {a.rsvp && <span className="muted small"> · said they'd come</span>}
              </span>
            </label>
          ))}
        </div>
      )}
    </Card>
  )
}
