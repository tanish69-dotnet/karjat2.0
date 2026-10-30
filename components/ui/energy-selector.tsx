'use client';

import React from 'react';

interface EnergySelectorProps {
  value: number;
  onChange: (level: number) => void;
  disabled?: boolean;
  className?: string;
}

const LEVELS = [
  { level: 1, label: 'Very Low', desc: 'Preservation & sanctuary' },
  { level: 2, label: 'Low', desc: 'Gentle maintenance micro-steps' },
  { level: 3, label: 'Steady', desc: 'Balanced focus session' },
  { level: 4, label: 'Good', desc: 'Creative depth & synthesis' },
  { level: 5, label: 'High', desc: 'Deep architecture & flow' },
];

export function EnergySelector({ value, onChange, disabled, className }: EnergySelectorProps) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-5 gap-2.5 ${className}`}>
      {LEVELS.map(({ level, label, desc }) => {
        const isSelected = value === level;
        return (
          <button
            key={level}
            onClick={() => !disabled && onChange(level)}
            aria-pressed={isSelected}
            className={`group relative p-3.5 rounded-2xl text-left transition-all border ${
              isSelected
                ? 'bg-[#1e1714] border-[#c87046] text-[#f4eee6] shadow-lg shadow-[#c87046]/20'
                : 'bg-[#10131b]/80 border-[rgba(244,238,230,0.12)] hover:border-[rgba(244,238,230,0.25)] text-[#b9b4ae]'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-mono font-bold ${isSelected ? 'text-[#c87046]' : 'text-[#b9b4ae]'}`}>
                0{level}
              </span>
              {isSelected && (
                <span className="w-2 h-2 rounded-full bg-[#c87046] shadow-[0_0_8px_#c87046]" />
              )}
            </div>
            <span className="block text-[11px] font-mono uppercase tracking-wider font-semibold text-[#f4eee6]">
              {label}
            </span>
            <span className="block text-[10px] mt-1 text-[#b9b4ae] leading-tight">
              {desc}
            </span>
          </button>
        );
      })}
    </div>
  );
}
