import React, { useEffect, useState } from 'react';
import { playHoverSound, playClickSound } from '../utils/sfx';

const sections = [
  { id: 'hero', label: '00_ROOT' },
  { id: 'summary', label: '01_SUMMARY' },
  { id: 'experience', label: '02_EXPERIENCE' },
  { id: 'projects', label: '03_PROJECTS' },
  { id: 'skills', label: '04_SKILLS' },
  { id: 'education', label: '05_EDUCATION' },
];

export default function NavigationDots() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[70] hidden xl:flex flex-col gap-4 pointer-events-auto items-end" role="navigation" aria-label="Section navigation">
      {sections.map((sec) => {
        const isActive = activeSection === sec.id;
        return (
          <button 
            key={sec.id} 
            onMouseEnter={playHoverSound}
            onClick={() => { playClickSound(); scrollTo(sec.id); }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                playClickSound();
                scrollTo(sec.id);
              }
            }}
            aria-label={sec.label}
            aria-current={isActive ? 'true' : undefined}
            className="group flex items-center gap-3 cursor-pointer bg-transparent border-none outline-none"
          >
            <span className={`text-xs font-mono tracking-widest font-bold uppercase transition-all duration-300 hidden 2xl:block ${isActive ? 'text-green-400 opacity-100 translate-x-0' : 'text-green-900 opacity-0 translate-x-4 group-hover:opacity-50 group-hover:translate-x-0'}`}>
              {sec.label}
            </span>
            <div className="relative flex items-center justify-center w-3 h-3">
              {isActive && (
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
              )}
              <div className={`w-1.5 h-1.5 transition-all duration-500 ${isActive ? 'bg-green-400 scale-150 shadow-[0_0_10px_#00ff41]' : 'bg-green-900/50 group-hover:bg-green-700'}`}></div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
