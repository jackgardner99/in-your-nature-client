import type { BillingResponse, Installment, InvoiceRow } from '../api/types'
import { useApi } from '../api/useApi'
import LoadState from '../components/LoadState'
import { ButtonLink, Card, Chip } from '../components/ui'
import { daysUntil, fullDate, monthDay, usd, usdCents } from '../lib/format'
import './Billing.css'

export default function Billing() {
  const billing = useApi<BillingResponse>('/billing')
  const data = billing.data

  return (
    <>
      <header className="page-header">
        <p className="eyebrow">Billing</p>
        <h1 className="page-title">Payments</h1>
        <p className="muted">
          Invoices are sent and paid through Square. Your card details never touch this portal.
        </p>
      </header>

      {!data ? (
        <LoadState {...billing} />
      ) : (
        <>
          {data.programInvoice && <ProgramInvoiceCard invoice={data.programInvoice} />}
          {data.membership && <MembershipCard membership={data.membership} />}

          {data.earlierInvoices.length > 0 && (
            <Card flat aria-labelledby="earlier-h" style={{ gap: 8 }}>
              <h2 id="earlier-h" style={{ fontSize: 22 }}>
                Earlier invoices
              </h2>
              <InvoiceTable firstColumn="Item" rows={data.earlierInvoices} />
            </Card>
          )}

          {!data.programInvoice && !data.membership && data.earlierInvoices.length === 0 && (
            <p className="muted">No invoices yet.</p>
          )}
        </>
      )}
    </>
  )
}

function installmentLabel(i: Installment) {
  if (i.status === 'paid') return i.paidAt ? `Paid ${monthDay(i.paidAt)}` : 'Paid'
  if (i.status === 'scheduled') return 'Scheduled'
  const days = daysUntil(i.dueDate)
  if (days < 0) return 'Overdue'
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  return `Due in ${days} days`
}

function ProgramInvoiceCard({ invoice }: { invoice: NonNullable<BillingResponse['programInvoice']> }) {
  const { installments } = invoice
  const total = installments.reduce((sum, i) => sum + i.amount, 0)
  const paid = installments.filter((i) => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0)
  const next = installments.find((i) => i.status === 'due')
  const status = paid >= total ? 'Paid' : paid > 0 ? 'Partially paid' : 'Unpaid'

  return (
    <Card flat aria-labelledby="inv-h">
      <div className="billing-head">
        <div className="billing-head-text">
          <h2 id="inv-h" className="billing-title">
            {invoice.name}
          </h2>
          <p className="muted small">
            Invoice {invoice.invoiceNumber} · Sent {fullDate(invoice.sentAt)} · {installments.length} installments
          </p>
        </div>
        <Chip variant={status === 'Paid' ? 'paid' : 'due'}>{status}</Chip>
      </div>

      <div className="stats">
        <Stat label="Total" value={usd(total)} />
        <Stat label="Paid" value={usd(paid)} paid />
        <Stat label="Remaining" value={usd(total - paid)} />
      </div>

      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>Installment</th>
              <th>Due</th>
              <th className="num">Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {installments.map((i) => (
              <tr key={i.number} className={i === next ? 'highlight' : undefined}>
                <td>
                  {i.number} of {installments.length}
                </td>
                <td>{fullDate(i.dueDate)}</td>
                <td className="num">{usdCents(i.amount)}</td>
                <td>
                  <Chip variant={i.status}>{installmentLabel(i)}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {next && (
        <div className="pay-row">
          <ButtonLink to={invoice.payUrl} variant="clay" newTab>
            Pay {usd(next.amount)} now
          </ButtonLink>
          <p className="muted small">Opens Square's secure payment page in a new tab.</p>
        </div>
      )}
    </Card>
  )
}

function MembershipCard({ membership: m }: { membership: NonNullable<BillingResponse['membership']> }) {
  return (
    <Card flat aria-labelledby="circ-h">
      <div className="billing-head">
        <div className="billing-head-text">
          <h2 id="circ-h" className="billing-title">
            {m.name}
          </h2>
          <p className="ital billing-tagline">{m.tagline}</p>
        </div>
        <Chip variant="paid">Active · {usd(m.monthlyAmount)}/month</Chip>
      </div>
      <p className="muted small">Next charge {fullDate(m.nextChargeDate)} · Cancel anytime</p>
      {m.invoices.length > 0 && <InvoiceTable firstColumn="Month" rows={m.invoices} />}
      <a className="cancel-link" href={m.cancelUrl}>
        Cancel membership
      </a>
    </Card>
  )
}

function Stat({ label, value, paid }: { label: string; value: string; paid?: boolean }) {
  return (
    <div className="stat">
      <span className="muted stat-label">{label}</span>
      <b className={paid ? 'stat-value paid' : 'stat-value'}>{value}</b>
    </div>
  )
}

function InvoiceTable({ firstColumn, rows }: { firstColumn: string; rows: InvoiceRow[] }) {
  return (
    <div className="tbl-wrap">
      <table className="tbl">
        <thead>
          <tr>
            <th>{firstColumn}</th>
            <th>Invoice</th>
            <th className="num">Amount</th>
            <th>Status</th>
            <th className="num">Receipt</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.item}</td>
              <td>{row.invoiceNumber}</td>
              <td className="num">{usdCents(row.amount)}</td>
              <td>
                <Chip variant="paid">Paid {monthDay(row.paidAt)}</Chip>
              </td>
              <td className="num">
                <a href={row.receiptUrl}>View</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
