import { ApiError } from '../../api/client'

export const isExpiredLink = (err: unknown) => err instanceof ApiError && (err.status === 404 || err.status === 410)

export function authErrorMessage(err: unknown, unauthorized = 'Something went wrong. Please try again.') {
  if (err instanceof ApiError) {
    if (err.status === 400 || err.status === 401) return unauthorized
    if (err.status === 429) return 'Too many attempts. Please wait a few minutes and try again.'
  }
  return 'Something went wrong. Please try again.'
}
