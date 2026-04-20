"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import ParticleField from "@/components/ParticleField";
import ContactForm from "@/components/ContactForm";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.2, 0.6, 0.2, 1] as [number, number, number, number] },
  }),
};

const engagements = [
  {
    kicker: "5 BUSINESS DAYS",
    title: "AI Readiness Audit",
    tag: "Cut through the hype. Know exactly where AI will deliver ROI — not a slide deck full of buzzwords.",
    price: "from £1,200",
    mark: (
      <svg className="mark" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth={1.5} />
        <circle cx="24" cy="24" r="12" stroke="currentColor" strokeWidth={1.5} />
        <circle cx="24" cy="24" r="4" fill="#3B6FE3" />
      </svg>
    ),
  },
  {
    kicker: "ONE DAY",
    title: "CTO Strategy Day",
    tag: "One day. Full clarity. A written technology roadmap and 90-day action plan, aligned to your commercial goals.",
    price: "£2,000",
    mark: (
      <svg className="mark" viewBox="0 0 48 48" fill="none">
        <path d="M6 42 L42 42" stroke="currentColor" strokeWidth={1.5} />
        <path d="M6 42 L6 8" stroke="currentColor" strokeWidth={1.5} />
        <path d="M12 34 L20 34 L20 26 L28 26 L28 18 L36 18 L36 10" stroke="currentColor" strokeWidth={1.5} fill="none" />
        <circle cx="36" cy="10" r={2.4} fill="#3B6FE3" />
      </svg>
    ),
  },
  {
    kicker: "5 BUSINESS DAYS",
    title: "Tech Health Check",
    tag: "A 360-degree review — infrastructure, security, code quality, practices, vendors — scored and prioritised.",
    price: "from £1,500",
    mark: (
      <svg className="mark" viewBox="0 0 48 48" fill="none">
        <rect x="6" y="28" width="6" height="14" stroke="currentColor" strokeWidth={1.5} />
        <rect x="16" y="20" width="6" height="22" stroke="currentColor" strokeWidth={1.5} />
        <rect x="26" y="12" width="6" height="30" stroke="currentColor" strokeWidth={1.5} />
        <rect x="36" y="22" width="6" height="20" stroke="currentColor" strokeWidth={1.5} />
        <line x1="6" y1="42" x2="42" y2="42" stroke="currentColor" strokeWidth={1.5} />
        <path d="M36 8 L39 11 L42 5" stroke="#3B6FE3" strokeWidth={1.5} strokeLinecap="square" fill="none" />
      </svg>
    ),
  },
  {
    kicker: "5 BUSINESS DAYS",
    title: "Cyber Security Review",
    tag: "Know where you're exposed. A structured posture assessment with a prioritised remediation plan.",
    price: "from £1,500",
    mark: (
      <svg className="mark" viewBox="0 0 48 48" fill="none">
        <path d="M24 4 C13 4 8 11 8 20 L8 40 C8 42 10 44 12 44 L36 44 C38 44 40 42 40 40 L40 20 C40 11 35 4 24 4 Z" stroke="currentColor" strokeWidth={1.5} fill="none" />
        <line x1="14" y1="20" x2="34" y2="20" stroke="currentColor" strokeWidth={1.5} />
        <circle cx="24" cy="30" r={2.4} fill="#3B6FE3" />
        <line x1="24" y1="32" x2="24" y2="38" stroke="#3B6FE3" strokeWidth={1.5} />
      </svg>
    ),
  },
];

const whatYouGet = [
  "Technology strategy & commercial roadmap",
  "Web application & digital product development",
  "AI strategy, LLM integration & automation",
  "Platform architecture & cloud infrastructure",
  "Team building & engineering leadership",
  "Information security, compliance & governance",
  "M&A technical due diligence",
  "Product management & agile delivery",
];

const steps = [
  { n: "01", title: "Discovery call", desc: "30 minutes. Free. We establish where the real pain is." },
  { n: "02", title: "Diagnostic", desc: "A structured audit or strategy session — clear picture, clear plan." },
  { n: "03", title: "Retained engagement", desc: "Outcome-focused. Structured around your goals, pace, and priorities." },
];

const outcomes = [
  "Rebuilt GPNotebook.com — now used by 75%+ of active UK GPs monthly.",
  "Led AI strategy from experimentation to production across an organisation.",
  "Achieved 99.9% platform uptime after inheriting a failing technology estate.",
  "Established enterprise-grade InfoSec in a regulated health environment.",
  "Digital product delivery for Google, Novo Nordisk, KFC, BMW, Samsung, and IKEA.",
  "Led a £5m IKEA digital loyalty programme (IKEA Family UK).",
];

const audiences = [
  { label: "SMEs scaling fast", desc: "Tech-enabled businesses (£1m–£20m) without senior technical oversight." },
  { label: "MedComms & HealthTech", desc: "Regulated health environments needing secure, compliant platforms." },
  { label: "Marketing Agencies", desc: "Agencies navigating AI, data platforms, and martech complexity." },
  { label: "PE-backed businesses", desc: "M&A due diligence and post-acquisition platform integration." },
];

const tickIcon = (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M4 13 L10 19 L20 5" stroke="currentColor" strokeWidth={2.6} strokeLinecap="square" />
  </svg>
);

const arrowRight = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const cardArrow = (
  <svg className="arrow" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" />
  </svg>
);

function CardSpotlight({ children }: { children: React.ReactNode }) {
  return (
    <a
      className="card"
      href="#contact"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
        e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
      }}
    >
      {children}
    </a>
  );
}

