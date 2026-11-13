import { useState } from 'react'
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

function Quiz() {
  const [labels, setLabels] = useState({}) // question index -> selected option label
  const [scores, setScores] = useState({}) // question index -> selected option score
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [errorMessage, setErrorMessage] = useState('')

  const allAnswered = Object.keys(labels).length === QUESTIONS.length

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
      // The recommendation is emailed, not shown on screen.
      setStatus('sent')
    } catch (err) {
      console.error('Assessment submit failed:', err)
      setErrorMessage(err.message)
      setStatus('error')
    }
  }

  return (
    <form className="quiz-form" onSubmit={handleSubmit}>
      <div className="qq qq-situation">
        <div className="qq-q">1. First, in your own words: what&apos;s going on for you right now?</div>
        <textarea
          name="situation"
          rows={3}
          placeholder="A sentence or two is perfect: where you're at, what feels stuck, or what you're hoping to change."
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
              Enter your name and email, and I&apos;ll send you a personalized read on where you
              are, plus the path I&apos;d recommend for you.
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
                {errorMessage || 'Something went wrong sending that. Please try again.'}
              </p>
            )}
            {status === 'sent' ? (
              <p className="cap-done" role="status">
                🌿 Thank you! Your personalized results are on their way to your inbox.
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

export default Quiz
