import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import type { BlueprintSection, BlueprintStatus, StaffBlueprint } from '../../api/staffTypes'
import { useApi } from '../../api/useApi'
import LoadState from '../../components/LoadState'
import { Button, Card, Chip } from '../../components/ui'
import { fullDate } from '../../lib/format'
import { BLUEPRINT_LABEL, options, useAction } from '../../lib/staff'
import { Field, FormError, Select } from '../forms'

export default function BlueprintEditor() {
  const { blueprintId = '' } = useParams()
  const path = `/staff/blueprints/${encodeURIComponent(blueprintId)}`
  const bp = useApi<StaffBlueprint>(path)
  const b = bp.data

  return (
    <>
      <Link to="/staff/blueprints" className="back-link">
        ← All Blueprints
      </Link>
      {!b ? (
        <LoadState {...bp} />
      ) : (
        <>
          <header className="staff-head">
            <div className="staff-head-text">
              <p className="eyebrow">{b.programName}</p>
              <h1 className="staff-title">{b.clientName}'s Blueprint</h1>
              <p className="muted">
                <Link to={`/staff/clients/${b.clientId}`}>Client record</Link> · {b.sectionsWritten} of 9 facets written
              </p>
            </div>
            <Chip variant={b.releasedAt ? 'active' : 'due'}>
              {b.releasedAt ? `Released ${fullDate(b.releasedAt)}` : 'Not released'}
            </Chip>
          </header>

          <Summary blueprint={b} path={path} onSaved={(next) => bp.setData(() => next)} />

          <Card flat aria-labelledby="facets-h">
            <h2 id="facets-h" className="staff-h2">
              Facets
            </h2>
            <p className="muted small">
              Each facet saves on its own. Facets left empty aren't shown to the client.
            </p>
            {b.sections.map((s) => (
              <SectionEditor key={s.facetKey} blueprintId={b.id} section={s} onSaved={bp.reload} />
            ))}
          </Card>
        </>
      )}
    </>
  )
}

function Summary({
  blueprint: b,
  path,
  onSaved,
}: {
  blueprint: StaffBlueprint
  path: string
  onSaved: (b: StaffBlueprint) => void
}) {
  const [summary, setSummary] = useState(b.summary ?? '')
  const [saved, setSaved] = useState(false)
  const save = useAction((body: object) => api.patch<StaffBlueprint>(path, body))

  async function patch(body: object) {
    setSaved(false)
    const next = await save.run(body)
    if (next) {
      onSaved(next)
      setSaved(true)
    }
  }

  return (
    <Card flat aria-labelledby="summary-h">
      <h2 id="summary-h" className="staff-h2">
        Summary and release
      </h2>
      <FormError error={save.error} />
      <Field label="Summary" htmlFor="bp-summary" hint="The opening read at the top of their Blueprint.">
        <textarea id="bp-summary" className="input" value={summary} onChange={(e) => setSummary(e.target.value)} />
      </Field>
      <div className="form-grid">
        <Field label="Status" htmlFor="bp-status">
          <Select<BlueprintStatus>
            id="bp-status"
            value={b.status}
            options={options(BLUEPRINT_LABEL)}
            onChange={(status) => patch({ status })}
            disabled={save.pending}
          />
        </Field>
      </div>
      <div className="form-actions">
        <Button
          variant="teal"
          className="btn-sm"
          disabled={save.pending || summary === (b.summary ?? '')}
          onClick={() => patch({ summary })}
        >
          Save summary
        </Button>
        {b.releasedAt ? (
          <Button variant="ghost" className="btn-sm" disabled={save.pending} onClick={() => patch({ released: false })}>
            Hide from client
          </Button>
        ) : (
          <Button
            variant="clay"
            className="btn-sm"
            disabled={save.pending || b.sectionsWritten === 0}
            onClick={() => patch({ released: true, summary })}
          >
            Release to {b.clientName.split(' ')[0]}
          </Button>
        )}
        {saved && (
          <span className="saved-note" role="status">
            Saved
          </span>
        )}
      </div>
    </Card>
  )
}

function SectionEditor({
  blueprintId,
  section: s,
  onSaved,
}: {
  blueprintId: string
  section: BlueprintSection
  onSaved: () => void
}) {
  const [body, setBody] = useState(s.body)
  const [highlights, setHighlights] = useState(s.highlights.join('\n'))
  const [saved, setSaved] = useState(false)
  const save = useAction((payload: object) => api.put(`/staff/blueprints/${blueprintId}/sections/${s.facetKey}`, payload))
  const dirty = body !== s.body || highlights !== s.highlights.join('\n')

  async function handleSave() {
    setSaved(false)
    const ok = await save.run({ body, highlights: highlights.split('\n') })
    if (ok !== undefined) {
      setSaved(true)
      onSaved()
    }
  }

  return (
    <section className="facet-editor" aria-labelledby={`f-${s.facetKey}`}>
      <div>
        <p className="eyebrow">{s.eyebrow}</p>
        <h3 id={`f-${s.facetKey}`}>{s.facetTitle}</h3>
      </div>
      <FormError error={save.error} />
      <Field label="Write-up" htmlFor={`fb-${s.facetKey}`}>
        <textarea id={`fb-${s.facetKey}`} className="input" value={body} onChange={(e) => setBody(e.target.value)} />
      </Field>
      <Field label="Highlights" htmlFor={`fh-${s.facetKey}`} hint="One per line. Shown as short chips.">
        <textarea
          id={`fh-${s.facetKey}`}
          className="input"
          style={{ minHeight: 80 }}
          value={highlights}
          onChange={(e) => setHighlights(e.target.value)}
        />
      </Field>
      <div className="form-actions">
        <Button variant="teal" className="btn-sm" disabled={!dirty || save.pending} onClick={handleSave}>
          {save.pending ? 'Saving…' : `Save ${s.facetTitle}`}
        </Button>
        {saved && !dirty && (
          <span className="saved-note" role="status">
            Saved
          </span>
        )}
        {dirty && <span className="muted small">Unsaved changes</span>}
      </div>
    </section>
  )
}
