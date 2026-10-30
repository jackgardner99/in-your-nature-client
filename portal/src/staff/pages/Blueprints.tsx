import { Link } from 'react-router-dom'
import type { BlueprintRow } from '../../api/staffTypes'
import { useApi } from '../../api/useApi'
import LoadState from '../../components/LoadState'
import { ButtonLink, Card, Chip } from '../../components/ui'
import { fullDate } from '../../lib/format'
import { BLUEPRINT_LABEL } from '../../lib/staff'

export default function Blueprints() {
  const blueprints = useApi<BlueprintRow[]>('/staff/blueprints')

  return (
    <>
      <header className="staff-head">
        <div className="staff-head-text">
          <p className="eyebrow">Blueprints</p>
          <h1 className="staff-title">Personal reads</h1>
          <p className="muted">One is started for each program that includes a Blueprint.</p>
        </div>
        <ButtonLink to="/staff/blueprints/facets" variant="ghost">
          Edit facet wording
        </ButtonLink>
      </header>

      <Card flat>
        {!blueprints.data ? (
          <LoadState {...blueprints} />
        ) : blueprints.data.length === 0 ? (
          <p className="empty">No Blueprints yet. Add a program that includes one to a client.</p>
        ) : (
          <div className="rows">
            {blueprints.data.map((b) => (
              <Link key={b.id} to={`/staff/blueprints/${b.id}`} className="row">
                <div className="row-main">
                  <span className="row-title">{b.clientName}</span>
                  <span className="row-meta">
                    {b.programName} · {b.sectionsWritten} of 9 facets written
                    {b.releasedAt && ` · released ${fullDate(b.releasedAt)}`}
                  </span>
                </div>
                <Chip variant={b.releasedAt ? 'active' : 'due'}>
                  {b.releasedAt ? BLUEPRINT_LABEL[b.status] : `${BLUEPRINT_LABEL[b.status]} · not released`}
                </Chip>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </>
  )
}
