// Response shapes the portal expects from the backend.
// Dates are ISO 8601 strings: date-times as "2026-10-15T15:00:00Z", calendar dates as "2026-11-01".
// Amounts are in whole dollars.

/** GET /me */
export type Me = {
  firstName: string
  fullName: string
  programName: string
  coach: {
    firstName: string
    messageUrl: string
  }
}

// Auth. The backend keeps the session in an httpOnly cookie; GET /me returns 401 when signed out.
// POST /auth/login            { email, password }      → Me
// POST /auth/logout                                     → 204
// GET  /auth/invite/:token                              → Invite (404/410 if invalid, used or expired)
// POST /auth/invite/:token    { password }              → Me (sets the password and signs in)
// POST /auth/forgot-password  { email }                 → 204 (always, so emails can't be probed)
// POST /auth/reset-password   { token, password }       → Me

/** GET /auth/invite/:token */
export type Invite = {
  email: string
  firstName: string
}

/** GET /program */
export type Program = {
  name: string
  tagline: string
  status: string
  sessionsCompleted: number
  sessionsTotal: number
  startDate: string
  endDate: string
}

export type UpcomingSession = {
  id: string
  title: string
  /** Position in the program, e.g. 4 for "Session 4". */
  number: number
  startsAt: string
  endsAt: string
  format: string
  joinUrl?: string
  rescheduleUrl: string
}

export type PastSession = {
  id: string
  kind: 'coaching' | 'blueprint' | 'intro'
  title: string
  /** Omitted for sessions that don't count toward the program (e.g. the intro call). */
  number?: number
  startsAt: string
  nextStepCount: number
  notesAdded: boolean
  recapUrl?: string
}

/** GET /sessions */
export type SessionsResponse = {
  bookUrl: string
  upcoming: UpcomingSession[]
  /** Newest first. */
  past: PastSession[]
}

export type NextStep = {
  id: string
  text: string
  done: boolean
  dueDate?: string
}

/** GET /next-steps (newest session first). PATCH /next-steps/:id with { done } */
export type NextStepGroup = {
  sessionId: string
  sessionDate: string
  items: NextStep[]
}

export type Facet = {
  id: string
  kicker: string
  title: string
  /** Shorter label for chips, e.g. "Core nature". Falls back to title. */
  shortTitle?: string
  intro: string
  body: string
  highlights: string[]
  journalPrompt?: string
}

/** GET /blueprint */
export type Blueprint = {
  summary: string
  releasedAt: string
  walkthroughAt?: string
  facets: Facet[]
}

export type Installment = {
  number: number
  dueDate: string
  amount: number
  status: 'paid' | 'due' | 'scheduled'
  paidAt?: string
}

export type InvoiceRow = {
  id: string
  item: string
  invoiceNumber: string
  amount: number
  paidAt: string
  receiptUrl: string
}

/** GET /billing */
export type BillingResponse = {
  programInvoice: {
    name: string
    invoiceNumber: string
    sentAt: string
    payUrl: string
    installments: Installment[]
  } | null
  membership: {
    name: string
    tagline: string
    monthlyAmount: number
    nextChargeDate: string
    cancelUrl: string
    invoices: InvoiceRow[]
  } | null
  earlierInvoices: InvoiceRow[]
}

export type CirclePrompt = {
  id: string
  facet: string
  text: string
}

export type JournalEntry = {
  id: string
  createdAt: string
  /** Omitted for free entries. */
  promptId?: string
  promptText?: string
  shared: boolean
}

/** PUT /circle/rsvp with { going } returns this */
export type RsvpResponse = {
  isGoing: boolean
  goingCount: number
}

/** GET /circle. POST /circle/journal with { promptId?, body, shared } returns a JournalEntry. */
export type CircleResponse = {
  memberSince: string
  call: ({
    startsAt: string
    endsAt: string
    topic: string
    calendarUrl: string
  } & RsvpResponse) | null
  prompts: CirclePrompt[]
  /** Newest first. */
  journal: JournalEntry[]
  pastCalls: { id: string; title: string; recordingUrl: string }[]
}
