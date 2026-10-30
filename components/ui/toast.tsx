'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts(prev => [...prev, { ...toast, id }]);
      if (toast.duration !== 0) {
        const timeout = setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== id));
        }, toast.duration ?? 4000);
        return () => clearTimeout(timeout);
      }
      return undefined;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const value: ToastContextType = { toasts, addToast, removeToast };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => {
          const color = toast.type === 'success' ? 'text-sage-300 border-sage-500/50 bg-sage-500/10' : toast.type === 'error' ? 'text-red-300 border-red-500/50 bg-red-500/10' : toast.type === 'warning' ? 'text-amber-300 border-amber-500/50 bg-amber-500/10' : 'text-sage-300 border-thaw-700/50 bg-thaw-800/80';
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto glass-panel rounded-lg border p-4 animate-in slide-in-from-right-4 duration-300 min-w-[320px] ${color}`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 bg-black/20">
                  {toast.type === 'success' ? (
                    <svg className="w-5 h-5 text-sage-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                  ) : toast.type === 'error' ? (
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  ) : toast.type === 'warning' ? (
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  ) : (
                    <svg className="w-5 h-5 text-sage-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-sm text-white">{toast.title}</h4>
                  {toast.description && <p className="text-xs text-thaw-300 mt-0.5">{toast.description}</p>}
                </div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="absolute top-2 right-2 p-1 text-thaw-400 hover:text-white"
                aria-label="Dismiss"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
