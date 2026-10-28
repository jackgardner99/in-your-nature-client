import type { Program } from '../api/types'
import { toDate } from './format'

function monthsBetween(a: Date, b: Date) {
  return (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth() - (b.getDate() < a.getDate() ? 1 : 0)
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

/** Where today falls in the program: "Month 2 of 4" and how far through it is. */
export function programTimeline(program: Program, now = new Date()) {
  const start = toDate(program.startDate)
  const end = toDate(program.endDate)
  const monthsTotal = Math.max(1, monthsBetween(start, end))
  return {
    month: clamp(monthsBetween(start, now) + 1, 1, monthsTotal),
    monthsTotal,
    percent: clamp(((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100, 0, 100),
  }
}

export const sessionsLeft = (program: Program) => Math.max(0, program.sessionsTotal - program.sessionsCompleted)
