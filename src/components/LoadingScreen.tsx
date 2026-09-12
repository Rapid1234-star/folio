import React, { useEffect, useState } from 'react';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Show for 1.5 seconds, then fade out
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(onComplete, 500); // 500ms fade transition
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[200] bg-black flex items-center justify-center transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-green-500 font-mono text-xl md:text-2xl font-bold flex items-center gap-2">
        [ INITIALIZING TRACE_OS... ]<span className="w-4 h-6 bg-green-500 animate-pulse"></span>
      </div>
    </div>
  );
}
