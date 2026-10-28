import type { ReactNode } from 'react'
import { api } from '../api/client'
import type { NextStepGroup } from '../api/types'
import { useApi } from '../api/useApi'
import { NextStepsContext, type NextStepsState } from './nextSteps'

const withDone = (id: string, done: boolean) => (groups: NextStepGroup[]) =>
  groups.map((g) => ({ ...g, items: g.items.map((item) => (item.id === id ? { ...item, done } : item)) }))

/** Shares checklist state so ticking a step on Home also shows on Sessions. */
export default function NextStepsProvider({ children }: { children: ReactNode }) {
  const { data, error, reload, setData } = useApi<NextStepGroup[]>('/next-steps')

  const value: NextStepsState = {
    groups: data,
    error,
    reload,
    setDone: (id, done) => {
      setData(withDone(id, done))
      api.patch(`/next-steps/${encodeURIComponent(id)}`, { done }).catch(() => setData(withDone(id, !done)))
    },
  }

  return <NextStepsContext.Provider value={value}>{children}</NextStepsContext.Provider>
}
