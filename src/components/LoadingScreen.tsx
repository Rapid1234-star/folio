import React, { useEffect, useState } from "react";

export default function LoadingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(onComplete, 500);
    }, 1400);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[200] bg-[#050a08] flex items-center justify-center transition-opacity duration-500 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
      aria-live="polite"
      aria-busy="true"
    >
      <div className="text-[var(--accent)] font-mono text-xl md:text-2xl font-bold flex items-center gap-2 drop-shadow-[0_0_20px_rgba(0,255,136,0.4)]">
        [ INITIALIZING TRACE_OS... ]
        <span
          className="w-4 h-6 bg-[var(--accent)] animate-pulse shadow-[0_0_12px_#00ff88]"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
