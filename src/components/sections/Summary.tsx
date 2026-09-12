import React, { useRef } from "react";
import SectionHeader from "../SectionHeader";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../../hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function Summary() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      tl.from(".summary-box", {
        y: 28,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      })
        .from(
          ".summary-text p",
          {
            y: 14,
            opacity: 0,
            duration: 0.45,
            stagger: 0.12,
            ease: "power2.out",
          },
          "-=0.35",
        )
        .from(
          ".metric-card",
          {
            y: 12,
            opacity: 0,
            duration: 0.4,
            stagger: 0.08,
            ease: "back.out(1.4)",
          },
          "-=0.2",
        );

      const counters = gsap.utils.toArray<HTMLElement>(".metric-counter");
      counters.forEach((counter) => {
        const target = parseFloat(counter.getAttribute("data-target") || "0");
        const suffix = counter.getAttribute("data-suffix") || "";
        const obj = { val: 0 };
        gsap.to(obj, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
          val: target,
          duration: 1.8,
          ease: "power2.out",
          onUpdate() {
            counter.textContent = Math.round(obj.val) + suffix;
          },
        });
      });
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full flex flex-col justify-center px-6 md:px-12 py-16 md:py-20"
      id="summary"
    >
      <SectionHeader
        tag="ABOUT_ME"
        title="About Me"
        subtitle="Candidate profile analysis complete"
      />
      <div className="summary-box w-full max-w-5xl cyber-border glass-panel p-6 md:p-10 relative overflow-visible mx-auto">
        <div className="absolute top-0 right-0 w-32 h-1 bg-[var(--accent)]/25" />
        <div className="absolute top-0 right-0 w-1 h-32 bg-[var(--accent)]/25" />

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 mt-6 relative z-10">
          <div className="summary-text flex-[2] space-y-6 text-[var(--text-main)] text-sm md:text-base leading-relaxed">
            <p>
              <span className="text-white font-bold">
                &gt; Analyzing candidate profile...
              </span>
              <br />
              I&apos;m the person who finds the bugs before your users do. QA
              isn&apos;t just my job — it&apos;s how my brain works. I see broken
              flows the way most people see scenery. Every button, every edge
              case, every race condition — it&apos;s all a puzzle waiting to be
              solved.
            </p>
            <p>
              <span className="text-white font-bold">
                &gt; Extracting key capabilities...
              </span>
              <br />
              I build systems that break gracefully and recover even better.
              From Playwright suites catching 650+ edge cases to full-stack apps
              deployed in the wild — I ship code I&apos;d trust with my own data.
              Automation isn&apos;t about replacing humans; it&apos;s about
              freeing them to focus on what actually matters.
            </p>
            <p>
              <span className="text-white font-bold">
                &gt; Decoding personal profile...
              </span>
              <br />
              CTF challenges are my weekend entertainment. I believe the best
              security isn&apos;t built in firewalls — it&apos;s built in the
              mindset of the people using the system. That&apos;s why I study
              both the code and the human behind the keyboard.
            </p>
          </div>

          <div className="flex-1 grid grid-cols-2 lg:grid-cols-1 gap-4">
            {[
              { target: "650", suffix: "+", label: "Tests Written" },
              { target: "5", suffix: "", label: "Projects Shipped" },
              { target: "3", suffix: "", label: "Certifications" },
              { target: "100", suffix: "%", label: "System Uptime" },
            ].map((m) => (
              <div
                key={m.label}
                className="metric-card border border-[var(--border-soft)] bg-black/40 p-5 text-center group hover:border-[var(--accent)]/50 hover:-translate-y-1 transition-all duration-200"
              >
                <div
                  className="text-[var(--accent)] font-bold text-3xl md:text-4xl mb-1 metric-counter drop-shadow-[0_0_10px_rgba(0,255,136,0.35)]"
                  data-target={m.target}
                  data-suffix={m.suffix}
                >
                  0
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest group-hover:text-[var(--accent)] transition-colors">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-500 mt-6 border-t border-[var(--border-soft)] pt-4 relative z-10">
          [PROCESS COMPLETED IN 0.043s] · TRACE_R // A.D_
        </div>
      </div>
    </section>
  );
}
