import React, { useEffect, useState } from "react";
import { playHoverSound, playClickSound } from "../utils/sfx";

const sections = [
  { id: "hero", label: "00_ROOT" },
  { id: "summary", label: "01_SUMMARY" },
  { id: "experience", label: "02_EXPERIENCE" },
  { id: "projects", label: "03_PROJECTS" },
  { id: "skills", label: "04_SKILLS" },
  { id: "education", label: "05_EDUCATION" },
  { id: "contact", label: "06_CONTACT" },
];

export default function NavigationDots({
  isTerminalMode,
}: {
  isTerminalMode: boolean;
}) {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    if (isTerminalMode) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3 },
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isTerminalMode]);

  if (isTerminalMode) return null;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="fixed right-6 top-1/2 -translate-y-1/2 z-[70] hidden xl:flex flex-col gap-4 pointer-events-auto items-end"
      role="navigation"
      aria-label="Section navigation"
    >
      {sections.map((sec) => {
        const isActive = activeSection === sec.id;
        return (
          <button
            key={sec.id}
            onMouseEnter={playHoverSound}
            onClick={() => {
              playClickSound();
              scrollTo(sec.id);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                playClickSound();
                scrollTo(sec.id);
              }
            }}
            aria-label={sec.label}
            aria-current={isActive ? "true" : undefined}
            className="group flex items-center gap-3 cursor-pointer bg-transparent border-none outline-none min-h-11"
          >
            <span
              className={`text-xs font-mono tracking-widest font-bold uppercase transition-all duration-300 hidden 2xl:block ${
                isActive
                  ? "text-[var(--accent)] opacity-100 translate-x-0"
                  : "text-[var(--accent)]/25 opacity-0 translate-x-4 group-hover:opacity-50 group-hover:translate-x-0"
              }`}
            >
              {sec.label}
            </span>
            <div className="relative flex items-center justify-center w-3 h-3">
              {isActive && (
                <div className="absolute inset-0 bg-[var(--accent)] rounded-full animate-ping opacity-25" />
              )}
              <div
                className={`w-1.5 h-1.5 transition-all duration-500 ${
                  isActive
                    ? "bg-[var(--accent)] scale-150 shadow-[0_0_10px_#00ff88]"
                    : "bg-[var(--accent)]/30 group-hover:bg-[var(--accent)]/70"
                }`}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
