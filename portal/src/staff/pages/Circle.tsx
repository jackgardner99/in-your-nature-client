import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import type { FacetRow, GroupCallDetail, GroupCallRow, MemberRow, PromptAudience, PromptRow } from '../../api/staffTypes'
import { useApi } from '../../api/useApi'
import LoadState from '../../components/LoadState'
import { Button, Card, Chip } from '../../components/ui'
import { fullDate, longDate, monthYear } from '../../lib/format'
import { MEMBERSHIP_LABEL, fromLocalInput, todayIso, useAction } from '../../lib/staff'
import { Field, FormError, Select } from '../forms'

export default function Circle() {
  return (
    <>
      <header className="staff-head">
        <div className="staff-head-text">
          <p className="eyebrow">The Circle</p>
          <h1 className="staff-title">Community</h1>
          <p className="muted">Monthly prompts, group calls, and who's in.</p>
        </div>
      </header>
      <Prompts />
      <Calls />
      <Members />
    </>
  )
}

function Members() {
  const members = useApi<MemberRow[]>('/staff/circle/members')
  return (
    <Card flat aria-labelledby="members-h">
      <h2 id="members-h" className="staff-h2">
        Members
      </h2>
      <p className="muted small">Add someone to The Circle from their client page.</p>
      {!members.data ? (
        <LoadState {...members} />
      ) : members.data.length === 0 ? (
        <p className="empty">No members yet.</p>
      ) : (
        <div className="rows">
          {members.data.map((m) => (
            <Link key={m.id} to={`/staff/clients/${m.clientId}`} className="row">
              <div className="row-main">
                <span className="row-title">{m.clientName}</span>
                <span className="row-meta">
                  Since {fullDate(m.startedAt)} · paid through {fullDate(m.currentPeriodEnd)}
                </span>
              </div>
              <Chip variant={m.status === 'active' ? 'plum' : m.status === 'past_due' ? 'due' : 'outline'}>
                {MEMBERSHIP_LABEL[m.status]}
              </Chip>
            </Link>
          ))}
        </div>
      )}
    </Card>
  )
}

