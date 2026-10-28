const whole = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const cents = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })

/** $1,500 */
export const usd = (amount: number) => whole.format(amount)

/** $1,500.00 */
export const usdCents = (amount: number) => cents.format(amount)

/** Calendar dates ("2026-11-01") are read as local dates so they don't shift a day in US time zones. */
export function toDate(iso: string) {
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  return dateOnly ? new Date(+dateOnly[1], +dateOnly[2] - 1, +dateOnly[3]) : new Date(iso)
}

const fmt = (options: Intl.DateTimeFormatOptions) => {
  const f = new Intl.DateTimeFormat('en-US', options)
  return (iso: string) => f.format(toDate(iso))
}

/** Thursday */
export const weekday = fmt({ weekday: 'long' })
/** Oct */
export const monthShort = fmt({ month: 'short' })
/** October */
export const monthLong = fmt({ month: 'long' })
/** 15 */
export const dayOfMonth = (iso: string) => toDate(iso).getDate()
/** Oct 15 */
export const monthDay = fmt({ month: 'short', day: 'numeric' })
/** Sep 2, 2026 */
export const fullDate = fmt({ month: 'short', day: 'numeric', year: 'numeric' })
/** August 2026 */
export const monthYear = fmt({ month: 'long', year: 'numeric' })
/** Monday, October 12 */
export const longDate = fmt({ weekday: 'long', month: 'long', day: 'numeric' })
/** 10:00 AM CDT */
export const timeWithZone = fmt({ hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })

const timeOnly = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' })
const zoneOnly = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' })

/** 10:00 – 11:00 AM CDT */
export function timeRange(startIso: string, endIso: string) {
  const start = toDate(startIso)
  const zone = zoneOnly.formatToParts(start).find((p) => p.type === 'timeZoneName')?.value
  return `${timeOnly.formatRange(start, toDate(endIso))} ${zone ?? ''}`.trim()
}

const DAY_MS = 24 * 60 * 60 * 1000

/** Whole days from today until the given date (negative if past). */
export function daysUntil(iso: string, now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((toDate(iso).getTime() - today.getTime()) / DAY_MS)
}

export function partOfDay(now = new Date()) {
  const h = now.getHours()
  return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'
}

export function initials(fullName: string) {
  const parts = fullName.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase()
}
