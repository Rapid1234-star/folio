import React from "react";

interface SectionHeaderProps {
  tag: string;
  title: string;
  subtitle: string;
}

export default function SectionHeader({
  tag,
  title,
  subtitle,
}: SectionHeaderProps) {
  return (
    <div className="w-full max-w-5xl mx-auto mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <span className="inline-block bg-[var(--accent)] text-black px-3 py-1 text-[10px] md:text-xs font-bold uppercase tracking-widest w-fit shadow-[0_0_14px_rgba(0,255,136,0.35)]">
          {tag}
        </span>
        <div className="flex-1 flex items-center gap-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight drop-shadow-[0_0_12px_rgba(0,255,136,0.15)]">
            {title}
          </h2>
          <span className="hidden sm:block flex-1 h-px bg-gradient-to-r from-[var(--accent)]/45 to-transparent" />
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
