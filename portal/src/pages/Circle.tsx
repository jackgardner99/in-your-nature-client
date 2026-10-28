import { useEffect, useRef, useState, type FormEvent, type Ref } from 'react'
import { useLocation } from 'react-router-dom'
import { api } from '../api/client'
import type { CirclePrompt, CircleResponse, JournalEntry, RsvpResponse } from '../api/types'
import { useApi } from '../api/useApi'
import DarkBanner from '../components/DarkBanner'
import LoadState from '../components/LoadState'
import { Button, ButtonLink, Card, Chip } from '../components/ui'
import { monthDay, monthLong, monthYear, timeRange, weekday } from '../lib/format'
import { useMe } from '../state/auth'
import './Circle.css'

export default function Circle() {
  const circle = useApi<CircleResponse>('/circle')
  const me = useMe()
  const coachName = me?.coach.firstName ?? 'your coach'
  const [chosenPromptId, setChosenPromptId] = useState<string>()
  const formRef = useRef<HTMLFormElement>(null)

  useScrollToHash(circle.data !== undefined)

  const header = (
    <header className="circle-header">
      <p className="eyebrow">The Circle</p>
      <h1 className="circle-title">A small community, all year.</h1>
      {circle.data && (
        <p className="muted">
          Member since {monthYear(circle.data.memberSince)} · One live group call and fresh prompts each month
        </p>
      )}
    </header>
  )

  const data = circle.data
  if (!data) {
    return (
      <>
        {header}
        <LoadState {...circle} />
      </>
    )
  }

  const isAnswered = (id: string) => data.journal.some((e) => e.promptId === id)
  const selected =
    data.prompts.find((p) => p.id === chosenPromptId) ?? data.prompts.find((p) => !isAnswered(p.id))

  function startWriting(id: string) {
    setChosenPromptId(id)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    formRef.current?.querySelector('textarea')?.focus({ preventScroll: true })
  }

  async function saveEntry(body: string, shared: boolean) {
    const entry = await api.post<JournalEntry>('/circle/journal', { promptId: selected?.id, body, shared })
    circle.setData((d) => ({ ...d, journal: [entry, ...d.journal] }))
    setChosenPromptId(undefined)
  }

  return (
    <>
      {header}

      {data.call && <CallBanner call={data.call} onRsvp={(r) => circle.setData((d) => ({ ...d, call: d.call && { ...d.call, ...r } }))} />}

      <div className="circle-layout">
        <div className="circle-main">
          <Card flat className="prompts-card" aria-labelledby="pr-h">
            <h2 id="pr-h" style={{ fontSize: 24 }}>
              This month's prompts
            </h2>
            {data.prompts.length === 0 && <p className="muted">New prompts arrive at the start of each month.</p>}
            {data.prompts.map((p) => (
              <div className="prompt-row" key={p.id}>
                <div className="prompt-text">
                  <p className="facet-tag">{p.facet}</p>
                  <p>{p.text}</p>
                </div>
                {isAnswered(p.id) ? (
                  <Chip variant="active">Answered</Chip>
                ) : (
                  <button type="button" className="link-button" onClick={() => startWriting(p.id)}>
                    Write
                  </button>
                )}
              </div>
            ))}
          </Card>

          <EntryForm ref={formRef} prompt={selected} coachName={coachName} onSave={saveEntry} />
        </div>

        <div className="circle-side">
          <Card flat id="journal" className="journal-card" aria-labelledby="j-h">
            <h2 id="j-h" className="circle-card-title">
              Your journal
            </h2>
            {data.journal.length === 0 && <p className="muted small">Your entries will show up here.</p>}
            {data.journal.map((e) => (
              <div className="journal-entry" key={e.id}>
                <div className="journal-entry-head">
                  <strong>{monthDay(e.createdAt)}</strong>
                  {e.shared ? (
                    <Chip variant="plum">Shared with {coachName}</Chip>
                  ) : (
                    <Chip variant="scheduled">Private</Chip>
                  )}
                </div>
                <p className="muted small">{e.promptText ?? 'Free entry'}</p>
              </div>
            ))}
          </Card>

          {data.pastCalls.length > 0 && (
            <Card flat className="calls-card" aria-labelledby="rec-h">
              <h2 id="rec-h" className="circle-card-title">
                Past calls
              </h2>
              <div>
                {data.pastCalls.map((c) => (
                  <a className="call-link" href={c.recordingUrl} key={c.id}>
                    <span>{c.title}</span>
                    <span>Watch recording</span>
                  </a>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}

type CallBannerProps = {
  call: NonNullable<CircleResponse['call']>
  onRsvp: (result: RsvpResponse) => void
}

function CallBanner({ call, onRsvp }: CallBannerProps) {
  const [saving, setSaving] = useState(false)

  async function toggle() {
    setSaving(true)
    try {
      onRsvp(await api.put<RsvpResponse>('/circle/rsvp', { going: !call.isGoing }))
    } finally {
      setSaving(false)
    }
  }

  return (
    <DarkBanner
      eyebrow={`${monthLong(call.startsAt)} group call`}
      title={`${weekday(call.startsAt)}, ${monthDay(call.startsAt)} · ${timeRange(call.startsAt, call.endsAt)}`}
      titleSize={32}
      body={`Topic: ${call.topic} · ${call.goingCount} members going`}
      actions={
        <>
          <Button variant="sage" onClick={toggle} disabled={saving} aria-pressed={call.isGoing}>
            {call.isGoing ? "You're going ✓" : "I'll be there"}
          </Button>
          <ButtonLink to={call.calendarUrl} variant="outline-light">
            Add to calendar
          </ButtonLink>
        </>
      }
    />
  )
}

type EntryFormProps = {
  ref: Ref<HTMLFormElement>
  prompt?: CirclePrompt
  coachName: string
  onSave: (body: string, shared: boolean) => Promise<void>
}

function EntryForm({ ref, prompt, coachName, onSave }: EntryFormProps) {
  const [body, setBody] = useState('')
  const [shared, setShared] = useState(false)
  const [saving, setSaving] = useState(false)
  const [failed, setFailed] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!body.trim() || saving) return
    setSaving(true)
    setFailed(false)
    try {
      await onSave(body.trim(), shared)
      setBody('')
      setShared(false)
    } catch {
      setFailed(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form ref={ref} className="card card-flat entry-form" aria-labelledby="new-h" onSubmit={handleSubmit}>
      <h2 id="new-h" className="circle-card-title">
        New journal entry
      </h2>
      <p className="facet-tag">{prompt ? `${prompt.facet} · ${prompt.text}` : 'Free entry'}</p>
      <label htmlFor="entry" className="muted entry-label">
        Your entry
      </label>
      <textarea
        id="entry"
        placeholder="Write as much or as little as you like…"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="entry-footer">
        <label htmlFor="share" className="share-toggle">
          <input id="share" type="checkbox" checked={shared} onChange={(e) => setShared(e.target.checked)} />
          Share this entry with {coachName}
        </label>
        <Button variant="teal" type="submit" disabled={!body.trim() || saving}>
          {saving ? 'Saving…' : 'Save entry'}
        </Button>
      </div>
      {failed && (
        <p role="alert" className="xsmall" style={{ color: 'var(--clay-dark)' }}>
          Couldn't save your entry. Your text is still here, so try again in a moment.
        </p>
      )}
      <p className="muted xsmall">Entries are private to you unless you share them.</p>
    </form>
  )
}

/** Router links like /circle#journal don't scroll on their own; wait until the target has rendered. */
function useScrollToHash(ready: boolean) {
  const { hash } = useLocation()
  useEffect(() => {
    if (ready && hash) document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' })
  }, [hash, ready])
}
