import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { BillingResponse, Blueprint, CircleResponse, Program, SessionsResponse } from '../api/types'
import { useApi, type ApiResult } from '../api/useApi'
import DarkBanner from '../components/DarkBanner'
import LoadState from '../components/LoadState'
import NextStepCheck from '../components/NextStepCheck'
import { ButtonLink, Card, Chip, Progress } from '../components/ui'
import { fullDate, longDate, monthDay, monthLong, partOfDay, timeWithZone, usd, weekday } from '../lib/format'
import { programTimeline } from '../lib/program'
import { useMe } from '../state/auth'
import { useNextSteps } from '../state/nextSteps'
import './Home.css'

export default function Home() {
  const me = useMe()
  const program = useApi<Program>('/program')
  const [now] = useState(() => new Date())

  return (
    <>
      <header className="home-header">
        <div className="home-header-text">
          <p className="eyebrow">{longDate(now.toISOString())}</p>
          <h1 className="home-title">
            Good {partOfDay(now)}
            {me && `, ${me.firstName}`}.
          </h1>
          {me && program.data && (
            <p className="ital home-subtitle">
              Month {programTimeline(program.data, now).month} of your {me.programName}.
            </p>
          )}
        </div>
        {me && (
          <ButtonLink to={me.coach.messageUrl} variant="ghost">
            Message {me.coach.firstName}
          </ButtonLink>
        )}
      </header>

      <div className="grid2">
        <NextSessionCard />
        <ProgramCard program={program} />
      </div>

      <div className="grid3">
        <NextStepsCard />
        <BlueprintCard />
        <BillingCard />
      </div>

      <CircleBanner />
    </>
  )
}

const minutesBetween = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 60000)

function NextSessionCard() {
  const sessions = useApi<SessionsResponse>('/sessions')
  const next = sessions.data?.upcoming[0]

  return (
    <Card aria-labelledby="next-h">
      <p className="eyebrow">Next session</p>
      {!sessions.data ? (
        <LoadState {...sessions} />
      ) : !next ? (
        <>
          <h2 id="next-h" style={{ fontSize: 28 }}>
            Nothing booked yet
          </h2>
          <div className="actions actions-tight">
            <ButtonLink to={sessions.data.bookUrl} variant="teal">
              Book a session
            </ButtonLink>
          </div>
        </>
      ) : (
        <>
          <h2 id="next-h" style={{ fontSize: 28 }}>
            {weekday(next.startsAt)}, {monthDay(next.startsAt)} · {timeWithZone(next.startsAt)}
          </h2>
          <p className="muted">
            {next.title} · {minutesBetween(next.startsAt, next.endsAt)} minutes · {next.format}
          </p>
          <div className="actions actions-tight">
            {next.joinUrl && (
              <ButtonLink to={next.joinUrl} variant="teal">
                Join call
              </ButtonLink>
            )}
            <ButtonLink to="/sessions" variant="ghost">
              Reschedule
            </ButtonLink>
          </div>
        </>
      )}
    </Card>
  )
}

function ProgramCard({ program }: { program: ApiResult<Program> }) {
  const p = program.data
  if (!p) {
    return (
      <Card aria-label="Your program">
        <LoadState {...program} />
      </Card>
    )
  }

  const timeline = programTimeline(p)
  return (
    <Card aria-labelledby="prog-h">
      <div className="program-head">
        <h2 id="prog-h" style={{ fontSize: 24 }}>
          {p.name}
        </h2>
        <Chip variant="active">{p.status}</Chip>
      </div>
      <p className="ital program-tagline">{p.tagline}</p>
      <Progress
        label="Sessions"
        value={`${p.sessionsCompleted} of ${p.sessionsTotal}`}
        percent={(p.sessionsCompleted / p.sessionsTotal) * 100}
      />
      <Progress
        label="Program time"
        value={`Month ${timeline.month} of ${timeline.monthsTotal}`}
        percent={timeline.percent}
        color="var(--sage-400)"
      />
      <p className="muted small">
        Started {fullDate(p.startDate)} · Ends {fullDate(p.endDate)}
      </p>
    </Card>
  )
}

