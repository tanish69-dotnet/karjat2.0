'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useThaw } from '@/lib/store';
import { Coffee, ArrowLeft, Wind, Moon, Leaf, Heart, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OpenBookSpreadView } from '@/components/OpenBookSpreadView';
import { findBookByRoute } from '@/lib/books';

const GROUNDING_SUGGESTIONS = [
  'Notice three physical textures around you right now.',
  'Take a long, deep inhale, and a slower, quiet exhale.',
  'Feel the weight of your hands resting in your lap.',
  'Look away from the screen toward a natural light source.',
  'Drop your jaw and release tension in your shoulders.',
];

export default function RestPage() {
  const { logActivity } = useThaw();
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [suggestionIndex, setSuggestionIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'workstation' | 'book'>('workstation');
  const bookConfig = findBookByRoute('/rest');

  useEffect(() => {
    logActivity('rest_session', 'Entered Rest Sanctuary');
  }, [logActivity]);

  useEffect(() => {
    const cycle = ['inhale', 'hold', 'exhale'] as const;
    const interval = setInterval(() => {
      setBreathingPhase((p) => cycle[(cycle.indexOf(p) + 1) % cycle.length]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSuggestionIndex((i) => (i + 1) % GROUNDING_SUGGESTIONS.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-12 animate-fade-in max-w-3xl mx-auto text-center py-6">
      {/* Header */}
      <section className="flex flex-col items-center pb-6 border-b border-[rgba(244,238,230,0.12)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171a24] border border-[rgba(244,238,230,0.14)] text-[#c87046] text-xs font-mono uppercase tracking-widest mb-3">
          <Coffee className="w-3.5 h-3.5" />
          <span>Volume IV · Rest Sanctuary</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-editorial text-[#f4eee6] tracking-tight">
          Guilt-Free Recovery
        </h1>
        <p className="text-[#b9b4ae] mt-2 text-sm md:text-base max-w-md">
          Rest is not the absence of productivity. It is active neurological restoration. Step back without penalty or broken streaks.
        </p>

        {/* Dual Experience Switcher */}
        <div className="flex items-center gap-1 p-1 mt-5 rounded-full bg-[#10131b] border border-[rgba(244,238,230,0.14)] shadow-md">
          <button
            type="button"
            onClick={() => setViewMode('book')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition ${
              viewMode === 'book'
                ? 'bg-[#c87046] text-white font-semibold shadow-md shadow-[#c87046]/40'
                : 'text-[#b9b4ae] hover:text-[#f4eee6]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Physical Book</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('workstation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition ${
              viewMode === 'workstation'
                ? 'bg-[#c87046] text-white font-semibold shadow-md shadow-[#c87046]/40'
                : 'text-[#b9b4ae] hover:text-[#f4eee6]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Breathing Sphere</span>
          </button>
        </div>
      </section>

      {/* Book Spread View (Default Physical-Looking Pages) */}
      {viewMode === 'book' && bookConfig && (
        <section className="py-2 text-left">
          <OpenBookSpreadView
            book={bookConfig}
            onClose={() => setViewMode('workstation')}
          />
        </section>
      )}

      {/* Guided Breathing Sphere View */}
      {viewMode === 'workstation' && (
      <>
      <div className="p-10 md:p-14 rounded-3xl bg-[#141822] border border-[rgba(244,238,230,0.14)] shadow-library flex flex-col items-center relative overflow-hidden">
        <div className="relative w-64 h-64 flex items-center justify-center my-6">
          {/* Animated Pulsing Sphere */}
          <div
            className={`absolute rounded-full transition-all duration-[4000ms] ease-in-out ${
              breathingPhase === 'inhale'
                ? 'w-60 h-60 bg-[#c87046]/20 border border-[#c87046]/60 shadow-[0_0_50px_rgba(200,112,70,0.3)]'
                : breathingPhase === 'hold'
                ? 'w-60 h-60 bg-[#c87046]/30 border border-[#c87046] shadow-[0_0_60px_rgba(200,112,70,0.45)]'
                : 'w-28 h-28 bg-[#171a24] border border-[rgba(244,238,230,0.2)]'
            }`}
          />

          <div className="relative z-10 flex flex-col items-center">
            <span className="text-xl md:text-2xl font-editorial text-[#f4eee6] capitalize font-medium">
              {breathingPhase === 'inhale' ? 'Breathe In' : breathingPhase === 'hold' ? 'Hold Gently' : 'Release Slowly'}
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#c87046] mt-1 font-semibold">
              4-4-4 Rhythm
            </span>
          </div>
        </div>

        {/* Rotating Grounding Suggestion */}
        <div className="min-h-[3rem] flex items-center justify-center max-w-md px-4 mt-4">
          <p className="text-sm font-editorial text-[#b9b4ae] italic transition-opacity duration-500">
            "{GROUNDING_SUGGESTIONS[suggestionIndex]}"
          </p>
        </div>
      </div>

      {/* Navigation Return Options */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#171a24] hover:bg-[#202534] border border-[rgba(244,238,230,0.16)] text-xs font-mono uppercase tracking-wider text-[#f4eee6] transition shadow-md"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#c87046]" />
          <span>Return to Reading Desk</span>
        </Link>
        <Link
          href="/sequencer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#c87046] hover:bg-[#b56138] text-white text-xs font-mono uppercase tracking-wider font-semibold transition shadow-md shadow-[#c87046]/20"
        >
          <span>Ready for a Micro-Step</span>
        </Link>
      </div>
      </>
      )}
    </div>
  );
}
