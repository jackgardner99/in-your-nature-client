import { createContext, useContext } from 'react'
import type { NextStepGroup } from '../api/types'

export type NextStepsState = {
  groups?: NextStepGroup[]
  error?: Error
  reload: () => void
  setDone: (id: string, done: boolean) => void
}

export const NextStepsContext = createContext<NextStepsState | null>(null)

export function useNextSteps() {
  const ctx = useContext(NextStepsContext)
  if (!ctx) throw new Error('useNextSteps must be used inside <NextStepsProvider>')
  return ctx
}
