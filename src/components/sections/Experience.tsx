import React, { useRef } from "react";
import SectionHeader from "../SectionHeader";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      tl.from(".exp-box", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      })
        .from(
          ".exp-header",
          { y: 20, opacity: 0, duration: 0.5, ease: "power2.out" },
          "-=0.4",
        )
        .from(
          ".exp-metric",
          {
            scale: 0.8,
            opacity: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: "back.out(1.7)",
          },
          "-=0.2",
        )
        .from(
          ".exp-bullet",
          {
            x: -20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.15,
            ease: "power2.out",
          },
          "-=0.2",
        )
        .from(".exp-tags", { opacity: 0, duration: 0.5 }, "-=0.2");

      // Counter animation for metrics
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
      className="relative w-full py-16 md:py-20 px-6 md:px-12 flex flex-col justify-center"
      id="experience"
    >
      <SectionHeader
        tag="EXPERIENCE"
        title="Experience"
        subtitle="Professional work history"
      />
      <div className="w-full max-w-5xl font-mono relative mx-auto">
        <div className="exp-box cyber-border bg-[var(--card-bg)] p-6 md:p-10 relative mt-4 overflow-hidden">
          <div className="flex flex-col md:flex-row gap-8 relative z-10">
            {/* Left Column */}
            <div className="flex-[2] flex flex-col">
              <div className="exp-header mb-6 pb-6 border-b border-green-500/30">
                <h2 className="text-xl md:text-3xl font-bold text-white mb-2">
                  &gt; QA & Automation Intern
                </h2>
                <div className="text-green-400 text-sm md:text-base">
                  @ Patchifi <span className="text-slate-600 px-2">|</span>{" "}
                  Remote <span className="text-slate-600 px-2">|</span>{" "}
                  Cybersecurity
                </div>
                <div className="text-slate-400 text-xs mt-3 bg-slate-900 border border-slate-700 px-3 py-1 inline-block w-fit">
                  [ APR 2026 - SEPT 2026 ]
                </div>
              </div>

              {/* Prominent Metric Callouts */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="exp-metric border border-green-500/20 bg-green-900/10 p-4 flex flex-col items-center justify-center">
                  <span
                    className="text-3xl font-bold text-green-500 exp-counter"
                    data-target="650"
                    data-suffix="+"
                  >
                    0
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
                    Tests Written
                  </span>
                </div>
                <div className="exp-metric border border-green-500/20 bg-green-900/10 p-4 flex flex-col items-center justify-center">
                  <span
                    className="text-3xl font-bold text-green-500 exp-counter"
                    data-target="8"
                  >
                    0
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
                    Platform Modules
                  </span>
                </div>
                <div className="exp-metric border border-green-500/20 bg-green-900/10 p-4 flex flex-col items-center justify-center">
                  <span
                    className="text-3xl font-bold text-green-500 exp-counter"
                    data-target="22"
                  >
                    0
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
                    Endpoint Scripts
                  </span>
                </div>
                <div className="exp-metric border border-green-500/20 bg-green-900/10 p-4 flex flex-col items-center justify-center">
                  <span
                    className="text-3xl font-bold text-green-500 exp-counter"
                    data-target="10"
                  >
                    0
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
                    Auto Pitches
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex-[3] space-y-4 text-sm md:text-base text-[var(--text-main)]">
              <div className="exp-bullet flex gap-4 items-start bg-black/40 p-4 border-l-2 border-green-500/50 hover:border-green-500 transition-colors">
                <span className="text-green-500 shrink-0 mt-0.5">[*]</span>
                <p>
                  <strong className="text-white">
                    Test Engineering & Authentication:
                  </strong>{" "}
                  Built and maintained 650+ automated Playwright test cases
                  across 8 core platform modules (Dashboard, Access Control,
                  Patch Center, and more), and engineered a custom
                  OTP-polling/session-reuse workflow enabling 550+ tests to run
                  under one authenticated session — eliminating redundant OTP
                  requests and cutting regression runtime.
                </p>
              </div>
              <div className="exp-bullet flex gap-4 items-start bg-green-900/10 p-4 border-l-2 border-green-500/20 hover:border-green-500 transition-colors">
                <span className="text-green-500 shrink-0 mt-0.5">[*]</span>
                <p>
                  <strong className="text-white">Workflow Automation:</strong>{" "}
                  Designed and deployed an n8n + AI pipeline that auto-publishes
                  company blog content to LinkedIn, then pitched 10 additional
                  automation opportunities directly to the CEO.
                </p>
              </div>
              <div className="exp-bullet flex gap-4 items-start bg-black/40 p-4 border-l-2 border-green-500/50 hover:border-green-500 transition-colors">
                <span className="text-green-500 shrink-0 mt-0.5">[*]</span>
                <p>
                  <strong className="text-white">
                    Endpoint & Systems Testing:
                  </strong>{" "}
                  Validated 22 endpoint remediation scripts (14 disable-update,
                  8 update) for Chrome, Edge, Firefox, and Dropbox via Azure
                  Bastion, verifying Windows Registry policies, services, and
                  scheduled tasks across virtual machines.
                </p>
              </div>
              <div className="exp-bullet flex gap-4 items-start bg-green-900/10 p-4 border-l-2 border-green-500/20 hover:border-green-500 transition-colors">
                <span className="text-green-500 shrink-0 mt-0.5">[*]</span>
                <p>
                  <strong className="text-white">
                    Web QA & Production Maintenance:
                  </strong>{" "}
                  Led a full desktop/mobile QA audit of the production Wix site,
                  logging defects in a screenshot-backed tracker, then resolved
                  UI issues and configured email-gated download forms.
                </p>
              </div>
            </div>
          </div>

          <div className="exp-tags mt-8 pt-6 border-t border-green-900 flex flex-wrap gap-2 text-xs items-center relative z-10">
            <span className="text-slate-500 mr-2 py-1">
              DEPENDENCIES_LOADED:
            </span>
            {[
              "Playwright",
              "JavaScript/TypeScript",
              "n8n",
              "Wix",
              "Azure Bastion",
              "Windows Registry",
              "Excel",
            ].map((tool, i) => (
              <span
                key={i}
                className="bg-green-500/10 text-green-400 border border-green-500/30 px-3 py-1.5 font-bold hover:bg-green-500 hover:text-black transition-colors"
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
