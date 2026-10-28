import type { ComponentProps, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import './ui.css'

type CardProps = ComponentProps<'section'> & { flat?: boolean }

export function Card({ className, flat, ...props }: CardProps) {
  return <section className={['card', flat && 'card-flat', className].filter(Boolean).join(' ')} {...props} />
}

type ButtonVariant = 'clay' | 'teal' | 'ghost' | 'sage' | 'outline-light'

type ButtonLinkProps = {
  to: string
  variant: ButtonVariant
  children: ReactNode
  className?: string
  /** Open in a new tab (e.g. Square payment pages). */
  newTab?: boolean
}

/** Internal routes use the router; hash and external links render a plain anchor. */
export function ButtonLink({ to, variant, children, className, newTab }: ButtonLinkProps) {
  const cls = ['btn', `btn-${variant}`, className].filter(Boolean).join(' ')
  if (to.startsWith('/')) {
    return (
      <Link className={cls} to={to}>
        {children}
      </Link>
    )
  }
  return (
    <a className={cls} href={to} {...(newTab && { target: '_blank', rel: 'noopener noreferrer' })}>
      {children}
    </a>
  )
}

type ButtonProps = ComponentProps<'button'> & { variant: ButtonVariant }

export function Button({ variant, className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={['btn', `btn-${variant}`, className].filter(Boolean).join(' ')} {...props} />
}

type ChipVariant = 'active' | 'outline' | 'paid' | 'due' | 'scheduled' | 'plum'

export function Chip({ variant, children }: { variant: ChipVariant; children: ReactNode }) {
  return <span className={`chip chip-${variant}`}>{children}</span>
}

type ProgressProps = {
  label: string
  value: string
  percent: number
  color?: string
}

export function Progress({ label, value, percent, color }: ProgressProps) {
  return (
    <div className="progress">
      <div className="progress-label">
        <span>{label}</span>
        <span className="tabular">{value}</span>
      </div>
      <div
        className="bar"
        role="progressbar"
        aria-label={label}
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <i style={{ width: `${percent}%`, background: color }} />
      </div>
    </div>
  )
}
