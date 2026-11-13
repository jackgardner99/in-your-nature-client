import { Fragment } from 'react'
import { Link } from 'react-router'
import Footer from '../components/Footer.jsx'
import KidsQuiz from '../components/KidsQuiz.jsx'
import Reveal from '../components/Reveal.jsx'
import Testimonials from '../components/Testimonials.jsx'
import { testimonials } from '../data/testimonials.js'

const SITE_URL = 'https://getinyournature.com'

const SEO_DESCRIPTION =
  'Kids and teens confidence coaching, public speaking, and reading and learning support in Hendersonville and Nashville, TN, and online. Plus a parent-friendly Learning Blueprint showing how your child learns best. Book a free intro call.'

const SEO_KEYWORDS =
  'kids confidence coach near me, confidence coaching for kids Nashville, child confidence coach Hendersonville TN, public speaking for kids, public speaking for teens, reading help for kids, reading tutor near me, help child learn to read, learning style assessment for kids, how my child learns, teen coach Nashville, learning blueprint, kids coach Middle Tennessee'

const KIDS_SERVICE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Kids & Teens Coaching',
  serviceType: [
    'Kids confidence coaching',
    'Public speaking for kids and teens',
    'Reading and learning support',
    'Learning Blueprint for parents',
  ],
  provider: {
    '@type': ['ProfessionalService', 'LocalBusiness'],
    '@id': `${SITE_URL}/#business`,
    name: 'In Your Nature',
    url: `${SITE_URL}/`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Hendersonville',
      addressRegion: 'TN',
      addressCountry: 'US',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 36.3048, longitude: -86.62 },
  },
  areaServed: [
    { '@type': 'City', name: 'Hendersonville, TN' },
    { '@type': 'City', name: 'Nashville, TN' },
    { '@type': 'City', name: 'Gallatin, TN' },
    { '@type': 'City', name: 'Goodlettsville, TN' },
    { '@type': 'City', name: 'Mount Juliet, TN' },
    { '@type': 'AdministrativeArea', name: 'Sumner County, TN' },
    { '@type': 'AdministrativeArea', name: 'Middle Tennessee' },
  ],
  availableChannel: {
    '@type': 'ServiceChannel',
    serviceLocation: { '@type': 'Place', name: 'Online (video) coaching, available anywhere' },
  },
  description:
    'Kids and teens confidence coaching, public speaking, and reading and learning support in Hendersonville and Nashville, TN, and online, plus a parent-friendly Learning Blueprint showing how a child learns best.',
}

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
    body: 'Concrete, science-based ways to help, grounded in temperament research, executive function, and proven learning strategies.',
  },
]

const process = [
  { num: 1, title: 'We meet for an intro', body: 'A free, relaxed call to hear about your child and what you’re hoping for.' },
  { num: 2, title: 'You fill out the questionnaire', body: 'A few honest questions about your child, about ten minutes.' },
  { num: 3, title: 'I do an activity session with your child', body: 'A short, playful session, in person or online, to see how they learn.' },
  { num: 4, title: 'I coach you through the changes', body: 'We turn the Blueprint into real progress, at a pace that fits your child.' },
]

// Parent quotes, in display order, pulled from the shared testimonials list.
const kidsQuotes = ['The Bartlet family', 'Mr. and Mrs. Moore', 'The Chapmans', 'Tayler', 'Avery'].map((name) =>
  testimonials.find((t) => t.name === name),
)

function Kids() {
  return (
    <>
      <title>
        Kids Confidence Coach &amp; Public Speaking · Hendersonville &amp; Nashville, TN | In
        Your Nature
      </title>
      <meta name="description" content={SEO_DESCRIPTION} />
      <meta name="keywords" content={SEO_KEYWORDS} />
      <link rel="canonical" href={`${SITE_URL}/kids`} />
      <meta name="robots" content="index, follow" />
      <meta name="geo.region" content="US-TN" />
      <meta name="geo.placename" content="Hendersonville, Nashville, Tennessee" />
      <meta property="og:type" content="website" />
      <meta
        property="og:title"
        content="Kids &amp; Teens Coaching | Confidence, Public Speaking &amp; Reading Help"
      />
      <meta
        property="og:description"
        content="Help your child build confidence, find their voice, and love learning. Confidence, public speaking, and reading support, plus a Learning Blueprint for parents."
      />
      <meta property="og:url" content={`${SITE_URL}/kids`} />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(KIDS_SERVICE_SCHEMA) }}
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
              <a href="#quiz" className="btn btn-ghost">
                Take the 1-minute quiz
              </a>
            </div>
            <p className="hero-proof">
              &ldquo;Kaitlin helped our child with public speaking and helped him find the
              confidence in himself to make friends.&rdquo; <span>— The Chapmans</span>
            </p>
            <p className="hero-fine" style={{ marginTop: 14 }}>
              Serving families in <b>Hendersonville &amp; Nashville, TN</b> and across Middle
              Tennessee, plus online anywhere.
            </p>
          </div>
        </div>
      </header>

      {/* services */}
      <section className="sec" id="kids-services">
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
      <section className="sec">
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
      <section className="sec blue-band" id="learning-blueprint">
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
          <p className="blue-lead">
            Built from a parent questionnaire plus a short, playful activity session with your
            child, here&apos;s what&apos;s inside:
          </p>
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
            The Learning Blueprint pairs naturally with coaching or tutoring: first we understand
            how your child learns, then we build their confidence and skills around it.
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
          <div className="process process-sm">
            {process.map(({ num, title, body }, i) => (
              <Fragment key={title}>
                <Reveal className="pstep">
                  <div className="pnum">{num}</div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </Reveal>
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
          <Testimonials items={kidsQuotes} />
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

      {/* find your child's starting point */}
      <section className="sec quiz-band" id="quiz">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Find your child&apos;s starting point</span>
            <h2>Where is your child right now?</h2>
            <p>
              Answer a few quick questions and I&apos;ll send you a personalized read, plus the
              next step I&apos;d recommend for your child. Takes about a minute.
            </p>
          </div>
          <KidsQuiz />
        </div>
      </section>

      {/* contact cta */}
      <section className="sec contact-band">
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: 0 }}>
            <span className="eyebrow">Let&apos;s talk</span>
            <h2>Tell me about your child.</h2>
            <p>
              Book a free, no-pressure intro call and tell me where your child is at and what
              you&apos;re hoping for. Together we&apos;ll figure out whether confidence coaching,
              public speaking, reading and learning support, or a Learning Blueprint is the right
              place to start. If you&apos;ve been searching for a kids confidence coach near you in
              Hendersonville, Nashville, or anywhere in Middle Tennessee, or you&apos;d like to meet
              online, I&apos;d love to help.{' '}
              <Link to="/#contact" style={{ color: 'var(--teal)', fontWeight: 700 }}>
                Book your free call &rarr;
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer
        heading="Every child deserves to feel capable."
        area="Kids & teens coaching in Hendersonville & Nashville, TN, across Middle Tennessee, and online anywhere."
        services="Confidence coaching, public speaking, reading and learning support, and the Learning Blueprint for parents."
        disclaimer="In Your Nature provides coaching, tutoring, and personal-development guidance to support growth and learning. It is not a substitute for licensed therapy, medical, educational, or psychological evaluation. Any suggestions are shared from personal and client experience, not as professional or medical direction."
      >
        Let&apos;s help yours see what they&apos;re good at, and grow from there.
      </Footer>
    </>
  )
}

export default Kids
