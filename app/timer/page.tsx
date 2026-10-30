'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useThaw } from '@/lib/store';
import { Timer, Play, Pause, RotateCcw, Coffee, CheckCircle, ArrowRight, Sparkles, BookOpen, Sliders, Check } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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

function TimerContent() {
  const { logActivity } = useThaw();
  const { addToast } = useToast();
  const searchParams = useSearchParams();
  const taskQuery = searchParams.get('task');
  const durationQuery = searchParams.get('duration');

  const [activeTask, setActiveTask] = useState<string | null>(taskQuery);
  const [duration, setDuration] = useState<number>(() => {
    if (durationQuery) {
      const match = durationQuery.match(/(\d+)/);
      if (match) return Math.max(60, parseInt(match[1], 10) * 60);
    }
    return 120;
  });
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    if (durationQuery) {
      const match = durationQuery.match(/(\d+)/);
      if (match) return Math.max(60, parseInt(match[1], 10) * 60);
    }
    return 120;
  });
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);
  const [customInput, setCustomInput] = useState<string>('25');
  const [viewMode, setViewMode] = useState<'book' | 'workstation'>('workstation');
  const bookConfig = findBookByRoute('/timer');

  // React to query parameter updates
  useEffect(() => {
    if (taskQuery) {
      setActiveTask(taskQuery);
    }
    if (durationQuery) {
      const match = durationQuery.match(/(\d+)/);
      if (match) {
        const secs = Math.max(60, parseInt(match[1], 10) * 60);
        setDuration(secs);
        setTimeLeft(secs);
        setViewMode('workstation');
      }
    }
  }, [taskQuery, durationQuery]);

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
      {activeTask && (
        <div className="p-4 rounded-2xl bg-[#171a24] border border-[#c87046]/40 shadow-library flex items-center justify-between gap-4 text-left animate-fade-in max-w-xl mx-auto">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c87046] animate-pulse shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#c87046] font-semibold block">Connected Task</span>
              <p className="text-sm font-editorial text-[#f4eee6] truncate">{activeTask}</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTask(null)}
            className="text-[10px] font-mono uppercase tracking-wider text-[#b9b4ae] hover:text-[#f4eee6] shrink-0"
          >
            Clear
          </button>
        </div>
      )}

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

        {/* Preset Selector & Custom Input */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {PRESETS.map((p) => (
            <button
              key={p.secs}
              onClick={() => {
                setIsCustomizing(false);
                selectDuration(p.secs);
              }}
              disabled={isRunning}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition ${
                duration === p.secs && !isCustomizing
                  ? 'bg-[#c87046] text-white font-semibold shadow-md shadow-[#c87046]/30'
                  : 'bg-[#10131b] border border-[rgba(244,238,230,0.12)] text-[#b9b4ae] hover:text-[#f4eee6]'
              }`}
            >
              {p.label}
            </button>
          ))}

          <button
            onClick={() => {
              setIsCustomizing(!isCustomizing);
              setCustomInput(String(Math.round(duration / 60)));
            }}
            disabled={isRunning}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition ${
              isCustomizing
                ? 'bg-[#c87046] text-white font-semibold shadow-md shadow-[#c87046]/30'
                : 'bg-[#10131b] border border-[rgba(244,238,230,0.12)] text-[#b9b4ae] hover:text-[#f4eee6]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isCustomizing ? 'Close' : 'Custom'}</span>
          </button>
        </div>

        {/* Custom Duration Input Form */}
        {isCustomizing && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const minsVal = parseInt(customInput, 10);
              if (!isNaN(minsVal) && minsVal > 0 && minsVal <= 180) {
                selectDuration(minsVal * 60);
                setIsCustomizing(false);
              }
            }}
            className="flex items-center justify-center gap-2 mb-8 p-3 rounded-2xl bg-[#10131b] border border-[rgba(244,238,230,0.14)]"
          >
            <span className="text-xs font-mono text-[#b9b4ae] uppercase">Custom Duration:</span>
            <input
              type="number"
              min={1}
              max={180}
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="w-20 px-3 py-1.5 text-sm font-mono font-bold text-center rounded-xl bg-[#171a24] border border-[#c87046]/40 text-[#f4eee6] focus:outline-none focus:border-[#c87046]"
              autoFocus
            />
            <span className="text-xs font-mono text-[#b9b4ae]">mins</span>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-[#c87046] hover:bg-[#b56138] text-white text-xs font-mono uppercase tracking-wider font-semibold transition flex items-center gap-1 shadow-md shadow-[#c87046]/20"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply</span>
            </button>
          </form>
        )}

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

export default function TimerPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh] text-[#b9b4ae] font-mono text-xs uppercase tracking-widest">
          Calibrating Focus Chamber...
        </div>
      }
    >
      <TimerContent />
    </React.Suspense>
  );
}
