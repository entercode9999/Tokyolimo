import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowUpRight,
  Check,
  Clock3,
  MapPin,
  Menu,
  Plus,
  ShieldCheck,
  Star,
  X,
} from 'lucide-react';
import './index.css';

type QuoteFields = {
  name: string;
  email: string;
  service: string;
  date: string;
  passengers: string;
  notes: string;
};

const initialQuote: QuoteFields = {
  name: '',
  email: '',
  service: 'Airport transfer',
  date: '',
  passengers: '1–3 guests',
  notes: '',
};

const services = [
  {
    index: '01 / ARRIVE',
    title: 'Airport transfers',
    copy: 'Haneda and Narita, met with a name board and a quiet ride into the city.',
  },
  {
    index: '02 / MOVE',
    title: 'Business travel',
    copy: 'A composed mobile office for executives, assistants and visiting teams.',
  },
  {
    index: '03 / MARK',
    title: 'Weddings & events',
    copy: 'Precise arrivals, discreet coordination and room for the people who matter.',
  },
  {
    index: '04 / STAY',
    title: 'Hourly charter',
    copy: 'Keep a dedicated car close for meetings, shopping, dinners or a full day out.',
  },
  {
    index: '05 / SEE',
    title: 'Tours & groups',
    copy: 'From Tokyo to Hakone, travel farther with a Sprinter for the whole party.',
  },
];

const fleetOptions = {
  executive: {
    title: 'Executive sedan',
    copy: 'For one to three guests who value a quiet cabin, generous legroom and an unhurried arrival.',
    capacity: '1–3 guests',
    luggage: '2 large cases',
  },
  firstclass: {
    title: 'First-class MPV',
    copy: 'A private lounge on the move. Ideal for families, principals and airport days with more luggage.',
    capacity: '1–5 guests',
    luggage: '4 large cases',
  },
  group: {
    title: 'Sprinter group',
    copy: 'Keep the conversation together. A spacious, polished solution for teams, weddings and tours.',
    capacity: '6–13 guests',
    luggage: 'Up to 13 cases',
  },
};

const faqs = [
  ['How far in advance should I book?', 'For airport and city transfers, 24 hours is usually enough. For weddings, events and multi-day itineraries, we recommend securing your vehicle two to four weeks ahead.'],
  ['Do you monitor my flight?', 'Yes. Share your flight number in the quote notes and our operations team will track the arrival, adjust the pickup timing and be ready when you are.'],
  ['What is included in the quoted fare?', 'Your quoted fare includes the vehicle, professional chauffeur, fuel, tolls on the agreed route and a 15-minute arrival wait. There are no surprise surcharges.'],
  ['Can you arrange child seats or meet-and-greet?', 'Absolutely. Tell us what you need in the notes field and we will confirm the right child seat, name board or terminal meeting point with your itinerary.'],
];

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('is-visible');
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

function Brand() {
  return (
    <a href="#top" className="brand" data-testid="link-brand">
      <span className="brand-mark"><span>T</span></span>
      <span className="brand-copy">
        <span className="brand-name">TOKYO LIMO</span>
        <span className="brand-tagline">private transportation</span>
      </span>
    </a>
  );
}

function Navigation() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const links = [
    ['Services', '#services'],
    ['Fleet', '#fleet'],
    ['Our standard', '#standard'],
    ['FAQ', '#faq'],
  ];
  return (
    <nav className={`nav ${open ? 'is-open' : ''}`} aria-label="Main navigation">
      <Brand />
      <div className="nav-links">
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={close} data-testid={`link-nav-${label.toLowerCase().replace(' ', '-')}`}>{label}</a>
        ))}
      </div>
      <div className="nav-contact">
        <a className="nav-phone" href="tel:+81300000000" data-testid="link-nav-phone">+81 3 0000 0000</a>
        <a className="button primary" href="#quote" onClick={close} data-testid="link-nav-quote">Request a quote <ArrowUpRight size={14} /></a>
        <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} data-testid="button-mobile-menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </nav>
  );
}

