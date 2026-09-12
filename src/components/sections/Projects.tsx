import React, { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Github, X } from "lucide-react";
import SectionHeader from "../SectionHeader";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "Internship Management System",
    stack: ["Node.js", "HTML", "CSS", "JavaScript"],
    link: "https://github.com/Rapid1234-star/Internship-management-site",
    desc: "Architected a full-stack internship portal with role-based access control, secure authentication, and optimized database queries for high-performance data retrieval.",
    metric: "650+ TESTS, 8 MODULES",
    icon: "devicon-nodejs-plain",
  },
  {
    title: "AI Resume Analyzer",
    stack: ["TypeScript", "JavaScript", "AI Integration"],
    link: "https://github.com/Rapid1234-star/ai-resume-analyser",
    desc: "Built a TypeScript-based analyzer that dynamically parses, evaluates, and scores resume content with AI-powered insights.",
    metric: "30% ACCURACY IMPROVEMENT",
    icon: "devicon-typescript-plain",
  },
  {
    title: "Voice Scam Shield",
    stack: ["TypeScript", "JavaScript", "AI Integration"],
    link: "https://github.com/Rapid1234-star/Voice_Scam_Shield",
    desc: "Prototyped a real-time web application for detecting and flagging voice-based fraud and scam patterns using AI analysis.",
    metric: null,
    icon: "devicon-python-plain",
  },
  {
    title: "AI Face & Object Detection",
    stack: ["Python", "OpenCV", "JavaScript", "COCO-SSD"],
    link: "https://github.com/Rapid1234-star/AI-Object-Detection",
    desc: "Developed a Python facial recognition system with real-time image processing, plus a browser-based object detector using COCO-SSD.",
    metric: "20% ACCURACY IMPROVEMENT",
    icon: "devicon-python-plain",
  },
  {
    title: "Hand Snake",
    stack: ["React", "TypeScript", "MediaPipe", "Python"],
    link: "https://github.com/Rapid1234-star/Gesture-Snake-game",
    desc: "Built a hand-gesture-controlled browser game combining MediaPipe motion tracking with a React/TypeScript frontend and a Python reference engine.",
    metric: null,
    icon: "devicon-react-original",
  },
];

const getTechColor = (tech: string) => {
  const colors: Record<string, string> = {
    TypeScript: "text-blue-400 border-blue-400/30 bg-blue-400/10",
    Python: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
    React: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10",
    "Node.js": "text-green-500 border-green-500/30 bg-green-500/10",
    JavaScript: "text-yellow-300 border-yellow-300/30 bg-yellow-300/10",
    "AI Integration": "text-purple-400 border-purple-400/30 bg-purple-400/10",
  };
  return colors[tech] || "text-slate-300 border-slate-500/30 bg-slate-500/10";
};

