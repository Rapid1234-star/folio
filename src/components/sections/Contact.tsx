import React, { useRef } from "react";
import SectionHeader from "../SectionHeader";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, Github, Linkedin, Phone, Download } from "lucide-react";
import { useMagnetic } from "../../hooks/useMagnetic";
import { useReducedMotion } from "../../hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const magneticRef = useMagnetic<HTMLAnchorElement>(0.28);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(".contact-box", {
        y: 24,
        opacity: 0,
        duration: 0.65,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 md:py-24 px-6 md:px-12 flex flex-col justify-center"
      id="contact"
    >
      <SectionHeader
        tag="CONTACT"
        title="Establish Link"
        subtitle="Open a channel — hiring, collabs, or just saying hi"
      />

      <div className="contact-box w-full max-w-5xl cyber-border glass-panel p-6 md:p-10 mx-auto relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[var(--accent)]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-16 w-56 h-56 rounded-full bg-[var(--accent-cyan)]/8 blur-3xl pointer-events-none" />

        <p className="relative z-10 text-[var(--text-muted)] text-sm md:text-base max-w-2xl mb-8 leading-relaxed">
          <span className="text-white font-bold">&gt; Ready to connect...</span>
          <br />
          Looking for a QA automation engineer who thinks like an attacker and
          ships like a builder? Let&apos;s talk.
        </p>

        <div className="relative z-10 flex flex-wrap gap-3 mb-8">
          <a
            ref={magneticRef}
            href="mailto:aayanirshad99@gmail.com?subject=Let's%20Connect%20|%20Portfolio"
            className="will-change-transform inline-flex items-center gap-2 min-h-11 px-6 py-3 bg-[var(--accent)] text-black font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_24px_rgba(0,255,136,0.3)]"
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
            [ SEND_EMAIL ]
          </a>
          <a
            href="/aayan_cv.pdf"
            download
            className="inline-flex items-center gap-2 min-h-11 px-5 py-3 border border-[var(--accent)] text-[var(--accent)] font-bold text-xs uppercase tracking-widest hover:bg-[var(--accent)] hover:text-black transition-all bg-black/40"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            [ DOWNLOAD_CV ]
          </a>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              href: "tel:+971561235034",
              icon: Phone,
              label: "TEL",
              value: "+971-56-123-5034",
            },
            {
              href: "mailto:aayanirshad99@gmail.com",
              icon: Mail,
              label: "EMAIL",
              value: "aayanirshad99@gmail.com",
            },
            {
              href: "https://github.com/Rapid1234-star",
              icon: Github,
              label: "GITHUB",
              value: "Rapid1234-star",
              external: true,
            },
            {
              href: "https://linkedin.com/in/aayan-desai",
              icon: Linkedin,
              label: "LINKEDIN",
              value: "aayan-desai",
              external: true,
            },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              {...(item.external
                ? { target: "_blank", rel: "noreferrer" }
                : {})}
              className="flex items-center gap-3 border border-[var(--border-soft)] bg-black/40 px-4 py-3 min-h-11 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors group"
            >
              <item.icon
                className="w-4 h-4 text-[var(--accent)]/70 group-hover:text-[var(--accent)] shrink-0"
                aria-hidden="true"
              />
              <span className="text-[10px] text-slate-500 tracking-widest uppercase shrink-0">
                {item.label}
              </span>
              <span
                className={`text-xs md:text-sm text-slate-300 group-hover:text-[var(--accent)] min-w-0 ${
                  item.label === "EMAIL" ? "break-all" : "truncate"
                }`}
              >
                {item.value}
              </span>
            </a>
          ))}
        </div>

        <div className="relative z-10 text-[10px] text-slate-600 mt-6 border-t border-[var(--border-soft)] pt-3 font-mono">
          CHANNEL_OPEN · TRACE_OS · AES-256-GCM
        </div>
      </div>
    </section>
  );
}
