"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ParticleField from "@/components/ParticleField";
import ContactForm from "@/components/ContactForm";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] },
  }),
};

const engagements = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    title: "AI Readiness Audit",
    tagline: "Cut through the hype.",
    description: "A structured assessment that maps your workflows, identifies where AI will genuinely deliver ROI, and produces a prioritised implementation roadmap — not a slide deck full of buzzwords.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "CTO Strategy Day",
    tagline: "One day. Full clarity.",
    description: "A facilitated strategy session with your leadership team that produces a written technology strategy, prioritised roadmap, and 90-day action plan — aligned to your commercial goals.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-5.1m0 0L11.42 5.07m-5.1 5.1H21M3 3v18" />
      </svg>
    ),
    title: "Tech Health Check",
    tagline: "Clear diagnosis. Clear priorities.",
    description: "A 360-degree review of your technology estate — infrastructure, security, code quality, development practices, and vendor landscape — scored, assessed, and delivered with a prioritised action plan.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Cyber Security Review",
    tagline: "Know where you\u2019re exposed.",
    description: "A structured assessment of your security posture — access controls, data protection, infrastructure, application security, and incident readiness — with a prioritised remediation plan.",
  },
];

const steps = [
  {
    number: "01",
    title: "Discovery call",
    description: "30 minutes. Free. We establish where the real pain is.",
  },
  {
    number: "02",
    title: "Diagnostic",
    description: "A structured audit or strategy session — clear picture, clear plan.",
  },
  {
    number: "03",
    title: "Retained engagement",
    description: "Outcome-focused. Structured around your goals, pace, and priorities.",
  },
];

