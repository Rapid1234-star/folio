import React, { useEffect, useState } from "react";
import { playHoverSound, playClickSound } from "../utils/sfx";

type ModeToggleProps = {
  isTerminalMode: boolean;
  onToggle: () => void;
  compact?: boolean;
  /** Stretch to full slot width — use in mobile shell-slot-bottom */
  fullWidth?: boolean;
};

const SEEN_KEY = "trace_mode_toggle_noticed";

/**
 * Hardware-style VISUAL | TERMINAL switch for TRACE_OS.
 * Soft breathe + "try alt view" until first use, then calm.
 */
export default function ModeToggle({
  isTerminalMode,
  onToggle,
  compact = false,
  fullWidth = false,
}: ModeToggleProps) {
  const [invite, setInvite] = useState(false);

  useEffect(() => {
    try {
      setInvite(!sessionStorage.getItem(SEEN_KEY));
    } catch {
      setInvite(true);
    }
  }, []);

  const markSeenAndToggle = () => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
    setInvite(false);
    playClickSound();
    onToggle();
  };

  const showInvite = invite && !isTerminalMode;
  const pad = fullWidth
    ? "px-3 text-[11px] flex-1 justify-center"
    : compact
      ? "px-2 text-[9px]"
      : "px-3 text-[10px]";

  return (
    <div
      className={`relative shrink-0 ${fullWidth ? "w-full" : ""} ${compact && !fullWidth ? "" : "pt-0"}`}
      data-shell-control="mode-toggle"
    >
      {showInvite && (
        <span
          className="mode-toggle-beacon absolute -inset-1 rounded-sm pointer-events-none"
          aria-hidden="true"
        />
      )}

      {!compact && !fullWidth && showInvite && (
        <span
          className="absolute -top-4 right-0 text-[8px] font-bold tracking-[0.18em] uppercase text-[var(--accent)] whitespace-nowrap pointer-events-none mode-toggle-hint"
          aria-hidden="true"
        >
          try alt view ▾
        </span>
      )}

      <div
        role="group"
        aria-label="View mode switch"
        className={`mode-toggle relative flex items-stretch border bg-black/90 backdrop-blur-md overflow-hidden ${
          fullWidth ? "w-full" : ""
        } ${
          showInvite
            ? "border-[var(--accent)] shadow-[0_0_24px_rgba(0,255,136,0.4)]"
            : "border-[var(--border-accent)] shadow-[0_0_14px_rgba(0,255,136,0.15)]"
        }`}
      >
        <span
          aria-hidden="true"
          className="absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-2px)] bg-[var(--accent)] shadow-[0_0_16px_rgba(0,255,136,0.5)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            transform: isTerminalMode
              ? "translateX(calc(100% + 2px))"
              : "translateX(0)",
          }}
        />

        <button
          type="button"
          onClick={() => {
            if (isTerminalMode) markSeenAndToggle();
          }}
          onMouseEnter={playHoverSound}
          aria-pressed={!isTerminalMode}
          aria-label="Switch to Visual mode"
          className={`relative z-[1] ${pad} font-bold uppercase tracking-widest min-h-11 inline-flex items-center transition-colors ${
            !isTerminalMode
              ? "text-black"
              : "text-[var(--accent)]/50 hover:text-[var(--accent)]"
          }`}
        >
          Visual
        </button>

        <button
          type="button"
          onClick={() => {
            if (!isTerminalMode) markSeenAndToggle();
          }}
          onMouseEnter={playHoverSound}
          aria-pressed={isTerminalMode}
          aria-label="Switch to Terminal mode"
          className={`relative z-[1] ${pad} font-bold uppercase tracking-widest min-h-11 inline-flex items-center gap-1.5 transition-colors ${
            isTerminalMode
              ? "text-black"
              : "text-[var(--accent)] hover:text-white"
          }`}
        >
          {showInvite && (
            <span
              className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse shadow-[0_0_8px_#00ff88]"
              aria-hidden="true"
            />
          )}
          Terminal
        </button>
      </div>
    </div>
  );
}
