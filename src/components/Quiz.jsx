import { useState } from 'react'
import { Link } from 'react-router'
import { ASSESSMENT_API_URL } from '../data/site.js'

const QUESTIONS = [
  {
    key: 'support_wanted',
    q: 'How much support are you looking for?',
    opts: [
      { label: "Mostly just clarity, once I see it I'll run with it", score: 0 },
      { label: 'A little guidance to get me going', score: 1 },
      { label: 'Steady coaching beside me as I put it into action', score: 2 },
    ],
  },
  {
    key: 'change_size',
    q: "How big is what you're navigating?",
    opts: [
      { label: 'More fine-tuning than overhaul', score: 0 },
      { label: 'A real decision or two to get right', score: 1 },
      { label: "A significant shift I've been putting off", score: 2 },
    ],
  },
]

// Shown once the backend confirms a recommendation — kept in sync with the
// actual tier cards above, not reinvented here.
const TIERS = {
  'The Blueprint': {
    price: '$500',
    desc: 'A clear, personalized read on who you really are, walked through together in a live session.',
    list: [
      'Free intro conversation first',
      'Your full personalized Blueprint',
      'One live walkthrough session with me',
      'Keep-forever report',
      'Your $500 credits toward the Clarity Program if you upgrade within 30 days',
    ],
  },
  'The Clarity Program': {
    price: '$1,500',
    desc: 'Everything in the Blueprint, plus three months of coaching to actually live as yourself, in your days, your relationships, and your direction.',
    list: [
      'Everything in The Blueprint',
      '3 months of coaching, a session every two weeks',
      'Your days, relationships, direction & environments',
      'Your core toolkit: daily-response & rhythm tools',
      'Between-session email support',
    ],
  },
}

function Quiz() {
  const [labels, setLabels] = useState({}) // question index -> selected option label
  const [scores, setScores] = useState({}) // question index -> selected option score
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [errorMessage, setErrorMessage] = useState('')
  const [recommendedTier, setRecommendedTier] = useState(null)

  const answeredCount = Object.keys(labels).length
  const allAnswered = answeredCount === QUESTIONS.length
  const progressPct = Math.round((answeredCount / QUESTIONS.length) * 100)

  function selectOption(qi, opt) {
    setLabels((l) => ({ ...l, [qi]: opt.label }))
    setScores((s) => ({ ...s, [qi]: opt.score }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    setStatus('sending')
    setErrorMessage('')

    const data = new FormData(form)
    const payload = {
      name: data.get('name'),
      email: data.get('email'),
      consent: data.get('consent') === 'on',
      situation: (data.get('situation') || '').trim(),
      answers: QUESTIONS.map((item, qi) => ({
        key: item.key,
        question: item.q,
        answer: labels[qi],
        score: scores[qi],
      })),
      submitted_at: new Date().toISOString(),
      source: 'home_quiz',
    }

    try {
      const res = await fetch(ASSESSMENT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await res.json().catch(() => null)
      if (!res.ok || !result?.ok) {
        throw new Error(result?.error || `API responded ${res.status}`)
      }
      setRecommendedTier(result.recommended_tier)
      setStatus('sent')
    } catch (err) {
      console.error('Assessment submit failed:', err)
      setErrorMessage(err.message)
      setStatus('error')
    }
  }

  const tier = recommendedTier ? TIERS[recommendedTier] : null

  return (
    <form className="quiz-form" onSubmit={handleSubmit}>
      <div className="quiz-progress">
        <div className="quiz-progress-bar" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="quiz-card">
        <div className="quiz-q-kicker">First, in your own words</div>
        <div className="quiz-q-text">What&apos;s going on for you right now? What brought you here?</div>
        <textarea
          name="situation"
          rows={3}
          placeholder="A sentence or two is perfect: where you're at, what feels stuck, or what you're hoping to change."
        />
      </div>

      {QUESTIONS.map((item, qi) => (
        <div className="quiz-card" key={item.key}>
          <div className="quiz-q-kicker">
            Question {qi + 1} of {QUESTIONS.length}
          </div>
          <div className="quiz-q-text">{item.q}</div>
          <div className="quiz-opts">
            {item.opts.map((opt) => (
              <button
                key={opt.label}
                type="button"
                className={`quiz-opt${labels[qi] === opt.label ? ' sel' : ''}`}
                onClick={() => selectOption(qi, opt)}
              >
                <span className="quiz-dot" aria-hidden="true" />
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      ))}

      {status === 'sent' && tier ? (
        <div className="quiz-card quiz-result">
          <div className="quiz-center">
            <span className="quiz-badge">Your recommended starting point</span>
            <h3>{recommendedTier}</h3>
            <div className="quiz-result-price">{tier.price}</div>
            <p>{tier.desc}</p>
          </div>
          <ul>
            {tier.list.map((li) => (
              <li key={li}>{li}</li>
            ))}
          </ul>
          <div className="quiz-guarantee">
            My promise: if you don&apos;t feel real clarity after your first session,
            I&apos;ll add up to two more sessions at no extra cost.
          </div>
          <div className="quiz-center">
            <Link to="/#contact" className="btn btn-solid">
              Book a free call &rarr;
            </Link>
          </div>
        </div>
      ) : (
        allAnswered && (
          <div className="quiz-card quiz-gate">
            <div className="quiz-center">
              <h3>Where should I send your result?</h3>
              <p>
                Enter your name and email, and your personalized recommendation appears right
                away, plus I&apos;ll send you a copy to keep.
              </p>
            </div>
            <div className="quiz-field">
              <label htmlFor="quiz-name">First name</label>
              <input type="text" id="quiz-name" name="name" autoComplete="given-name" required />
            </div>
            <div className="quiz-field">
              <label htmlFor="quiz-email">Email</label>
              <input type="email" id="quiz-email" name="email" autoComplete="email" required />
            </div>
            <label className="quiz-consent">
              <input type="checkbox" name="consent" required />
              It&apos;s okay to email me my result and occasional notes from In Your Nature. (No
              spam, unsubscribe anytime.)
            </label>
            {status === 'error' && (
              <p className="quiz-err" role="alert">
                {errorMessage || 'Something went wrong sending that. Please try again.'}
              </p>
            )}
            <div className="quiz-center">
              <button type="submit" className="btn btn-solid" disabled={status === 'sending'}>
                {status === 'sending' ? 'One moment…' : 'Show my result →'}
              </button>
            </div>
          </div>
        )
      )}
    </form>
  )
}

export default Quiz
