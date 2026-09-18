import { Link } from 'react-router'
import Footer from '../components/Footer.jsx'
import Testimonials from '../components/Testimonials.jsx'

const approach = [
  {
    key: 'first',
    title: 'I listen, really',
    body: "Before any framework, I want to understand you — where you are, what you're reaching for, what's been wearing you down.",
  },
  {
    key: 'then',
    title: 'I show you yourself',
    body: 'I translate time-tested frameworks and my own read of you into plain language — your gifts, your rhythm, your direction.',
  },
  {
    key: 'always',
    title: "I'm on your side",
    body: "No judgment, no forcing you into someone else's mold. Just honest reflection and steady support toward what's genuinely yours.",
  },
]

function About() {
  return (
    <>
      <title>About — In Your Nature</title>

      <header className="hero">
        <div className="hero-orbs" aria-hidden="true">
          <span className="orb orb-grad"></span>
          <span className="orb orb-grad2"></span>
        </div>
        <div className="wrap hero-in">
          <div className="hero-copy">
            <span className="eyebrow">About</span>
            <h1>
              Hi, I&apos;m Kadi.<span className="whisper">and I&apos;ve been where you are.</span>
            </h1>
            <p className="lead">
              I spent years quietly unfulfilled — worn down by jobs that drained me, wondering if
              that heaviness was just what life was supposed to feel like. It wasn&apos;t.
              Understanding myself changed everything, and now I help other people find their way
              there too.
            </p>
          </div>
        </div>
      </header>

      <section className="sec">
        <div className="wrap wrap-narrow">
          <div className="sec-head sec-head-full">
            <span className="eyebrow">My story</span>
            <h2>I felt lost for years — until I finally understood myself.</h2>
          </div>
          <div className="story">
            <p>
              For a long time, I did what I thought I was supposed to do. I worked hard in jobs
              that looked fine on paper and slowly emptied me out. I felt stuck, low, and quietly
              certain that something was missing — but I couldn&apos;t name what. I kept wondering
              if this was just what adulthood felt like, and whether there was actually more to
              life than this.
            </p>
            <p>
              The turning point wasn&apos;t a new job or a big leap. It was finally digging into{' '}
              <em>who I actually am</em> — my real gifts, my nature, the things that genuinely fit
              me and the things that never would. That self-understanding is the same Blueprint I
              now use with the people I coach. And it changed my life. Knowing myself gave me the
              clarity to say no to what wasn&apos;t mine — and saying no is what finally made room
              for the right things to come in.
            </p>
            <p>
              Today I&apos;m the happiest I&apos;ve ever been. Not because everything is perfect,
              but because my life finally feels like <em>mine</em> — built around who I really am
              instead of who I thought I had to be.
            </p>
            <p>
              That&apos;s why I built In Your Nature. I come from a background in consulting and
              coaching, and I&apos;ve spent years helping people get clear on their vision, find
              work that suits them, and understand their own gifts. I bring warmth, honesty, and a
              real gift for seeing people — plus time-tested frameworks that let me show you your
              own nature with a clarity that&apos;s hard to find on your own. If you&apos;re where
              I was, I promise you: there is more. And I&apos;d love to help you find it.
            </p>
          </div>
        </div>
      </section>

      <section className="sec blue-band">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">How I work</span>
            <h2>Warm, honest, and actually useful.</h2>
          </div>
          <div className="facets">
            {approach.map(({ key, title, body }) => (
              <div className="facet" key={key}>
                <div className="fk">{key}</div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">In their words</span>
            <h2>What people say.</h2>
          </div>
          <Testimonials />
          <div className="cta-center">
            <Link to="/#contact" className="btn btn-solid">
              Book a free intro call
            </Link>
          </div>
        </div>
      </section>

      <Footer heading="Let's find out what's in your nature.">
        Start with a free, no-pressure conversation — and see what becomes clear.
      </Footer>
    </>
  )
}

export default About
