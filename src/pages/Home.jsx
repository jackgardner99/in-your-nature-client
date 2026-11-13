import { Fragment, useState } from 'react'
import { Link } from 'react-router'
import Footer from '../components/Footer.jsx'
import Quiz from '../components/Quiz.jsx'
import Reveal from '../components/Reveal.jsx'
import Testimonials from '../components/Testimonials.jsx'
import { testimonials } from '../data/testimonials.js'
import { FORMSPREE_ENDPOINT } from '../data/site.js'

const SITE_URL = 'https://getinyournature.com'

const SEO_DESCRIPTION =
  'Career coaching, confidence coaching, public speaking, and kids & teens coaching in Hendersonville and Nashville, TN, and online. Find your purpose, true calling, ideal job, and natural gifts. Book a free intro call.'

const SEO_KEYWORDS =
  'career coach near me, career coaching Nashville, confidence coach Hendersonville TN, confidence coaching near me, public speaking coach Nashville, life coach Middle Tennessee, find my purpose, true calling, ideal job, discover my gifts and talents, find my strengths, destiny, kids confidence coach near me, confidence coaching for kids, public speaking for kids and teens, reading and learning support, learning blueprint, teen coaching Nashville'

const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['ProfessionalService', 'LocalBusiness'],
  '@id': `${SITE_URL}/#business`,
  name: 'In Your Nature',
  description:
    'Career coaching, confidence coaching, and public speaking coaching to help you find your purpose, true calling, ideal job, and natural gifts and talents. For adults, kids, and teens. Based in Hendersonville, TN, serving Nashville and Middle Tennessee, and online.',
  url: `${SITE_URL}/`,
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Hendersonville',
    addressRegion: 'TN',
    addressCountry: 'US',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 36.3048, longitude: -86.62 },
  areaServed: [
    { '@type': 'City', name: 'Hendersonville, TN' },
    { '@type': 'City', name: 'Nashville, TN' },
    { '@type': 'City', name: 'Gallatin, TN' },
    { '@type': 'City', name: 'Goodlettsville, TN' },
    { '@type': 'City', name: 'Mount Juliet, TN' },
    { '@type': 'City', name: 'Madison, TN' },
    { '@type': 'AdministrativeArea', name: 'Sumner County, TN' },
    { '@type': 'AdministrativeArea', name: 'Middle Tennessee' },
  ],
  availableChannel: {
    '@type': 'ServiceChannel',
    serviceLocation: { '@type': 'Place', name: 'Online (video) coaching, available anywhere' },
  },
  knowsAbout: [
    'career coaching',
    'career coach near me',
    'job search',
    'finding your ideal job',
    'finding your purpose',
    'true calling',
    'confidence coaching',
    'confidence coach near me',
    'public speaking coach',
    'discovering your gifts and talents',
    'kids confidence coaching',
    'kids confidence coach near me',
    'public speaking for kids',
    'reading and learning support',
    'life coach Nashville',
  ],
  makesOffer: [
    'Career Coaching & Job Search',
    'Find Your Purpose & True Calling',
    'Confidence Coaching',
    'Public Speaking Coaching',
    'Kids & Teens Coaching & Learning Blueprint',
  ].map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
}

// All five quotes show here, including the Moores' (also featured in the kids & teens band above).
const homeTestimonials = testimonials

const steps = [
  {
    title: 'We talk',
    body: "A free, unhurried call to hear what lights you up and what you're reaching for.",
  },
  {
    title: 'You fill out the questionnaire',
    body: "A set of honest questions that show me how you're truly wired.",
  },
  {
    title: 'I build your Blueprint',
    body: 'I create your personal Blueprint, and we talk through it together.',
  },
  {
    title: 'I coach you through the change',
    body: 'We turn it into real change in your work, your confidence, and your life.',
  },
]

