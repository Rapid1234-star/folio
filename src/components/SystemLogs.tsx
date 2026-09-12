import React, { useEffect, useState, useRef } from 'react';
import { scrollState } from '../utils/scrollState';

const ALL_LOGS = [
  { t: 0.00, msg: "Initializing kernel modules..." },
  { t: 0.02, msg: "Mounting virtual filesystems... [OK]" },
  { t: 0.05, msg: "Starting secure tunnel..." },
  { t: 0.08, msg: "Handshake successful. Link established." },
  { t: 0.12, msg: "Fetching user profile: Aayan Irshad Desai" },
  { t: 0.18, msg: "Parsing executive summary parameters..." },
  { t: 0.22, msg: "Bypassing firewall [OK]" },
  { t: 0.30, msg: "Loading module: EXPERIENCE_LOG.sys" },
  { t: 0.35, msg: "Injecting Playwright automation suites..." },
  { t: 0.42, msg: "Validating endpoint scripts via Azure Bastion" },
  { t: 0.50, msg: "Extracting archive: PROJECT_RECORDS.tar.gz" },
  { t: 0.60, msg: "Compiling neural networks & computer vision models" },
  { t: 0.70, msg: "Parsing AI Resume Analyzer outputs" },
  { t: 0.80, msg: "Mapping system capabilities (Languages, Frameworks)" },
  { t: 0.85, msg: "Auditing cybersecurity fundamentals..." },
  { t: 0.90, msg: "Decrypting certification keys..." },
  { t: 0.95, msg: "Verification complete." },
  { t: 0.98, msg: "EOF Reached. Connection stable." },
];

export default function SystemLogs({ isTerminalMode }: { isTerminalMode: boolean }) {
  const [logs, setLogs] = useState<{ time: string, msg: string }[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate initial startup logs
    const baseTime = new Date();
    const initialLogs = [
      { time: baseTime.toISOString().substring(11, 19), msg: "System boot sequence initiated." }
    ];
    setLogs(initialLogs);

    let lastLogCount = -1;

    const unsubscribe = scrollState.subscribe((p) => {
      // Find all logs that should be visible up to current scroll progress
      const visibleLogs = ALL_LOGS.filter(log => p >= log.t);
      
      if (visibleLogs.length === lastLogCount) return;
      lastLogCount = visibleLogs.length;

      const mappedLogs = visibleLogs.map((log, i) => {
         const d = new Date(baseTime);
         d.setSeconds(d.getSeconds() + i * 2);
         return {
           time: d.toISOString().substring(11, 19),
           msg: log.msg
         };
      });
      
      setLogs([...initialLogs, ...mappedLogs]);
      
      // Auto-scroll to bottom of logs
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    });
    
    return unsubscribe;
  }, []);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle system logs"
        className={`fixed top-20 right-0 z-50 bg-black border-l border-t border-b border-green-500 text-green-500 px-2 py-3 text-xs font-bold tracking-widest hover:bg-green-500 hover:text-black transition-colors lg:hidden ${isTerminalMode ? 'block' : 'hidden'}`}
        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
      >
        {isOpen ? 'CLOSE_LOGS' : 'SYS_LOGS'}
      </button>

      <div className={`fixed right-0 top-0 bottom-0 w-64 xl:w-80 border-l border-green-900/50 bg-black/90 backdrop-blur-md z-40 flex flex-col text-xs font-mono p-4 pointer-events-auto transition-transform duration-500 ${isTerminalMode ? (isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0') : 'translate-x-full'} ${isTerminalMode ? 'opacity-100' : 'opacity-30'}`}>
        <div className="text-green-500 border-b border-green-900/50 pb-2 mb-2 font-bold tracking-widest flex justify-between items-center">
          <span>SYS_TRACE_LOG</span>
          <span className="w-2 h-2 bg-green-500 animate-pulse"></span>
        </div>
        <div ref={containerRef} className="flex-1 overflow-hidden flex flex-col justify-end gap-1.5 text-green-400/80">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-slate-500 shrink-0">[{log.time}]</span>
              <span className={i === logs.length - 1 ? 'animate-pulse text-green-300' : ''}>{log.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
