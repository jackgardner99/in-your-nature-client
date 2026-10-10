import { useState } from 'react'
import { ASSESSMENT_API_URL } from '../data/site.js'

const QUESTIONS = [
  {
    key: 'support_wanted',
    q: 'How much support do you want on this journey?',
    opts: [
      { label: "Just the insight, I'll take it from there", score: 0 },
      { label: 'A little guidance to get going', score: 1 },
      { label: 'Regular coaching over a few months', score: 2 },
      { label: 'Someone beside me the whole way through', score: 3 },
    ],
  },
  {
    key: 'change_size',
    q: "How big is the change you're facing?",
    opts: [
      { label: 'More fine-tuning than overhaul', score: 0 },
      { label: 'A few real decisions to get right', score: 1 },
      { label: "A significant shift I've been putting off", score: 2 },
      { label: 'A major life or career transition', score: 3 },
    ],
  },
  {
    key: 'timeline',
    q: 'How do you want to work through it?',
    opts: [
      { label: "One focused read, then I'm off", score: 0 },
      { label: 'A quick start, then on my own', score: 1 },
      { label: 'Steadily, with monthly check-ins', score: 2 },
      { label: 'Over time, with ongoing accountability', score: 3 },
    ],
  },
  {
    key: 'self_starting',
    q: "Once you're clear on your direction, you tend to...",
    opts: [
      { label: 'Run with it easily on my own', score: 0 },
      { label: 'Get going with a bit of a nudge', score: 1 },
      { label: 'Do better with regular accountability', score: 2 },
      { label: 'Really thrive with steady, ongoing support', score: 3 },
    ],
  },
]

function Quiz() {
  const [labels, setLabels] = useState({}) // question index -> selected option label
  const [scores, setScores] = useState({}) // question index -> selected option score
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [errorMessage, setErrorMessage] = useState('')
  const [recommendedTier, setRecommendedTier] = useState(null)

  const started = Object.keys(labels).length > 0
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
      consent: data.get('consent') === 'on',
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
      form.reset()
      setRecommendedTier(result.recommended_tier)
      setStatus('sent')
    } catch (err) {
      setErrorMessage(err.message)
      setStatus('error')
    }
  }

  return (
    <>
      <div className="quiz-questions">
        {QUESTIONS.map((item, qi) => (
          <div className="qq" key={item.key}>
            <div className="qq-q">
              {qi + 1}. {item.q}
            </div>
            <div className="qq-opts">
              {item.opts.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  className={`qq-opt${labels[qi] === opt.label ? ' sel' : ''}`}
                  onClick={() => selectOption(qi, opt)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {started && (
        <div className="capture">
          <div className="capture-inner">
            {status === 'sent' ? (
              <>
                <h3>Your starting point: {recommendedTier}</h3>
                <p className="cdone" role="status">
                  🌿 Thank you! I&apos;ve sent your personalized results to your inbox, and
                  I&apos;ll follow up personally soon.
                </p>
              </>
            ) : (
              <>
                <h3>Where should I send your results?</h3>
                <p>
                  Enter your name and email, and I&apos;ll send you a personalized read on where
                  you are, plus the path I&apos;d recommend for you.
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="cap-row">
                    <input type="text" name="name" placeholder="Your name" required />
                    <input type="email" name="email" placeholder="Your email" required />
                  </div>
                  <label className="cap-consent">
                    <input type="checkbox" name="consent" required />
                    I&apos;m okay with In Your Nature emailing me my results and following up.
                  </label>
                  {!allAnswered && (
                    <p className="cap-fine">Answer all the questions above to get your result.</p>
                  )}
                  <button
                    type="submit"
                    className="btn btn-solid cap-submit"
                    disabled={status === 'sending' || !allAnswered}
                  >
                    {status === 'sending' ? 'Sending…' : 'Send me my results'}
                  </button>
                  {status === 'error' && (
                    <p className="cerror" role="alert">
                      {errorMessage || 'Something went wrong sending that. Please try again.'}
                    </p>
                  )}
                  <p className="cap-fine">No spam, ever. Just your result and a genuine next step.</p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Quiz
