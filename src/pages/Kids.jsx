import { Fragment } from 'react'
import { Link } from 'react-router'
import Footer from '../components/Footer.jsx'
import Reveal from '../components/Reveal.jsx'

const services = [
  {
    key: 'self-belief',
    title: 'Confidence Coaching for Kids & Teens',
    body: 'Help your child believe in themselves, handle setbacks, and show up with quiet confidence at school, in friendships, and in new situations.',
  },
  {
    key: 'finding their voice',
    title: 'Public Speaking for Kids & Teens',
    body: 'From class presentations to speaking up in a group, I help young people learn to speak clearly and calmly, and actually enjoy being heard.',
  },
  {
    key: 'learning that sticks',
    title: 'Reading & Learning Support',
    body: 'Patient, personalized reading and learning help, including proven, kind approaches for children who learn differently or have dyslexia.',
  },
]

const blueprintFacets = [
  {
    key: 'temperament',
    title: 'How your child is wired',
    body: 'Their energy, persistence, sensitivity, and how they handle change, the nature underneath the behavior.',
  },
  {
    key: 'attention',
    title: 'How they focus',
    body: 'Their real attention span, memory, and pace, so homework can be sized and structured to fit them.',
  },
  {
    key: 'motivation',
    title: 'What lights them up',
    body: 'The interests and challenges that pull them in, and how they respond when something gets hard.',
  },
  {
    key: 'how they take it in',
    title: 'How they engage best',
    body: 'Whether they come alive hands-on, through stories, or by seeing it, and how to use that at home.',
  },
  {
    key: 'their gifts',
    title: 'Strengths & growth edges',
    body: 'The talents to build on and the areas to support, named kindly and clearly.',
  },
  {
    key: 'for you',
    title: 'Your parent playbook',
    body: 'Concrete, practical ways to help, grounded in temperament, attention, and proven learning strategies.',
  },
]

const process = [
  { num: 1, title: 'We meet for an intro', body: 'A free, relaxed call to hear about your child and what you’re hoping for.' },
  { num: 2, title: 'You fill out the questionnaire', body: 'A few honest questions about your child, about ten minutes.' },
  { num: 3, title: 'I do an activity session with your child', body: 'A short, playful session, in person or online, to see how they learn.' },
  { num: 4, title: 'I coach you through the changes', body: 'We turn the Blueprint into real progress, at a pace that fits your child.' },
]

const quotes = [
  {
    quote:
      'Kaitlin helped our child cultivate confidence in his speaking, even incorporating a method to help reduce his stutter.',
    who: 'The Bartlet family',
  },
  {
    quote:
      'Kaitlin helped our child with public speaking and helped him find the confidence in himself to make friends.',
    who: 'The Chapmans',
  },
]