export default function Home() {
  useEffect(() => {
    const nav = document.getElementById("nav");
    if (!nav) return;
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Atmosphere */}
      <div className="mesh" aria-hidden="true" />
      <div className="grid-bg" aria-hidden="true" />
      <ParticleField />
      <div className="grain" aria-hidden="true" />

      {/* NAV */}
      <nav className="nav" id="nav">
        <div className="wm">
          Rory Oliver
          <span className="t">
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <path d="M4 13 L10 19 L20 5" stroke="currentColor" strokeWidth={2.6} strokeLinecap="square" />
            </svg>
          </span>
        </div>
        <ul>
          <li><a href="#services">Services</a></li>
          <li><a href="#process">Process</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      <main>
        {/* HERO */}
        <header className="hero">
          <div className="container">
            <motion.span variants={fadeUp} initial="hidden" animate="visible" custom={0} className="pill">
              <span className="dot" />
              Available for new engagements
            </motion.span>
            <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}>
              Fractional CTO <span className="accent">for growing businesses.</span>
            </motion.h1>
            <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2} className="lead">
              Senior technology leadership on a flexible, fractional basis — aligned directly to your commercial outcomes.
            </motion.p>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} className="cta-row">
              <a href="#contact" className="btn btn-primary">
                Book a discovery call
                {arrowRight}
              </a>
              <a href="#services" className="btn btn-secondary">See services</a>
            </motion.div>
          </div>
        </header>

        {/* SERVICES */}
        <section className="section" id="services">
          <div className="container">
            <div className="section-intro">
              <span className="kicker">What I do</span>
              <h2>Senior judgement. Applied where <span className="accent">it matters.</span></h2>
              <p>A full-time CTO costs £150k+. Most growing businesses don&apos;t need one full-time — they need senior technical judgement, applied precisely when and where it matters.</p>
            </div>

            <div className="callout">
              <div>
                <svg className="mark" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth={1.5} strokeDasharray="4 6" />
                  <circle cx="24" cy="24" r="5" fill="#3B6FE3" />
                  <circle cx="42" cy="24" r="2" fill="currentColor" />
                </svg>
                <h3>Fractional CTO</h3>
                <p>Strategic and technical leadership exactly when it matters — without the cost, commitment, or distraction of a full-time hire. I embed as part of your team, present in standups, architecture decisions, and board-level conversations. Engaged around outcomes, not a clock.</p>
              </div>
              <div className="what-grid">
                <span className="label-mono">What you get</span>
                {whatYouGet.map((item) => (
                  <div key={item} className="what-item">{item}</div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 88 }}>
              <div style={{ marginBottom: 40 }}>
                <span className="kicker">Start small — scale fast</span>
                <h2 style={{ fontSize: 32, marginTop: 14 }}>Focused engagements. Clear deliverables.</h2>
              </div>
              <div className="cards">
                {engagements.map((e) => (
                  <CardSpotlight key={e.title}>
                    <div className="k">{e.kicker}</div>
                    {e.mark}
                    <h3>{e.title}</h3>
                    <p className="tag">{e.tag}</p>
                    <div className="foot">
                      <span className="price">{e.price}</span>
                      {cardArrow}
                    </div>
                  </CardSpotlight>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="section" id="process">
          <div className="container">
            <div className="section-intro">
              <span className="kicker">How it works</span>
              <h2>Simple. Structured. <span className="accent">No surprises.</span></h2>
            </div>
            <div className="steps">
              {steps.map((s) => (
                <div key={s.n} className="step">
                  <div className="n">{s.n} {tickIcon}</div>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OUTCOMES */}
        <section className="section">
          <div className="container">
            <div className="section-intro">
              <span className="kicker">Track record</span>
              <h2>Recent outcomes.</h2>
            </div>
            <div className="outcomes">
              {outcomes.map((o) => (
                <div key={o} className="outcome">{o}</div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="about" id="about">
          <div className="container">
            <span className="kicker">About</span>
            <h2>I&apos;m <strong>Rory Oliver</strong> — a technology leader with 20+ years across enterprise and high-growth environments.</h2>
            <p className="bio">I&apos;ve built platforms used by 75% of UK GPs, led digital product delivery for brands like Google, Novo Nordisk, KFC, BMW, Samsung, and IKEA, and founded a startup that floated on a US exchange. I work with SMEs scaling fast, MedComms and HealthTech companies navigating regulation, marketing agencies managing complex technology stacks, and PE-backed businesses going through post-acquisition integration. I don&apos;t deliver generic frameworks — I bring deep, hands-on experience to your specific context.</p>
          </div>
        </section>

        {/* AUDIENCES */}
        <section className="section">
          <div className="container">
            <div className="section-intro">
              <span className="kicker">Who I work with</span>
              <h2>Businesses that need senior oversight, <span className="accent">not another agency.</span></h2>
            </div>
            <div className="audiences">
              {audiences.map((a) => (
                <div key={a.label} className="aud">
                  <h4>{a.label}</h4>
                  <p>{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="section" id="contact">
          <div className="container">
            <div className="section-intro">
              <span className="kicker">Get in touch</span>
              <h2>Ready to talk?</h2>
              <p>Book a free 30-minute discovery call — no pitch, no obligation. I typically respond within 24 hours.</p>
            </div>
            <div style={{ maxWidth: 520 }}>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container foot-wrap">
          <div className="wm">
            © {new Date().getFullYear()} Rory Oliver
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none">
              <path d="M4 13 L10 19 L20 5" stroke="currentColor" strokeWidth={3} strokeLinecap="square" />
            </svg>
          </div>
          <div className="links">
            <a href="https://linkedin.com/in/roryoliver" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </footer>
    </>
  );
}
