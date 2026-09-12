import React, { useState, useEffect } from 'react';
import { playHoverSound } from '../utils/sfx';

interface AudioPlayerProps {
  isMuted: boolean;
  toggleMute: () => void;
}

export default function AudioPlayer({ isMuted, toggleMute }: AudioPlayerProps) {
  // Simple fake EQ animation heights
  const [eqHeights, setEqHeights] = useState([4, 4, 4, 4]);

  useEffect(() => {
    if (isMuted) return;
    
    // Animate EQ bars randomly when playing
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
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMute(); } }}
      onMouseEnter={playHoverSound}
      className="flex items-center gap-3 border border-green-900/50 bg-black/80 px-3 py-2 shadow-[0_0_10px_rgba(0,255,65,0.1)] backdrop-blur-sm group hover:border-green-500/50 transition-all pointer-events-auto cursor-pointer"
      aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
    >
      {/* Play/Pause Button */}
      <div className={`w-11 h-11 flex items-center justify-center rounded-sm border transition-all ${isMuted ? 'border-green-900/50 text-green-700' : 'border-green-500 text-green-500 shadow-[0_0_8px_rgba(0,255,65,0.4)]'}`}>
        {isMuted ? (
          // Play Icon
          <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
            <path d="M1 1.5L10.5 7L1 12.5V1.5Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
        ) : (
          // Pause Icon
          <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="3" height="10" fill="currentColor"/>
            <rect x="7" y="2" width="3" height="10" fill="currentColor"/>
          </svg>
        )}
      </div>

      {/* Track Info */}
      <div className="flex flex-col justify-center min-w-[110px] max-w-[110px] overflow-hidden">
        <div className="text-[9px] text-green-500/60 uppercase tracking-widest font-bold mb-[2px]">SYS_AUDIO</div>
        <div className="text-xs font-bold tracking-wider truncate flex gap-2">
          {!isMuted ? (
            <div className="flex items-center gap-1 text-green-400">
              <span className="w-1.5 h-1.5 bg-green-500 animate-pulse rounded-full"></span>
              <span className="animate-pulse">CYBER.WAV</span>
            </div>
          ) : (
            <span className="text-green-900">PAUSED</span>
          )}
        </div>
      </div>

      {/* Mini EQ */}
      <div className="flex gap-[2px] h-[14px] items-end ml-1">
        {eqHeights.map((height, i) => (
          <div
            key={i}
            className={`w-[3px] transition-all duration-150 ease-linear ${
              !isMuted ? 'bg-green-500 shadow-[0_0_5px_rgba(0,255,65,0.5)]' : 'h-[2px] bg-green-900'
            }`}
            style={{
              height: !isMuted ? `${height}px` : '2px',
            }}
          />
        ))}
      </div>
    </div>
  );
}
