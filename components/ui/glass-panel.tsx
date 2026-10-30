'use client';

import React from 'react';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStyles: Record<string, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8 md:p-10',
};

export function GlassPanel({ children, padding = 'md', className = '', ...props }: GlassPanelProps) {
  return (
    <div
      className={`library-card rounded-2xl ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