function Kids() {
  return (
    <>
      <title>Kids &amp; Teens Coaching — In Your Nature</title>
      <meta
        name="description"
        content="Confidence coaching, public speaking, and reading & learning support for kids and teens, plus a parent-friendly Learning Blueprint showing how your child learns best."
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Kids & Teens Coaching',
            serviceType: [
              'Kids confidence coaching',
              'Public speaking for kids and teens',
              'Reading and learning support',
              'Learning Blueprint for parents',
            ],
            description:
              'Confidence coaching, public speaking, and reading and learning support for kids and teens, plus a parent-friendly Learning Blueprint showing how a child learns best.',
          }),
        }}
      />

      <header className="hero">
        <div className="hero-orbs" aria-hidden="true">
          <span className="orb orb-grad"></span>
          <span className="orb orb-grad2"></span>
        </div>
        <div className="wrap hero-in">
          <div className="hero-copy">
            <span className="eyebrow">Kids &amp; teens coaching</span>
            <h1>
              Confidence, voice, and a love of learning.
              <span className="whisper">for the young person in your life.</span>
            </h1>
            <p className="lead">
              Some kids need help believing in themselves. Some need to find their voice and
              speak up. And some just need to be taught the way they actually learn. I work with
              children and teens on confidence, public speaking, and reading and learning
              support, and I give parents a clear picture of how their child is wired, so you
              know exactly how to help them thrive.
            </p>
            <div className="hero-cta">
              <Link to="/#contact" className="btn btn-solid">
                Book a free intro call
              </Link>
              <a href="#blueprint" className="btn btn-ghost">
                See the Learning Blueprint
              </a>
            </div>
            <p className="hero-proof">
              &ldquo;Kaitlin helped our child with public speaking and helped him find the
              confidence in himself to make friends.&rdquo; <span>— The Chapmans</span>
            </p>
          </div>
        </div>
      </header>

      {/* services */}
      <section className="sec">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">How I help young people</span>
            <h2>Support that meets your child where they are.</h2>
            <p>
              Every child is wired differently. Instead of forcing them into one mold, we start
              with how they naturally learn and grow, then build their confidence and skills from
              there.
            </p>
          </div>
          <div className="facets">
            {services.map(({ key, title, body }) => (
              <Reveal className="facet" key={title}>
                <div className="fk">{key}</div>
                <h3>{title}</h3>
                <p>{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* reading system story */}
      <section className="sec sec-tight">
        <div className="wrap">
          <div className="cred-note">
            <p>
              When a young girl I worked with was struggling to read, the usual methods
              weren&apos;t reaching her. So I built a brand new reading system around how she
              actually learned, teaching word sounds, pronunciation, and writing in a way that
              finally clicked. Within a few weeks she was reading. Within a year she was reading
              over a hundred words a minute and making the honor roll. That&apos;s the heart of
              what I do with kids: meet them where they are, teach them their way, and watch their
              confidence follow.
            </p>
          </div>
        </div>
      </section>

      {/* learning blueprint */}
      <section className="sec blue-band" id="blueprint">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">For parents</span>
            <h2>The Learning Blueprint: see how your child actually learns.</h2>
            <p>
              One of the hardest parts of parenting is not knowing why something isn&apos;t
              clicking for your child. The Learning Blueprint takes the guesswork out. It&apos;s a
              clear, parent-friendly read on how your child is wired to learn, so you can support
              them with confidence instead of frustration.
            </p>
          </div>
          <div className="facets dark">
            {blueprintFacets.map(({ key, title, body }) => (
              <Reveal className="facet" key={title}>
                <div className="fk">{key}</div>
                <h3>{title}</h3>
                <p>{body}</p>
              </Reveal>
            ))}
          </div>
          <p className="blue-note">
            Built from a parent questionnaire plus a short, playful activity session with your
            child. The Learning Blueprint pairs naturally with coaching or tutoring: first we
            understand how your child learns, then we build their confidence and skills around
            it.
          </p>
        </div>
      </section>

      {/* how it works */}
      <section className="sec">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">How it works</span>
            <h2>How we&apos;ll work together.</h2>
            <p>A simple, pressure-free path from first hello to real progress for your child.</p>
          </div>
          <div className="process">
            {process.map(({ num, title, body }, i) => (
              <Fragment key={title}>
                <div className="pstep reveal in">
                  <div className="pnum">{num}</div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
                {i < process.length - 1 && (
                  <div className="parrow" aria-hidden="true">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M4 12h15M13 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* quotes */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">In their words</span>
            <h2>What parents say.</h2>
          </div>
          <div className="quotes">
            {quotes.map(({ quote, who }) => (
              <Reveal key={who} className="quote">
                <p>&ldquo;{quote}&rdquo;</p>
                <div className="who">{who}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* dusk band: Moore testimonial */}
      <section className="sec dusk-band">
        <div className="wrap">
          <span className="eyebrow">A grandparent&apos;s words</span>
          <h2 style={{ maxWidth: '26ch' }}>From struggling to read, to the A honor roll.</h2>
          <p style={{ fontSize: 20, fontStyle: 'italic', fontFamily: "'Fraunces',serif", maxWidth: '70ch' }}>
            &ldquo;When we hired Kaitlin to tutor our granddaughter, she was struggling in 1st
            grade and couldn&apos;t read or write properly. Within a few weeks, Kaitlin taught her
            word sounds, writing, and math, and she knew exactly how to teach a child with
            dyslexia. Within a year she was reading over 100 words a minute, excelled in all her
            classes, and made the A honor roll. Kaitlin is like family to us, and we&apos;re so
            grateful she came into our lives.&rdquo;
          </p>
          <p style={{ marginTop: 18, fontWeight: 700, color: 'var(--teal-light)' }}>
            Mr. and Mrs. Moore <span style={{ fontWeight: 400, color: '#C9DAD5' }}>&middot; grandparents of a student</span>
          </p>
          <div className="dusk-cta">
            <Link to="/#contact" className="btn btn-solid">
              Book a free intro call
            </Link>
          </div>
        </div>
      </section>

      <Footer heading="Every child deserves to feel capable.">
        Let&apos;s help yours see what they&apos;re good at, and grow from there.
      </Footer>
    </>
  )
}

export default Kids
