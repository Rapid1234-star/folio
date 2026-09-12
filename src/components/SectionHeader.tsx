import React from 'react';

interface SectionHeaderProps {
  tag: string;
  title: string;
  subtitle: string;
}

export default function SectionHeader({ tag, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="w-full max-w-5xl mx-auto mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <span className="inline-block bg-green-500 text-black px-3 py-1 text-[10px] md:text-xs font-bold uppercase tracking-widest w-fit">
          {tag}
        </span>
        <div className="flex-1 flex items-center gap-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            {title}
          </h2>
          <span className="hidden sm:block flex-1 h-px bg-gradient-to-r from-green-500/40 to-transparent"></span>
        </div>
      </div>
      {subtitle && (
        <p className="mt-2 text-sm text-slate-400 ml-0 sm:ml-[4.5rem]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
