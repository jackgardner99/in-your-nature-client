import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import type { PastSession, Program, SessionsResponse, UpcomingSession } from '../api/types'
import { useApi } from '../api/useApi'
import LoadState from '../components/LoadState'
import NextStepCheck from '../components/NextStepCheck'
import { ButtonLink, Card, Chip } from '../components/ui'
import { dayOfMonth, fullDate, monthDay, monthShort, timeRange, weekday } from '../lib/format'
import { sessionsLeft } from '../lib/program'
import { useNextSteps } from '../state/nextSteps'
import './Sessions.css'

export default function Sessions() {
  const sessions = useApi<SessionsResponse>('/sessions', { refreshOnFocus: true })
  const program = useApi<Program>('/program')
  const p = program.data

  return (
    <>
      <header className="sessions-header">
        <div className="sessions-header-text">
          <p className="eyebrow">Sessions</p>
          <h1 className="sessions-title">Our time together</h1>
          {p && (
            <p className="muted">
              {sessionsLeft(p)} of {p.sessionsTotal} sessions left · Program ends {fullDate(p.endDate)}
            </p>
          )}
        </div>
        {sessions.data && (
          <ButtonLink to={sessions.data.bookUrl} variant="teal" newTab>
            Book a session
          </ButtonLink>
        )}
      </header>

      <div className="sessions-layout">
        <div className="sessions-lists">
          <Card flat aria-labelledby="up-h">
            <h2 id="up-h" className="sessions-card-title">
              Upcoming
            </h2>
            {!sessions.data ? (
              <LoadState {...sessions} />
            ) : sessions.data.upcoming.length === 0 ? (
              <p className="muted">No sessions booked yet.</p>
            ) : (
              sessions.data.upcoming.map((s, i) => <UpcomingRow key={s.id} session={s} isNext={i === 0} />)
            )}
          </Card>

          <Card flat aria-labelledby="past-h">
            <h2 id="past-h" className="sessions-card-title">
              Past sessions
            </h2>
            {!sessions.data ? (
              <LoadState {...sessions} />
            ) : sessions.data.past.length === 0 ? (
              <p className="muted">Your past sessions will show up here.</p>
            ) : (
              sessions.data.past.map((s) => <PastRow key={s.id} session={s} />)
            )}
          </Card>
        </div>

        <NextStepsAside />
      </div>

      <p className="muted guarantee">
        If you don't feel real clarity after your first session, we keep working until you do, at no extra
        cost. Those extra sessions don't count toward your {p ? p.sessionsTotal : 'program'}.
      </p>
    </>
  )
}

function NextStepsAside() {
  const { groups, error, reload } = useNextSteps()

  return (
    <aside className="card card-flat steps-card" aria-labelledby="steps-h">
      <p className="eyebrow">Next steps</p>
      <h2 id="steps-h" className="steps-title">
        What we agreed on
      </h2>
      {!groups ? (
        <LoadState error={error} reload={reload} />
      ) : groups.length === 0 ? (
        <p className="muted small">Nothing yet. Next steps from your sessions will show up here.</p>
      ) : (
        groups.map((group, i) => (
          <Fragment key={group.sessionId}>
            <p className={i === 0 ? 'muted steps-group-label first' : 'muted steps-group-label'}>
              From {monthDay(group.sessionDate)}
            </p>
            {group.items.map((step) => (
              <NextStepCheck key={step.id} step={step} showDue />
            ))}
          </Fragment>
        ))
      )}
    </aside>
  )
}

function DateBadge({ iso }: { iso: string }) {
  return (
    <div className="date-badge">
      <span>{monthShort(iso)}</span>
      <b>{dayOfMonth(iso)}</b>
    </div>
  )
}

function UpcomingRow({ session: s, isNext }: { session: UpcomingSession; isNext: boolean }) {
  return (
    <div className="session-row">
      <DateBadge iso={s.startsAt} />
      <div className="session-info">
        <div className="session-title-line">
          <strong>{s.title}</strong>
          <Chip variant="active">Session {s.number}</Chip>
        </div>
        <p className="muted small">
          {weekday(s.startsAt)} · {timeRange(s.startsAt, s.endsAt)} · {s.format}
        </p>
      </div>
      <div className="actions">
        {isNext && s.joinUrl && (
          <ButtonLink to={s.joinUrl} variant="teal">
            Join
          </ButtonLink>
        )}
        <ButtonLink to={s.rescheduleUrl} variant="ghost" newTab>
          Reschedule
        </ButtonLink>
      </div>
    </div>
  )
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

function pastDetails(s: PastSession) {
  if (s.kind === 'intro') return 'Where you started'
  const parts = s.number ? [`Session ${s.number}`] : []
  if (s.kind === 'blueprint') return [...parts, 'All facets'].join(' · ')
  if (s.nextStepCount) parts.push(plural(s.nextStepCount, 'next step'))
  if (s.notesAdded) parts.push('Your notes added')
  return parts.join(' · ')
}

function PastRow({ session: s }: { session: PastSession }) {
  return (
    <div className="session-row">
      <DateBadge iso={s.startsAt} />
      <div className="session-info">
        <div className="session-title-line">
          <strong>{s.title}</strong>
          {s.kind === 'blueprint' && <Chip variant="due">Blueprint</Chip>}
          {s.kind === 'intro' && <Chip variant="scheduled">Not counted</Chip>}
        </div>
        <p className="muted small">{pastDetails(s)}</p>
      </div>
      {s.kind === 'blueprint' ? (
        <Link to="/blueprint" className="text-link">
          Open Blueprint
        </Link>
      ) : (
        s.recapUrl && (
          <a href={s.recapUrl} className="text-link">
            View recap
          </a>
        )
      )}
    </div>
  )
}
