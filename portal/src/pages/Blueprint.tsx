import { useEffect, useRef, type ReactNode } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import type { Blueprint as BlueprintData, Facet } from '../api/types'
import { useApi } from '../api/useApi'
import LoadState from '../components/LoadState'
import { ButtonLink, Chip } from '../components/ui'
import { fullDate, monthDay } from '../lib/format'
import './Blueprint.css'

const Header = ({ children }: { children?: ReactNode }) => (
  <header className="blueprint-header">
    <p className="eyebrow">Your Blueprint</p>
    <h1 className="blueprint-title">The clearest picture of yourself you've ever had.</h1>
    {children}
  </header>
)

export default function Blueprint() {
  const blueprint = useApi<BlueprintData>('/blueprint')
  const { facetId } = useParams()
  const bp = blueprint.data

  if (!bp) {
    return (
      <Header>
        <LoadState {...blueprint} />
      </Header>
    )
  }

  const { facets } = bp
  if (facets.length === 0) {
    return (
      <Header>
        <p className="muted blueprint-summary">Your Blueprint will appear here once it's ready.</p>
      </Header>
    )
  }

  const activeId = facetId ?? facets[0].id
  const index = facets.findIndex((f) => f.id === activeId)
  if (index === -1) return <Navigate to="/blueprint" replace />

  return (
    <>
      <Header>
        <p className="muted blueprint-summary">{bp.summary}</p>
        <div className="blueprint-chips">
          <Chip variant="active">Released {fullDate(bp.releasedAt)}</Chip>
          {bp.walkthroughAt && <Chip variant="plum">Walked through together {monthDay(bp.walkthroughAt)}</Chip>}
        </div>
      </Header>

      <nav className="facet-grid" aria-label="Blueprint facets">
        {facets.map((facet) => {
          const active = facet.id === activeId
          return (
            <Link
              key={facet.id}
              to={`/blueprint/${facet.id}`}
              className={active ? 'facet-card active' : 'facet-card'}
              aria-current={active ? 'true' : undefined}
            >
              <span className="facet-eye">{facet.kicker}</span>
              <h2 className="facet-card-title">{facet.title}</h2>
              <span className="muted small">
                {active ? 'Reading now' : `${facet.highlights.length} highlights`}
              </span>
            </Link>
          )
        })}
      </nav>

      <FacetArticle facet={facets[index]} prev={facets[index - 1]} next={facets[index + 1]} />
    </>
  )
}

function FacetArticle({ facet, prev, next }: { facet: Facet; prev?: Facet; next?: Facet }) {
  const ref = useRef<HTMLElement>(null)
  const isFirstRender = useRef(true)

  // Bring the reader into view when switching facets, but not on the initial page load.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [facet.id])

  return (
    <article ref={ref} className="facet-article" aria-labelledby="facet-h">
      <div className="facet-body">
        <p className="facet-eye">{facet.kicker}</p>
        <h2 id="facet-h" className="facet-title">
          {facet.title}
        </h2>
        <p className="muted">{facet.intro}</p>
        <p className="facet-text">{facet.body}</p>
        {(prev || next) && (
          <div className="facet-actions">
            {prev && (
              <ButtonLink to={`/blueprint/${prev.id}`} variant="ghost">
                Previous facet
              </ButtonLink>
            )}
            {next && (
              <ButtonLink to={`/blueprint/${next.id}`} variant="teal">
                Next: {next.title}
              </ButtonLink>
            )}
          </div>
        )}
      </div>

      <aside className="facet-aside">
        <p className="eyebrow">Highlights</p>
        <ul className="highlights">
          {facet.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        {facet.journalPrompt && (
          <div className="facet-journal">
            <p className="eyebrow">From The Circle</p>
            <p className="facet-journal-prompt">{facet.journalPrompt}</p>
            <Link to="/circle" className="text-link">
              Write about it
            </Link>
          </div>
        )}
      </aside>
    </article>
  )
}
