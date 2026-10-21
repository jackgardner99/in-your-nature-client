import { useState } from 'react'
import { Link } from 'react-router'
import Footer from '../components/Footer.jsx'
import Quiz from '../components/Quiz.jsx'
import Reveal from '../components/Reveal.jsx'
import Testimonials from '../components/Testimonials.jsx'
import { FORMSPREE_ENDPOINT } from '../data/site.js'

const flow = [
  {
    title: 'We talk',
    body: "A free, unhurried conversation. I listen for what lights you up, what wears you down, and what you're reaching for.",
  },
  {
    title: 'We map who you are',
    body: 'Through real conversation and time-tested frameworks, we get clear on your genuine gifts, strengths, and the environments where you do your best.',
  },
  {
    title: 'It translates to your life',
    body: 'That clarity becomes real direction: work that fits you, a daily rhythm that suits you, and confident choices that finally feel like yours.',
  },
]

const facets = [
  {
    key: 'who you are',
    title: 'Your core nature',
    body: 'The temperament underneath the roles you play, and how you actually operate when you\'re being yourself.',
  },
  {
    key: "what you're good at",
    title: 'Your secret gifts',
    body: 'The talents you underrate because they come easily to you, the ones worth building a life around.',
  },
  {
    key: 'how you work',
    title: 'One path, or many',
    body: "Whether you're built to go deep on one thing or to move between several, and how to stop fighting your own wiring.",
  },
  {
    key: 'your conditions',
    title: 'Environment & routine',
    body: 'Whether you thrive on rigid structure or need open freedom, and the surroundings that let you do your best work.',
  },
  {
    key: 'how you refill',
    title: 'How you recharge',
    body: 'What genuinely restores you versus what only looks like rest, so you stop running yourself empty.',
  },
  {
    key: 'how you sense',
    title: 'Your intuitive gifts',
    body: 'How you read people and situations, and the quieter forms of knowing you can learn to trust.',
  },
  {
    key: "where you're headed",
    title: 'Career directions',
    body: 'The kinds of roles and work that fit your nature, and the ones that will quietly drain you no matter the pay.',
  },
  {
    key: 'your growth edge',
    title: "Where you're meant to stretch",
    body: "The direction of real growth for you this chapter: the work that's uncomfortable because it's yours to do.",
  },
  {
    key: 'the honest part',
    title: 'What drains you & what to avoid',
    body: "The patterns, environments, and choices that don't fit you: what quietly wears you down, and what to stop forcing. Knowing what isn't yours is half of finding what is.",
  },
]

function ContactForm() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    setStatus('sending')
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error(`Formspree responded ${res.status}`)
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form className="cform" onSubmit={handleSubmit}>
      <div className="cfield">
        <label htmlFor="contact-name">Your name</label>
        <input id="contact-name" name="name" type="text" placeholder="First name" />
      </div>
      <div className="cfield">
        <label htmlFor="contact-email">Email</label>
        <input id="contact-email" name="email" type="email" placeholder="you@email.com" required />
      </div>
      <div className="cfield">
        <label htmlFor="contact-message">Where are you right now?</label>
        <textarea
          id="contact-message"
          name="message"
          placeholder="What's on your mind, or what you're hoping to figure out..."
        />
      </div>
      {/* honeypot: hidden from people, filled in by spam bots */}
      <input className="hp" type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button type="submit" className="btn btn-solid" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Submit Form'}
      </button>
      {status === 'sent' && (
        <p className="cdone" role="status">
          Thank you! Your message is on its way. I&apos;ll be in touch soon.
        </p>
      )}
      {status === 'error' && (
        <p className="cerror" role="alert">
          Something went wrong sending your message. Please try again.
        </p>
      )}
      <p className="cnote">
        In Your Nature offers coaching and personal development, not licensed therapy or medical,
        legal, or financial advice.
      </p>
    </form>
  )
}