function NextStepsCard() {
  const { groups, error, reload } = useNextSteps()
  const latest = groups?.[0]

  return (
    <Card aria-labelledby="todo-h">
      {latest && <p className="eyebrow">From your {monthDay(latest.sessionDate)} session</p>}
      <h2 id="todo-h" style={{ fontSize: 22 }}>
        Your next steps
      </h2>
      {!groups ? (
        <LoadState error={error} reload={reload} />
      ) : !latest ? (
        <p className="muted">Next steps from your sessions will show up here.</p>
      ) : (
        <div>
          {latest.items.map((step) => (
            <NextStepCheck key={step.id} step={step} />
          ))}
        </div>
      )}
      <Link to="/sessions" className="text-link">
        See all next steps
      </Link>
    </Card>
  )
}

function BlueprintCard() {
  const blueprint = useApi<Blueprint>('/blueprint')
  const bp = blueprint.data
  const featured = bp?.facets.slice(0, 2) ?? []
  const remaining = (bp?.facets.length ?? 0) - featured.length

  return (
    <Card aria-labelledby="bp-h">
      <p className="ital blueprint-kicker">who you are</p>
      <h2 id="bp-h" style={{ fontSize: 22 }}>
        Your Blueprint
      </h2>
      {!bp ? (
        <LoadState {...blueprint} />
      ) : (
        <>
          <p className="muted">
            Your personal read across all {bp.facets.length} facets.
            {bp.walkthroughAt && ` Walked through together on ${monthDay(bp.walkthroughAt)}.`}
          </p>
          <div className="chips">
            {featured.map((f) => (
              <Chip key={f.id} variant="outline">
                {f.shortTitle ?? f.title}
              </Chip>
            ))}
            {remaining > 0 && <Chip variant="outline">+{remaining} more</Chip>}
          </div>
          <ButtonLink to="/blueprint" variant="teal" className="self-start">
            Open my Blueprint
          </ButtonLink>
        </>
      )}
    </Card>
  )
}

function BillingCard() {
  const billing = useApi<BillingResponse>('/billing')
  const invoice = billing.data?.programInvoice
  const next = invoice?.installments.find((i) => i.status === 'due')

  return (
    <Card aria-labelledby="bill-h">
      <p className="eyebrow">Billing</p>
      <h2 id="bill-h" style={{ fontSize: 22 }}>
        Next installment
      </h2>
      {!billing.data ? (
        <LoadState {...billing} />
      ) : !invoice || !next ? (
        <p className="muted">You're all paid up.</p>
      ) : (
        <>
          <p className="amount tabular">{usd(next.amount)}</p>
          <p className="muted">
            Due {monthDay(next.dueDate)} · Installment {next.number} of {invoice.installments.length}
          </p>
          <ButtonLink to="/billing" variant="clay" className="self-start">
            Pay now
          </ButtonLink>
          <p className="muted xsmall">Opens Square's secure payment page.</p>
        </>
      )}
    </Card>
  )
}

function CircleBanner() {
  const circle = useApi<CircleResponse>('/circle')
  const call = circle.data?.call
  if (!call) return null

  const prompt = circle.data?.prompts[0]
  return (
    <DarkBanner
      eyebrow={`The Circle · ${monthLong(call.startsAt)}`}
      title={`Group call: ${weekday(call.startsAt)}, ${monthDay(call.startsAt)} · ${timeWithZone(call.startsAt)}`}
      body={prompt ? `This month's prompt: "${prompt.text}"` : call.topic}
      actions={
        <>
          <ButtonLink to="/circle" variant="sage">
            RSVP
          </ButtonLink>
          <ButtonLink to="/circle#journal" variant="outline-light">
            Open journal
          </ButtonLink>
        </>
      }
    />
  )
}
