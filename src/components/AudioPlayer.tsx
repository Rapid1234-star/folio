import React, { useState, useEffect } from "react";
import { playHoverSound } from "../utils/sfx";

interface AudioPlayerProps {
  isMuted: boolean;
  toggleMute: () => void;
}

export default function AudioPlayer({ isMuted, toggleMute }: AudioPlayerProps) {
  const [eqHeights, setEqHeights] = useState([4, 4, 4, 4]);

  useEffect(() => {
    if (isMuted) return;

    const interval = setInterval(() => {
      setEqHeights([
        Math.max(3, Math.random() * 14),
        Math.max(3, Math.random() * 14),
        Math.max(3, Math.random() * 14),
        Math.max(3, Math.random() * 14),
      ]);
    }, 150);

    return () => clearInterval(interval);
  }, [isMuted]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={toggleMute}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleMute();
        }
      }}
      onMouseEnter={playHoverSound}
      className="flex items-center gap-3 border border-[var(--border-soft)] bg-[var(--card-bg)] px-3 py-2 backdrop-blur-md group hover:border-[var(--border-accent)] transition-all pointer-events-auto cursor-pointer min-h-11"
      aria-label={isMuted ? "Unmute audio" : "Mute audio"}
      data-shell-control="audio"
    >
      <div
        className={`w-11 h-11 flex items-center justify-center border transition-all ${
          isMuted
            ? "border-[var(--border-soft)] text-[var(--text-muted)]"
            : "border-[var(--accent)] text-[var(--accent)] shadow-[0_0_8px_rgba(52,211,153,0.35)]"
        }`}
      >
        {isMuted ? (
          <svg
            width="12"
            height="14"
            viewBox="0 0 12 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="ml-1"
            aria-hidden="true"
          >
            <path
              d="M1 1.5L10.5 7L1 12.5V1.5Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            width="12"
            height="14"
            viewBox="0 0 12 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect x="2" y="2" width="3" height="10" fill="currentColor" />
            <rect x="7" y="2" width="3" height="10" fill="currentColor" />
          </svg>
        )}
      </div>

      <div className="flex flex-col justify-center min-w-[110px] max-w-[110px] overflow-hidden">
        <div className="text-[9px] text-[var(--accent)]/60 uppercase tracking-widest font-bold mb-[2px]">
          SYS_AUDIO
        </div>
        <div className="text-xs font-bold tracking-wider truncate flex gap-2">
          {!isMuted ? (
            <div className="flex items-center gap-1 text-[var(--accent)]">
              <span className="w-1.5 h-1.5 bg-[var(--accent)] animate-pulse rounded-full" />
              <span className="animate-pulse">CYBER.WAV</span>
            </div>
          ) : (
            <span className="text-[var(--accent)]/35">PAUSED</span>
          )}
        </div>
      </div>

      <div className="flex gap-[2px] h-[14px] items-end ml-1" aria-hidden="true">
        {eqHeights.map((height, i) => (
          <div
            key={i}
            className={`w-[3px] transition-all duration-150 ease-linear ${
              !isMuted
                ? "bg-[var(--accent)]"
                : "h-[2px] bg-[var(--text-muted)]/40"
            }`}
            style={{
              height: !isMuted ? `${height}px` : "2px",
            }}
          />
        ))}
      </div>
    </div>
  );
}
