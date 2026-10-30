import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import type { FacetRow } from '../../api/staffTypes'
import { useApi } from '../../api/useApi'
import LoadState from '../../components/LoadState'
import { Button, Card } from '../../components/ui'
import { useAction } from '../../lib/staff'
import { Field, FormError } from '../forms'

export default function Facets() {
  const facets = useApi<FacetRow[]>('/staff/facets')

  return (
    <>
      <Link to="/staff/blueprints" className="back-link">
        ← All Blueprints
      </Link>
      <header className="staff-head">
        <div className="staff-head-text">
          <p className="eyebrow">Blueprints</p>
          <h1 className="staff-title">Facet wording</h1>
          <p className="muted">
            The same for every client: the small label, the title, and the intro shown above each person's own write-up.
          </p>
        </div>
      </header>
      <Card flat>
        {!facets.data ? (
          <LoadState {...facets} />
        ) : (
          facets.data.map((f) => (
            <FacetForm key={f.key} facet={f} onSaved={(next) => facets.setData((l) => l.map((x) => (x.key === next.key ? next : x)))} />
          ))
        )}
      </Card>
    </>
  )
}

function FacetForm({ facet, onSaved }: { facet: FacetRow; onSaved: (f: FacetRow) => void }) {
  const [form, setForm] = useState({ eyebrow: facet.eyebrow, title: facet.title, intro: facet.intro })
  const save = useAction((body: object) => api.patch<FacetRow>(`/staff/facets/${facet.key}`, body))
  const dirty = form.eyebrow !== facet.eyebrow || form.title !== facet.title || form.intro !== facet.intro

  async function handleSave() {
    const next = await save.run(form)
    if (next) onSaved(next)
  }

  return (
    <section className="facet-editor" aria-label={facet.title}>
      <FormError error={save.error} />
      <div className="form-grid">
        <Field label="Label" htmlFor={`e-${facet.key}`}>
          <input
            id={`e-${facet.key}`}
            className="input"
            value={form.eyebrow}
            onChange={(e) => setForm({ ...form, eyebrow: e.target.value })}
          />
        </Field>
        <Field label="Title" htmlFor={`t-${facet.key}`}>
          <input
            id={`t-${facet.key}`}
            className="input"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </Field>
      </div>
      <Field label="Intro" htmlFor={`i-${facet.key}`}>
        <textarea
          id={`i-${facet.key}`}
          className="input"
          style={{ minHeight: 80 }}
          value={form.intro}
          onChange={(e) => setForm({ ...form, intro: e.target.value })}
        />
      </Field>
      <div className="form-actions">
        <Button variant="teal" className="btn-sm" disabled={!dirty || save.pending} onClick={handleSave}>
          Save
        </Button>
      </div>
    </section>
  )
}
