import React from "react";
import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer
      role="contentinfo"
      className="w-full border-t border-[var(--border-soft)] bg-black/85 pt-10 pb-10 px-6 md:px-12 relative z-10 mt-12 font-mono"
      aria-label="Site footer"
    >
      <div className="w-full h-px bg-gradient-to-r from-[var(--accent)]/45 via-[var(--accent-cyan)]/25 to-transparent mb-8" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 max-w-5xl mx-auto">
        <div className="flex flex-col gap-2">
          <div className="text-[var(--accent)] text-xs font-bold tracking-widest mb-1">
            <span className="w-2 h-2 bg-[var(--accent)] animate-pulse inline-block mr-2 align-middle shadow-[0_0_8px_#00ff88]" />
            TRACE_OS v2.5 &nbsp;// &nbsp;ALL SYSTEMS OPERATIONAL
          </div>
          <div className="text-slate-500 text-xs">
            &gt; EOF &nbsp;// &nbsp;© 2026 Aayan Desai
          </div>
          <a
            href="mailto:aayanirshad99@gmail.com"
            className="inline-flex items-center min-h-11 py-2 text-sm text-slate-400 hover:text-[var(--accent)] transition-colors tracking-wide mt-1"
          >
            aayanirshad99@gmail.com
          </a>
        </div>

        <div className="flex flex-col items-start md:items-end gap-4">
          <div className="flex gap-5 items-center">
            <a
              href="https://github.com/Rapid1234-star"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              className="text-slate-400 hover:text-[var(--accent)] transition-colors hover:shadow-[0_0_8px_#00ff88] min-h-11 min-w-11 inline-flex items-center justify-center"
            >
              <Github size={18} aria-hidden="true" />
            </a>
            <a
              href="https://linkedin.com/in/aayan-desai"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile"
              className="text-slate-400 hover:text-[var(--accent)] transition-colors hover:shadow-[0_0_8px_#00ff88] min-h-11 min-w-11 inline-flex items-center justify-center"
            >
              <Linkedin size={18} aria-hidden="true" />
            </a>
            <a
              href="mailto:aayanirshad99@gmail.com"
              aria-label="Send email"
              className="text-slate-400 hover:text-[var(--accent)] transition-colors hover:shadow-[0_0_8px_#00ff88] min-h-11 min-w-11 inline-flex items-center justify-center"
            >
              <Mail size={18} aria-hidden="true" />
            </a>
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[var(--accent)]/55 hover:text-[var(--accent)] border border-[var(--border-soft)] hover:border-[var(--accent)]/40 px-3 py-2 min-h-11 transition-all"
            aria-label="Back to top"
          >
            <ArrowUp size={10} aria-hidden="true" />
            [ BACK TO TOP ]
          </button>
        </div>
      </div>
    </footer>
  );
}
