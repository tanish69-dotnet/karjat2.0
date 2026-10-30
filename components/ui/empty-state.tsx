'use client';

import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={`text-center py-16 ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-thaw-900/60 border border-thaw-800 text-sage-400 flex items-center justify-center mx-auto mb-6">
        {icon}
      </div>
      <h3 className="text-lg font-serif text-white mb-2">{title}</h3>
      <p className="text-sm text-thaw-300 max-w-sm mx-auto leading-relaxed">{description}</p>
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-thaw-800/60 ${className}`}
    />
  );
}
