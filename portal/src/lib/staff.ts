import { useCallback, useState } from 'react'
import { ApiError } from '../api/client'
import type {
  AccountState,
  BlueprintStatus,
  ClientStage,
  EnrollmentStatus,
  InquiryStatus,
  MembershipStatus,
  SessionKind,
  SessionStatus,
} from '../api/staffTypes'

export const STAGE_LABEL: Record<ClientStage, string> = {
  lead: 'Lead',
  active: 'Active',
  alumni: 'Alumni',
  archived: 'Archived',
}

export const ENROLLMENT_LABEL: Record<EnrollmentStatus, string> = {
  pending_payment: 'Awaiting payment',
  active: 'Active',
  paused: 'Paused',
  completed: 'Completed',
  canceled: 'Canceled',
}

export const INQUIRY_LABEL: Record<InquiryStatus, string> = {
  new: 'New',
  call_booked: 'Call booked',
  converted: 'Became a client',
  not_a_fit: 'Not a fit',
}

export const SESSION_KIND_LABEL: Record<SessionKind, string> = {
  intro: 'Intro call',
  blueprint_walkthrough: 'Blueprint walkthrough',
  coaching: 'Coaching',
  guarantee: 'Guarantee session',
}

export const SESSION_STATUS_LABEL: Record<SessionStatus, string> = {
  scheduled: 'Scheduled',
  completed: 'Completed',
  no_show: 'No-show',
  canceled: 'Canceled',
}

export const BLUEPRINT_LABEL: Record<BlueprintStatus, string> = {
  intake: 'Not started',
  drafting: 'Drafting',
  ready: 'Ready',
  walked_through: 'Walked through',
}

export const MEMBERSHIP_LABEL: Record<MembershipStatus, string> = {
  active: 'Active',
  past_due: 'Past due',
  canceled: 'Canceled',
}

export const ACCOUNT_LABEL: Record<AccountState, string> = {
  none: 'Not invited',
  invited: 'Invited',
  active: 'Signed up',
}

export const options = <K extends string>(labels: Record<K, string>) =>
  (Object.entries(labels) as [K, string][]).map(([value, label]) => ({ value, label }))

/** "2026-11-01T15:00:00Z" → "2026-11-01T10:00" for a datetime-local input, in the browser's zone. */
export function toLocalInput(iso: string) {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** A datetime-local value, read in the browser's zone, as an ISO instant for the API. */
export const fromLocalInput = (value: string) => new Date(value).toISOString()

/** Today as YYYY-MM-DD in the browser's zone. */
export function todayIso() {
  const d = new Date()
  return toLocalInput(d.toISOString()).slice(0, 10)
}

/** Plain-language message for a failed save. */
export function errorText(err: unknown) {
  if (err instanceof ApiError) {
    if (err.detail) return err.detail.charAt(0).toUpperCase() + err.detail.slice(1) + '.'
    if (err.status === 422) return 'Some of those values weren’t accepted. Check them and try again.'
    if (err.status === 404) return 'That record no longer exists. Reload the page.'
  }
  return 'Something went wrong saving that. Please try again.'
}

/**
 * Wraps a save/delete call with pending and error state, for buttons and forms.
 * `run` resolves to the call's result, or undefined if it failed (the error is then in `error`).
 */
export function useAction<A extends unknown[], R>(fn: (...args: A) => Promise<R>) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string>()
  const run = useCallback(
    async (...args: A): Promise<R | undefined> => {
      setPending(true)
      setError(undefined)
      try {
        return await fn(...args)
      } catch (err) {
        setError(errorText(err))
        return undefined
      } finally {
        setPending(false)
      }
    },
    [fn],
  )
  return { run, pending, error, clearError: () => setError(undefined) }
}
