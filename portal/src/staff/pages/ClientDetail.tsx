import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import type { ClientDetail as Detail, ClientStage, ProgramRow } from '../../api/staffTypes'
import { useApi } from '../../api/useApi'
import LoadState from '../../components/LoadState'
import { Button, Card, Chip } from '../../components/ui'
import { fullDate } from '../../lib/format'
import { ACCOUNT_LABEL, INQUIRY_LABEL, STAGE_LABEL, options, useAction } from '../../lib/staff'
import ClientCircle from '../components/ClientCircle'
import ClientPrograms from '../components/ClientPrograms'
import ClientSessions from '../components/ClientSessions'
import { Field, FormError, Select } from '../forms'

export default function ClientDetail() {
  const { clientId = '' } = useParams()
  const path = `/staff/clients/${encodeURIComponent(clientId)}`
  const detail = useApi<Detail>(path)
  const programs = useApi<ProgramRow[]>('/staff/programs')
  const c = detail.data
  const replace = (next: Detail) => detail.setData(() => next)

  return (
    <>
      <Link to="/staff/clients" className="back-link">
        ← All clients
      </Link>
      {!c ? (
        <LoadState {...detail} />
      ) : (
        <>
          <header className="staff-head">
            <div className="staff-head-text">
              <p className="eyebrow">{STAGE_LABEL[c.stage]}</p>
              <h1 className="staff-title">{c.fullName}</h1>
              <p className="muted">
                <a href={`mailto:${c.email}`}>{c.email}</a> · Added {fullDate(c.createdAt)}
              </p>
            </div>
            <div className="row-side">
              {c.isCircleMember && <Chip variant="plum">Circle</Chip>}
              <Chip variant={c.account === 'active' ? 'active' : c.account === 'invited' ? 'due' : 'scheduled'}>
                {ACCOUNT_LABEL[c.account]}
              </Chip>
            </div>
          </header>

          <div className="grid2">
            <PortalAccess client={c} onInvited={detail.reload} />
            <Profile client={c} path={path} onSaved={replace} />
          </div>

          <ClientPrograms client={c} programs={programs.data ?? []} onChanged={detail.reload} />
          <ClientSessions client={c} onChanged={detail.reload} />
          <ClientCircle client={c} onChanged={detail.reload} />
          <Intake client={c} />
        </>
      )}
    </>
  )
}

function PortalAccess({ client, onInvited }: { client: Detail; onInvited: () => void }) {
  const invite = useAction(() => api.post(`/staff/clients/${client.id}/invite`))
  const [sent, setSent] = useState(false)

  async function send() {
    setSent(false)
    if ((await invite.run()) !== undefined) {
      setSent(true)
      onInvited()
    }
  }

  return (
    <Card flat aria-labelledby="access-h">
      <h2 id="access-h" className="staff-h2">
        Portal access
      </h2>
      {client.account === 'active' ? (
        <p>
          {client.firstName} has set up their account. If they're locked out, they can use “Forgot password?” on the
          sign-in page.
        </p>
      ) : (
        <>
          <p>
            {client.account === 'invited' && client.inviteExpiresAt
              ? `Invite sent. The link works until ${fullDate(client.inviteExpiresAt)}.`
              : `${client.firstName} hasn't been invited yet.`}{' '}
            Sending an invite emails a link to choose a password; a new invite replaces any earlier link.
          </p>
          <FormError error={invite.error} />
          <div className="form-actions">
            <Button variant="teal" onClick={send} disabled={invite.pending}>
              {invite.pending ? 'Sending…' : client.account === 'invited' ? 'Resend invite' : 'Send invite'}
            </Button>
            {sent && (
              <span className="saved-note" role="status">
                Invite sent to {client.email}
              </span>
            )}
          </div>
        </>
      )}
    </Card>
  )
}

function Profile({ client, path, onSaved }: { client: Detail; path: string; onSaved: (c: Detail) => void }) {
  const [form, setForm] = useState({
    firstName: client.firstName,
    lastName: client.lastName ?? '',
    email: client.email,
    stage: client.stage,
  })
  const [saved, setSaved] = useState(false)
  const save = useAction((body: object) => api.patch<Detail>(path, body))

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaved(false)
    const next = await save.run({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim() || null,
      email: form.email.trim(),
      stage: form.stage,
    })
    if (next) {
      onSaved(next)
      setSaved(true)
    }
  }

  return (
    <Card flat aria-labelledby="profile-h">
      <h2 id="profile-h" className="staff-h2">
        Details
      </h2>
      <form className="form" onSubmit={handleSubmit}>
        <FormError error={save.error} />
        <div className="form-grid">
          <Field label="First name" htmlFor="p-first">
            <input
              id="p-first"
              className="input"
              required
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
          </Field>
          <Field label="Last name" htmlFor="p-last">
            <input
              id="p-last"
              className="input"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Email" htmlFor="p-email">
          <input
            id="p-email"
            className="input"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Field>
        <Field label="Stage" htmlFor="p-stage">
          <Select<ClientStage>
            id="p-stage"
            value={form.stage}
            options={options(STAGE_LABEL)}
            onChange={(stage) => setForm({ ...form, stage })}
          />
        </Field>
        <div className="form-actions">
          <Button variant="teal" type="submit" disabled={save.pending}>
            {save.pending ? 'Saving…' : 'Save details'}
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

function Intake({ client }: { client: Detail }) {
  if (!client.inquiries.length && !client.quizResponses.length && !client.sharedJournal.length) return null
  return (
    <div className="grid2">
      {(client.inquiries.length > 0 || client.quizResponses.length > 0) && (
        <Card flat aria-labelledby="intake-h">
          <h2 id="intake-h" className="staff-h2">
            How they found you
          </h2>
          {client.inquiries.map((i) => (
            <div key={i.id} className="form">
              <p className="row-meta">
                Intro-call request · {fullDate(i.createdAt)} · {INQUIRY_LABEL[i.status]}
              </p>
              <p className="quote">{i.whereYouAre}</p>
            </div>
          ))}
          {client.quizResponses.map((r) => (
            <div key={r.id} className="form">
              <p className="row-meta">
                Starting-point quiz · {fullDate(r.submittedAt)} · scored {r.totalScore}/12 ·{' '}
                {r.recommendedProgramName ?? r.recommendedTier}
              </p>
              <div className="steps">
                {r.answers.map((a) => (
                  <p key={a.questionKey} className="small">
                    <strong>{a.question}</strong> {a.answer}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </Card>
      )}
      {client.sharedJournal.length > 0 && (
        <Card flat aria-labelledby="journal-h">
          <h2 id="journal-h" className="staff-h2">
            Shared journal entries
          </h2>
          {client.sharedJournal.map((e) => (
            <div key={e.id} className="form">
              <p className="row-meta">
                {fullDate(e.createdAt)}
                {e.promptText && ` · ${e.promptText}`}
              </p>
              <p className="quote">{e.body}</p>
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}