export default function Projects() {
  const sectionRef  = useRef<HTMLElement>(null);
  const sceneRef    = useRef<HTMLDivElement>(null);
  const modalRef    = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const activeProject = activeIndex >= 0 ? projects[activeIndex] : null;

  // Spotlight glow tracking — only on collapsed cards
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const cards = document.querySelectorAll(".dock-pc");
      cards.forEach((card) => {
        const r = card.getBoundingClientRect();
        (card as HTMLElement).style.setProperty("--spot-x", `${e.clientX - r.left}px`);
        (card as HTMLElement).style.setProperty("--spot-y", `${e.clientY - r.top}px`);
      });
    };
    document.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => document.removeEventListener("pointermove", handlePointerMove);
  }, []);

  // Lock body scroll while modal open
  useEffect(() => {
    if (activeIndex >= 0) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [activeIndex]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActiveIndex(-1); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openModal  = useCallback((idx: number) => setActiveIndex(idx), []);
  const closeModal = useCallback(() => setActiveIndex(-1), []);

  // Backdrop click — close if clicking the dark overlay, not the card itself
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) closeModal();
  }, [closeModal]);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
      tl.from(".dock-scene", { y: 50, opacity: 0, duration: 0.8, ease: "power3.out" })
        .from(".dock-bar", { y: 30, opacity: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" }, "-=0.4");
    },
    { scope: sectionRef },
  );

  const truncName = (s: string, n: number) =>
    s.length > n ? s.substring(0, n) + "\u2026" : s;

  return (
    <>
      <section
        ref={sectionRef}
        className="relative w-full py-16 md:py-20 px-6 md:px-12 flex flex-col justify-center"
        id="projects"
      >
        <SectionHeader
          tag="PROJECT_ARCHIVES"
          title="Projects"
          subtitle={`${projects.length} deployed projects`}
        />

        {/* Dock — cards never change size, layout is always stable */}
        <div
          ref={sceneRef}
          className="dock-scene w-full max-w-7xl mx-auto py-6 md:py-8 px-1 md:px-3"
        >
          <div className="dock-track flex justify-center items-end gap-3 md:gap-4 relative"
            style={{ height: "clamp(280px,36vw,340px)" }}
          >
            {projects.map((p, idx) => (
              <div
                key={idx}
                className="dock-bar relative cursor-pointer flex flex-col min-w-0 group"
                onClick={() => openModal(idx)}
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                aria-label={`View project: ${p.title}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(idx); }
                }}
                style={{
                  flex: "0 1 clamp(120px, 18vw, 200px)",
                  height: "100%",
                  overflow: "hidden",
                  border: "1px solid rgba(0,255,65,0.12)",
                  background: "transparent",
                  opacity: 0.68,
                  transition: "opacity 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = "1";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,255,65,0.35)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 28px rgba(0,255,65,0.10)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = "0.68";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,255,65,0.12)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                {/* Card face — always the same, never expands */}
                <div
                  className="dock-pc absolute inset-0 flex flex-col items-center justify-center gap-3"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,255,65,0.22) 0%, rgba(0,20,8,0.50) 50%, rgba(0,0,0,0.85) 100%)",
                    boxShadow: "inset 0 0 30px rgba(0,255,65,0.05)",
                  }}
                >
                  <i
                    className={`${p.icon} text-4xl md:text-5xl`}
                    style={{ color: "rgba(0,255,65,0.6)" }}
                  />
                  {/* Vertical project name */}
                  <span
                    className="text-[9px] font-bold uppercase tracking-[0.18em] text-center px-1"
                    style={{
                      color: "rgba(0,255,65,0.65)",
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg)",
                      maxHeight: "120px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {truncName(p.title, 16)}
                  </span>
                  {/* Spotlight glow */}
                  <div
                    className="dock-spotlight absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        "radial-gradient(200px circle at var(--spot-x,50%) var(--spot-y,50%), rgba(0,255,65,0.13), transparent 62%)",
                    }}
                  />
                </div>

                {/* Bottom caption */}
                <div className="absolute bottom-0 left-0 right-0 text-center z-10 bg-gradient-to-t from-black/90 to-transparent py-3 px-1">
                  <span
                    className="block text-[10px] md:text-xs font-bold uppercase tracking-wider"
                    style={{ color: "rgba(255,255,255,0.9)" }}
                  >
                    {truncName(p.title, 10)}
                  </span>
                </div>

                {/* "OPEN" hint on hover */}
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: "rgba(0,0,0,0.35)" }}
                >
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 border"
                    style={{ color: "#00ff41", borderColor: "rgba(0,255,65,0.5)" }}
                  >
                    VIEW
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— MODAL OVERLAY ——— */}
      {/* Rendered via React Portal — completely escapes any parent transforms
          or stacking contexts, guaranteeing it is centered perfectly relative
          to the actual viewport. */}
      {activeProject && typeof document !== "undefined" && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeProject.title}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8"
          style={{
            background: "rgba(0,0,0,0.82)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            animation: "modal-backdrop-in 0.25s ease forwards",
          }}
          onClick={handleBackdropClick}
        >
          <div
            ref={modalRef}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            style={{
              background: "#080e08",
              border: "1px solid rgba(0,255,65,0.35)",
              boxShadow: "0 0 100px rgba(0,255,65,0.12), 0 40px 100px rgba(0,0,0,0.8)",
              animation: "modal-card-in 0.3s cubic-bezier(0.23,1,0.32,1) forwards",
            }}
          >
            {/* Green accent bar — top */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-green-500/0 via-green-500 to-green-500/0" />

            {/* Close button */}
            <button
              className="absolute top-4 right-4 z-20 flex items-center justify-center w-8 h-8 rounded-full transition-all"
              style={{
                border: "1px solid rgba(0,255,65,0.3)",
                background: "rgba(0,0,0,0.6)",
                color: "rgba(0,255,65,0.7)",
              }}
              onClick={closeModal}
              aria-label="Close project details"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(0,255,65,0.15)";
                (e.currentTarget as HTMLElement).style.color = "#00ff41";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.6)";
                (e.currentTarget as HTMLElement).style.color = "rgba(0,255,65,0.7)";
              }}
            >
              <X size={16} />
            </button>

            {/* Modal content */}
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
              {/* Left panel — icon + decoration */}
              <div
                className="relative flex flex-col items-center justify-center overflow-hidden shrink-0 py-10"
                style={{
                  flexBasis: "32%",
                  borderRight: "1px solid rgba(0,255,65,0.1)",
                  background:
                    "radial-gradient(ellipse at 40% 40%, rgba(0,255,65,0.12) 0%, transparent 65%)",
                }}
              >
                {/* Corner brackets */}
                <div className="absolute top-4 left-4 w-4 h-4" style={{ borderTop: "1px solid rgba(0,255,65,0.5)", borderLeft: "1px solid rgba(0,255,65,0.5)" }} />
                <div className="absolute top-4 right-4 w-4 h-4" style={{ borderTop: "1px solid rgba(0,255,65,0.5)", borderRight: "1px solid rgba(0,255,65,0.5)" }} />
                <div className="absolute bottom-4 left-4 w-4 h-4" style={{ borderBottom: "1px solid rgba(0,255,65,0.5)", borderLeft: "1px solid rgba(0,255,65,0.5)" }} />
                <div className="absolute bottom-4 right-4 w-4 h-4" style={{ borderBottom: "1px solid rgba(0,255,65,0.5)", borderRight: "1px solid rgba(0,255,65,0.5)" }} />

                <i
                  className={`${activeProject.icon} text-7xl md:text-8xl relative z-10`}
                  style={{ color: "rgba(0,255,65,0.25)" }}
                />
                <span className="text-[9px] text-green-500/35 uppercase tracking-[0.22em] mt-4 relative z-10">
                  [ SYSTEM_ARCHIVE ]
                </span>
              </div>

              {/* Right panel — content */}
              <div className="p-6 md:p-8 flex flex-col flex-1 overflow-y-auto">
                {/* System label */}
                <span className="text-[9px] text-green-500/40 uppercase tracking-[0.22em] mb-3 font-mono">
                  PROJECT_ID_{String(activeIndex + 1).padStart(2, "0")}
                </span>

                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight leading-tight flex items-center gap-2">
                  <span className="text-green-500">&gt;</span> {activeProject.title}
                </h3>

                {activeProject.metric && (
                  <div
                    className="mb-5 inline-block w-fit text-[10px] md:text-xs font-bold px-3 py-1.5 border tracking-wider uppercase"
                    style={{ borderColor: "rgba(0,255,65,0.3)", background: "rgba(0,255,65,0.08)", color: "rgba(0,255,65,0.85)" }}
                  >
                    METRIC: {activeProject.metric}
                  </div>
                )}

                <p
                  className="text-sm md:text-base leading-relaxed mb-6 flex-1"
                  style={{ color: "rgba(220,230,220,0.72)" }}
                >
                  {activeProject.desc}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {activeProject.stack.map((tech) => (
                    <span
                      key={tech}
                      className={`text-[10px] md:text-xs font-medium px-3 py-1.5 border rounded ${getTechColor(tech)}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div
                  className="flex items-center gap-3 text-xs uppercase tracking-widest pt-4 mt-auto"
                  style={{ borderTop: "1px solid rgba(0,255,65,0.1)" }}
                >
                  <a
                    href={activeProject.link}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`View source code for ${activeProject.title}`}
                    className="flex items-center gap-2 px-4 py-2 font-bold transition-all"
                    style={{ color: "#000", border: "1px solid #00ff41", background: "#00ff41" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(0,255,65,0.8)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#00ff41"; }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Github size={14} aria-hidden="true" /> SOURCE
                  </a>
                  <span
                    className="text-[10px] md:text-xs px-4 py-2 font-bold flex items-center gap-2"
                    style={{ color: "rgba(100,116,139,0.8)", border: "1px solid rgba(71,85,105,0.25)", background: "rgba(0,0,0,0.5)", cursor: "not-allowed" }}
                  >
                    LIVE_DEMO [OFFLINE]
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      , document.body)}

      {/* Keyframe animations injected once */}
      <style>{`
        @keyframes modal-backdrop-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modal-card-in {
          from { opacity: 0; transform: scale(0.94) translateY(16px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);     }
        }
      `}</style>
    </>
  );
}
