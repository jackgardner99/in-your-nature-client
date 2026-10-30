import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import type { InquiryRow, InquiryStatus } from '../../api/staffTypes'
import { useApi } from '../../api/useApi'
import LoadState from '../../components/LoadState'
import { Card } from '../../components/ui'
import { fullDate } from '../../lib/format'
import { INQUIRY_LABEL, options, useAction } from '../../lib/staff'
import { FormError, Select } from '../forms'

const FILTERS: (InquiryStatus | 'all')[] = ['new', 'call_booked', 'all']

export default function Inquiries() {
  const [filter, setFilter] = useState<InquiryStatus | 'all'>('new')
  const inquiries = useApi<InquiryRow[]>(`/staff/inquiries${filter === 'all' ? '' : `?status=${filter}`}`)
  const update = useAction((id: string, status: InquiryStatus) =>
    api.patch<InquiryRow>(`/staff/inquiries/${id}`, { status }),
  )

  async function setStatus(row: InquiryRow, status: InquiryStatus) {
    const next = await update.run(row.id, status)
    if (next) inquiries.setData((list) => list.map((i) => (i.id === next.id ? next : i)))
  }

  return (
    <>
      <header className="staff-head">
        <div className="staff-head-text">
          <p className="eyebrow">Inquiries</p>
          <h1 className="staff-title">Intro-call requests</h1>
          <p className="muted">From the “Book your free intro call” form on the site.</p>
        </div>
      </header>

      <Card flat>
        <div className="toolbar">
          {FILTERS.map((f) => (
            <button key={f} type="button" className="filter" aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : INQUIRY_LABEL[f]}
            </button>
          ))}
        </div>
        <FormError error={update.error} />
        {!inquiries.data ? (
          <LoadState {...inquiries} />
        ) : inquiries.data.length === 0 ? (
          <p className="empty">Nothing here.</p>
        ) : (
          <div className="rows">
            {inquiries.data.map((i) => (
              <div key={i.id} className="row">
                <div className="row-main">
                  <Link to={`/staff/clients/${i.clientId}`} className="row-title">
                    {i.clientName}
                  </Link>
                  <span className="row-meta">
                    {i.email} · {fullDate(i.createdAt)}
                    {i.source && ` · ${i.source}`}
                  </span>
                  <p className="quote small">{i.whereYouAre}</p>
                </div>
                <Select<InquiryStatus>
                  small
                  aria-label={`Status for ${i.clientName}`}
                  value={i.status}
                  options={options(INQUIRY_LABEL)}
                  onChange={(status) => setStatus(i, status)}
                />
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  )
}
