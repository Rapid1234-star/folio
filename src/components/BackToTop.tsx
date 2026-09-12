import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`back-to-top-btn bg-black/85 border border-[var(--accent)]/50 p-3 min-h-11 min-w-11 text-[var(--accent)] hover:bg-[var(--accent)] hover:text-black transition-all duration-300 backdrop-blur-md shadow-[0_0_16px_rgba(0,255,136,0.2)] group ${
        isVisible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-10 opacity-0 pointer-events-none"
      }`}
      aria-label="Back to top"
      data-shell-control="back-to-top"
    >
      <ArrowUp
        size={22}
        className="group-hover:-translate-y-0.5 transition-transform"
        aria-hidden="true"
      />
    </button>
  );
}
