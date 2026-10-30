import type { ClientDetail, InvoiceStatus } from '../../api/staffTypes'
import { Card, Chip } from '../../components/ui'
import { fullDate, usdCents } from '../../lib/format'
import { INVOICE_LABEL } from '../../lib/staff'

const CHIP: Record<InvoiceStatus, 'paid' | 'due' | 'scheduled' | 'outline'> = {
  draft: 'outline',
  unpaid: 'due',
  scheduled: 'scheduled',
  partially_paid: 'due',
  paid: 'paid',
  partially_refunded: 'outline',
  refunded: 'outline',
  canceled: 'outline',
  failed: 'due',
}

/** Read-only: invoices are created and sent in the Square Dashboard and sync in on their own. */
export default function ClientInvoices({ client }: { client: ClientDetail }) {
  return (
    <Card flat aria-labelledby="invoices-h">
      <h2 id="invoices-h" className="staff-h2">
        Invoices
      </h2>
      {client.invoices.length === 0 ? (
        <p className="empty">
          No Square invoices yet. Invoices you send from Square to {client.email} show up here, and on{' '}
          {client.firstName}'s Billing page, once they have a program.
        </p>
      ) : (
        <div className="rows">
          {client.invoices.map((i) => (
            <div key={i.id} className="row">
              <div className="row-main">
                <span className="row-title">
                  #{i.invoiceNumber}
                  {i.programName && ` · ${i.programName}`}
                </span>
                <span className="row-meta tabular">
                  {usdCents(i.paid)} of {usdCents(i.total)} paid
                  {i.sentAt && ` · Sent ${fullDate(i.sentAt)}`}
                  {i.paidAt && ` · Paid ${fullDate(i.paidAt)}`}
                  {i.publicUrl && (
                    <>
                      {' · '}
                      <a href={i.publicUrl} target="_blank" rel="noreferrer">
                        View in Square
                      </a>
                    </>
                  )}
                </span>
              </div>
              <div className="row-side">
                <Chip variant={CHIP[i.status]}>{INVOICE_LABEL[i.status]}</Chip>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
