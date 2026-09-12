import React, { useState, useEffect, useRef } from 'react';
import { playHoverSound, playClickSound } from '../utils/sfx';

export default function CliOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{type: 'cmd'|'out'|'last', text: string}[]>([
    { type: 'last', text: 'Last login: ' + new Date().toLocaleString() + ' on ttys001' },
    { type: 'out', text: 'TRACE_OS v2.4.1. Unauthorized access strictly prohibited.' },
    { type: 'out', text: 'Type "help" for available commands.' }
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const execute = (cmd: string) => {
     const trimmed = cmd.trim().toLowerCase();
     setHistory(prev => [...prev, { type: 'cmd', text: trimmed }]);
     
     switch(trimmed) {
       case 'help':
         setHistory(prev => [...prev, { type: 'out', text: 'AVAILABLE_COMMANDS: whoami, about, help, resume, projects, skills, education, contact, clear' }]);
         break;
       case 'whoami':
         setHistory(prev => [...prev, { type: 'out', text: 'USER: Aayan Irshad Desai | ROLE: SYS_ADMIN | ACCESS: [GRANTED]' }]);
         break;
       case 'about':
         setHistory(prev => [...prev, { type: 'out', text: 'Aayan Irshad Desai - QA Automation Engineer, Full-Stack Developer, and Cybersecurity Specialist.' }]);
         break;
       case 'clear':
         setHistory([
           { type: 'last', text: 'Last login: ' + new Date().toLocaleString() + ' on ttys001' },
           { type: 'out', text: 'TRACE_OS v2.4.1. Unauthorized access strictly prohibited.' },
           { type: 'out', text: 'Type "help" for available commands.' },
         ]);
         break;
       case 'resume':
         setHistory(prev => [...prev, { type: 'out', text: '> Navigating to Exec Summary...' }]);
         document.getElementById('summary')?.scrollIntoView({ behavior: 'smooth' });
         setIsOpen(false);
         break;
       case 'projects':
         setHistory(prev => [...prev, { type: 'out', text: '> Accessing Project Archives...' }]);
         document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
         setIsOpen(false);
         break;
       case 'skills':
         setHistory(prev => [...prev, { type: 'out', text: '> Loading System Capabilities...' }]);
         document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
         setIsOpen(false);
         break;
       case 'education':
         setHistory(prev => [...prev, { type: 'out', text: '> Loading Training & Certs...' }]);
         document.getElementById('education')?.scrollIntoView({ behavior: 'smooth' });
         setIsOpen(false);
         break;
       case 'contact':
         setHistory(prev => [...prev, { type: 'out', text: 'Email: aayanirshad99@gmail.com | Tel: +971 56-123-5034 | GitHub: Rapid1234-star' }]);
         break;
       default:
         if (trimmed) {
           setHistory(prev => [...prev, { type: 'out', text: `bash: command not found: ${trimmed}. Type "help" for a list of commands.` }]);
         }
     }
     setInput('');
     
     // Scroll to bottom of terminal
     setTimeout(() => {
       const terminalBody = document.getElementById('cli-body');
       if (terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
     }, 10);
  };

  const getLineClass = (h: {type: string, text: string}) => {
    if (h.type === 'cmd') return 'text-white';
    if (h.type === 'last') return 'text-slate-500 italic';
    if (h.text.includes('[GRANTED]') || h.text.includes('[OK]')) return 'text-green-400';
    if (h.text.includes('not found') || h.text.includes('error') || h.text.includes('Error')) return 'text-red-400';
    if (h.text.startsWith('>') || h.text.includes('Navigating') || h.text.includes('Accessing') || h.text.includes('Loading')) return 'text-cyan-400';
    return 'text-green-400/80';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] font-mono flex flex-col" style={{ background: '#0a0a0a' }}>
      {/* Title bar with traffic lights */}
      <div className="flex items-center gap-3 px-5 py-3 bg-[#1a1a1a] border-b border-green-900/60 shrink-0">
        <div className="flex gap-1.5">
          <button onClick={() => setIsOpen(false)} className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-125 transition-all" style={{ boxShadow: '0 0 4px rgba(255,95,87,0.5)' }} title="close" aria-label="Close terminal" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" style={{ boxShadow: '0 0 4px rgba(254,188,46,0.4)' }} />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" style={{ boxShadow: '0 0 4px rgba(40,200,64,0.4)' }} />
        </div>
        <span className="flex-1 text-center text-xs text-slate-500 tracking-widest font-mono">
          <span className="w-2 h-2 bg-green-500 animate-pulse inline-block mr-2 align-middle"></span>
          AAYAN_DESAI // SYS_ADMIN_CLI &nbsp;·&nbsp; TTY_01 :: ONLINE
        </span>
        <span className="text-[10px] text-green-500/30 tracking-widest hidden md:block">SECURE SHELL</span>
      </div>

      {/* Terminal body */}
      <div 
        id="cli-body" 
        className="flex-1 overflow-y-auto p-6 md:p-10 space-y-1.5 text-sm md:text-base flex flex-col justify-end"
        style={{ 
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.012) 2px, rgba(0,255,65,0.012) 4px)'
        }}
      >
        {history.map((h, i) => (
          <div key={i} className={getLineClass(h)}>
            {h.type === 'cmd' 
              ? <><span className="text-green-500 font-bold">aayan@trace-os:~$</span> {h.text}</>
              : <>{h.text}</>
            }
          </div>
        ))}
      </div>

      {/* Input line */}
      <div className="flex items-center gap-2 text-sm md:text-base border-t border-green-900/60 pt-4 pb-4 px-6 md:px-10 bg-[#0a0a0a] shrink-0">
        <span className="text-green-500 font-bold shrink-0">aayan@trace-os:~$</span>
        <input 
          ref={inputRef}
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') execute(input);
          }}
          aria-label="Terminal command input"
          className="flex-1 bg-transparent border-none outline-none text-white font-mono"
          spellCheck={false}
          autoComplete="off"
          autoFocus
        />
        <span className="w-2.5 h-5 bg-green-500 animate-pulse inline-block"></span>
      </div>

      {/* Quick execute bar */}
      <div className="flex overflow-x-auto gap-3 text-xs border-t border-green-900/40 px-6 md:px-10 py-3 whitespace-nowrap scrollbar-hide bg-[#111] shrink-0">
         <span className="text-slate-600 py-1 shrink-0 tracking-widest uppercase">Quick Exec:</span>
         {['whoami', 'about', 'help', 'resume', 'projects', 'skills', 'contact', 'clear'].map(cmd => (
           <button key={cmd} onMouseEnter={playHoverSound} onClick={() => { playClickSound(); execute(cmd); }} aria-label={`Execute command: ${cmd}`} className="shrink-0 border border-green-900/50 bg-green-900/10 text-green-400 hover:bg-green-500 hover:text-black px-3 py-1.5 transition-colors uppercase tracking-wider">
             {cmd}
           </button>
         ))}
      </div>
    </div>
  );
}
