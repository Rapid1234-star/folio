import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { playHoverSound, playClickSound } from "../utils/sfx";

const navItems = [
  { id: "summary", label: "ABOUT" },
  { id: "experience", label: "EXP" },
  { id: "projects", label: "WORK" },
  { id: "skills", label: "SKILLS" },
  { id: "education", label: "EDU" },
  { id: "contact", label: "LINK" },
];

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (targetId: string) => void;
  isMuted: boolean;
  toggleMute: () => void;
}

export default function MobileNav({
  isOpen,
  onClose,
  onNavigate,
  isMuted,
  toggleMute,
}: MobileNavProps) {
  const firstItemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      firstItemRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[90] md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute top-0 right-0 h-full w-72 max-w-[85vw] bg-[#0a120e] border-l border-[var(--border-soft)] flex flex-col pb-[var(--safe-bottom)]">
        <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--border-soft)]">
          <span className="text-[var(--accent)] text-xs font-bold tracking-widest">
            NAV_MENU
          </span>
          <button
            onClick={onClose}
            className="text-[var(--accent)] hover:text-white transition-colors min-h-11 min-w-11 flex items-center justify-center"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav
          className="flex-1 flex flex-col py-4 overflow-y-auto"
          role="navigation"
          aria-label="Mobile navigation"
        >
          {navItems.map((item, idx) => (
            <button
              key={item.id}
              ref={idx === 0 ? firstItemRef : undefined}
              onClick={() => {
                playClickSound();
                onNavigate(item.id);
                onClose();
              }}
              onMouseEnter={playHoverSound}
              className="px-6 py-4 text-left text-sm font-bold tracking-widest text-[var(--accent)]/75 hover:text-white hover:bg-[var(--accent)]/10 transition-all min-h-11 flex items-center gap-3"
            >
              <span className="text-[var(--accent)]/30 text-xs">0{idx + 1}_</span>
              [ {item.label} ]
            </button>
          ))}
        </nav>

        {/* System actions — live here on mobile so bottom chrome stays ModeToggle-only */}
        <div className="px-4 py-4 border-t border-[var(--border-soft)] flex flex-col gap-2">
          <p className="text-[9px] text-[var(--accent)]/40 tracking-[0.2em] uppercase mb-1">
            System
          </p>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onNavigate("hero");
              onClose();
            }}
            onMouseEnter={playHoverSound}
            aria-label="Reboot System"
            className="w-full min-h-11 border border-[var(--accent)] text-[var(--accent)] text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--accent)] hover:text-black transition-colors"
          >
            [ REBOOT_SYS ]
          </button>
          <button
            type="button"
            onClick={() => {
              toggleMute();
            }}
            onMouseEnter={playHoverSound}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            className="w-full min-h-11 border border-[var(--border-soft)] text-[var(--accent)]/80 text-[10px] font-bold uppercase tracking-widest hover:border-[var(--accent)] hover:text-white transition-colors"
          >
            {isMuted ? "[ AUDIO: MUTED ]" : "[ AUDIO: ON ]"}
          </button>
          <p className="text-[10px] text-[var(--accent)]/35 tracking-widest pt-2">
            TRACE_OS v2.5
          </p>
        </div>
      </div>
    </div>
  );
}
