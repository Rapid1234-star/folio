import React, { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { scrollState } from '../../utils/scrollState';

const roles = ['QA Automation Engineer', 'Full-Stack Developer', 'Cybersecurity Specialist'];

export default function Hero() {
  // Boot sequence states
  const [bootState, setBootState] = useState<'init' | 'login' | 'pass' | 'grant' | 'name' | 'ready'>('init');
  const [loginText, setLoginText] = useState('');
  const [passText, setPassText] = useState('');
  const [nameText, setNameText] = useState('');
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [processTime] = useState(() => (Math.random() * 0.08 + 0.02).toFixed(3));
  
  // Terminal Role Typewriter
  const [roleText, setRoleText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeletingRole, setIsDeletingRole] = useState(false);
  
  const heroRef = useRef<HTMLElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(terminalRef.current, {
      y: 30,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.2
    });
  }, { scope: heroRef });

  // Hide scroll hint once user scrolls
  useEffect(() => {
    const unsub = scrollState.subscribe((p) => {
      if (p > 0.03) setShowScrollHint(false);
      else setShowScrollHint(true);
    });
    return unsub;
  }, []);

  // Boot Sequence Logic
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isActive = true;

    // Safety fallback: if sequence takes longer than 6s, force ready state
    const fallbackTimer = setTimeout(() => {
      if (isActive) {
        setBootState('ready');
        setLoginText('aayan_desai@system');
        setPassText('********************');
        setNameText('AAYAN IRSHAD DESAI');
      }
    }, 6000);

    const sequence = async () => {
      const wait = (ms: number) => new Promise(resolve => {
        timeoutId = setTimeout(resolve, ms);
      });
      
      const loginTarget = 'aayan_desai@system';
      const passTarget = '********************';
      const nameTarget = 'AAYAN IRSHAD DESAI';

      await wait(600);
      if (!isActive) return;
      setBootState('login');

      for (let i = 1; i <= loginTarget.length; i++) {
        setLoginText(loginTarget.substring(0, i));
        await wait(40);
        if (!isActive) return;
      }
      
      await wait(300);
      if (!isActive) return;
      setBootState('pass');

      for (let i = 1; i <= passTarget.length; i++) {
        setPassText(passTarget.substring(0, i));
        await wait(20);
        if (!isActive) return;
      }
      
      await wait(400);
      if (!isActive) return;
      setBootState('grant');
      
      await wait(500);
      if (!isActive) return;
      setBootState('name');

      for (let i = 1; i <= nameTarget.length; i++) {
        setNameText(nameTarget.substring(0, i));
        await wait(50);
        if (!isActive) return;
      }
      
      await wait(600);
      if (!isActive) return;
      
      clearTimeout(fallbackTimer);
      setBootState('ready');
    };

    sequence();

    return () => { 
      isActive = false; 
      clearTimeout(timeoutId);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Role Typewriter Logic (only runs after boot is ready)
  useEffect(() => {
    if (bootState !== 'ready') return;

    let typeSpeed = isDeletingRole ? 40 : 100;
    const currentRole = roles[roleIndex];

    if (!isDeletingRole && roleText === currentRole) {
      typeSpeed = 2000;
    }

    const timer = setTimeout(() => {
      if (!isDeletingRole && roleText === currentRole) {
        setIsDeletingRole(true);
      } else if (isDeletingRole && roleText === '') {
        setIsDeletingRole(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      } else {
        setRoleText(currentRole.substring(0, roleText.length + (isDeletingRole ? -1 : 1)));
      }
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [roleText, isDeletingRole, roleIndex, bootState]);

  return (
    <section ref={heroRef} className="relative w-full h-screen flex flex-col justify-center px-6 md:px-24 font-mono" id="hero">
      
      <div ref={terminalRef} className="max-w-5xl z-10 relative" style={{ border: '1px solid rgba(0,255,65,0.15)', boxShadow: '0 0 60px rgba(0,255,65,0.06), 0 40px 80px rgba(0,0,0,0.7)' }}>
        {/* Terminal title bar — macOS/Linux style chrome */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1a1a] border-b border-[rgba(0,255,65,0.1)]">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" style={{ boxShadow: '0 0 4px rgba(255,95,87,0.6)' }} title="close" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" style={{ boxShadow: '0 0 4px rgba(254,188,46,0.6)' }} title="minimize" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" style={{ boxShadow: '0 0 4px rgba(40,200,64,0.6)' }} title="maximize" />
          </div>
          <span className="flex-1 text-center text-[11px] text-slate-500 font-mono tracking-wider">
            bash — aayan@trace-os:~ — 80×24
          </span>
          <span className="text-[10px] text-green-500/30 font-mono tracking-widest hidden md:block">
            [ PRESS ` FOR CLI ]
          </span>
        </div>

        {/* Terminal body */}
        <div className="bg-[#0c0c0c] p-5 md:p-8" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.012) 2px, rgba(0,255,65,0.012) 4px)' }}>
          <div className="text-green-500 mb-6 text-sm md:text-base space-y-1" aria-live="polite">
            <p>&gt; Establishing secure connection...</p>
            {bootState !== 'init' && (
              <p><span className="text-slate-400">login:</span> <span className="text-white">{loginText}</span>{bootState === 'login' && <span className="animate-pulse bg-green-500 w-2 h-4 inline-block ml-1 align-middle"></span>}</p>
            )}
            {(bootState === 'pass' || bootState === 'grant' || bootState === 'name' || bootState === 'ready') && (
              <p><span className="text-slate-400">Password:</span> <span className="text-slate-500">{passText}</span>{bootState === 'pass' && <span className="animate-pulse bg-green-500 w-2 h-4 inline-block ml-1 align-middle"></span>}</p>
            )}
            {(bootState === 'grant' || bootState === 'name' || bootState === 'ready') && (
              <p>&gt; Access: <span className="text-black bg-green-500 px-2 py-0.5 ml-1 font-bold animate-pulse">GRANTED</span></p>
            )}
          </div>
          
          {(bootState === 'name' || bootState === 'ready') && (
            <div className="transition-opacity duration-1000 opacity-100">
              <p className="text-slate-500 text-xs md:text-sm mb-2">$ cat /home/aayan/.profile</p>
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-[0_0_10px_rgba(0,255,65,0.4)] break-words">
                {nameText}
                {bootState === 'name' && <span className="animate-pulse bg-green-500 w-4 h-8 inline-block ml-2 align-middle"></span>}
              </h1>
            </div>
          )}
          
          {bootState === 'ready' && (
            <div className="transition-opacity duration-1000 opacity-100">
              <div className="flex items-center text-lg md:text-2xl text-green-400 mb-10 h-10">
                <span>~/profile $ <span className="text-slate-400 text-base">role:</span> <span className="text-white font-medium bg-green-900/40 px-2 border-b-2 border-green-500">{roleText}</span><span className="w-3 md:w-4 h-6 md:h-8 bg-green-400 ml-1 inline-block align-middle animate-pulse shadow-[0_0_8px_#00ff41]"></span></span>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-4 text-xs md:text-sm text-slate-400">
                <span className="border border-green-900/50 px-3 py-1.5 bg-black flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_#00ff41]"></span>
                  LOC: AL NAHDA, SHARJAH
                </span>
                <a href="tel:+971561235034" className="border border-green-900/50 px-3 py-1.5 bg-black hover:border-green-500 hover:text-green-400 transition-colors">
                  TEL: +971-56-123-5034
                </a>
                <a href="mailto:aayanirshad99@gmail.com" className="border border-green-900/50 px-3 py-1.5 bg-black hover:border-green-500 hover:text-green-400 transition-colors">
                  EMAIL: aayanirshad99@gmail.com
                </a>
                <a href="https://github.com/Rapid1234-star" target="_blank" rel="noreferrer" className="border border-green-900/50 px-3 py-1.5 bg-black hover:border-green-500 hover:text-green-400 transition-colors">
                  GITHUB: Rapid1234-star
                </a>
                <a href="https://linkedin.com/in/aayan-desai" target="_blank" rel="noreferrer" className="border border-green-900/50 px-3 py-1.5 bg-black hover:border-green-500 hover:text-green-400 transition-colors">
                  LINKEDIN: aayan-desai
                </a>
              </div>

              <div className="mt-8 border-t border-green-900/40 pt-6">
                <div className="hidden md:block text-slate-400 text-xs mb-3 font-mono">
                  <span className="text-green-500">$</span> wget https://system.core/aayan_cv.pdf<br/>
                  <span className="text-green-500 opacity-70">[==================================&gt;] 100%</span>
                </div>
                <a href="/aayan_cv.pdf" download className="inline-flex items-center gap-3 bg-black border border-green-500 px-6 py-3 text-green-500 font-bold text-xs uppercase tracking-widest hover:bg-green-500 hover:text-black transition-all shadow-[0_0_15px_rgba(0,255,65,0.15)] group">
                  <span className="w-2 h-2 bg-green-500 group-hover:bg-black animate-pulse"></span>
                  [ DOWNLOAD_CV.PDF ]
                </a>
              </div>

              {/* Terminal footer status */}
              <div className="text-[10px] text-slate-600 mt-6 border-t border-green-900/30 pt-3 font-mono">
                [PROCESS COMPLETED IN {processTime}s] &nbsp;|&nbsp; TRACE_OS v2.4.1 &nbsp;|&nbsp; SECURE_SHELL
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll hint - fades out on scroll */}
      <div 
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 text-xs tracking-widest animate-bounce z-10 transition-opacity duration-500 ${showScrollHint ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-hidden="true"
      >
        <span>[ SCROLL TO EXPLORE ]</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
