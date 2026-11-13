import { testimonials } from '../data/testimonials.js'
import Reveal from './Reveal.jsx'

function Testimonials({ items = testimonials }) {
  return (
    <div className="quotes">
      {items.map(({ name, tag, quote }) => (
        <Reveal key={name} className="quote">
          <p>&ldquo;{quote}&rdquo;</p>
          <div className="who">
            {name}
            {tag && <span> · {tag}</span>}
          </div>
        </Reveal>
      ))}
    </div>
  )
}

export default Testimonials
