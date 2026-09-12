/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MatrixRain from "./components/MatrixRain";
import BackToTop from "./components/BackToTop";
import SystemLogs from "./components/SystemLogs";
import Hero from "./components/sections/Hero";
import Summary from "./components/sections/Summary";
import Experience from "./components/sections/Experience";
import Projects from "./components/sections/Projects";
import Skills from "./components/sections/Skills";
import Education from "./components/sections/Education";
import CyberGlobeScene from "./components/CyberGlobe/CyberGlobeScene";
import MobileGridFallback from "./components/CyberGlobe/MobileGridFallback";
import { useDebouncedMobile } from "./hooks/useDebouncedMobile";
import CliOverlay from "./components/CliOverlay";
import Marquee from "./components/Marquee";
import NavigationDots from "./components/NavigationDots";
import { scrollState } from "./utils/scrollState";
import { initMusic, toggleMusic, getIsMusicMuted } from "./utils/music";
import AudioPlayer from "./components/AudioPlayer";
import { initSFX, playHoverSound, playClickSound } from "./utils/sfx";
import { ErrorBoundary } from "./components/ErrorBoundary";
import LoadingScreen from "./components/LoadingScreen";
import { mousePosition } from "./utils/mousePosition";
import Footer from "./components/Footer";

gsap.registerPlugin(ScrollTrigger);

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
  const [isTerminalMode, setIsTerminalMode] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(getIsMusicMuted());
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useDebouncedMobile();

  useEffect(() => {
    // Only init audio on first click anywhere
    const handleFirstClick = () => {
      initMusic();
      initSFX();
      window.removeEventListener("click", handleFirstClick);
    };
    window.addEventListener("click", handleFirstClick);
    return () => window.removeEventListener("click", handleFirstClick);
  }, []);

  // Track mouse at document level — bypasses z-index stacking so particles respond everywhere
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

  const toggleMute = () => {
    setIsAudioMuted(toggleMusic());
    playClickSound();
  };

  const handleNavClick = (targetId: string) => {
    playClickSound();
    setIsGlitching(true);

    setTimeout(() => {
      if (targetId === "top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    }, 150);

    setTimeout(() => {
      setIsGlitching(false);
    }, 800);
  };

  useEffect(() => {
    // Setup scroll trigger to update the scrollState proxy
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        scrollState.set(self.progress);
        // Update top progress bar status indicator
        gsap.set("#progress-bar-fill", { width: `${self.progress * 100}%` });
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`min-h-screen font-mono text-[var(--text-main)] overflow-x-hidden selection:bg-green-500 selection:text-black transition-colors duration-500 ${isTerminalMode ? "terminal-mode bg-[#020402]" : "bg-[#050a05]"}`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] bg-black border border-green-500 px-4 py-2 text-green-500"
      >
        Skip to main content
      </a>

      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* Top Terminal Status Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-black z-[100] border-b border-green-900 flex items-center">
        <div
          id="progress-bar-fill"
          className="h-full bg-green-500 shadow-[0_0_10px_#00ff41] w-0"
        ></div>
      </div>

      {/* Persistent Static HUD Elements - xl only to avoid mid-width overlap */}
      <div className="fixed top-4 right-6 z-[60] text-xs font-bold text-green-500/60 pointer-events-none hidden xl:block">
        <div className="flex flex-col items-end pointer-events-auto">
          <Tooltip text="SYS_STATE: NOMINAL">
            <span className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 bg-green-500 animate-pulse"></span>{" "}
              SYS.ONLINE
            </span>
          </Tooltip>

          <Tooltip text="PING: 12.04ms (LONDON_EU_WEST)">
            <span className="mb-1">LATENCY: 12MS</span>
          </Tooltip>
          <Tooltip text="Z-INDEX_DEPTH: AUTOMATIC">
            <span>POS_Z: AUTO</span>
          </Tooltip>
        </div>
      </div>

      {/* Top Navbar */}
      <header
        role="banner"
        className="fixed top-1.5 left-0 w-full z-[80] px-4 md:px-6 lg:px-12 py-3 md:py-4 flex justify-between items-center pointer-events-none"
      >
        <button
          onClick={() => handleNavClick("hero")}
          onMouseEnter={playHoverSound}
          aria-label="Back to top"
          className="text-lg md:text-2xl font-bold tracking-tighter border border-green-900/50 bg-black/80 px-3 py-1 pointer-events-auto hover:text-white hover:border-green-500 transition-all shadow-[0_0_10px_rgba(0,255,65,0.1)] whitespace-nowrap"
        >
          TRACE_0 // A.D_
        </button>

        <nav
          role="navigation"
          className="hidden md:flex gap-1 lg:gap-2 pointer-events-auto border border-green-900/50 bg-black/85 px-2 lg:px-3 py-1.5 shadow-[0_0_10px_rgba(0,255,65,0.1)] backdrop-blur-sm"
          aria-label="Main navigation"
        >
          <button
            onClick={() => handleNavClick("summary")}
            onMouseEnter={playHoverSound}
            aria-label="Navigate to About section"
            className="min-h-11 px-2 lg:px-3 text-[10px] lg:text-xs tracking-widest hover:text-white hover:bg-green-900/30 transition-all whitespace-nowrap"
          >
            [ ABOUT ]
          </button>
          <button
            onClick={() => handleNavClick("experience")}
            onMouseEnter={playHoverSound}
            aria-label="Navigate to Experience section"
            className="min-h-11 px-2 lg:px-3 text-[10px] lg:text-xs tracking-widest hover:text-white hover:bg-green-900/30 transition-all whitespace-nowrap"
          >
            [ EXP ]
          </button>
          <button
            onClick={() => handleNavClick("projects")}
            onMouseEnter={playHoverSound}
            aria-label="Navigate to Projects section"
            className="min-h-11 px-2 lg:px-3 text-[10px] lg:text-xs tracking-widest hover:text-white hover:bg-green-900/30 transition-all whitespace-nowrap"
          >
            [ WORK ]
          </button>
          <button
            onClick={() => handleNavClick("skills")}
            onMouseEnter={playHoverSound}
            aria-label="Navigate to Skills section"
            className="min-h-11 px-2 lg:px-3 text-[10px] lg:text-xs tracking-widest hover:text-white hover:bg-green-900/30 transition-all whitespace-nowrap"
          >
            [ SKILLS ]
          </button>
          <button
            onClick={() => handleNavClick("education")}
            onMouseEnter={playHoverSound}
            aria-label="Navigate to Education section"
            className="min-h-11 px-2 lg:px-3 text-[10px] lg:text-xs tracking-widest hover:text-white hover:bg-green-900/30 transition-all whitespace-nowrap"
          >
            [ EDU ]
          </button>
        </nav>
      </header>

      <div className="fixed bottom-4 left-6 z-[60] text-[10px] text-green-500/40 pointer-events-none hidden md:block border-l border-green-500/40 pl-2">
        <div className="pointer-events-auto">
          <Tooltip text="TARGET_USER_PROFILE">
            <p className="mb-1">AAYAN_DESAI // PORTFOLIO</p>
          </Tooltip>
          <Tooltip text="FIREWALL_STATUS: ACTIVE">
            <p className="mb-1">SEC_PROTOCOL: ENABLED</p>
          </Tooltip>
          <Tooltip text="CIPHER: AES-256-GCM">
            <p>ENCRYPTION: AES-256-GCM</p>
          </Tooltip>
        </div>
      </div>

      {/* Reboot Sys Button */}
      <button
        onClick={() => handleNavClick("hero")}
        aria-label="Reboot System"
        className="fixed bottom-6 left-6 z-[60] bg-black border border-green-500 text-green-500/70 px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-green-500 hover:text-black transition-colors shadow-[0_0_15px_rgba(0,255,65,0.1)] block md:hidden"
      >
        [ REBOOT_SYS ]
      </button>

      {/* 3D Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ErrorBoundary fallback={<MobileGridFallback />}>
          <CyberGlobeScene
            isTerminalMode={isTerminalMode}
            isMobile={isMobile}
          />
        </ErrorBoundary>
      </div>

      {/* CLI Overlay */}
      {isGlitching && (
        <div className="fixed inset-0 z-[150] pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-green-900/10 backdrop-blur-[2px]"></div>
          <div className="animate-cyber-sweep h-32 bg-gradient-to-b from-transparent via-green-500/20 to-transparent border-y border-green-500/40 shadow-[0_0_30px_rgba(0,255,65,0.4)]"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMwZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30"></div>
        </div>
      )}
      <div className="pointer-events-none fixed inset-0 z-50 crt-overlay"></div>
      <div className="pointer-events-none fixed inset-0 z-40 scanlines opacity-30"></div>

      <CliOverlay />

      {/* View Toggle + Audio Player (bottom-right) */}
      <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-2">
        <AudioPlayer isMuted={isAudioMuted} toggleMute={toggleMute} />
        <button
          onClick={() => setIsTerminalMode(!isTerminalMode)}
          aria-label="Switch view mode"
          className={`border ${isTerminalMode ? "border-green-500 text-green-400" : "border-green-900/50 text-green-600"} bg-black/80 hover:bg-green-900/30 hover:border-green-500/50 px-3 py-2 transition-all shadow-[0_0_10px_rgba(0,255,65,0.1)] flex items-center gap-2 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest`}
        >
          {isTerminalMode ? "[ VISUAL ]" : "[ TERMINAL ]"}
        </button>
      </div>

      {/* Background Matrix Rain */}
      <MatrixRain opacity={isTerminalMode ? 0.6 : 0.0} />

      {/* 3D Scene is handled above */}

      {/* Side Logs Overlay */}
      <SystemLogs isTerminalMode={isTerminalMode} />

      {/* Right Side Navigation Dots */}
      <NavigationDots />

      {/* Main Content — Part 1: Hero, Summary */}
      <main
        role="main"
        id="main-content"
        className={`relative z-10 w-full flex flex-col gap-0 pb-48 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left ${isTerminalMode ? "lg:pr-[360px] max-w-7xl mx-auto -translate-x-2" : "max-w-7xl lg:ml-24 lg:w-[calc(100%-6rem)] xl:ml-32 xl:w-[calc(100%-8rem)] xl:pr-20 translate-x-0"}`}
      >
        <Hero />
      </main>

      {/* Marquee between Hero and About - proper position as section divider - outside main for edge-to-edge */}
      <div className="relative z-10 w-full">
        <Marquee />
      </div>

      {/* Main Content — Part 2: Summary through Footer */}
      <div
        className={`relative z-10 w-full flex flex-col gap-0 pb-48 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left ${isTerminalMode ? "lg:pr-[360px] max-w-7xl mx-auto -translate-x-2" : "max-w-7xl lg:ml-24 lg:w-[calc(100%-6rem)] xl:ml-32 xl:w-[calc(100%-8rem)] xl:pr-20 translate-x-0"}`}
      >
        <Summary />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Footer />
      </div>
      <BackToTop />
    </div>
  );
}
