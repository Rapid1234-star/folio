import React from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * CSS-only animated grid for mobile devices or when WebGL fails.
 * Zero GPU cost, looks like Tron cyberspace.
 */
export default function MobileGridFallback() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black flex items-end justify-center perspective-[1000px]">
      <div 
        className="w-[200vw] h-[100vh] origin-bottom opacity-40"
        style={{
          transform: 'rotateX(60deg) translateY(100px)',
          backgroundSize: '40px 40px',
          backgroundImage: `
            linear-gradient(to right, rgba(0, 255, 65, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 255, 65, 0.2) 1px, transparent 1px)
          `,
          animation: prefersReducedMotion ? 'none' : 'gridScroll 3s linear infinite',
        }}
      />
      <style>{`
        @keyframes gridScroll {
          0% { transform: rotateX(60deg) translateY(0); }
          100% { transform: rotateX(60deg) translateY(40px); }
        }
      `}</style>
    </div>
  );
}
