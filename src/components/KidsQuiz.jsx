import { useState } from 'react'
import { Link } from 'react-router'
import { ASSESSMENT_API_URL } from '../data/site.js'

const QUESTIONS = [
  {
    key: 'focus_area',
    q: 'What would help your child most right now?',
    opts: [
      { label: 'Confidence and speaking up', score: 0 },
      { label: 'Reading or learning support', score: 1 },
      { label: 'Understanding how they learn', score: 0 },
      { label: 'Focus and school', score: 1 },
    ],
  },
  {
    key: 'child_age',
    q: 'How old is your child?',
    opts: [
      { label: 'Under 6', score: 0 },
      { label: '6 to 9', score: 0 },
      { label: '10 to 13', score: 0 },
      { label: '14 or older', score: 0 },
    ],
  },
  {
    key: 'support_wanted',
    q: 'How much support are you looking for?',
    opts: [
      { label: 'Just understanding how my child is wired', score: 0 },
      { label: 'A clear plan I can run with at home', score: 1 },
      { label: 'Ongoing coaching or tutoring', score: 2 },
    ],
  },
  {
    key: 'change_size',
    q: 'How much change are you hoping to see?',
    opts: [
      { label: 'A gentle nudge', score: 0 },
      { label: 'A real step forward', score: 1 },
      { label: "A big shift we've needed", score: 2 },
    ],
  },
]

// Computed client-side (not echoed back by the backend) since the backend's
// recommendation logic is scoped to the adult tiers, not these.
const TIERS = {
  'The Learning Blueprint': {
    desc: "A clear, parent-friendly read on how your child is wired to learn, so you know exactly how to support them.",
    list: [
      'A short parent questionnaire',
      'A playful activity session with your child',
      "Your child's Learning Blueprint report",
      'Concrete, practical ways to help at home',
    ],
  },
  'Learning Blueprint + Coaching': {
    desc: 'Everything in the Learning Blueprint, plus ongoing coaching or tutoring to turn it into real progress.',
    list: [
      'Everything in the Learning Blueprint',
      'Ongoing coaching or tutoring sessions',
      'Support for confidence, speaking, or reading as needed',
      'Check-ins to track progress and adjust',
    ],
  },
}

function KidsQuiz() {
  const [labels, setLabels] = useState({}) // question index -> selected option label
  const [scores, setScores] = useState({}) // question index -> selected option score
  const [status, setStatus] = useState('idle') // idle | sending | sent
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

    const data = new FormData(form)
    const total = Object.values(scores).reduce((a, s) => a + s, 0)
    const tier = total <= 1 ? 'The Learning Blueprint' : 'Learning Blueprint + Coaching'

    const payload = {
      audience: 'child',
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
      total_score: total,
      recommended_tier: tier,
      submitted_at: new Date().toISOString(),
      source: 'kids_page_quiz',
    }

    // Send to the backend for lead capture + email, but reveal the result
    // regardless — the recommendation is computed here, not by the backend.
    try {
      await fetch(ASSESSMENT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch (err) {
      console.error('Kids assessment submit failed:', err)
    }

    setRecommendedTier(tier)
    setStatus('sent')
  }

  const tier = recommendedTier ? TIERS[recommendedTier] : null

  return (
    <form className="quiz-form" onSubmit={handleSubmit}>
      <div className="quiz-progress">
        <div className="quiz-progress-bar" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="quiz-card">
        <div className="quiz-q-kicker">First, in your own words</div>
        <div className="quiz-q-text">What&apos;s going on for your child right now?</div>
        <textarea
          name="situation"
          rows={3}
          placeholder="A sentence or two is perfect: what feels hard, what you've noticed, or what you're hoping to help with."
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
            <p>{tier.desc}</p>
          </div>
          <ul>
            {tier.list.map((li) => (
              <li key={li}>{li}</li>
            ))}
          </ul>
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
              <h3>Where should I send your results?</h3>
              <p>
                Enter your name and email, and I&apos;ll send you a personalized read on your
                child, plus the path I&apos;d recommend.
              </p>
            </div>
            <div className="quiz-field">
              <label htmlFor="kids-quiz-name">Your name</label>
              <input
                type="text"
                id="kids-quiz-name"
                name="name"
                autoComplete="given-name"
                required
              />
            </div>
            <div className="quiz-field">
              <label htmlFor="kids-quiz-email">Email</label>
              <input type="email" id="kids-quiz-email" name="email" autoComplete="email" required />
            </div>
            <label className="quiz-consent">
              <input type="checkbox" name="consent" required />
              It&apos;s okay to email me my result and occasional notes from In Your Nature. (No
              spam, unsubscribe anytime.)
            </label>
            <div className="quiz-center">
              <button type="submit" className="btn btn-solid" disabled={status === 'sending'}>
                {status === 'sending' ? 'One moment…' : 'Send me my results →'}
              </button>
            </div>
          </div>
        )
      )}
    </form>
  )
}

export default KidsQuiz
