import { Link } from 'react-router-dom'
import type { Overview as OverviewData } from '../../api/staffTypes'
import { useApi } from '../../api/useApi'
import LoadState from '../../components/LoadState'
import { Card } from '../../components/ui'
import { longDate, partOfDay, timeRange } from '../../lib/format'
import { SESSION_KIND_LABEL } from '../../lib/staff'
import { useStaffMe } from '../../state/auth'
import SquareSync from '../components/SquareSync'

export default function Overview() {
  const me = useStaffMe()
  const { data, ...state } = useApi<OverviewData>('/staff/overview')

  const stats = data && [
    { to: '/staff/inquiries', value: data.newInquiries, label: 'New inquiries' },
    { to: '/staff/clients', value: data.activeClients, label: 'Clients in a program' },
    { to: '/staff/blueprints', value: data.blueprintsInProgress, label: 'Blueprints not yet released' },
    { to: '/staff/circle', value: data.circleMembers, label: 'Circle members' },
  ]

  return (
    <>
      <header className="staff-head">
        <div className="staff-head-text">
          <p className="eyebrow">Overview</p>
          <h1 className="staff-title">
            Good {partOfDay()}
            {me ? `, ${me.firstName}` : ''}.
          </h1>
        </div>
      </header>

      {!data ? (
        <LoadState {...state} />
      ) : (
        <>
          <div className="staff-stats">
            {stats!.map((s) => (
              <Card key={s.label} flat>
                <Link to={s.to} className="staff-stat">
                  <span className="staff-stat-value tabular">{s.value}</span>
                  <span className="staff-stat-label">{s.label}</span>
                </Link>
              </Card>
            ))}
          </div>

          <Card flat aria-labelledby="upcoming-h">
            <h2 id="upcoming-h" className="staff-h2">
              Next two weeks
            </h2>
            {data.upcomingSessions.length === 0 ? (
              <p className="empty">No sessions scheduled.</p>
            ) : (
              <div className="rows">
                {data.upcomingSessions.map((s) => (
                  <Link key={s.id} to={`/staff/clients/${s.clientId}`} className="row">
                    <div className="row-main">
                      <span className="row-title">{s.clientName}</span>
                      <span className="row-meta">
                        {SESSION_KIND_LABEL[s.kind]} · {longDate(s.startsAt)},{' '}
                        {timeRange(s.startsAt, new Date(Date.parse(s.startsAt) + s.durationMin * 60000).toISOString())}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          <SquareSync />
        </>
      )}
    </>
  )
}
