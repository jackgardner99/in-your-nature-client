import { useState } from 'react'
import { Link } from 'react-router'
import Footer from '../components/Footer.jsx'
import Reveal from '../components/Reveal.jsx'
import Testimonials from '../components/Testimonials.jsx'

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
    body: 'That clarity becomes real direction — work that fits you, a daily rhythm that suits you, and confident choices that finally feel like yours.',
  },
]

const facets = [
  {
    key: 'who you are',
    title: 'Your core nature',
    body: 'The temperament underneath the roles you play — how you actually operate when you\'re being yourself.',
  },
  {
    key: "what you're good at",
    title: 'Your secret gifts',
    body: 'The talents you underrate because they come easily to you — the ones worth building a life around.',
  },
  {
    key: 'how you work',
    title: 'One path, or many',
    body: "Whether you're built to go deep on one thing or to move between several — and how to stop fighting your own wiring.",
  },
  {
    key: 'your conditions',
    title: 'Environment & routine',
    body: 'Whether you thrive on rigid structure or need open freedom, and the surroundings that let you do your best work.',
  },
  {
    key: 'how you refill',
    title: 'How you recharge',
    body: 'What genuinely restores you versus what only looks like rest — so you stop running yourself empty.',
  },
  {
    key: 'how you sense',
    title: 'Your intuitive gifts',
    body: 'How you read people and situations, and the quieter forms of knowing you can learn to trust.',
  },
  {
    key: "where you're headed",
    title: 'Career directions',
    body: 'The kinds of roles and work that fit your nature — and the ones that will quietly drain you no matter the pay.',
  },
  {
    key: 'your growth edge',
    title: "Where you're meant to stretch",
    body: "The direction of real growth for you this chapter — the work that's uncomfortable because it's yours to do.",
  },
]

function ContactForm() {
  const [sent, setSent] = useState(false)

  return (
    <form
      className="cform"
      onSubmit={(e) => {
        e.preventDefault()
        setSent(true)
      }}
    >
      <div className="cfield">
        <label htmlFor="contact-name">Your name</label>
        <input id="contact-name" type="text" placeholder="First name" />
      </div>
      <div className="cfield">
        <label htmlFor="contact-email">Email</label>
        <input id="contact-email" type="email" placeholder="you@email.com" />
      </div>
      <div className="cfield">
        <label htmlFor="contact-message">Where are you right now?</label>
        <textarea
          id="contact-message"
          placeholder="What's on your mind, or what you're hoping to figure out..."
        />
      </div>
      <button type="submit" className="btn btn-solid">
        Request my free call
      </button>
      {sent && (
        <p className="cdone">
          Thank you — this is a demo form. On the live site, your note would reach me here.
        </p>
      )}
      <p className="cnote">
        In Your Nature offers coaching and personal development — not licensed therapy or medical,
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
          <span className="eyebrow">Coaching &amp; personal development</span>
          <h1>
            There&apos;s more for you.<span className="whisper">and it starts with knowing yourself.</span>
          </h1>
          <p className="lead">
            If you feel stuck or drained, quietly sensing you&apos;re meant for more — or you just
            need help putting your own gifts into words — you&apos;re in the right place. I help
            you map how you&apos;re actually wired: your gifts, your natural rhythm, the
            environments where you come alive. I know how much it matters, because finding this
            for myself is what pulled me out of years in work that slowly emptied me — and into a
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
            Map your gifts, your rhythm, and where you belong —{' '}
            <b>and turn that clarity into a life that fits you.</b>
          </p>
        </div>
      </header>

      {/* experience / why me strip */}
      <section className="sec sec-tight">
        <div className="wrap">
          <div className="cred-note">
            <p>
              I spent years unhappy in work that wasn&apos;t right for me — going through the
              motions, wondering if that heaviness was just what adulthood felt like. It
              wasn&apos;t. When I finally dug into understanding myself — my real gifts, what
              actually fit me — everything shifted. Knowing myself gave me the clarity to say no
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
              place — the career that fits, the way you want to live your days, the decisions that
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
              The clearest picture of yourself you&apos;ve ever had — and the foundation for
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
            <Reveal className="facet wide">
              <div className="fk">the honest part</div>
              <h3>What drains you &amp; what to avoid</h3>
              <p>
                Most reads only tell you the bright side. Yours also names the patterns,
                environments, and choices that don&apos;t fit you — what quietly wears you down,
                what you won&apos;t enjoy, and what to stop forcing. Knowing what isn&apos;t yours
                is half of finding what is.
              </p>
            </Reveal>
          </div>
          <p className="blue-note">
            The frameworks behind it are time-tested and personal — but you never have to learn
            any of them. I translate all of it into plain language about you.
          </p>
        </div>
      </section>

      {/* the promise / dusk band */}
      <section className="sec dusk-band">
        <div className="wrap">
          <span className="eyebrow">Why this works</span>
          <h2>Clarity isn&apos;t a personality label. It&apos;s permission.</h2>
          <p>
            Most people already sense who they are — they&apos;ve just been talked out of it. When
            you can finally see your own wiring laid out clearly, the pressure to be someone else
            drops, and the right next steps get obvious: the career that fits, the way you want
            your days to feel, the decisions that used to keep you stuck. That&apos;s the whole
            point — not a report you file away, but a life that starts to feel like yours.
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
            <span className="eyebrow">Work with me</span>
            <h2>Where to begin.</h2>
            <p>
              Everything starts with a free conversation. Most people begin with the Blueprint,
              because knowing yourself first makes the coaching that follows far more powerful —
              but you can dive straight into a specific goal too. Whatever fits you.
            </p>
          </div>
          <div className="offer">
            <Reveal className="ocard signature">
              <div className="otag">the best place to start</div>
              <h3>Your Blueprint</h3>
              <p>
                A personalized read on who you are — your gifts, strengths, and the environments
                you thrive in — delivered as a clear written report and walked through together.
                It&apos;s the foundation that makes every career and life decision after it
                sharper.
              </p>
              <ul>
                <li>Free intro conversation first</li>
                <li>Your full Blueprint across every facet</li>
                <li>A live walkthrough session to make it real</li>
                <li>Plain-language, keep-forever report</li>
              </ul>
              <div className="price">
                Pricing tailored to you — we&apos;ll talk it through on our call
              </div>
            </Reveal>
            <Reveal className="ocard">
              <div className="otag">put it to work</div>
              <h3>Coaching sessions</h3>
              <p>
                Turn self-understanding into real direction. Once you know your gifts and
                strengths, we work on the things that move your life forward — grounded in who you
                actually are, not generic advice. Start here on its own, or continue after your
                Blueprint.
              </p>
              <ul>
                <li>Finding the career and roles that truly fit you</li>
                <li>Shaping a daily routine and pace that suit you</li>
                <li>Interviews and communicating your strengths</li>
                <li>Confidence, presence &amp; public speaking</li>
                <li>Ongoing coaching toward your goals</li>
              </ul>
              <div className="price">Single sessions or packages — tailored to you</div>
            </Reveal>
          </div>
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
              no pitch — just a real conversation to see if this is a fit.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      <Footer heading="You don't need to become someone new.">
        You need to see who you already are — and build a life around it. Let&apos;s start.
      </Footer>
    </>
  )
}

export default Home
