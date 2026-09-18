import { testimonials } from '../data/testimonials.js'
import Reveal from './Reveal.jsx'

function Testimonials() {
  return (
    <div className="quotes">
      {testimonials.map(({ name, quote }) => (
        <Reveal key={name} className="quote">
          <p>&ldquo;{quote}&rdquo;</p>
          <div className="who">{name}</div>
        </Reveal>
      ))}
    </div>
  )
}

export default Testimonials
