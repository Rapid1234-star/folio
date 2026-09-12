import React, { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Github, X } from "lucide-react";
import SectionHeader from "../SectionHeader";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../../hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "Internship Management System",
    stack: ["Node.js", "HTML", "CSS", "JavaScript"],
    link: "https://github.com/Rapid1234-star/Internship-management-site",
    desc: "Architected a full-stack internship portal with role-based access control, secure authentication, and optimized database queries for high-performance data retrieval.",
    metric: "840+ TESTS, 8 MODULES",
    icon: "devicon-nodejs-plain",
    image: "/projects/project_internship.jpg",
  },
  {
    title: "AI Resume Analyzer",
    stack: ["TypeScript", "JavaScript", "AI Integration"],
    link: "https://github.com/Rapid1234-star/ai-resume-analyser",
    desc: "Built a TypeScript-based analyzer that dynamically parses, evaluates, and scores resume content with AI-powered insights.",
    metric: "30% ACCURACY IMPROVEMENT",
    icon: "devicon-typescript-plain",
    image: "/projects/project_resume_ai.jpg",
  },
  {
    title: "Voice Scam Shield",
    stack: ["TypeScript", "JavaScript", "AI Integration"],
    link: "https://github.com/Rapid1234-star/Voice_Scam_Shield",
    desc: "Prototyped a real-time web application for detecting and flagging voice-based fraud and scam patterns using AI analysis.",
    metric: null,
    icon: "devicon-python-plain",
    image: "/projects/project_voice_scam.jpg",
  },
  {
    title: "AI Face & Object Detection",
    stack: ["Python", "OpenCV", "JavaScript", "COCO-SSD"],
    link: "https://github.com/Rapid1234-star/AI-Object-Detection",
    desc: "Developed a Python facial recognition system with real-time image processing, plus a browser-based object detector using COCO-SSD.",
    metric: "20% ACCURACY IMPROVEMENT",
    icon: "devicon-python-plain",
    image: "/projects/project_face_detection.jpg",
  },
  {
    title: "Hand Snake",
    stack: ["React", "TypeScript", "MediaPipe", "Python"],
    link: "https://github.com/Rapid1234-star/Gesture-Snake-game",
    desc: "Built a hand-gesture-controlled browser game combining MediaPipe motion tracking with a React/TypeScript frontend and a Python reference engine.",
    metric: null,
    icon: "devicon-react-original",
    image: "/projects/project_hand_snake.jpg",
  },
] as const;

