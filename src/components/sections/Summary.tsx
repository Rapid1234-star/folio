import React, { useRef } from "react";
import SectionHeader from "../SectionHeader";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Summary() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      tl.from(".summary-box", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      })
        .from(
          ".summary-text p",
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.2,
            ease: "power2.out",
          },
          "-=0.4",
        )
        .from(
          ".metric-card",
          {
            scale: 0.8,
            opacity: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: "back.out(1.7)",
          },
          "-=0.2",
        );

      // Counter animation
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
          duration: 2,
          ease: "power2.out",
          onUpdate() {
            counter.textContent = Math.round(obj.val) + suffix;
          },
        });
      });
    },
    { scope: sectionRef },
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
      <div className="summary-box w-full max-w-5xl cyber-border bg-[var(--card-bg)] p-6 md:p-10 relative overflow-visible mx-auto">
        {/* Accent Bar */}
        <div className="absolute top-0 right-0 w-32 h-1 bg-green-500/20"></div>
        <div className="absolute top-0 right-0 w-1 h-32 bg-green-500/20"></div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 mt-6 relative z-10">
          <div className="summary-text flex-[2] space-y-6 text-[var(--text-main)] text-sm md:text-base leading-relaxed">
            <p>
              <span className="text-white font-bold">
                &gt; Analyzing candidate profile...
              </span>
              <br />
              Cybersecurity-focused Computer Science student and QA Automation
              Engineer with hands-on experience building large-scale Playwright
              test suites, production web systems, and AI-driven automation
              pipelines.
            </p>
            <p>
              <span className="text-white font-bold">
                &gt; Extracting key capabilities...
              </span>
              <br />
              Skilled at engineering authentication workarounds, validating
              endpoint remediation at scale, and shipping full-stack
              applications from React/Node.js frontends to Python-based computer
              vision systems.
            </p>
            <p>
              <span className="text-white font-bold">
                &gt; Decoding personal profile...
              </span>
              <br />
              Beyond the terminal, I'm deeply passionate about the intersection
              of human psychology and digital security. I spend my free time
              participating in CTF challenges, exploring the latest in zero-day
              vulnerabilities, and optimizing system architectures for maximum
              resilience.
            </p>
          </div>

          {/* Metric cards - 2-col grid on mobile/tablet, stacked column on lg+ */}
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="metric-card border border-green-900/50 bg-[var(--card-bg)] p-5 text-center group hover:border-green-500/50 hover:-translate-y-1 transition-all">
              <div
                className="text-green-500 font-bold text-3xl md:text-4xl mb-1 metric-counter"
                data-target="650"
                data-suffix="+"
              >
                0
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest group-hover:text-green-400 transition-colors">
                Tests Written
              </div>
            </div>
            <div className="metric-card border border-green-900/50 bg-[var(--card-bg)] p-5 text-center group hover:border-green-500/50 hover:-translate-y-1 transition-all">
              <div
                className="text-green-500 font-bold text-3xl md:text-4xl mb-1 metric-counter"
                data-target="5"
              >
                0
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest group-hover:text-green-400 transition-colors">
                Projects Shipped
              </div>
            </div>
            <div className="metric-card border border-green-900/50 bg-[var(--card-bg)] p-5 text-center group hover:border-green-500/50 hover:-translate-y-1 transition-all">
              <div
                className="text-green-500 font-bold text-3xl md:text-4xl mb-1 metric-counter"
                data-target="3"
              >
                0
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest group-hover:text-green-400 transition-colors">
                Certifications
              </div>
            </div>
            <div className="metric-card border border-green-900/50 bg-[var(--card-bg)] p-5 text-center group hover:border-green-500/50 hover:-translate-y-1 transition-all">
              <div
                className="text-green-500 font-bold text-3xl md:text-4xl mb-1 metric-counter"
                data-target="100"
                data-suffix="%"
              >
                0
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest group-hover:text-green-400 transition-colors">
                System Uptime
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 mt-6 border-t border-green-900/50 pt-4 relative z-10">
          [PROCESS COMPLETED IN 0.043s]
        </div>
      </div>
    </section>
  );
}
