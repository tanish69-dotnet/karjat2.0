'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useThaw } from '@/lib/store';
import { Timer, Play, Pause, RotateCcw, Coffee, CheckCircle, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { OpenBookSpreadView } from '@/components/OpenBookSpreadView';
import { findBookByRoute } from '@/lib/books';

const PRESETS = [
  { label: '2 min Starter', secs: 120 },
  { label: '5 min Check', secs: 300 },
  { label: '10 min Push', secs: 600 },
  { label: '15 min Flow', secs: 900 },
  { label: '25 min Deep', secs: 1500 },
];

export default function TimerPage() {
  const { logActivity } = useThaw();
  const { addToast } = useToast();

  const [duration, setDuration] = useState<number>(120);
  const [timeLeft, setTimeLeft] = useState<number>(120);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'book' | 'workstation'>('book');
  const bookConfig = findBookByRoute('/timer');

  const startTimeRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const formatTime = useCallback((secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }, []);

  const progressPercent = useCallback(() => {
    if (duration <= 0) return 0;
    return ((duration - timeLeft) / duration) * 100;
  }, [duration, timeLeft]);

  const selectDuration = useCallback((secs: number) => {
    setIsRunning(false);
    setIsCompleted(false);
    setDuration(secs);
    setTimeLeft(secs);
    startTimeRef.current = null;
    pausedAtRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const toggle = useCallback(() => {
    if (isCompleted) {
      setIsCompleted(false);
      setTimeLeft(duration);
      startTimeRef.current = null;
      pausedAtRef.current = null;
      setIsRunning(true);
      return;
    }
    if (isRunning) {
      setIsRunning(false);
      pausedAtRef.current = Date.now();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    } else {
      setIsRunning(true);
      const now = Date.now();
      if (pausedAtRef.current && startTimeRef.current) {
        const pausedFor = now - pausedAtRef.current;
        startTimeRef.current = startTimeRef.current + pausedFor;
      } else if (!startTimeRef.current) {
        startTimeRef.current = now;
      }
      pausedAtRef.current = null;
    }
  }, [isCompleted, duration, isRunning]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setIsCompleted(false);
    setTimeLeft(duration);
    startTimeRef.current = null;
    pausedAtRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, [duration]);

  useEffect(() => {
    if (!isRunning) return;

    const tick = () => {
      if (!startTimeRef.current) return;
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const rem = Math.max(0, duration - elapsed);
      setTimeLeft(rem);

      if (rem <= 0) {
        setIsRunning(false);
        setIsCompleted(true);
        logActivity('focus_session', `Completed ${Math.round(duration / 60)} minute focus interval`);
        addToast({ title: 'Focus interval finished. You may pause or extend gently', type: 'success' });
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning, duration, logActivity, addToast]);

  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent() / 100) * circumference;

  return (
    <div className="space-y-10 animate-fade-in max-w-4xl mx-auto text-center">
      {/* Header */}
      <section className="flex flex-col items-center pb-6 border-b border-[rgba(244,238,230,0.12)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171a24] border border-[rgba(244,238,230,0.14)] text-[#c87046] text-xs font-mono uppercase tracking-widest mb-3">
          <Timer className="w-3.5 h-3.5" />
          <span>Volume III · Focus Chamber</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-editorial text-[#f4eee6] tracking-tight">
          Quiet Focus &amp; Presence
        </h1>
        <p className="text-[#b9b4ae] mt-2 text-sm md:text-base max-w-md">
          Unpressured intervals paired with grounding virtual body doubling. Start with just 2 minutes to dissolve friction.
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
            <span>Chamber Dial</span>
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

      {/* Main Dial Chamber View */}
      {viewMode === 'workstation' && (
      <>
      <div className="p-8 md:p-12 rounded-3xl bg-[#141822] border border-[rgba(244,238,230,0.14)] shadow-library flex flex-col items-center relative overflow-hidden">
        {/* Ambient Ring Glow */}
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-20" />

        {/* SVG Circular Progress Dial */}
        <div className="relative w-72 h-72 flex items-center justify-center my-4">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 300 300">
            {/* Background track */}
            <circle
              cx="150"
              cy="150"
              r={radius}
              stroke="rgba(244, 238, 230, 0.08)"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Active progress arc */}
            <circle
              cx="150"
              cy="150"
              r={radius}
              stroke="#c87046"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-300"
            />
          </svg>

          {/* Time Readout inside Dial */}
          <div className="absolute flex flex-col items-center">
            <span className="text-5xl md:text-6xl font-mono font-medium tracking-tighter text-[#f4eee6]">
              {formatTime(timeLeft)}
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#c87046] mt-2 font-semibold">
              {isRunning ? 'Session Active' : isCompleted ? 'Interval Complete' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {PRESETS.map((p) => (
            <button
              key={p.secs}
              onClick={() => selectDuration(p.secs)}
              disabled={isRunning}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition ${
                duration === p.secs
                  ? 'bg-[#c87046] text-white font-semibold shadow-md shadow-[#c87046]/30'
                  : 'bg-[#10131b] border border-[rgba(244,238,230,0.12)] text-[#b9b4ae] hover:text-[#f4eee6]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <Button
            variant="primary"
            size="lg"
            className="px-8 shadow-xl"
            onClick={toggle}
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            <span>{isRunning ? 'Pause' : isCompleted ? 'Restart' : 'Begin'}</span>
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={reset}
            disabled={!isRunning && timeLeft === duration}
          >
            <RotateCcw className="w-4 h-4 text-[#b9b4ae]" />
            <span>Reset</span>
          </Button>
        </div>
      </div>

      {/* Post-Session Gentle Prompt */}
      {isCompleted && (
        <div className="p-6 rounded-2xl bg-[#171a24] border border-[#c87046]/40 shadow-library flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div>
            <h4 className="text-base font-editorial text-[#f4eee6]">Interval Complete</h4>
            <p className="text-xs text-[#b9b4ae] mt-1">
              Honor your momentum or step into the sanctuary to recharge.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/rest"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10131b] border border-[rgba(244,238,230,0.14)] text-xs font-mono uppercase tracking-wider text-[#f4eee6] hover:bg-white/5 transition"
            >
              <Coffee className="w-3.5 h-3.5 text-[#c87046]" />
              <span>Rest Sanctuary</span>
            </Link>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
}
