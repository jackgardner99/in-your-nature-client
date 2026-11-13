import { useState } from 'react'
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

function KidsQuiz() {
  const [labels, setLabels] = useState({}) // question index -> selected option label
  const [scores, setScores] = useState({}) // question index -> selected option score
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const allAnswered = Object.keys(labels).length === QUESTIONS.length

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
    // The backend's own recommendation logic covers the adult tiers only, so the
    // kids recommendation is worked out here and sent along for the email.
    const tier = total <= 1 ? 'The Learning Blueprint' : 'Learning Blueprint + Coaching'

    const payload = {
      audience: 'child',
      name: data.get('name'),
      email: data.get('email'),
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

    try {
      const res = await fetch(ASSESSMENT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`API responded ${res.status}`)
      // The recommendation is emailed, not shown on screen.
      setStatus('sent')
    } catch (err) {
      console.error('Kids assessment submit failed:', err)
      setStatus('error')
    }
  }

  return (
    <form className="quiz-form" onSubmit={handleSubmit}>
      <div className="qq qq-situation">
        <div className="qq-q">
          1. First, in your own words: what&apos;s going on for your child right now?
        </div>
        <textarea
          name="situation"
          rows={3}
          placeholder="A sentence or two is perfect: what feels hard, what you've noticed, or what you're hoping to help with."
        />
      </div>

      <div className="quiz-questions">
        {QUESTIONS.map((item, qi) => (
          <div className="qq" key={item.key}>
            <div className="qq-q">
              {qi + 2}. {item.q}
            </div>
            <div className="qq-opts">
              {item.opts.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  className={`qq-opt${labels[qi] === opt.label ? ' sel' : ''}`}
                  aria-pressed={labels[qi] === opt.label}
                  onClick={() => selectOption(qi, opt)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {allAnswered && (
        <div className="capture">
          <div className="capture-inner">
            <h3>Where should I send your results?</h3>
            <p>
              Enter your name and email, and I&apos;ll send you a personalized read on your child,
              plus the path I&apos;d recommend.
            </p>
            <div className="cap-row">
              <input
                type="text"
                name="name"
                placeholder="Your name"
                aria-label="Your name"
                autoComplete="given-name"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your email"
                aria-label="Your email"
                autoComplete="email"
                required
              />
            </div>
            {status === 'error' && (
              <p className="quiz-err" role="alert">
                Something went wrong sending that. Please try again.
              </p>
            )}
            {status === 'sent' ? (
              <p className="cap-done" role="status">
                🌿 Thank you! Your personalized results are on their way.
              </p>
            ) : (
              <button type="submit" className="btn btn-solid cap-btn" disabled={status === 'sending'}>
                {status === 'sending' ? 'One moment…' : 'Send me my results'}
              </button>
            )}
            <p className="cap-fine">No spam, ever. Just your result and a genuine next step.</p>
          </div>
        </div>
      )}
    </form>
  )
}

export default KidsQuiz
