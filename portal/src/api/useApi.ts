import { useCallback, useEffect, useState } from 'react'
import { api } from './client'

type State<T> = { key?: string; path?: string; data?: T; error?: Error }

export type ApiResult<T> = {
  data?: T
  error?: Error
  loading: boolean
  reload: () => void
  /** Update the loaded data locally, e.g. after a successful POST. */
  setData: (update: (data: T) => T) => void
}

type Options = {
  /** Reload when the tab comes back into view, e.g. after booking a session in another tab. */
  refreshOnFocus?: boolean
}

export function useApi<T>(path: string, { refreshOnFocus = false }: Options = {}): ApiResult<T> {
  const [state, setState] = useState<State<T>>({})
  const [attempt, setAttempt] = useState(0)
  const key = `${path}#${attempt}`

  useEffect(() => {
    const controller = new AbortController()
    api.get<T>(path, controller.signal).then(
      (data) => setState({ key, path, data }),
      (error: Error) => {
        if (!controller.signal.aborted) setState((s) => ({ key, path, data: s.path === path ? s.data : undefined, error }))
      },
    )
    return () => controller.abort()
  }, [key, path])

  const reload = useCallback(() => setAttempt((n) => n + 1), [])

  useEffect(() => {
    if (!refreshOnFocus) return
    const onVisible = () => {
      if (document.visibilityState === 'visible') reload()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [refreshOnFocus, reload])
  const setData = useCallback(
    (update: (data: T) => T) => setState((s) => (s.data === undefined ? s : { ...s, data: update(s.data) })),
    [],
  )

  return {
    // Keep showing the previous data while reloading the same path.
    data: state.path === path ? state.data : undefined,
    error: state.key === key ? state.error : undefined,
    loading: state.key !== key,
    reload,
    setData,
  }
}
