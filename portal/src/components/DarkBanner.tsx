import { useId, type ReactNode } from 'react'
import './DarkBanner.css'

type DarkBannerProps = {
  eyebrow: ReactNode
  title: ReactNode
  body: ReactNode
  actions: ReactNode
  titleSize?: number
}

/** The deep-teal call-out used for The Circle's group call on Home and The Circle page. */
export default function DarkBanner({ eyebrow, title, body, actions, titleSize }: DarkBannerProps) {
  const headingId = useId()
  return (
    <section className="dark-banner" aria-labelledby={headingId}>
      <div className="dark-banner-text">
        <p className="dark-banner-eyebrow">{eyebrow}</p>
        <h2 id={headingId} className="dark-banner-title" style={titleSize ? { fontSize: titleSize } : undefined}>
          {title}
        </h2>
        <p className="dark-banner-body">{body}</p>
      </div>
      <div className="actions">{actions}</div>
    </section>
  )
}