const services = [
  {
    key: 'find your path',
    title: 'Career Coaching & Job Search',
    body: 'One-on-one career coaching to find your ideal job, clarify your direction, and move through a job search with a plan that actually fits who you are.',
  },
  {
    key: 'meaning',
    title: 'Find Your Purpose & True Calling',
    body: "Get clear on your purpose, your calling, and the direction you're meant for, so your work and your life finally point the same way.",
  },
  {
    key: 'self-belief',
    title: 'Confidence Coaching',
    body: 'Build real, steady confidence: speak up, own your strengths, and stop shrinking in the rooms and moments that matter most.',
  },
  {
    key: 'speak with ease',
    title: 'Public Speaking Coaching',
    body: 'Present, pitch, and speak in public with calm and presence, for talks, interviews, meetings, and the everyday moments that count.',
  },
  {
    key: 'discover them',
    title: 'Discover Your Gifts & Talents',
    body: 'Through your Blueprint, uncover the natural gifts and talents you overlook because they come easily, and learn exactly how to use them.',
  },
  {
    key: 'for young people',
    title: 'Kids & Teens Coaching',
    body: 'Confidence, public speaking, reading, and learning support for kids and teens, plus a parent-friendly Learning Blueprint that shows how your child learns best.',
    link: true,
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
    body: "Your top five careers that truly match who you are, the kind of path that fits you (traditional or non-traditional), and the roles that would quietly drain you no matter the pay.",
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
        {status === 'sending' ? 'Sending…' : 'Request my free call'}
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
      <title>
        Career &amp; Confidence Coaching in Hendersonville &amp; Nashville, TN | In Your Nature
      </title>
      <meta name="description" content={SEO_DESCRIPTION} />
      <meta name="keywords" content={SEO_KEYWORDS} />
      <meta name="geo.region" content="US-TN" />
      <meta name="geo.placename" content="Hendersonville, Nashville, Tennessee" />
      <link rel="canonical" href={`${SITE_URL}/`} />
      <meta name="robots" content="index, follow" />
      <meta property="og:type" content="website" />
      <meta
        property="og:title"
        content="In Your Nature | Career Coaching, Confidence &amp; Public Speaking"
      />
      <meta
        property="og:description"
        content="Find your purpose, your true calling, and your ideal job. Career, confidence, and public speaking coaching for adults, kids, and teens."
      />
      <meta property="og:url" content={`${SITE_URL}/`} />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_SCHEMA) }}
      />

      <header className="hero">
        <div className="hero-orbs" aria-hidden="true">
          <span className="orb orb-grad"></span>
          <span className="orb orb-grad2"></span>
        </div>
        <div className="wrap hero-in">
          <div className="hero-copy">
            <span className="eyebrow">Career &amp; confidence coaching · Public speaking · Purpose</span>
            <h1>
              You already sense there&apos;s more.
              <span className="whisper">let&apos;s find it, together.</span>
            </h1>
            <p className="lead">
              If you feel stuck, low on confidence, or quietly sensing you&apos;re meant for more,
              searching for your purpose, your true calling, or the ideal job that finally fits,
              you&apos;re in the right place. I offer career coaching, confidence coaching, and
              public speaking help, and underneath all of it is one thing: understanding how
              you&apos;re actually wired. Together we name your real gifts and talents, your
              natural rhythm, and the environments where you come alive. I know how much it
              matters, because finding this for myself is what pulled me out of years in work that
              slowly emptied me, and into a life that finally feels like mine.
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
              Map your gifts, your rhythm, and where you belong,{' '}
              <b>and turn that clarity into a life that fits you.</b>
            </p>
            <p className="hero-fine" style={{ marginTop: 8 }}>
              Based in <b>Hendersonville, TN</b>, serving <b>Nashville</b> and Middle Tennessee in
              person, and anyone, anywhere online.
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

      {/* how it works: numbered process with arrows */}
      <section className="sec">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">How we work together</span>
            <h2>Understand yourself first. Everything else follows.</h2>
            <p>
              My approach blends time-tested personality frameworks, which I&apos;ve shaped into
              my own method, with real one on one conversation. Together they map your genuine
              gifts and how you&apos;re wired. We put that into your Blueprint, then adjust your
              real life around it so it finally works for you.
            </p>
          </div>
          <div className="process">
            {steps.map(({ title, body }, i) => (
              <Fragment key={title}>
                {i > 0 && (
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
                <Reveal className="pstep">
                  <div className="pnum">{i + 1}</div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </Reveal>
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ways I can help */}
      <section className="sec" id="services">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">What I offer</span>
            <h2>Ways I can help</h2>
            <p>
              Whether you&apos;re after a career change, your ideal job, more confidence, or help
              finding your purpose, every path starts the same way: getting clear on who you are
              and the gifts you&apos;re built to use.
            </p>
          </div>
          <div className="facets dark">
            {services.map(({ key, title, body, link }) => (
              <Reveal className="facet" key={title}>
                <div className="fk">{key}</div>
                <h3>{title}</h3>
                <p>
                  {body}
                  {link && (
                    <>
                      {' '}
                      <Link to="/kids">Explore kids &amp; teens &rarr;</Link>
                    </>
                  )}
                </p>
              </Reveal>
            ))}
          </div>
          <p className="blue-note">
            Not sure which fits? Start with a free intro call and we&apos;ll find the right path
            together.
          </p>
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
            It starts with my own questionnaire, which I built from a blend of time-tested
            personality frameworks, together with everything I pick up in our live conversation.
            You never have to learn any of it, and you don&apos;t end with a number or a label.
            You end with your real gifts clearly stated, alongside the facets above, all in plain
            language about you.
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
              Both begin with understanding yourself, and the same free conversation. What changes
              is how much support you want after that: just the insight to run with, or months of
              coaching alongside it.
            </p>
          </div>

          <div className="tiers">
            <Reveal className="tier">
              <div className="tier-name">The Blueprint</div>
              <div className="tier-for">Know yourself</div>
              {/* <div className="tier-price">$500</div> */}
              {/* <div className="tier-pay">Paid in full</div> */}
              <p className="tier-desc">
                The foundation for everything after. A clear, personalized read on who you really
                are, walked through together.
              </p>
              <ul>
                <li>Free intro conversation first</li>
                <li>Your full personalized Blueprint</li>
                <li>One live walkthrough session with me</li>
                <li>Keep-forever report</li>
              </ul>
              <p className="tier-upgrade">
                For a limited time, your full Blueprint fee credits toward the Clarity Program if
                you choose to go deeper.
              </p>
              <Link to="/#contact" className="btn btn-ghost tier-cta">
                Start here
              </Link>
            </Reveal>

            <Reveal className="tier feature">
              <div className="tier-badge">★ Most people start here</div>
              <div className="tier-name">The Clarity Program</div>
              <div className="tier-for">Live it, in the areas that matter most</div>
              {/* <div className="tier-price">$1,500</div> */}
              <p className="tier-desc">
                Everything in the Blueprint, plus three months of coaching to actually live as
                yourself, in your days, your relationships, and your direction.
              </p>
              <ul>
                <li>
                  <b>Everything in The Blueprint</b>
                </li>
                <li>3 months of coaching, a session every two weeks</li>
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
                <li>Between-session email support</li>
              </ul>
              <Link to="/#contact" className="btn btn-solid tier-cta">
                Book a free intro call
              </Link>
            </Reveal>
          </div>

          <div className="brand-guarantee">
            <b>My promise, on every path:</b> I&apos;m committed to your clarity. If you don&apos;t
            feel it after your first session, we&apos;ll keep working until you do, at no extra
            cost. I won&apos;t leave you without what you came for.
          </div>

          <p className="tiers-note">
            Not sure which fits? Take the quiz above, or just book a free call and we&apos;ll
            figure it out together.
          </p>
        </div>
      </section>

      {/* kids & teens band */}
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="promo-split">
            <div>
              <span className="eyebrow">Kids &amp; teens</span>
              <h2 style={{ fontSize: 'clamp(26px,3.4vw,36px)', margin: '8px 0 12px' }}>
                Yes, I work with kids and teens too.
              </h2>
              <p style={{ color: 'var(--ink-soft)', fontSize: 17, marginBottom: 20, maxWidth: '52ch' }}>
                From confidence and public speaking to reading and learning support, I help young
                people grow into themselves. Parents also get a Learning Blueprint: a clear
                picture of how their child is wired to learn, so you know exactly how to support
                them.
              </p>
              <Link to="/kids" className="btn btn-solid">
                Explore kids &amp; teens coaching
              </Link>
            </div>
            <div className="promo-split-card">
              <p>
                &ldquo;Our granddaughter was struggling in 1st grade. Within a few weeks, Kaitlin
                had her reading. Within a year she was reading over a hundred words a minute and
                on the A honor roll. Kaitlin is like family to us.&rdquo;
              </p>
              <div className="who">
                Mr. and Mrs. Moore <span>&middot; grandparents</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* testimonials */}
      <section className="sec">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">In their words</span>
            <h2>What it&apos;s like to work with me.</h2>
            <p>
              From career clarity and confidence to kids finding their voice, here&apos;s what
              people say.
            </p>
          </div>
          <Testimonials items={homeTestimonials} />
          <div className="cta-center" style={{ marginTop: 34 }}>
            <Link to="/#contact" className="btn btn-solid">
              Ready to see yours? Book a free call
            </Link>
          </div>
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
              if you don&apos;t feel real clarity after your first session, we&apos;ll keep
              working until you do, at no extra cost.
            </p>
            <p style={{ marginTop: 12, fontSize: 16 }}>
              I meet clients in person around <b>Hendersonville and Nashville, TN</b> and across
              Middle Tennessee, and work with people everywhere over video. So whether you&apos;re
              searching for a career coach, a confidence coach, or a kids confidence coach near
              you, let&apos;s talk.
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
