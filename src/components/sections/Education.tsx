import React, { useRef } from "react";
import SectionHeader from "../SectionHeader";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Education() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      tl.from(".edu-box", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      }).from(
        ".edu-cert",
        {
          x: -20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.15,
          ease: "power2.out",
        },
        "-=0.4",
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 md:py-20 px-6 md:px-12 flex flex-col justify-center"
      id="education"
    >
      <SectionHeader
        tag="EDUCATION"
        title="Education"
        subtitle="Academic background & certifications"
      />
      <div className="w-full max-w-5xl font-mono relative mx-auto">
        <div className="flex flex-col lg:flex-row gap-5 items-stretch mt-4 relative z-10 mb-8">
          <div className="edu-box flex-1 cyber-border border border-green-900/50 bg-[var(--card-bg)] p-6 md:p-10 pt-12 relative shadow-[inset_0_0_50px_rgba(0,255,65,0.05)]">
            <div className="absolute top-0 right-0 bg-green-500/20 text-green-400 border-b border-l border-green-500/40 px-3 py-1 text-[10px] md:text-xs tracking-widest">
              STATUS: IN_PROGRESS
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
              &gt; University of Wollongong in Dubai
            </h2>
            <div className="text-green-400 text-sm mb-4">
              Bachelor of Computer Science, Specializing in Cybersecurity
            </div>
            <div className="text-slate-400 text-xs md:text-sm bg-slate-900 border border-slate-700 px-3 py-1 inline-block">
              [ APR 2025 - APR 2028 ] | Dubai, UAE
            </div>
          </div>

          <div className="edu-box flex-1 cyber-border border border-green-900/50 bg-[var(--card-bg)] p-6 md:p-10 relative">
            <h2 className="text-green-400 mb-6 border-b border-green-900/50 pb-2 text-sm md:text-base">
              # PROFESSIONAL_CERTIFICATIONS
            </h2>
            <ul className="space-y-4 text-slate-300 text-sm md:text-base">
              <li className="edu-cert flex items-center gap-3">
                <span className="text-green-500">[*]</span>
                Google Cybersecurity Professional Certificate
              </li>
              <li className="edu-cert flex items-center gap-3">
                <span className="text-green-500">[*]</span>
                Meta Front-End Developer Professional Certificate
              </li>
              <li className="edu-cert flex items-center gap-3">
                <span className="text-green-500">[*]</span>
                Microsoft Python Development Professional Certificate
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
