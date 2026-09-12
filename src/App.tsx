/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";
import MatrixRain from "./components/MatrixRain";
import BackToTop from "./components/BackToTop";
import SystemLogs from "./components/SystemLogs";
import Hero from "./components/sections/Hero";
import Summary from "./components/sections/Summary";
import Experience from "./components/sections/Experience";
import Projects from "./components/sections/Projects";
import Skills from "./components/sections/Skills";
import Education from "./components/sections/Education";
import Contact from "./components/sections/Contact";
import CyberGlobeScene from "./components/CyberGlobe/CyberGlobeScene";
import MobileGridFallback from "./components/CyberGlobe/MobileGridFallback";
import { useDebouncedMobile } from "./hooks/useDebouncedMobile";
import { useReducedMotion } from "./hooks/useReducedMotion";
import CliOverlay from "./components/CliOverlay";
import NavigationDots from "./components/NavigationDots";
import { scrollState } from "./utils/scrollState";
import { createLenisScroll } from "./utils/lenisScroll";
import { initMusic, toggleMusic, getIsMusicMuted } from "./utils/music";
import AudioPlayer from "./components/AudioPlayer";
import ModeToggle from "./components/ModeToggle";
import MobileNav from "./components/MobileNav";
import { initSFX, playHoverSound, playClickSound } from "./utils/sfx";
import { ErrorBoundary } from "./components/ErrorBoundary";
import LoadingScreen from "./components/LoadingScreen";
import { mousePosition } from "./utils/mousePosition";
import Footer from "./components/Footer";

gsap.registerPlugin(ScrollTrigger);

const NAV_ITEMS = [
  { id: "summary", label: "ABOUT" },
  { id: "experience", label: "EXP" },
  { id: "projects", label: "WORK" },
  { id: "skills", label: "SKILLS" },
  { id: "education", label: "EDU" },
  { id: "contact", label: "LINK" },
] as const;

