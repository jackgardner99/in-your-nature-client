// Response shapes for the staff portal (/staff/* on the backend, see staff_schemas.py there).
// Same conventions as types.ts: ISO date strings, amounts in whole dollars.
// PATCH bodies only change the fields they include; send null (or '' for text) to clear one.

export type ClientStage = 'lead' | 'active' | 'alumni' | 'archived'
export type EnrollmentStatus = 'pending_payment' | 'active' | 'paused' | 'completed' | 'canceled'
export type InquiryStatus = 'new' | 'call_booked' | 'converted' | 'not_a_fit'
export type SessionKind = 'intro' | 'blueprint_walkthrough' | 'coaching' | 'guarantee'
export type SessionStatus = 'scheduled' | 'completed' | 'no_show' | 'canceled'
export type BlueprintStatus = 'intake' | 'drafting' | 'ready' | 'walked_through'
export type MembershipStatus = 'active' | 'past_due' | 'canceled'
export type PromptAudience = 'circle' | 'all_clients'
/** none: never invited · invited: invite link pending · active: has set a password */
export type AccountState = 'none' | 'invited' | 'active'

/** GET /staff/me */
export type StaffMe = {
  id: string
  firstName: string
  fullName: string
  email: string
}

/** GET /staff/overview */
export type Overview = {
  newInquiries: number
  activeClients: number
  circleMembers: number
  blueprintsInProgress: number
  upcomingSessions: {
    id: string
    clientId: string
    clientName: string
    kind: SessionKind
    startsAt: string
    durationMin: number
    meetingUrl?: string
  }[]
}

/** GET /staff/programs */
export type ProgramRow = {
  id: string
  slug: string
  name: string
  price: number
  durationMonths: number | null
  includedSessions: number
  includesBlueprint: boolean
}

/** GET /staff/clients */
export type ClientRow = {
  id: string
  firstName: string
  lastName: string | null
  fullName: string
  email: string
  stage: ClientStage
  programName: string | null
  enrollmentStatus: EnrollmentStatus | null
  isCircleMember: boolean
  account: AccountState
  createdAt: string
}

export type Enrollment = {
  id: string
  programId: string
  programName: string
  status: EnrollmentStatus
  pricePaid: number
  startsOn: string | null
  endsOn: string | null
  guaranteeInvokedAt: string | null
  sessionsCompleted: number
  sessionsTotal: number
  blueprintId: string | null
  blueprintStatus: BlueprintStatus | null
  createdAt: string
}

export type Membership = {
  id: string
  status: MembershipStatus
  monthlyAmount: number
  startedAt: string
  currentPeriodEnd: string
  canceledAt: string | null
}

export type InquiryRow = {
  id: string
  clientId: string
  clientName: string
  email: string
  whereYouAre: string
  source: string | null
  status: InquiryStatus
  createdAt: string
}

export type QuizRow = {
  id: string
  clientId: string | null
  name: string
  email: string
  totalScore: number
  recommendedTier: string
  recommendedProgramName: string | null
  submittedAt: string
  answers: { questionKey: string; question: string; answer: string; score: number }[]
}

/** GET/PATCH /staff/clients/:id, POST /staff/clients */
export type ClientDetail = ClientRow & {
  timezone: string
  inviteExpiresAt: string | null
  enrollments: Enrollment[]
  membership: Membership | null
  inquiries: InquiryRow[]
  quizResponses: QuizRow[]
  sharedJournal: { id: string; createdAt: string; promptText: string | null; body: string }[]
}

export type ActionItem = {
  id: string
  text: string
  dueOn: string | null
  done: boolean
}

/** GET /staff/clients/:id/sessions */
export type StaffSession = {
  id: string
  clientId: string
  enrollmentId: string | null
  kind: SessionKind
  startsAt: string
  durationMin: number
  meetingUrl: string | null
  status: SessionStatus
  countsTowardPlan: boolean
  clientNotes: string | null
  coachPrivateNotes: string | null
  actionItems: ActionItem[]
}

export type FacetRow = {
  key: string
  eyebrow: string
  title: string
  intro: string
  sortOrder: number
}

/** GET /staff/blueprints */
export type BlueprintRow = {
  id: string
  enrollmentId: string
  clientId: string
  clientName: string
  programName: string
  status: BlueprintStatus
  releasedAt: string | null
  sectionsWritten: number
}

export type BlueprintSection = {
  facetKey: string
  facetTitle: string
  eyebrow: string
  body: string
  highlights: string[]
  updatedAt: string | null
}

/** GET/PATCH /staff/blueprints/:id */
export type StaffBlueprint = BlueprintRow & {
  summary: string | null
  sections: BlueprintSection[]
}

/** GET /staff/circle/members */
export type MemberRow = Membership & {
  clientId: string
  clientName: string
  email: string
}

/** GET /staff/circle/prompts */
export type PromptRow = {
  id: string
  month: string
  facetKey: string | null
  facetTitle: string | null
  prompt: string
  audience: PromptAudience
  entryCount: number
}

/** GET /staff/circle/calls */
export type GroupCallRow = {
  id: string
  topic: string
  startsAt: string
  durationMin: number
  meetingUrl: string
  recordingUrl: string | null
  goingCount: number
  attendedCount: number
}

/** GET /staff/circle/calls/:id */
export type GroupCallDetail = GroupCallRow & {
  attendance: { membershipId: string; clientName: string; rsvp: boolean; attended: boolean }[]
}