function QuoteForm() {
  const [fields, setFields] = useState<QuoteFields>(initialQuote);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const update = (key: keyof QuoteFields, value: string) => setFields((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fields.name.trim() || !fields.email.trim() || !fields.date) {
      setError('Please add your name, email and preferred date.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(fields.email)) {
      setError('Please check the email address and try again.');
      return;
    }
    setError('');
    setSubmitted(true);
  };
  return (
    <div className="quick-quote" id="quote">
      {!submitted ? (
        <>
          <div className="quick-quote-head">
            <h2>Plan the ride.</h2>
            <span className="quote-number">TL / 001</span>
          </div>
          <form onSubmit={submit} noValidate>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="quote-name">Your name</label>
                <input id="quote-name" value={fields.name} onChange={(e) => update('name', e.target.value)} placeholder="First and last name" data-testid="input-quote-name" />
              </div>
              <div className="field">
                <label htmlFor="quote-email">Email</label>
                <input id="quote-email" type="email" value={fields.email} onChange={(e) => update('email', e.target.value)} placeholder="you@company.com" data-testid="input-quote-email" />
              </div>
              <div className="field full">
                <label htmlFor="quote-service">Service</label>
                <select id="quote-service" value={fields.service} onChange={(e) => update('service', e.target.value)} data-testid="select-quote-service">
                  <option>Airport transfer</option>
                  <option>Corporate travel</option>
                  <option>Wedding or event</option>
                  <option>Hourly charter</option>
                  <option>Tour or group travel</option>
                  <option>City-to-city transfer</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="quote-date">Preferred date</label>
                <input id="quote-date" type="date" value={fields.date} onChange={(e) => update('date', e.target.value)} data-testid="input-quote-date" />
              </div>
              <div className="field">
                <label htmlFor="quote-passengers">Party size</label>
                <select id="quote-passengers" value={fields.passengers} onChange={(e) => update('passengers', e.target.value)} data-testid="select-quote-passengers">
                  <option>1–3 guests</option><option>4–5 guests</option><option>6–13 guests</option><option>14+ guests</option>
                </select>
              </div>
              <div className="field full">
                <label htmlFor="quote-notes">Anything we should know? <span>(optional)</span></label>
                <textarea id="quote-notes" value={fields.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Flight number, stops, luggage, timing..." data-testid="textarea-quote-notes" />
              </div>
            </div>
            {error && <p className="form-error" role="alert" data-testid="status-quote-error">{error}</p>}
            <button className="button dark" type="submit" data-testid="button-submit-quote">Get my exact quote <ArrowUpRight size={14} /></button>
            <p className="form-note">No obligation · We reply within one business hour</p>
          </form>
        </>
      ) : (
        <div className="success" role="status" data-testid="status-quote-success">
          <div className="success-icon"><Check size={22} /></div>
          <h3>We have your route.</h3>
          <p>Thank you, {fields.name.split(' ')[0]}. A Tokyo Limo coordinator will reply to {fields.email} shortly with availability and a clear, all-in quote.</p>
          <button className="button dark" onClick={() => { setSubmitted(false); setFields(initialQuote); }} data-testid="button-new-quote">Start another request</button>
        </div>
      )}
    </div>
  );
}

function ServiceCard({ service, index }: { service: typeof services[number]; index: number }) {
  return (
    <article className="service-card" data-testid={`card-service-${index + 1}`}>
      <span className="service-index">{service.index}</span>
      <ArrowUpRight className="service-arrow" size={20} />
      <h3>{service.title}</h3>
      <p>{service.copy}</p>
    </article>
  );
}

function Fleet() {
  const [active, setActive] = useState<keyof typeof fleetOptions>('executive');
  const vehicle = fleetOptions[active];
  return (
    <section className="fleet section-pad" id="fleet">
      <div className="container">
        <Reveal className="fleet-top">
          <div>
            <span className="eyebrow">The fleet / 03</span>
            <h2 className="display">Quietly capable.</h2>
          </div>
          <div className="fleet-tabs" role="tablist" aria-label="Fleet types">
            {(Object.keys(fleetOptions) as Array<keyof typeof fleetOptions>).map((key) => (
              <button className={`fleet-tab ${active === key ? 'active' : ''}`} key={key} onClick={() => setActive(key)} role="tab" aria-selected={active === key} data-testid={`button-fleet-${key}`}>
                {key === 'firstclass' ? 'MPV' : key}
              </button>
            ))}
          </div>
        </Reveal>
        <Reveal>
          <div className="fleet-content" data-testid="panel-fleet-details">
            <div className="fleet-visual" aria-label={`${vehicle.title} vehicle illustration`}>
              <div className="fleet-car" />
            </div>
            <div className="fleet-spec">
              <span className="eyebrow light">Selected vehicle</span>
              <h3 className="display">{vehicle.title}</h3>
              <p>{vehicle.copy}</p>
              <div className="specs">
                <div><span>Capacity</span><strong>{vehicle.capacity}</strong></div>
                <div><span>Luggage</span><strong>{vehicle.luggage}</strong></div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FAQ() {
  const [active, setActive] = useState(0);
  return (
    <section className="faq section-pad" id="faq">
      <div className="container faq-layout">
        <Reveal>
          <span className="eyebrow">Good to know / 06</span>
          <h2 className="display">The small<br />assurances.</h2>
        </Reveal>
        <Reveal className="faq-list">
          {faqs.map(([question, answer], index) => {
            const isOpen = active === index;
            return (
              <div className="faq-item" key={question}>
                <button className={`faq-question ${isOpen ? 'open' : ''}`} onClick={() => setActive(isOpen ? -1 : index)} aria-expanded={isOpen} data-testid={`button-faq-${index + 1}`}>
                  <span>{question}</span><Plus size={18} />
                </button>
                {isOpen && <div className="faq-answer" data-testid={`text-faq-answer-${index + 1}`}>{answer}</div>}
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

function App() {
  return (
    <main className="site" id="top">
      <section className="hero">
        <img className="hero-image" src={`${import.meta.env.BASE_URL}images/tokyo-limo-hero.jpg`} alt="Black executive sedan on a rain-lit Tokyo street at night" />
        <div className="hero-shade" />
        <div className="noise" />
        <div className="container">
          <Navigation />
          <div className="hero-content">
            <div className="hero-copy">
              <span className="eyebrow light">Tokyo · Haneda · Narita · 24/7</span>
              <h1 className="display">Arrive<br /><em>assured.</em></h1>
              <p>Private transportation for people who plan carefully. A calm, punctual chauffeur service across Tokyo and beyond.</p>
              <div className="hero-actions">
                <a className="button primary" href="#quote" data-testid="link-hero-quote">Request a quote <ArrowUpRight size={14} /></a>
                <a className="button ghost" href="#services" data-testid="link-hero-services">Explore services</a>
              </div>
              <div className="hero-meta">
                <span><strong>24 / 7</strong>Tokyo operations</span>
                <span><strong>Flat rate</strong>No surprises</span>
                <span><strong>EN · JA</strong>Bilingual support</span>
              </div>
            </div>
            <div className="hero-form-wrap">
              <QuoteForm />
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Tokyo Limo standards">
        <div className="container trust-inner">
          <div className="trust-lead">A better way<br />through Tokyo.</div>
          <div className="trust-item"><Clock3 size={20} /><span>Always on time<br />down to the minute</span></div>
          <div className="trust-item"><ShieldCheck size={20} /><span>Clear rates<br />before you ride</span></div>
          <div className="trust-item"><Star size={20} /><span>Local expertise<br />international ease</span></div>
        </div>
      </section>

      <section className="intro section-pad" id="standard">
        <div className="container intro-grid">
          <Reveal className="section-kicker">
            <span className="eyebrow">Our standard / 01</span>
            <span className="jp">静かに、正確に。</span>
          </Reveal>
          <Reveal className="intro-copy">
            <h2 className="display">The city moves quickly.<br /><em>We don't have to.</em></h2>
            <p>Tokyo Limo is a private car service built around the details that make a journey feel effortless: a clean cabin, a driver who knows the back streets, and a plan that holds even when the day changes.</p>
            <div className="intro-rule" />
          </Reveal>
        </div>
      </section>

      <section className="services section-pad" id="services">
        <div className="container">
          <Reveal className="service-heading">
            <div>
              <span className="eyebrow light">One service / many reasons</span>
              <h2 className="display">Wherever the day<br />takes you.</h2>
            </div>
            <p>From a first arrival at Haneda to the last guest leaving your reception, we make the in-between feel considered.</p>
          </Reveal>
          <Reveal className="service-grid">
            {services.map((service, index) => <ServiceCard key={service.title} service={service} index={index} />)}
          </Reveal>
        </div>
      </section>

      <section className="quote-band section-pad">
        <div className="container quote-layout">
          <Reveal>
            <span className="eyebrow">The Tokyo Limo promise / 02</span>
            <h2 className="display">A clear plan<br /><em>feels good.</em></h2>
            <p>Your quote is built around your actual itinerary, not a meter. See the fare, vehicle and timing before you commit — then let us handle the road.</p>
            <ul className="quote-list">
              <li><Check size={16} />Flat-rate pricing, agreed in advance</li>
              <li><Check size={16} />Complimentary flight monitoring</li>
              <li><Check size={16} />A real person on call, day or night</li>
            </ul>
            <a className="button dark" href="#quote" data-testid="link-promise-quote">Build my itinerary <ArrowUpRight size={14} /></a>
          </Reveal>
          <Reveal className="quote-stamp">
            <div className="quote-stamp-inner"><div><strong>0</strong><span>surprises<br />in your fare</span></div></div>
          </Reveal>
        </div>
      </section>

      <Fleet />

      <section className="airport section-pad">
        <div className="container airport-layout">
          <Reveal>
            <span className="eyebrow light">From runway to ryokan</span>
            <h2 className="display">Your first hour<br />in Tokyo, handled.</h2>
          </Reveal>
          <Reveal>
            <p>Meet us at Haneda or Narita. We watch the flight, guide the luggage and take the city at your pace.</p>
            <a className="button ghost" href="#quote" data-testid="link-airport-quote">Arrange airport pickup <ArrowUpRight size={14} /></a>
          </Reveal>
        </div>
      </section>

      <section className="process section-pad">
        <div className="container">
          <Reveal className="process-heading">
            <div><span className="eyebrow">How it works / 04</span><h2 className="display">Simple by design.</h2></div>
            <p>No app to learn. No queue to join. Just one thoughtful conversation, followed by a service that remembers the details.</p>
          </Reveal>
          <Reveal className="process-grid">
            <div className="process-step"><span className="step-num">01</span><h3 className="display">Tell us the plan.</h3><p>Send your route, timing and the little details that matter to you.</p></div>
            <div className="process-step"><span className="step-num">02</span><h3 className="display">We make it clear.</h3><p>Receive a precise quote and a considered vehicle recommendation.</p></div>
            <div className="process-step"><span className="step-num">03</span><h3 className="display">Enjoy the quiet.</h3><p>Your chauffeur arrives early, prepared and ready to adapt.</p></div>
          </Reveal>
        </div>
      </section>

      <section className="testimonial section-pad">
        <div className="container testimonial-layout">
          <Reveal><div className="testimonial-mark">“</div><span className="eyebrow light">A note from the road</span></Reveal>
          <Reveal>
            <blockquote>“The rare service that makes a complicated Tokyo week feel like it has more hours in it.”</blockquote>
            <cite>— Elena M. · Executive assistant, London</cite>
          </Reveal>
        </div>
      </section>

      <FAQ />

      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-intro">
              <Brand />
              <h2 className="display">Take the<br />scenic route.</h2>
              <p>Private chauffeur service for Tokyo, its airports and the places worth going a little farther for.</p>
            </div>
            <div className="footer-col"><h3>Explore</h3><a href="#services" data-testid="link-footer-services">Services</a><a href="#fleet" data-testid="link-footer-fleet">Fleet</a><a href="#standard" data-testid="link-footer-standard">Our standard</a><a href="#faq" data-testid="link-footer-faq">FAQ</a></div>
            <div className="footer-col"><h3>Reach us</h3><a href="tel:+81300000000" data-testid="link-footer-phone">+81 3 0000 0000</a><a href="mailto:hello@tokyolimo.jp" data-testid="link-footer-email">hello@tokyolimo.jp</a><p>Editable contact details<br />Tokyo, Japan</p></div>
            <div className="footer-col"><h3>Service area</h3><p><MapPin size={13} /> Tokyo 23 wards</p><p>Haneda · Narita</p><p>Yokohama · Hakone</p><p>City-to-city on request</p></div>
          </div>
          <div className="footer-bottom"><span>© 2025 Tokyo Limo. Private transportation, thoughtfully arranged.</span><span>正確さ · 静けさ · 信頼</span></div>
        </div>
      </footer>
    </main>
  );
}

export default App;