function Prompts() {
  const prompts = useApi<PromptRow[]>('/staff/circle/prompts')
  const facets = useApi<FacetRow[]>('/staff/facets')
  const [form, setForm] = useState({
    month: todayIso().slice(0, 7),
    facetKey: '',
    prompt: '',
    audience: 'circle' as PromptAudience,
  })
  const add = useAction((body: object) => api.post<PromptRow>('/staff/circle/prompts', body))
  const remove = useAction((id: string) => api.delete(`/staff/circle/prompts/${id}`).then(() => true))

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    const created = await add.run({
      month: `${form.month}-01`,
      facetKey: form.facetKey || null,
      prompt: form.prompt.trim(),
      audience: form.audience,
    })
    if (created) {
      prompts.reload()
      setForm({ ...form, prompt: '' })
    }
  }

  async function del(p: PromptRow) {
    const note = p.entryCount ? ` ${p.entryCount} journal entr${p.entryCount === 1 ? 'y' : 'ies'} will be kept as free entries.` : ''
    if (!window.confirm(`Delete this prompt?${note}`)) return
    if (await remove.run(p.id)) prompts.setData((list) => list.filter((x) => x.id !== p.id))
  }

  // Group by month, newest first (the API already sorts that way).
  const byMonth = new Map<string, PromptRow[]>()
  for (const p of prompts.data ?? []) byMonth.set(p.month, [...(byMonth.get(p.month) ?? []), p])

  return (
    <Card flat aria-labelledby="prompts-h">
      <h2 id="prompts-h" className="staff-h2">
        Journal prompts
      </h2>
      <p className="muted small">Members see this month's prompts on their Circle page.</p>

      <form className="form" onSubmit={handleAdd}>
        <FormError error={add.error ?? remove.error} />
        <div className="form-grid">
          <Field label="Month" htmlFor="pr-month">
            <input
              id="pr-month"
              className="input"
              type="month"
              required
              value={form.month}
              onChange={(e) => setForm({ ...form, month: e.target.value })}
            />
          </Field>
          <Field label="Facet" htmlFor="pr-facet">
            <Select
              id="pr-facet"
              value={form.facetKey}
              options={[{ value: '', label: 'None' }, ...(facets.data ?? []).map((f) => ({ value: f.key, label: f.title }))]}
              onChange={(facetKey) => setForm({ ...form, facetKey })}
            />
          </Field>
          <Field label="Who sees it" htmlFor="pr-aud">
            <Select<PromptAudience>
              id="pr-aud"
              value={form.audience}
              options={[
                { value: 'circle', label: 'Circle members' },
                { value: 'all_clients', label: 'All clients' },
              ]}
              onChange={(audience) => setForm({ ...form, audience })}
            />
          </Field>
        </div>
        <Field label="Prompt" htmlFor="pr-text">
          <textarea
            id="pr-text"
            className="input"
            style={{ minHeight: 80 }}
            required
            value={form.prompt}
            onChange={(e) => setForm({ ...form, prompt: e.target.value })}
          />
        </Field>
        <div className="form-actions">
          <Button variant="teal" type="submit" className="btn-sm" disabled={add.pending}>
            Add prompt
          </Button>
        </div>
      </form>

      {!prompts.data ? (
        <LoadState {...prompts} />
      ) : (
        [...byMonth].map(([month, list]) => (
          <div key={month} className="form">
            <h3 className="small">{monthYear(month)}</h3>
            <div className="rows">
              {list.map((p) => (
                <div key={p.id} className="row">
                  <div className="row-main">
                    <span>{p.prompt}</span>
                    <span className="row-meta">
                      {p.facetTitle ?? 'No facet'} · {p.audience === 'circle' ? 'Circle members' : 'All clients'} ·{' '}
                      {p.entryCount} entr{p.entryCount === 1 ? 'y' : 'ies'}
                    </span>
                  </div>
                  <button type="button" className="link-button small" onClick={() => del(p)}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </Card>
  )
}

function Calls() {
  const navigate = useNavigate()
  const calls = useApi<GroupCallRow[]>('/staff/circle/calls')
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ topic: '', startsAt: '', durationMin: '60', meetingUrl: '' })
  const add = useAction((body: object) => api.post<GroupCallDetail>('/staff/circle/calls', body))

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    const call = await add.run({
      topic: form.topic.trim(),
      startsAt: fromLocalInput(form.startsAt),
      durationMin: Number(form.durationMin),
      meetingUrl: form.meetingUrl.trim(),
    })
    if (call) navigate(`/staff/circle/calls/${call.id}`)
  }

  // Read once per mount; good enough to split upcoming from past calls.
  const [now] = useState(() => Date.now())

  return (
    <Card flat aria-labelledby="calls-h">
      <div className="staff-head">
        <h2 id="calls-h" className="staff-h2">
          Group calls
        </h2>
        {!adding && (
          <Button variant="ghost" className="btn-sm" onClick={() => setAdding(true)}>
            Schedule a call
          </Button>
        )}
      </div>

      {adding && (
        <form className="form" onSubmit={handleAdd}>
          <FormError error={add.error} />
          <div className="form-grid">
            <Field label="Topic" htmlFor="gc-topic">
              <input
                id="gc-topic"
                className="input"
                required
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
              />
            </Field>
            <Field label="Starts" htmlFor="gc-start" hint="In your time zone.">
              <input
                id="gc-start"
                className="input"
                type="datetime-local"
                required
                value={form.startsAt}
                onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
              />
            </Field>
            <Field label="Minutes" htmlFor="gc-min">
              <input
                id="gc-min"
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
          <Field label="Meeting link" htmlFor="gc-url">
            <input
              id="gc-url"
              className="input"
              type="url"
              required
              placeholder="https://"
              value={form.meetingUrl}
              onChange={(e) => setForm({ ...form, meetingUrl: e.target.value })}
            />
          </Field>
          <div className="form-actions">
            <Button variant="teal" type="submit" disabled={add.pending}>
              Schedule call
            </Button>
            <Button variant="ghost" onClick={() => setAdding(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {!calls.data ? (
        <LoadState {...calls} />
      ) : calls.data.length === 0 ? (
        <p className="empty">No calls yet.</p>
      ) : (
        <div className="rows">
          {calls.data.map((c) => {
            const upcoming = Date.parse(c.startsAt) + c.durationMin * 60000 > now
            return (
              <Link key={c.id} to={`/staff/circle/calls/${c.id}`} className="row">
                <div className="row-main">
                  <span className="row-title">{c.topic}</span>
                  <span className="row-meta">
                    {longDate(c.startsAt)} ·{' '}
                    {upcoming ? `${c.goingCount} going` : `${c.attendedCount} attended`}
                  </span>
                </div>
                {upcoming ? (
                  <Chip variant="scheduled">Upcoming</Chip>
                ) : c.recordingUrl ? (
                  <Chip variant="active">Recording added</Chip>
                ) : (
                  <Chip variant="due">No recording</Chip>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </Card>
  )
}
