import type { ComponentProps, ReactNode } from 'react'

type FieldProps = { label: string; hint?: string; children: ReactNode; htmlFor: string }

export function Field({ label, hint, children, htmlFor }: FieldProps) {
  return (
    <div className="field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  )
}

type SelectProps<V extends string> = Omit<ComponentProps<'select'>, 'onChange' | 'value'> & {
  value: V
  options: { value: V; label: string }[]
  onChange: (value: V) => void
  small?: boolean
}

export function Select<V extends string>({ value, options, onChange, small, className, ...props }: SelectProps<V>) {
  return (
    <select
      className={['input', small && 'input-sm', className].filter(Boolean).join(' ')}
      value={value}
      onChange={(e) => onChange(e.target.value as V)}
      {...props}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

export function FormError({ error }: { error?: string }) {
  if (!error) return null
  return (
    <p className="form-error" role="alert">
      {error}
    </p>
  )
}
