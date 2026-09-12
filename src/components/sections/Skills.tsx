import React, { useRef } from "react";
import SectionHeader from "../SectionHeader";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const skills = [
  {
    name: "JavaScript",
    icon: "devicon-javascript-plain",
    color: "#f7df1e",
    tag: "Language",
  },
  {
    name: "Python",
    icon: "devicon-python-plain",
    color: "#3776ab",
    tag: "Language",
  },
  {
    name: "TypeScript",
    icon: "devicon-typescript-plain",
    color: "#3178c6",
    tag: "Language",
  },
  {
    name: "React",
    icon: "devicon-react-original",
    color: "#61dafb",
    tag: "Framework",
  },
  {
    name: "Node.js",
    icon: "devicon-nodejs-plain",
    color: "#68a063",
    tag: "Runtime",
  },
  {
    name: "Tailwind CSS",
    icon: "devicon-tailwindcss-plain",
    color: "#38bdf8",
    tag: "Framework",
  },
  {
    name: "HTML5",
    icon: "devicon-html5-plain",
    color: "#e34f26",
    tag: "Markup",
  },
  { name: "CSS3", icon: "devicon-css3-plain", color: "#1572b6", tag: "Styles" },
  { name: "Playwright", icon: "", color: "#22d3ee", tag: "Automation" },
  { name: "Git", icon: "devicon-git-plain", color: "#f05032", tag: "Version Control" },
  { name: "MySQL", icon: "devicon-mysql-plain", color: "#4479a1", tag: "Database" },
  { name: "Azure", icon: "devicon-azure-plain", color: "#0078d4", tag: "Cloud" },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".skills-logo-card",
        { y: 30, opacity: 0 },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.06,
          ease: "power3.out",
          onComplete() {
            // Hover glow effect
            document.querySelectorAll('.skills-logo-card').forEach((card) => {
              const el = card as HTMLElement;
              el.addEventListener('mouseenter', () => {
                const icon = el.querySelector('i, span') as HTMLElement;
                if (icon) gsap.to(icon, { scale: 1.18, duration: 0.2, ease: 'back.out(1.5)' });
              });
              el.addEventListener('mouseleave', () => {
                const icon = el.querySelector('i, span') as HTMLElement;
                if (icon) gsap.to(icon, { scale: 1, duration: 0.2, ease: 'power2.out' });
              });
            });
          }
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 md:py-20 px-6 md:px-12 flex flex-col justify-center"
      id="skills"
    >
      <SectionHeader
        tag="SYSTEM_CAPABILITIES"
        title="Skills"
        subtitle="Core technologies & frameworks"
      />
      <div className="w-full max-w-5xl font-mono relative mx-auto">
        <div className="cyber-border glass-panel p-6 md:p-10 pt-10 mt-4 relative z-10">
          <div className="grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {skills.map((skill, idx) => (
              <div
                key={idx}
                className="skills-logo-card flex items-center gap-3 p-3 md:p-4 border border-[var(--border-soft)] bg-black/40 hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5 hover:-translate-y-0.5 transition-all duration-200 cursor-default group"
              >
                {skill.icon ? (
                  <i
                    className={`${skill.icon} text-2xl md:text-3xl w-8 text-center shrink-0`}
                    style={{ color: skill.color }}
                  ></i>
                ) : (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 shrink-0"
                    style={{
                      color: skill.color,
                      background: `${skill.color}15`,
                      border: `1px solid ${skill.color}40`,
                    }}
                  >
                    PW
                  </span>
                )}
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-white text-xs md:text-sm font-semibold truncate">
                    {skill.name}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                    {skill.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
