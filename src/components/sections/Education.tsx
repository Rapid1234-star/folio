import React, { useRef } from "react";
import SectionHeader from "../SectionHeader";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../../hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function Education() {
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

      tl.from(".edu-box", {
        y: 16,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      }).from(
        ".edu-cert",
        {
          y: 8,
          opacity: 0,
          duration: 0.35,
          stagger: 0.08,
          ease: "power2.out",
        },
        "-=0.2",
      );
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 md:py-24 px-6 md:px-12 flex flex-col justify-center"
      id="education"
    >
      <SectionHeader
        tag="EDUCATION"
        title="Education"
        subtitle="Academic background & certifications"
      />
      <div className="w-full max-w-5xl font-mono relative mx-auto">
        <div className="flex flex-col lg:flex-row gap-5 items-stretch mt-4 relative z-10 mb-8">
          <div className="edu-box flex-1 cyber-border glass-panel p-6 md:p-10 pt-12 relative">
            <div className="absolute top-0 right-0 bg-[var(--accent)]/20 text-[var(--accent)] border-b border-l border-[var(--accent)]/40 px-3 py-1 text-[10px] md:text-xs tracking-widest">
              STATUS: IN_PROGRESS
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
              &gt; University of Wollongong in Dubai
            </h3>
            <div className="text-[var(--accent)] text-sm mb-4">
              Bachelor of Computer Science, Specializing in Cybersecurity
            </div>
            <div className="text-slate-400 text-xs md:text-sm bg-black/50 border border-slate-700 px-3 py-1 inline-block">
              [ APR 2025 - APR 2028 ] | Dubai, UAE
            </div>
          </div>

          <div className="edu-box flex-1 cyber-border glass-panel p-6 md:p-10 relative">
            <h3 className="text-[var(--accent)] mb-6 border-b border-[var(--border-soft)] pb-2 text-sm md:text-base">
              # PROFESSIONAL_CERTIFICATIONS
            </h3>
            <ul className="space-y-4 text-slate-300 text-sm md:text-base">
              {[
                {
                  href: "https://www.coursera.org/account/accomplishments/professional-cert/BC7C1BZCZ780",
                  label: "Google Cybersecurity Professional Certificate",
                },
                {
                  href: "https://www.coursera.org/account/accomplishments/professional-cert/L9U93KKVJ6D4",
                  label: "Meta Front-End Developer Professional Certificate",
                },
                {
                  href: "https://www.coursera.org/account/accomplishments/professional-cert/T20FSGC6EJ4T",
                  label: "Microsoft Python Development Professional Certificate",
                },
              ].map((c) => (
                <li key={c.href} className="edu-cert flex items-center gap-3">
                  <span className="text-[var(--accent)] shrink-0">[*]</span>
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center min-h-11 py-2 hover:text-[var(--accent)] transition-colors underline decoration-[var(--border-soft)] hover:decoration-[var(--accent)]/50"
                  >
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
