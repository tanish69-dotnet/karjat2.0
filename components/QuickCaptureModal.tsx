'use client';

import React, { useState, useEffect } from 'react';
import { useThaw } from '@/lib/store';
import { useToast } from '@/components/ui/toast';
import { Plus, X, Sparkles, Clock } from 'lucide-react';

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickCaptureModal({ isOpen, onClose }: QuickCaptureModalProps) {
  const { addTask, energyLevel } = useThaw();
  const { addToast } = useToast();
  const [title, setTitle] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(15);
  const [taskEnergy, setTaskEnergy] = useState(energyLevel);

  useEffect(() => {
    if (isOpen) {
      setTaskEnergy(energyLevel);
    }
  }, [isOpen, energyLevel]);

  // Keyboard Escape to close
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      energyRequired: taskEnergy,
      estimatedMinutes,
      isFlexible: true,
    });

    addToast({
      title: 'Captured to Ledger',
      description: `"${title.trim()}" is ready on your desk.`,
      type: 'success',
    });

    setTitle('');
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg p-6 rounded-2xl bg-[#141822] border border-[rgba(244,238,230,0.18)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(244,238,230,0.1)] mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c87046]" />
            <h3 className="font-editorial text-lg text-[#f4eee6]">Quick Capture</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#b9b4ae] hover:text-[#f4eee6] hover:bg-white/5 transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#b9b4ae] mb-1.5">
              Task or Intimidating Objective
            </label>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Read 3 pages of Chapter 4 or draft 1 introductory paragraph..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#10131b] border border-[rgba(244,238,230,0.14)] text-[#f4eee6] placeholder-[#b9b4ae]/50 text-sm focus:outline-none focus:border-[#c87046] transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Spoon Cost */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#b9b4ae] mb-1.5">
                Energy Required
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setTaskEnergy(lvl)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition border ${
                      taskEnergy === lvl
                        ? 'bg-[#c87046] border-[#c87046] text-white font-bold shadow-md'
                        : 'bg-[#10131b] border-[rgba(244,238,230,0.1)] text-[#b9b4ae] hover:border-[#c87046]/40'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Estimated Duration */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#b9b4ae] mb-1.5">
                Estimated Duration
              </label>
              <select
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#10131b] border border-[rgba(244,238,230,0.14)] text-xs font-mono text-[#f4eee6] focus:outline-none focus:border-[#c87046]"
              >
                <option value={5}>5 mins (Micro-step)</option>
                <option value={15}>15 mins (Standard chunk)</option>
                <option value={25}>25 mins (Focus block)</option>
                <option value={45}>45 mins (Deep sprint)</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[rgba(244,238,230,0.1)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-mono text-[#b9b4ae] hover:text-[#f4eee6] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#c87046] hover:bg-[#b56138] disabled:opacity-40 text-white text-xs font-mono uppercase tracking-wider font-semibold transition shadow-md shadow-[#c87046]/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save to Desk</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

