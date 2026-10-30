'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const baseStyles =
  'inline-flex items-center justify-center gap-2 font-medium transition-all disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c87046] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808] rounded-full';

const variantStyles: Record<string, string> = {
  primary: 'bg-[#c87046] text-white hover:bg-[#b56138] shadow-lg shadow-[#c87046]/25 font-semibold',
  secondary: 'bg-[#171a24] text-[#f4eee6] hover:bg-[#202534] border border-[rgba(244,238,230,0.14)] hover:border-[rgba(244,238,230,0.28)]',
  ghost: 'text-[#b9b4ae] hover:text-[#f4eee6] hover:bg-white/5',
  danger: 'bg-red-500/20 border border-red-500/30 text-red-200 hover:bg-red-500/30',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider',
  md: 'px-5 py-2.5 text-xs sm:text-sm',
  lg: 'px-7 py-3.5 text-sm sm:text-base',
};

export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
