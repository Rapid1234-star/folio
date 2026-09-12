import React, { useState, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { scrollState } from "../../utils/scrollState";
import { useMagnetic } from "../../hooks/useMagnetic";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const roles = [
  "QA Automation Engineer",
  "Full-Stack Developer",
  "Cybersecurity Specialist",
];

type HeroProps = {
  onNavigate?: (id: string) => void;
};

export default function Hero({ onNavigate }: HeroProps) {
  const [bootState, setBootState] = useState<
    "init" | "login" | "pass" | "grant" | "name" | "ready"
  >("init");
  const [loginText, setLoginText] = useState("");
  const [passText, setPassText] = useState("");
  const [nameText, setNameText] = useState("");
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [processTime] = useState(() =>
    (Math.random() * 0.08 + 0.02).toFixed(3),
  );
  const [roleText, setRoleText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeletingRole, setIsDeletingRole] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const magneticRef = useMagnetic<HTMLAnchorElement>(0.3);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(terminalRef.current, {
        y: 36,
        opacity: 0,
        scale: 0.98,
        duration: 1.1,
        ease: "power3.out",
        delay: 0.15,
      });
    },
    { scope: heroRef, dependencies: [reduced] },
  );

  // Subtle terminal parallax — premium mouse interaction (best-of-class portfolios)
  useEffect(() => {
    const el = terminalRef.current;
    if (!el || reduced) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.55, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.55, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      xTo(((e.clientX - cx) / cx) * 10);
      yTo(((e.clientY - cy) / cy) * 6);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [reduced]);

  useEffect(() => {
    const unsub = scrollState.subscribe((p) => setShowScrollHint(p <= 0.03));
    return unsub;
  }, []);

  useEffect(() => {
    if (reduced) {
      setBootState("ready");
      setLoginText("aayan_desai@system");
      setPassText("********************");
      setNameText("AAYAN IRSHAD DESAI");
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;
    let isActive = true;

    const fallbackTimer = setTimeout(() => {
      if (isActive) {
        setBootState("ready");
        setLoginText("aayan_desai@system");
        setPassText("********************");
        setNameText("AAYAN IRSHAD DESAI");
      }
    }, 6000);

    const sequence = async () => {
      const wait = (ms: number) =>
        new Promise<void>((resolve) => {
          timeoutId = setTimeout(resolve, ms);
        });

      const loginTarget = "aayan_desai@system";
      const passTarget = "********************";
      const nameTarget = "AAYAN IRSHAD DESAI";

      await wait(500);
      if (!isActive) return;
      setBootState("login");

      for (let i = 1; i <= loginTarget.length; i++) {
        setLoginText(loginTarget.substring(0, i));
        await wait(36);
        if (!isActive) return;
      }

      await wait(280);
      if (!isActive) return;
      setBootState("pass");

      for (let i = 1; i <= passTarget.length; i++) {
        setPassText(passTarget.substring(0, i));
        await wait(18);
        if (!isActive) return;
      }

      await wait(350);
      if (!isActive) return;
      setBootState("grant");

      await wait(450);
      if (!isActive) return;
      setBootState("name");

      for (let i = 1; i <= nameTarget.length; i++) {
        setNameText(nameTarget.substring(0, i));
        await wait(42);
        if (!isActive) return;
      }

      await wait(500);
      if (!isActive) return;
      clearTimeout(fallbackTimer);
      setBootState("ready");
    };

    sequence();
    return () => {
      isActive = false;
      clearTimeout(timeoutId);
      clearTimeout(fallbackTimer);
    };
  }, [reduced]);

  useEffect(() => {
    if (bootState !== "ready") return;
    let typeSpeed = isDeletingRole ? 36 : 95;
    const currentRole = roles[roleIndex];
    if (!isDeletingRole && roleText === currentRole) typeSpeed = 2000;

    const timer = setTimeout(() => {
      if (!isDeletingRole && roleText === currentRole) {
        setIsDeletingRole(true);
      } else if (isDeletingRole && roleText === "") {
        setIsDeletingRole(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      } else {
        setRoleText(
          currentRole.substring(
            0,
            roleText.length + (isDeletingRole ? -1 : 1),
          ),
        );
      }
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [roleText, isDeletingRole, roleIndex, bootState]);

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen flex flex-col justify-center px-6 md:px-24 font-mono pt-20 md:pt-0"
      id="hero"
    >
      <div
        ref={terminalRef}
        className="max-w-5xl z-10 relative overflow-hidden"
        style={{
          border: "1px solid rgba(0,255,136,0.22)",
          boxShadow:
            "0 0 80px rgba(0,255,136,0.1), 0 0 120px rgba(0,240,255,0.04), 0 40px 80px rgba(0,0,0,0.65)",
        }}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#121a16]/95 border-b border-[rgba(0,255,136,0.15)] backdrop-blur-md">
          <div className="flex gap-1.5">
            <span
              className="w-3 h-3 rounded-full bg-[#ff5f57]"
              style={{ boxShadow: "0 0 6px rgba(255,95,87,0.7)" }}
              title="close"
            />
            <span
              className="w-3 h-3 rounded-full bg-[#febc2e]"
              style={{ boxShadow: "0 0 6px rgba(254,188,46,0.7)" }}
              title="minimize"
            />
            <span
              className="w-3 h-3 rounded-full bg-[#28c840]"
              style={{ boxShadow: "0 0 6px rgba(40,200,64,0.7)" }}
              title="maximize"
            />
          </div>
          <span className="flex-1 text-center text-[11px] text-slate-500 font-mono tracking-wider">
            bash — aayan@trace-os:~ — 80×24
          </span>
          <span className="text-[10px] text-[var(--accent)]/40 font-mono tracking-widest hidden md:block">
            [ PRESS ` FOR CLI ]
          </span>
        </div>

        {/* Body */}
        <div
          className="bg-[#070f0c]/92 p-5 md:p-8 backdrop-blur-sm"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.015) 2px, rgba(0,255,136,0.015) 4px)",
          }}
        >
          <div
            className="text-[var(--accent)] mb-6 text-sm md:text-base space-y-1"
            aria-live="polite"
          >
            <p>&gt; Establishing secure connection...</p>
            {bootState !== "init" && (
              <p>
                <span className="text-slate-400">login:</span>{" "}
                <span className="text-white">{loginText}</span>
                {bootState === "login" && (
                  <span className="animate-pulse bg-[var(--accent)] w-2 h-4 inline-block ml-1 align-middle" />
                )}
              </p>
            )}
            {(bootState === "pass" ||
              bootState === "grant" ||
              bootState === "name" ||
              bootState === "ready") && (
              <p>
                <span className="text-slate-400">Password:</span>{" "}
                <span className="text-slate-500">{passText}</span>
                {bootState === "pass" && (
                  <span className="animate-pulse bg-[var(--accent)] w-2 h-4 inline-block ml-1 align-middle" />
                )}
              </p>
            )}
            {(bootState === "grant" ||
              bootState === "name" ||
              bootState === "ready") && (
              <p>
                &gt; Access:{" "}
                <span className="text-black bg-[var(--accent)] px-2 py-0.5 ml-1 font-bold animate-pulse shadow-[0_0_12px_rgba(0,255,136,0.5)]">
                  GRANTED
                </span>
              </p>
            )}
          </div>

          {(bootState === "name" || bootState === "ready") && (
            <div className="transition-opacity duration-1000 opacity-100">
              <p className="text-slate-500 text-xs md:text-sm mb-2">
                $ cat /home/aayan/.profile
              </p>
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 tracking-tight drop-shadow-[0_0_18px_rgba(0,255,136,0.35)] break-words">
                {nameText}
                {bootState === "name" && (
                  <span className="animate-pulse bg-[var(--accent)] w-4 h-8 inline-block ml-2 align-middle" />
                )}
              </h1>
              {bootState === "ready" && (
                <p className="text-[var(--accent)]/75 text-sm md:text-lg italic tracking-wide mb-6 animate-[fadeIn_1s_ease-in-out]">
                  &ldquo;I break things so you don&apos;t have to.&rdquo;
                </p>
              )}
            </div>
          )}

          {bootState === "ready" && (
            <div className="transition-opacity duration-1000 opacity-100">
              <div className="flex items-center text-lg md:text-2xl text-[var(--accent)] mb-8 h-10 overflow-hidden">
                <span>
                  ~/profile ${" "}
                  <span className="text-slate-400 text-base">role:</span>{" "}
                  <span className="text-white font-medium bg-[var(--accent)]/15 px-2 border-b-2 border-[var(--accent)]">
                    {roleText}
                  </span>
                  <span className="w-3 md:w-4 h-6 md:h-8 bg-[var(--accent)] ml-1 inline-block align-middle animate-pulse shadow-[0_0_10px_#00ff88]" />
                </span>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 text-xs md:text-sm text-slate-400 mb-8">
                <span className="border border-[var(--border-soft)] px-3 py-1.5 bg-black/50 flex items-center gap-2 min-h-11">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse shadow-[0_0_6px_#00ff88]" />
                  LOC: AL NAHDA, SHARJAH
                </span>
                <a
                  href="tel:+971561235034"
                  className="border border-[var(--border-soft)] px-3 py-1.5 bg-black/50 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors min-h-11 flex items-center"
                >
                  TEL: +971-56-123-5034
                </a>
                <a
                  href="mailto:aayanirshad99@gmail.com?subject=Let's%20Connect%20|%20Portfolio"
                  className="border border-[var(--border-soft)] px-3 py-1.5 bg-black/50 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors min-h-11 flex items-center"
                >
                  EMAIL: aayanirshad99@gmail.com
                </a>
                <a
                  href="https://github.com/Rapid1234-star"
                  target="_blank"
                  rel="noreferrer"
                  className="border border-[var(--border-soft)] px-3 py-1.5 bg-black/50 hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] transition-colors min-h-11 flex items-center"
                >
                  GITHUB: Rapid1234-star
                </a>
                <a
                  href="https://linkedin.com/in/aayan-desai"
                  target="_blank"
                  rel="noreferrer"
                  className="border border-[var(--border-soft)] px-3 py-1.5 bg-black/50 hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] transition-colors min-h-11 flex items-center"
                >
                  LINKEDIN: aayan-desai
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-4 border-t border-[var(--border-soft)] pt-6">
                <a
                  ref={magneticRef}
                  href="#projects"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.("projects");
                  }}
                  className="will-change-transform inline-flex items-center gap-3 bg-[var(--accent)] text-black px-6 py-3 font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_24px_rgba(0,255,136,0.35)] min-h-11"
                >
                  <span className="w-2 h-2 bg-black animate-pulse" />
                  [ ENTER_WORK ]
                </a>
                <a
                  href="/aayan_cv.pdf"
                  download
                  className="inline-flex items-center gap-3 bg-black/60 border border-[var(--accent)] px-6 py-3 text-[var(--accent)] font-bold text-xs uppercase tracking-widest hover:bg-[var(--accent)] hover:text-black transition-all shadow-[0_0_15px_rgba(0,255,136,0.15)] group min-h-11"
                >
                  <span className="w-2 h-2 bg-[var(--accent)] group-hover:bg-black animate-pulse" />
                  [ DOWNLOAD_CV.PDF ]
                </a>
              </div>

              <div className="text-[10px] text-slate-600 mt-6 border-t border-[var(--border-soft)] pt-3 font-mono">
                [PROCESS COMPLETED IN {processTime}s] &nbsp;|&nbsp; TRACE_OS
                v2.5 &nbsp;|&nbsp; SECURE_SHELL
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className={`absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 text-xs tracking-widest animate-bounce z-10 transition-opacity duration-500 ${
          showScrollHint ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      >
        <span>[ SCROLL TO EXPLORE ]</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
