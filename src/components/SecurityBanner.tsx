import React, { useMemo } from "react";

export default function SecurityBanner({ title }: { title: string }) {
  const hexHash = useMemo(
    () => Math.random().toString(16).substring(2, 10).toUpperCase(),
    [],
  );
  const cleanTitle = title
    .replace(/0x\d+_/g, "")
    .replace(/_/g, " ")
    .toLowerCase();

  return (
    <div
      className="w-[100vw] relative left-1/2 -translate-x-1/2 min-h-12 py-3 mb-2 select-none overflow-hidden bg-black/40 border-y border-green-900/30"
      aria-label={cleanTitle}
    >
      <div className="flex min-h-6 items-center text-green-500/60 font-mono text-[9px] md:text-xs whitespace-nowrap animate-marquee">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 shrink-0">
            <span className="text-green-500 font-bold">{">"}</span>
            <span className="tracking-[0.12em] uppercase">{cleanTitle}</span>
            <span className="text-green-500/30">0x{hexHash}</span>
            <span className="w-16 h-px bg-gradient-to-r from-green-500/40 to-transparent"></span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes bannerMarquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: bannerMarquee 30s linear infinite;
          width: max-content;
        }
      `}</style>
    </div>
  );
}
