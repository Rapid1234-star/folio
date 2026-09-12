import React from 'react';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer 
      role="contentinfo" 
      className="w-full border-t border-green-900/50 bg-black/90 pt-10 pb-32 px-6 md:px-12 relative z-10 mt-12 font-mono"
      aria-label="Site footer"
    >
      {/* Top accent line */}
      <div className="w-full h-px bg-gradient-to-r from-green-500/40 via-cyan-400/20 to-transparent mb-8" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        {/* Left: terminal-style info */}
        <div className="flex flex-col gap-2">
          <div className="text-green-500 text-xs font-bold tracking-widest mb-1">
            <span className="w-2 h-2 bg-green-500 animate-pulse inline-block mr-2 align-middle"></span>
            TRACE_OS v2.4.1 &nbsp;// &nbsp;ALL SYSTEMS OPERATIONAL
          </div>
          <div className="text-slate-500 text-xs">
            &gt; EOF &nbsp;// &nbsp;© 2026 Aayan Desai
          </div>
          <a 
            href="mailto:aayanirshad99@gmail.com" 
            className="text-xs text-slate-400 hover:text-green-400 transition-colors tracking-wide mt-1"
          >
            aayanirshad99@gmail.com
          </a>
        </div>

        {/* Right: links + back to top */}
        <div className="flex flex-col items-start md:items-end gap-4">
          <div className="flex gap-5 items-center">
            <a href="https://github.com/Rapid1234-star" target="_blank" rel="noreferrer" aria-label="GitHub profile" className="text-slate-400 hover:text-green-400 transition-colors hover:shadow-[0_0_8px_#00ff41]">
              <Github size={18} aria-hidden="true" />
            </a>
            <a href="https://linkedin.com/in/aayan-desai" target="_blank" rel="noreferrer" aria-label="LinkedIn profile" className="text-slate-400 hover:text-green-400 transition-colors hover:shadow-[0_0_8px_#00ff41]">
              <Linkedin size={18} aria-hidden="true" />
            </a>
            <a href="mailto:aayanirshad99@gmail.com" aria-label="Send email" className="text-slate-400 hover:text-green-400 transition-colors hover:shadow-[0_0_8px_#00ff41]">
              <Mail size={18} aria-hidden="true" />
            </a>
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-green-500/50 hover:text-green-400 border border-green-900/40 hover:border-green-500/40 px-3 py-1.5 transition-all"
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