const getTechColor = (tech: string) => {
  const colors: Record<string, string> = {
    TypeScript: "text-blue-400 border-blue-400/30 bg-blue-400/10",
    Python: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
    React: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10",
    "Node.js": "text-green-500 border-green-500/30 bg-green-500/10",
    JavaScript: "text-yellow-300 border-yellow-300/30 bg-yellow-300/10",
    "AI Integration": "text-purple-400 border-purple-400/30 bg-purple-400/10",
    HTML: "text-orange-400 border-orange-400/30 bg-orange-400/10",
    CSS: "text-sky-400 border-sky-400/30 bg-sky-400/10",
    OpenCV: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
    "COCO-SSD": "text-lime-300 border-lime-300/30 bg-lime-300/10",
    MediaPipe: "text-teal-300 border-teal-300/30 bg-teal-300/10",
  };
  return colors[tech] || "text-slate-300 border-slate-500/30 bg-slate-500/10";
};

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const modalCardRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const reduced = useReducedMotion();

  const activeProject = activeIndex >= 0 ? projects[activeIndex] : null;

  // Magnetic dock attraction (desktop)
  useEffect(() => {
    const track = trackRef.current;
    if (!track || reduced) return;

    const cards = Array.from(
      track.querySelectorAll<HTMLElement>(".dock-bar"),
    );
    if (!cards.length) return;

    const quickYs = cards.map((el) =>
      gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" }),
    );
    const quickScales = cards.map((el) =>
      gsap.quickTo(el, "scale", { duration: 0.35, ease: "power3.out" }),
    );

    const onMove = (e: PointerEvent) => {
      if (window.matchMedia("(pointer: coarse)").matches) return;
      cards.forEach((card, i) => {
        const r = card.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        const influence = Math.max(0, 1 - dist / 220);
        quickYs[i](-influence * 14);
        quickScales[i](1 + influence * 0.08);
        card.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
        card.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
      });
    };

    const onLeave = () => {
      quickYs.forEach((q) => q(0));
      quickScales.forEach((q) => q(1));
    };

    track.addEventListener("pointermove", onMove);
    track.addEventListener("pointerleave", onLeave);
    return () => {
      track.removeEventListener("pointermove", onMove);
      track.removeEventListener("pointerleave", onLeave);
      cards.forEach((c) => gsap.set(c, { y: 0, scale: 1 }));
    };
  }, [reduced]);

  useEffect(() => {
    if (activeIndex >= 0) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [activeIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Belt-and-suspenders: force tiles visible after mount (fixes stuck GSAP opacity)
  useEffect(() => {
    const forceVisible = () => {
      sectionRef.current
        ?.querySelectorAll<HTMLElement>(".dock-bar")
        .forEach((el) => {
          el.style.opacity = "1";
          el.style.visibility = "visible";
        });
    };
    forceVisible();
    const t = window.setTimeout(forceVisible, 800);
    return () => window.clearTimeout(t);
  }, []);

  // Cool modal entrance — always runs when opening
  useEffect(() => {
    if (activeIndex < 0 || !modalCardRef.current) return;
    const card = modalCardRef.current;
    if (reduced) {
      gsap.set(card, { clearProps: "all" });
      return;
    }
    gsap.fromTo(
      card,
      { opacity: 0, y: 36, scale: 0.88, rotateX: 12 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        duration: 0.5,
        ease: "power3.out",
      },
    );
    gsap.fromTo(
      card.querySelectorAll(".modal-stagger"),
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        duration: 0.38,
        stagger: 0.055,
        delay: 0.14,
        ease: "power2.out",
      },
    );
  }, [activeIndex, reduced]);

  const openModal = useCallback((idx: number) => setActiveIndex(idx), []);
  const closeModal = useCallback(() => setActiveIndex(-1), []);
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) closeModal();
    },
    [closeModal],
  );

  // Safe reveal — animate transform only so opacity can never stick at 0
  useGSAP(
    () => {
      const bars = sectionRef.current?.querySelectorAll(".dock-bar");
      if (!bars?.length) return;

      gsap.set(bars, { autoAlpha: 1, y: 0 });

      if (reduced) return;

      gsap.from(bars, {
        y: 20,
        duration: 0.5,
        stagger: 0.07,
        ease: "power2.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          once: true,
        },
      });
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <>
      <section
        ref={sectionRef}
        className="relative w-full py-16 md:py-20 px-4 sm:px-6 md:px-12 flex flex-col justify-center overflow-x-hidden"
        id="projects"
      >
        <SectionHeader
          tag="PROJECT_ARCHIVES"
          title="Projects"
          subtitle={`${projects.length} deployed projects · click a tile`}
        />

        <div className="relative w-full max-w-7xl mx-auto">
          <p className="text-[10px] text-[var(--accent)]/50 tracking-[0.2em] uppercase mb-4 px-1 font-mono md:hidden">
            Swipe dock →
          </p>

          <div
            className="dock-scene hide-scrollbar"
            data-lenis-prevent
            aria-label="Project dock"
          >
            <div ref={trackRef} className="dock-track">
              {projects.map((p, idx) => (
                <button
                  key={p.title}
                  type="button"
                  className="dock-bar dock-tile group"
                  onClick={() => openModal(idx)}
                  aria-haspopup="dialog"
                  aria-label={`Open ${p.title}`}
                >
                  <div className="dock-pc absolute inset-0 flex flex-col items-center justify-between p-3 sm:p-4 overflow-hidden">
                    {/* Soft grid / phosphor face — no photo clutter */}
                    <div
                      className="absolute inset-0 opacity-80"
                      style={{
                        background:
                          "linear-gradient(165deg, rgba(0,255,136,0.16) 0%, rgba(0,12,8,0.92) 45%, #000 100%)",
                      }}
                    />
                    <div
                      className="absolute inset-0 opacity-[0.07] pointer-events-none"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(0,255,136,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.5) 1px, transparent 1px)",
                        backgroundSize: "18px 18px",
                      }}
                    />

                    <span className="relative z-[1] self-start text-[9px] font-mono tracking-[0.16em] text-[var(--accent)]/55">
                      {String(idx + 1).padStart(2, "0")}
                    </span>

                    <div className="relative z-[1] flex flex-col items-center gap-3 flex-1 justify-center w-full">
                      <i
                        className={`${p.icon} text-4xl sm:text-5xl transition-transform duration-300 group-hover:scale-110`}
                        style={{
                          color: "rgba(0,255,136,0.9)",
                          filter: "drop-shadow(0 0 12px rgba(0,255,136,0.35))",
                        }}
                        aria-hidden="true"
                      />
                      <h3 className="text-[11px] sm:text-xs font-bold text-white text-center leading-snug tracking-wide px-1">
                        {p.title}
                      </h3>
                    </div>

                    <div className="relative z-[1] flex flex-wrap justify-center gap-1 w-full">
                      {p.stack.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className={`text-[8px] sm:text-[9px] px-1.5 py-0.5 border ${getTechColor(t)}`}
                        >
                          {t}
                        </span>
                      ))}
                      {p.stack.length > 2 && (
                        <span className="text-[8px] sm:text-[9px] px-1.5 py-0.5 border border-[var(--border-soft)] text-slate-400">
                          +{p.stack.length - 2}
                        </span>
                      )}
                    </div>

                    <div
                      className="dock-spotlight absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[1]"
                      style={{
                        background:
                          "radial-gradient(180px circle at var(--spot-x,50%) var(--spot-y,40%), rgba(0,255,136,0.18), transparent 60%)",
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {activeProject &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={activeProject.title}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8"
            style={{
              background: "rgba(5,10,8,0.88)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              animation: "modal-backdrop-in 0.28s ease forwards",
              perspective: 1200,
            }}
            onClick={handleBackdropClick}
          >
            <div
              ref={modalCardRef}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-[var(--accent)]/35 bg-[#0a1410] shadow-[0_0_80px_rgba(0,255,136,0.12)]"
              style={{
                transformStyle: "preserve-3d",
                transformOrigin: "center top",
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />

              <button
                type="button"
                className="absolute top-4 right-4 z-20 flex items-center justify-center w-11 h-11 min-h-11 min-w-11 border border-[var(--accent)]/35 bg-black/70 text-[var(--accent)] hover:bg-[var(--accent)]/15 transition-colors"
                onClick={closeModal}
                aria-label="Close project details"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0">
                <div className="relative flex flex-col items-center justify-center overflow-hidden shrink-0 py-10 md:py-0 md:min-h-[320px] md:w-[34%]">
                  {activeProject.image && (
                    <img
                      src={activeProject.image}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover opacity-35"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1410] via-black/40 to-black/50" />
                  <i
                    className={`${activeProject.icon} modal-stagger text-6xl md:text-7xl relative z-10`}
                    style={{ color: "rgba(0,255,136,0.55)" }}
                    aria-hidden="true"
                  />
                  <span className="modal-stagger text-[9px] text-[var(--accent)]/50 uppercase tracking-[0.22em] mt-4 relative z-10">
                    [ SYSTEM_ARCHIVE ]
                  </span>
                </div>

                <div className="p-6 md:p-8 flex flex-col flex-1 overflow-y-auto hide-scrollbar min-h-0">
                  <span className="modal-stagger text-[9px] text-[var(--accent)]/45 uppercase tracking-[0.22em] mb-3 font-mono">
                    PROJECT_ID_{String(activeIndex + 1).padStart(2, "0")}
                  </span>

                  <h3 className="modal-stagger text-xl md:text-2xl font-bold text-white mb-4 tracking-tight leading-tight">
                    <span className="text-[var(--accent)]">&gt;</span>{" "}
                    {activeProject.title}
                  </h3>

                  {activeProject.metric && (
                    <div className="modal-stagger mb-5 inline-block w-fit text-[10px] md:text-xs font-bold px-3 py-1.5 border border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent)] tracking-wider uppercase">
                      METRIC: {activeProject.metric}
                    </div>
                  )}

                  <p className="modal-stagger text-sm md:text-base leading-relaxed mb-6 text-[var(--text-muted)] flex-1">
                    {activeProject.desc}
                  </p>

                  <div className="modal-stagger flex flex-wrap gap-2 mb-6">
                    {activeProject.stack.map((tech) => (
                      <span
                        key={tech}
                        className={`text-[10px] md:text-xs font-medium px-3 py-1.5 border ${getTechColor(tech)}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="modal-stagger flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest pt-4 mt-auto border-t border-[var(--border-soft)]">
                    <a
                      href={activeProject.link}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`View source for ${activeProject.title}`}
                      className="inline-flex items-center gap-2 min-h-11 px-4 py-2 font-bold bg-[var(--accent)] text-black hover:brightness-110 transition-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github size={14} aria-hidden="true" /> SOURCE
                    </a>
                    <span className="text-[10px] px-4 py-2 font-bold text-slate-500 border border-slate-700/50 cursor-not-allowed min-h-11 inline-flex items-center">
                      LIVE_DEMO [OFFLINE]
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

      <style>{`
        @keyframes modal-backdrop-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}