const Tooltip = ({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) => (
  <div className="group relative flex items-center justify-center">
    {children}
    <div
      className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-green-900/90 text-black text-[10px] font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap tooltip-glitch z-[100]"
      data-text={text}
    >
      {text}
    </div>
  </div>
);

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [isTerminalMode, setIsTerminalMode] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(getIsMusicMuted());
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const isMobile = useDebouncedMobile();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleFirstClick = () => {
      initMusic();
      initSFX();
      window.removeEventListener("click", handleFirstClick);
    };
    window.addEventListener("click", handleFirstClick);
    return () => window.removeEventListener("click", handleFirstClick);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.x = e.clientX;
      mousePosition.y = e.clientY;
      mousePosition.isOnScreen = true;
    };
    const handleMouseLeave = () => {
      mousePosition.x = -1000;
      mousePosition.y = -1000;
      mousePosition.isOnScreen = false;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mousePosition.x = e.touches[0].clientX;
        mousePosition.y = e.touches[0].clientY;
        mousePosition.isOnScreen = true;
      }
    };
    const handleTouchEnd = () => {
      mousePosition.isOnScreen = false;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    const { lenis, destroy } = createLenisScroll({
      reducedMotion: prefersReducedMotion,
    });
    lenisRef.current = lenis;

    const st = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        scrollState.set(self.progress);
        gsap.set("#progress-bar-fill", { scaleX: self.progress });
      },
    });

    return () => {
      st.kill();
      destroy();
      lenisRef.current = null;
    };
  }, [prefersReducedMotion]);

  // Active section for nav highlight
  useEffect(() => {
    const ids = [
      "hero",
      "summary",
      "experience",
      "projects",
      "skills",
      "education",
      "contact",
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.28, rootMargin: "-15% 0px -45% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const toggleMute = () => {
    setIsAudioMuted(toggleMusic());
    playClickSound();
  };

  const handleNavClick = (targetId: string) => {
    playClickSound();
    if (!prefersReducedMotion) {
      setIsGlitching(true);
      window.setTimeout(() => setIsGlitching(false), 650);
    }

    const scrollTo = () => {
      if (targetId === "top" || targetId === "hero") {
        if (lenisRef.current) lenisRef.current.scrollTo(0, { duration: 1.15 });
        else window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const target = document.getElementById(targetId);
      if (!target) return;
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, { offset: -96, duration: 1.15 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    };

    window.setTimeout(scrollTo, prefersReducedMotion ? 0 : 120);
  };

  const contentLayout = isTerminalMode
    ? "lg:pr-[360px] max-w-7xl mx-auto"
    : "max-w-7xl lg:ml-24 lg:w-[calc(100%-6rem)] xl:ml-32 xl:w-[calc(100%-8rem)] xl:pr-20";

  return (
    <div
      ref={containerRef}
      className={`min-h-screen font-mono text-[var(--text-main)] overflow-x-hidden selection:bg-[var(--accent)] selection:text-black transition-colors duration-500 ${
        isTerminalMode ? "terminal-mode bg-[#020402]" : "bg-transparent"
      }`}
    >
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        onNavigate={handleNavClick}
        isMuted={isAudioMuted}
        toggleMute={toggleMute}
      />

      <div
        className="fixed top-0 left-0 w-full h-1.5 bg-black z-[100] border-b border-green-900/60"
        aria-hidden="true"
      >
        <div
          id="progress-bar-fill"
          className="h-full origin-left bg-[var(--accent)] shadow-[0_0_12px_#00ff88] w-full"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* HUD — unique TRACE chrome */}
      <div className="fixed top-16 right-6 z-[60] text-xs font-bold text-[var(--accent)]/75 pointer-events-none hidden xl:block">
        <div className="flex flex-col items-end pointer-events-auto">
          <Tooltip text="SYS_STATE: NOMINAL">
            <span className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 bg-[var(--accent)] animate-pulse shadow-[0_0_6px_#00ff88]" />{" "}
              SYS.ONLINE
            </span>
          </Tooltip>
          <Tooltip text="PING: 12.04ms">
            <span className="mb-1">LATENCY: 12MS</span>
          </Tooltip>
        </div>
      </div>

      {/* SHELL SLOT: TOP — logo + nav / hamburger only */}
      <header
        role="banner"
        data-shell-slot="top"
        className="shell-slot-top left-0 w-full px-4 md:px-6 lg:px-12 py-3 md:py-4 flex justify-between items-center"
      >
        <button
          onClick={() => handleNavClick("hero")}
          onMouseEnter={playHoverSound}
          aria-label="Back to top"
          data-shell-control="brand"
          className="text-lg md:text-2xl font-bold tracking-tighter border border-[var(--border-soft)] bg-black/75 px-3 py-1 pointer-events-auto hover:text-white hover:border-[var(--accent)] transition-all shadow-[0_0_14px_rgba(0,255,136,0.12)] whitespace-nowrap min-h-11 flex items-center backdrop-blur-md"
        >
          TRACE_0 // A.D_
        </button>

        <nav
          role="navigation"
          className="hidden md:flex gap-1 lg:gap-2 pointer-events-auto border border-[var(--border-soft)] bg-black/80 px-2 lg:px-3 py-1.5 shadow-[0_0_14px_rgba(0,255,136,0.1)] backdrop-blur-md"
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                onMouseEnter={playHoverSound}
                aria-label={`Navigate to ${item.label}`}
                aria-current={isActive ? "true" : undefined}
                className={`min-h-11 px-2 lg:px-3 text-[10px] lg:text-xs tracking-widest transition-all whitespace-nowrap ${
                  isActive
                    ? "text-black bg-[var(--accent)] shadow-[0_0_12px_rgba(0,255,136,0.35)]"
                    : "text-[var(--accent)]/80 hover:text-white hover:bg-[var(--accent)]/15"
                }`}
              >
                [ {item.label} ]
              </button>
            );
          })}
        </nav>

        <button
          onClick={() => setIsMobileNavOpen(true)}
          onMouseEnter={playHoverSound}
          aria-label="Open navigation menu"
          data-shell-control="menu"
          className="md:hidden pointer-events-auto border border-[var(--border-soft)] bg-black/80 px-3 py-2 text-[var(--accent)] hover:border-[var(--accent)] transition-all shadow-[0_0_10px_rgba(0,255,136,0.1)] min-h-11 min-w-11 flex flex-col items-center justify-center gap-1 backdrop-blur-md"
        >
          <span className="w-4 h-px bg-[var(--accent)]" />
          <span className="w-4 h-px bg-[var(--accent)]" />
          <span className="w-4 h-px bg-[var(--accent)]" />
        </button>
      </header>

      {/* SHELL SLOT: BL — desktop only */}
      <div className="shell-slot-bl" data-shell-slot="bl">
        <div className="text-[10px] text-[var(--accent)]/55 border-l border-[var(--accent)]/35 pl-2 hidden lg:block">
          <Tooltip text="TARGET_USER_PROFILE">
            <p className="mb-1">AAYAN_DESAI // PORTFOLIO</p>
          </Tooltip>
          <Tooltip text="FIREWALL_STATUS: ACTIVE">
            <p>SEC_PROTOCOL: ON</p>
          </Tooltip>
        </div>
        <button
          onClick={() => handleNavClick("hero")}
          aria-label="Reboot System"
          data-shell-control="reboot"
          className="bg-black border border-[var(--accent)] text-[var(--accent)]/80 px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--accent)] hover:text-black transition-colors shadow-[0_0_18px_rgba(0,255,136,0.15)] min-h-11"
        >
          [ REBOOT_SYS ]
        </button>
      </div>

      <div className="fixed inset-0 z-0 pointer-events-none">
        <ErrorBoundary fallback={<MobileGridFallback />}>
          <CyberGlobeScene
            isTerminalMode={isTerminalMode}
            isMobile={isMobile}
          />
        </ErrorBoundary>
      </div>

      {isGlitching && (
        <div className="fixed inset-0 z-[150] pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[var(--accent)]/8 backdrop-blur-[2px]" />
          <div className="animate-cyber-sweep h-32 bg-gradient-to-b from-transparent via-[var(--accent)]/25 to-transparent border-y border-[var(--accent)]/40 shadow-[0_0_30px_rgba(0,255,136,0.35)]" />
        </div>
      )}

      <div className="pointer-events-none fixed inset-0 z-50 crt-overlay hidden md:block" />
      <div className="pointer-events-none fixed inset-0 z-40 scanlines hidden md:block" />

      <CliOverlay />

      {/* SHELL SLOT: BOTTOM — mobile only, ModeToggle full-width */}
      {isMobile && (
        <div
          className="shell-slot-bottom"
          data-shell-slot="bottom"
          aria-label="View mode dock"
        >
          <ModeToggle
            fullWidth
            isTerminalMode={isTerminalMode}
            onToggle={() => setIsTerminalMode((v) => !v)}
          />
        </div>
      )}

      {/* SHELL SLOT: BR — desktop/tablet only */}
      {!isMobile && (
        <div className="shell-slot-br" data-shell-slot="br">
          <AudioPlayer isMuted={isAudioMuted} toggleMute={toggleMute} />
          <ModeToggle
            isTerminalMode={isTerminalMode}
            onToggle={() => setIsTerminalMode((v) => !v)}
          />
        </div>
      )}

      <MatrixRain opacity={isTerminalMode ? 0.55 : 0.12} />
      <SystemLogs isTerminalMode={isTerminalMode} />
      <NavigationDots isTerminalMode={isTerminalMode} />

      <main
        role="main"
        id="main-content"
        className={`relative z-10 w-full flex flex-col gap-0 transition-all duration-500 ${contentLayout}`}
      >
        <Hero onNavigate={handleNavClick} />
        <Summary />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
        <Footer />
      </main>

      <BackToTop />
    </div>
  );
}
