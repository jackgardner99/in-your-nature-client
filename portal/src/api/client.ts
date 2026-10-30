// `||` rather than `??`: CI passes an empty string when the variable isn't set.
const BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')

export class ApiError extends Error {
  readonly status: number
  /** The backend's explanation, when it sent one (FastAPI's `detail` string). */
  readonly detail?: string

  constructor(status: number, message: string, detail?: string) {
    super(message)
    this.status = status
    this.detail = detail
  }
}

let unauthorizedHandler: (() => void) | undefined

/** Called when any non-auth request comes back 401, i.e. the session has expired. Returns an unsubscribe. */
export function onUnauthorized(handler: () => void) {
  unauthorizedHandler = handler
  return () => {
    if (unauthorizedHandler === handler) unauthorizedHandler = undefined
  }
}

async function request<T>(method: string, path: string, body?: unknown, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    signal,
    credentials: 'include',
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (!res.ok) {
    if (res.status === 401 && !/^(\/staff)?\/auth\//.test(path)) unauthorizedHandler?.()
    const detail = await res.json().then((b) => (typeof b?.detail === 'string' ? b.detail : undefined), () => undefined)
    throw new ApiError(res.status, `${method} ${path} failed (${res.status})`, detail)
  }
  return res.status === 204 ? (undefined as T) : res.json()
}

export const api = {
  get: <T>(path: string, signal?: AbortSignal) => request<T>('GET', path, undefined, signal),
  post: <T>(path: string, body: unknown = {}) => request<T>('POST', path, body),
  put: <T>(path: string, body: unknown) => request<T>('PUT', path, body),
  patch: <T>(path: string, body: unknown) => request<T>('PATCH', path, body),
  delete: <T = void>(path: string) => request<T>('DELETE', path),
}