const outcomes = [
  "Rebuilt GPNotebook.com — now used by 75%+ of active UK GPs monthly",
  "Led AI strategy from experimentation to production across an organisation",
  "Achieved 99.9% platform uptime after inheriting a failing technology estate",
  "Established enterprise-grade InfoSec in a regulated health environment",
  "Digital product delivery for KFC, BMW, Samsung, Uber, Shell",
  "Led a £5m IKEA digital loyalty programme (IKEA Family UK)",
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  return (
    <div ref={containerRef} className="relative">
      {/* Background layers */}
      <div className="mesh-gradient" />
      <ParticleField />

      {/* ─── HERO ─── */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center"
      >
        {/* Status badge */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          <span className="text-zinc-400">
            Available for new engagements
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="max-w-4xl text-5xl font-bold leading-[1.1] tracking-tight sm:text-7xl md:text-8xl"
        >
          <span className="gradient-text glow-text">Fractional CTO</span>
          <br />
          <span className="text-white">for growing businesses</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="mt-6 max-w-xl text-lg text-zinc-400 leading-relaxed sm:text-xl"
        >
          Senior technology leadership on a flexible, fractional basis —
          aligned directly to your commercial outcomes.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <a
            href="#contact"
            className="group relative inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-accent)] px-8 py-3.5 font-semibold text-white transition-all hover:bg-[var(--color-accent-light)] hover:shadow-[0_0_30px_var(--color-accent-glow)]"
          >
            Book a discovery call
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </a>
          <a
            href="https://linkedin.com/in/roryoliver"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-3.5 font-semibold text-zinc-300 transition-all hover:border-[var(--color-border-hover)] hover:text-white"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-zinc-600"
          >
            <span className="text-xs font-mono uppercase tracking-widest">
              Scroll
            </span>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
              />
            </svg>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ─── FRACTIONAL CTO (CORE OFFERING) ─── */}
      <section className="relative z-10 px-6 py-32">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <p className="mb-3 text-sm font-mono uppercase tracking-widest text-white/70">
              What I do
            </p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              The technology leadership your business needs.
              <br />
              <span className="gradient-text">Without the full-time cost.</span>
            </h2>
          </motion.div>

          {/* Fractional CTO — description card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="gradient-border mb-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 sm:p-10 transition-all hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border-hover)]"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent-light)]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>
            </div>
            <h3 className="mb-3 text-2xl font-bold text-white">
              Fractional CTO
            </h3>
            <p className="text-base leading-relaxed text-white">
              Strategic and technical leadership exactly when it matters — without the cost, commitment, or distraction of a full-time hire. I embed as part of your team, present in standups, architecture decisions, and board-level conversations. Engaged around outcomes, not a clock.
            </p>
          </motion.div>

          {/* What you get — separate card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="gradient-border mb-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 sm:p-10 transition-all hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border-hover)]"
          >
            <p className="mb-5 font-mono text-sm uppercase tracking-widest text-white/70">
              What you get
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Technology strategy & commercial roadmap",
                "Web application & digital product development",
                "AI strategy, LLM integration & automation",
                "Platform architecture & cloud infrastructure",
                "Team building & engineering leadership",
                "Information security, compliance & governance",
                "M&A technical due diligence",
                "Product management & agile delivery",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className="text-sm text-white">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── STANDALONE ENGAGEMENTS ─── */}
      <section className="relative z-10 px-6 pb-32">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <p className="mb-3 text-sm font-mono uppercase tracking-widest text-white/70">
              Start small — scale fast
            </p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Focused engagements. Clear deliverables.
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-zinc-400">
              Not ready for an ongoing engagement? These standalone services give you senior-level clarity on the areas that matter most — with no retainers and no ongoing commitment.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2">
            {engagements.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="gradient-border group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7 transition-all hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border-hover)] hover:shadow-[0_0_40px_rgba(124,58,237,0.08)]"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent-light)] transition-colors group-hover:bg-[var(--color-accent)]/20">
                  {service.icon}
                </div>
                <h3 className="mb-1 text-lg font-semibold text-white">
                  {service.title}
                </h3>
                <p className="mb-3 text-sm font-medium text-white/70">
                  {service.tagline}
                </p>
                <p className="text-sm leading-relaxed text-zinc-400">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <p className="mb-3 text-sm font-mono uppercase tracking-widest text-white/70">
              How it works
            </p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Simple. Structured. No surprises.
            </h2>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="text-center sm:text-left"
              >
                <span className="mb-3 block text-3xl font-bold font-mono text-[var(--color-accent)] opacity-40">
                  {step.number}
                </span>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section className="relative z-10 px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--color-accent)]" />
            <span className="text-sm font-mono uppercase tracking-widest text-white/70">
              About
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--color-accent)]" />
          </div>
          <p className="text-xl leading-relaxed text-zinc-300 sm:text-2xl">
            I&apos;m <span className="text-white font-semibold">Rory Oliver</span> — a
            technology leader with 20+ years of experience across enterprise and
            high-growth environments. I&apos;ve built platforms used by 75% of UK GPs,
            led digital product delivery for brands like BMW, Samsung, KFC, and Uber,
            and founded a startup that floated on a US exchange.
          </p>
          <p className="mt-6 text-base text-zinc-500 leading-relaxed">
            I work with SMEs scaling fast, MedComms and HealthTech companies navigating
            regulation, marketing agencies managing complex technology stacks, and
            PE-backed businesses going through post-acquisition integration. I don&apos;t
            deliver generic frameworks — I bring deep, hands-on experience to your
            specific context.
          </p>
        </motion.div>
      </section>

      {/* ─── RECENT OUTCOMES ─── */}
      <section className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <p className="mb-3 text-sm font-mono uppercase tracking-widest text-white/70">
              Track record
            </p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Recent outcomes
            </h2>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {outcomes.map((outcome, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all hover:border-[var(--color-border-hover)]"
              >
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <p className="text-sm leading-relaxed text-zinc-300">
                  {outcome}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHO I WORK WITH ─── */}
      <section className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <p className="mb-3 text-sm font-mono uppercase tracking-widest text-white/70">
              Who I work with
            </p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Businesses that need senior oversight, not another agency.
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "SMEs scaling fast", desc: "Tech-enabled businesses (£1m–£20m) without senior technical oversight" },
              { label: "MedComms & HealthTech", desc: "Regulated health environments needing secure, compliant platforms" },
              { label: "Marketing Agencies", desc: "Agencies navigating AI, data platforms, and martech complexity" },
              { label: "PE-backed businesses", desc: "M&A due diligence and post-acquisition platform integration" },
            ].map((client, i) => (
              <motion.div
                key={client.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="text-center"
              >
                <h3 className="mb-2 text-base font-semibold text-white">{client.label}</h3>
                <p className="text-sm leading-relaxed text-zinc-500">{client.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section id="contact" className="relative z-10 px-6 py-32">
        <div className="mx-auto max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-10 text-center">
              <p className="mb-3 text-sm font-mono uppercase tracking-widest text-white/70">
                Get in touch
              </p>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Ready to talk?
              </h2>
              <p className="mt-4 text-zinc-400">
                Book a free 30-minute discovery call — no pitch, no obligation. I typically respond within 24 hours.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
              <ContactForm />
            </div>

            <p className="mt-6 text-center text-sm text-zinc-600">
              Or connect with me on{" "}
              <a
                href="https://linkedin.com/in/roryoliver"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-accent-light)] hover:text-[var(--color-accent)] transition-colors"
              >
                LinkedIn
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="relative z-10 border-t border-[var(--color-border)] px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="font-mono text-sm text-zinc-600">
            &copy; {new Date().getFullYear()} Rory Oliver
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://linkedin.com/in/roryoliver"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 transition-colors hover:text-[var(--color-accent-light)]"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
