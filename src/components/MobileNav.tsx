import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { playHoverSound, playClickSound } from '../utils/sfx';

const navItems = [
  { id: 'summary', label: 'ABOUT' },
  { id: 'experience', label: 'EXP' },
  { id: 'projects', label: 'WORK' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'education', label: 'EDU' },
];

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (targetId: string) => void;
}

export default function MobileNav({ isOpen, onClose, onNavigate }: MobileNavProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLButtonElement>(null);

  // Focus trap
  useEffect(() => {
    if (isOpen) {
      firstItemRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed inset-0 z-[90] md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Menu panel */}
      <div className="absolute top-0 right-0 h-full w-72 bg-[#0a0f0a] border-l border-green-900/50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-green-900/50">
          <span className="text-green-500 text-xs font-bold tracking-widest">NAV_MENU</span>
          <button
            onClick={onClose}
            className="text-green-500 hover:text-white transition-colors min-h-11 min-w-11 flex items-center justify-center"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 flex flex-col py-4" role="navigation" aria-label="Mobile navigation">
          {navItems.map((item, idx) => (
            <button
              key={item.id}
              ref={idx === 0 ? firstItemRef : undefined}
              onClick={() => { playClickSound(); onNavigate(item.id); onClose(); }}
              onMouseEnter={playHoverSound}
              className="px-6 py-4 text-left text-sm font-bold tracking-widest text-green-500/70 hover:text-white hover:bg-green-900/20 transition-all min-h-11 flex items-center gap-3"
            >
              <span className="text-green-900 text-xs">0{idx + 1}_</span>
              [ {item.label} ]
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-green-900/50 text-[10px] text-green-900 tracking-widest">
          TRACE_OS v2.4.1
        </div>
      </div>
    </div>
  );
}
