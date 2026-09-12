import React from 'react';

export default function Marquee() {
  return (
    <div className="w-[100vw] relative left-1/2 -translate-x-1/2 border-y border-green-500/40 py-2 md:py-3 overflow-hidden bg-[#050100] z-20 shadow-[0_0_15px_rgba(0,255,65,0.1)]" aria-hidden="true">
      <div className="flex w-max animate-marquee text-sm md:text-base font-bold tracking-widest text-green-500 uppercase">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center gap-6 pr-6 shrink-0">
            <span>[ QA AUTOMATION ]</span> <span className="text-green-800">//</span>
            <span>PLAYWRIGHT SPECIALIST</span> <span className="text-green-800">//</span>
            <span>[ CYBERSECURITY ]</span> <span className="text-green-800">//</span>
            <span>FULL-STACK DEVELOPER</span> <span className="text-green-800">//</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes endlessMarquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: endlessMarquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
}
