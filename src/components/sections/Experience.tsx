import React, { useRef } from "react";
import SectionHeader from "../SectionHeader";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../../hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
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

      tl.from(".exp-box", {
        y: 18,
        opacity: 0,
        duration: 0.55,
        ease: "power2.out",
      })
        .from(
          ".exp-header",
          { y: 12, opacity: 0, duration: 0.4, ease: "power2.out" },
          "-=0.25",
        )
        .from(
          ".exp-metric",
          {
            y: 8,
            opacity: 0,
            duration: 0.35,
            stagger: 0.06,
            ease: "power2.out",
          },
          "-=0.15",
        )
        .from(
          ".exp-bullet",
          {
            y: 10,
            opacity: 0,
            duration: 0.4,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.1",
        )
        .from(".exp-tags", { opacity: 0, duration: 0.4 }, "-=0.15");

      const counters = gsap.utils.toArray<HTMLElement>(".exp-counter");
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
          duration: 1.6,
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
      className="relative w-full py-16 md:py-24 px-6 md:px-12 flex flex-col justify-center"
      id="experience"
    >
      <SectionHeader
        tag="EXPERIENCE"
        title="Experience"
        subtitle="Professional work history"
      />
      <div className="w-full max-w-5xl font-mono relative mx-auto">
        <div className="exp-box cyber-border glass-panel p-6 md:p-10 relative mt-4 overflow-hidden">
          <div className="flex flex-col md:flex-row gap-8 relative z-10">
            <div className="flex-[2] flex flex-col">
              <div className="exp-header mb-6 pb-6 border-b border-[var(--accent)]/30">
                <h3 className="text-xl md:text-3xl font-bold text-white mb-2">
                  &gt; QA & Automation Intern
                </h3>
                <div className="text-[var(--accent)] text-sm md:text-base">
                  @ Patchifi <span className="text-slate-600 px-2">|</span>{" "}
                  Remote <span className="text-slate-600 px-2">|</span>{" "}
                  Cybersecurity
                </div>
                <div className="text-slate-400 text-xs mt-3 bg-black/50 border border-slate-700 px-3 py-1 inline-block w-fit">
                  [ APR 2026 - SEPT 2026 ]
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-2">
                {[
                  { target: "840", suffix: "+", label: "Tests written" },
                  { target: "8", suffix: "", label: "Platform modules" },
                  { target: "22", suffix: "", label: "Endpoint scripts" },
                  { target: "10", suffix: "", label: "Auto pitches" },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="exp-metric border border-[var(--border-soft)] bg-[var(--accent)]/5 p-4 flex flex-col items-center justify-center hover:border-[var(--border-accent)] transition-colors"
                  >
                    <span
                      className="text-2xl md:text-3xl font-semibold text-[var(--accent)] exp-counter font-mono"
                      data-target={m.target}
                      data-suffix={m.suffix}
                    >
                      0
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mt-1 text-center">
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-[3] space-y-3 text-sm md:text-[15px] text-[var(--text-muted)]">
              {[
                {
                  title: "Test engineering & auth",
                  body: "Built and maintained 840+ Playwright cases across 8 modules, plus an OTP-polling / session-reuse flow so 800+ tests run under one session — cutting redundant OTP noise and regression time.",
                },
                {
                  title: "Workflow automation",
                  body: "Shipped an n8n + AI pipeline that publishes blog content to LinkedIn, then pitched 10 more automation opportunities to leadership.",
                },
                {
                  title: "Endpoint & systems testing",
                  body: "Validated 22 remediation scripts across browsers via Azure Bastion — registry policies, services, and scheduled tasks on VMs.",
                },
                {
                  title: "Web QA & production",
                  body: "Led desktop/mobile QA on the production site, tracked defects with screenshots, fixed UI issues, and set up email-gated downloads.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="exp-bullet flex gap-3 items-start bg-black/25 p-4 border-l-2 border-[var(--accent)]/40 hover:border-[var(--accent)] transition-colors"
                >
                  <span
                    className="text-[var(--accent)] shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-[var(--accent)]"
                    aria-hidden="true"
                  />
                  <p>
                    <strong className="text-white font-medium">
                      {item.title}:
                    </strong>{" "}
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="exp-tags mt-8 pt-6 border-t border-[var(--border-soft)] flex flex-wrap gap-2 text-xs items-center relative z-10">
            <span className="text-[var(--text-muted)] mr-1 py-1 font-mono text-[10px] uppercase tracking-wider">
              Stack
            </span>
            {[
              "Playwright",
              "TypeScript",
              "n8n",
              "Wix",
              "Azure Bastion",
              "Windows Registry",
            ].map((tool) => (
              <span
                key={tool}
                className="bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--border-accent)] px-3 py-1.5 font-medium hover:bg-[var(--accent)] hover:text-[#0f172a] transition-colors"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
