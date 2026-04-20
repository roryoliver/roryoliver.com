"use client";

import { useState, FormEvent } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("https://formspree.io/f/mqeggnrd", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
          placeholder="Your name"
        />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
          placeholder="you@company.com"
        />
      </div>
      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          required
          value={formData.message}
          onChange={(e) => setFormData((f) => ({ ...f, message: e.target.value }))}
          placeholder="Tell me about your project…"
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={status === "sending"}
        style={{ justifyContent: "center" }}
      >
        {status === "sending" ? "Sending…" : "Send message"}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {status === "success" && (
        <div className="submit-success">Message sent. I&apos;ll be in touch shortly.</div>
      )}
      {status === "error" && (
        <div className="submit-error">
          Something went wrong. Try again or reach out on{" "}
          <a href="https://linkedin.com/in/roryoliver" target="_blank" rel="noopener noreferrer">LinkedIn</a>.
        </div>
      )}
    </form>
  );
}