function Home() {
  return (
    <>
      <title>In Your Nature — coaching &amp; personal development</title>

      <header className="hero">
        <div className="hero-orbs" aria-hidden="true">
          <span className="orb orb-grad"></span>
          <span className="orb orb-grad2"></span>
        </div>
        <div className="wrap hero-in">
          <div className="hero-copy">
            <span className="eyebrow">Coaching &amp; personal development</span>
            <h1>
              You already sense there&apos;s more.
              <span className="whisper">let&apos;s find it, together.</span>
            </h1>
            <p className="lead">
              If you feel stuck or drained, quietly sensing you&apos;re meant for more, or you just
              need help putting your own gifts into words, you&apos;re in the right place. I help
              you map how you&apos;re actually wired: your gifts, your natural rhythm, the
              environments where you come alive. I know how much it matters, because finding this
              for myself is what pulled me out of years in work that slowly emptied me, and into a
              life that finally feels like mine.
            </p>
            <div className="hero-cta">
              <Link to="/#contact" className="btn btn-solid">
                Book a free intro call
              </Link>
              <Link to="/#work" className="btn btn-ghost">
                See how I can help
              </Link>
            </div>
            <p className="hero-fine">
              Map your gifts, your rhythm, and where you belong, {' '}
              <b>and turn that clarity into a life that fits you.</b>
            </p>
            <p className="hero-proof">
              &ldquo;Kadi has a true gift for noticing people&apos;s natural strengths and helping
              them bring those into their real life.&rdquo; <span>— Avery</span>
            </p>
          </div>
        </div>
      </header>

      {/* experience / why me strip */}
      <section className="sec sec-tight">
        <div className="wrap">
          <div className="cred-note">
            <p>
              I spent years unhappy in work that wasn&apos;t right for me, going through the
              motions, wondering if that heaviness was just what adulthood felt like. It
              wasn&apos;t. When I finally dug into understanding myself, my real gifts and what
              actually fit me, everything shifted. Knowing myself gave me the clarity to say no
              to what wasn&apos;t mine, which made room for what was. That&apos;s the work I do
              with people now, and it comes from a background in consulting and coaching, helping
              people get clear on their vision, find work that suits them, and grow into who
              they&apos;re meant to be.
            </p>
          </div>
        </div>
      </section>

      {/* how it works: one connected arc */}
      <section className="sec">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">How we work together</span>
            <h2>Understand yourself first. Everything else follows.</h2>
            <p>
              The clearer you are on who you are, the more naturally the right things fall into
              place: the career that fits, the way you want to live your days, the decisions that
              used to feel hard.
            </p>
          </div>
          <div className="flow">
            {flow.map(({ title, body }) => (
              <Reveal className="flow-item" key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* the blueprint facets */}
      <section className="sec blue-band" id="blueprint">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Your Blueprint</span>
            <h2>
              The clearest picture of yourself you&apos;ve ever had, and the foundation for
              everything after.
            </h2>
            <p>
              Before we work on your career, your interviews, or your next move, we get clear on
              who you actually are. The Blueprint is that foundation: a personal read across the
              facets that shape your work and life. Here&apos;s what it opens up.
            </p>
          </div>
          <div className="facets">
            {facets.map(({ key, title, body }) => (
              <Reveal className="facet" key={title}>
                <div className="fk">{key}</div>
                <h3>{title}</h3>
                <p>{body}</p>
              </Reveal>
            ))}
          </div>
          <p className="blue-note">
            The frameworks behind it are time-tested and personal, but you never have to learn
            any of them. I translate all of it into plain language about you.
          </p>
        </div>
      </section>

      {/* interactive quiz */}
      <section className="sec quiz-band" id="quiz">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Find your starting point</span>
            <h2>Where are you right now?</h2>
            <p>
              Answer a few honest questions about where you are, and I&apos;ll send you a
              personalized read, plus the exact next step I&apos;d recommend for you. It takes
              about a minute.
            </p>
          </div>
          <Quiz />
        </div>
      </section>

      {/* the promise / dusk band */}
      <section className="sec dusk-band">
        <div className="wrap">
          <span className="eyebrow">Why this works</span>
          <h2>Clarity isn&apos;t a personality label. It&apos;s permission.</h2>
          <p>
            Most people already sense who they are. They&apos;ve just been talked out of it. When
            you can finally see your own wiring laid out clearly, the pressure to be someone else
            drops, and the right next steps get obvious: the career that fits, the way you want
            your days to feel, the decisions that used to keep you stuck. That&apos;s the whole
            point. Not a report you file away, but a life that starts to feel like yours.
          </p>
          <div className="dusk-cta">
            <Link to="/#contact" className="btn btn-solid">
              Start with a free call
            </Link>
          </div>
        </div>
      </section>

      {/* offerings */}
      <section className="sec" id="work">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Ways to work together</span>
            <h2>Two paths. The same clear start.</h2>
            <p>
              Every path begins with understanding yourself, and the same free conversation. What
              changes is how much support you want after that: the insight on its own, or four
              months of coaching to live it out. Pay in full or in installments.
            </p>
          </div>

          <div className="tiers">
            <Reveal className="tier">
              <div className="tier-name">The Blueprint</div>
              <div className="tier-for">Know yourself</div>
              <div className="tier-price">$500</div>
              <div className="tier-pay">Paid in full</div>
              <p className="tier-desc">
                A clear, personalized read on who you really are, walked through together in a
                live session.
              </p>
              <ul>
                <li>Free intro conversation first</li>
                <li>Your full personalized Blueprint</li>
                <li>One live walkthrough session with me</li>
                <li>Keep-forever report</li>
              </ul>
              <p className="tier-upgrade">
                Want more support? Your $500 credits toward the Clarity Program if you upgrade
                within 30 days.
              </p>
              <Link to="/#contact" className="btn btn-ghost tier-cta">
                Book a free intro call
              </Link>
            </Reveal>

            <Reveal className="tier feature">
              <div className="tier-badge">★ Most people start here</div>
              <div className="tier-name">The Clarity Program</div>
              <div className="tier-for">Live it, in the areas that matter most</div>
              {/* Founding-client promo — Jack: remove this note once the 3 spots fill */}
              <p className="tier-founding">
                Founding rate: $1,000 (or 4 payments of $250) for my first 3 clients, in exchange
                for honest feedback along the way.
              </p>
              <div className="tier-price">$1,500</div>
              <div className="tier-pay">Pay in full or 4 payments of $375</div>
              <p className="tier-desc">
                Everything in the Blueprint, plus four months of coaching to actually live as
                yourself, in your days, your relationships, and your direction.
              </p>
              <ul>
                <li>
                  <b>Everything in The Blueprint</b>
                </li>
                <li>4 months of coaching, every two weeks</li>
                <li>
                  <b>Your days:</b> a routine, rhythm &amp; rest that fit you
                </li>
                <li>
                  <b>Your relationships:</b> love, friendship, family &amp; conflict
                </li>
                <li>
                  <b>Your direction:</b> career and life guidance toward what fits
                </li>
                <li>
                  <b>Your environments:</b> the settings &amp; people where you thrive
                </li>
                <li>Your core toolkit: daily-response &amp; rhythm tools</li>
                <li>Journaling prompts written around your Blueprint</li>
                <li>Between-session email support</li>
              </ul>
              <Link to="/#contact" className="btn btn-solid tier-cta">
                Book a free intro call
              </Link>
            </Reveal>
          </div>

          <p className="tiers-note">
            Want to go even deeper? Longer-term, more intensive coaching is available by
            invitation for Clarity clients.
          </p>

          <div className="brand-guarantee">
            <b>My promise:</b> if you don&apos;t feel real clarity after your first session,
            I&apos;ll add up to two more sessions at no extra cost.
          </div>

          <p className="tiers-note">
            Each quarter I hold a few sliding-scale spots for people who need them. Just mention
            it on your intro call.
          </p>

          <Reveal className="circle">
            <div>
              <div className="tier-name">The Circle</div>
              <div className="tier-for">A small community, all year</div>
              <p className="tier-desc">
                For anyone who wants to keep growing alongside others. Each month: one live group
                call, fresh journaling prompts, and a small, kind community of people doing this
                same work. Open to everyone, and a gentle place to start.
              </p>
            </div>
            <div className="circle-price">
              <div className="tier-price">
                $40<span className="price-period">/month</span>
              </div>
              <div className="tier-pay">Cancel anytime</div>
              <Link to="/#contact" className="btn btn-ghost">
                Join the Circle
              </Link>
            </div>
          </Reveal>

          <p className="tiers-note">
            Not sure which fits? Take the quiz above, or just book a free call and we&apos;ll
            figure it out together.
          </p>
        </div>
      </section>

      {/* testimonials */}
      <section className="sec">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">In their words</span>
            <h2>What it&apos;s like to be coached by me.</h2>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* contact */}
      <section className="sec contact-band" id="contact">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Let&apos;s talk</span>
            <h2>Book your free intro call.</h2>
            <p>
              Tell me a little about where you are and what you&apos;re hoping for. No pressure,
              no pitch, just a real conversation to see if this is a fit. I work with a limited
              number of people at a time, so we can go deep, and every path comes with my promise:
              if you don&apos;t feel real clarity after your first session, I&apos;ll add up to
              two more sessions at no extra cost.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      <Footer heading="You don't need to become someone new.">
        You need to see who you already are, and build a life around it. Let&apos;s start.
      </Footer>
    </>
  )
}

export default Home
