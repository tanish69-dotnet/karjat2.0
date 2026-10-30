'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useThaw } from '@/lib/store';
import {
  Timer,
  Play,
  Coffee,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  RefreshCw,
  BookOpen,
  Plus,
  Check,
  TrendingUp,
} from 'lucide-react';
import { EnergySelector } from '@/components/ui/energy-selector';
import { EmptyState } from '@/components/ui/empty-state';
import { useToast } from '@/components/ui/toast';
import { QuickCaptureModal } from '@/components/QuickCaptureModal';
import { OpenBookSpreadView } from '@/components/OpenBookSpreadView';
import { findBookByRoute } from '@/lib/books';

type SequenceResult = {
  acknowledgment?: string;
  firstStep?: string;
  steps?: Array<{ id: string; title: string; duration: string; isEasiest?: boolean }>;
  strategyUsed?: string;
};

type SequenceResponse = {
  success: boolean;
  data?: SequenceResult;
  ragContext?: Array<{ id: string; title: string; actionableTip: string }>;
  isLiveAI?: boolean;
  error?: string;
};

const SPOON_DESCRIPTIONS: Record<number, { title: string; desc: string }> = {
  1: { title: 'Preservation Level', desc: 'Minimal capacity. Prioritize rest, low stimulation, and gentle restoration.' },
  2: { title: 'Low Energy Horizon', desc: 'Maintenance pacing only. Keep micro-actions under 2 minutes.' },
  3: { title: 'Steady Focus Capacity', desc: 'Harmonic balance for 1 or 2 thoughtful modules and a focus sprint.' },
  4: { title: 'High Creative Flow', desc: 'Ample cognitive headroom for complex writing, coding, or problem-solving.' },
  5: { title: 'Peak Synthesis Energy', desc: 'Broad capacity. Ideal for sequencing multi-day milestones or deep flow.' },
};

function greetingForTime() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const { energyLevel, setEnergyLevel, tasks, toggleTaskComplete, logActivity, activities } = useThaw();
  const { addToast } = useToast();

  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'workstation' | 'book'>('workstation');
  const bookConfig = findBookByRoute('/dashboard');

  // Compute metrics from real state
  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  // Gentle Recommendation Engine: Match task to current spoon capacity
  const recommendedTask =
    pendingTasks.find((t) => t.energyRequired <= energyLevel) || pendingTasks[0];

  const [recommendation, setRecommendation] = useState<SequenceResult | null>(null);
  const [ragSources, setRagSources] = useState<Array<{ id: string; title: string; actionableTip: string }>>([]);
  const [isLiveAI, setIsLiveAI] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Focus duration metric (summing today's logged focus activities)
  const focusActivities = activities.filter((a) => a.type === 'focus_session');
  const estimatedFocusMinutes = focusActivities.length * 25; // standard interval

  useEffect(() => {
    if (!recommendedTask) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch('/api/sequence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskDescription: recommendedTask.title,
        energyLevel,
      }),
    })
      .then((res) => res.json())
      .then((data: SequenceResponse) => {
        if (cancelled) return;
        setLoading(false);
        if (data.success) {
          setRecommendation(data.data ?? null);
          setRagSources(data.ragContext ?? []);
          setIsLiveAI(!!data.isLiveAI);
        } else {
          setError(data.error || 'Unable to generate recommendation.');
        }
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
        setError('Unable to reach cognitive sequencer service.');
      });
    return () => {
      cancelled = true;
    };
  }, [recommendedTask?.title, energyLevel]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Quick Capture Dialog Modal */}
      <QuickCaptureModal
        isOpen={isQuickCaptureOpen}
        onClose={() => setIsQuickCaptureOpen(false)}
      />

      {/* Top Reading Desk Hero Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[rgba(244,238,230,0.12)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171a24] border border-[rgba(244,238,230,0.14)] text-[#c87046] text-xs font-mono uppercase tracking-widest mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Volume I · Reading Desk</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-editorial text-[#f4eee6] tracking-tight">
            {greetingForTime()}, Reader.
          </h1>
          <p className="text-[#b9b4ae] mt-2 text-sm md:text-base max-w-xl">
            {SPOON_DESCRIPTIONS[energyLevel]?.desc}
          </p>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Dual Experience Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-[#10131b] border border-[rgba(244,238,230,0.14)] shadow-md">
            <button
              type="button"
              onClick={() => setViewMode('workstation')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition ${
                viewMode === 'workstation'
                  ? 'bg-[#c87046] text-white font-semibold shadow-md shadow-[#c87046]/40'
                  : 'text-[#b9b4ae] hover:text-[#f4eee6]'
              }`}
            >
              <span>Desk Overview</span>
            </button>
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
              <span>Volume I Book</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsQuickCaptureOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#c87046] hover:bg-[#b56138] text-white text-xs font-mono uppercase tracking-wider font-semibold transition shadow-lg shadow-[#c87046]/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Quick Capture</span>
          </button>

          <Link
            href="/sequencer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#171a24] hover:bg-[#202534] border border-[rgba(244,238,230,0.14)] text-[#f4eee6] text-xs font-mono uppercase tracking-wider font-medium transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#c87046]" />
            <span>AI Sequencer</span>
          </Link>

          <Link
            href="/rest"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#171a24] hover:bg-[#202534] border border-[rgba(244,238,230,0.14)] text-[#b9b4ae] hover:text-[#f4eee6] text-xs font-mono uppercase tracking-wider transition"
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Rest Sanctuary</span>
          </Link>
        </div>
      </section>

      {/* Book Spread View (Volume I: Energy & Capacity Check-in) */}
      {viewMode === 'book' && bookConfig && (
        <section className="py-2">
          <OpenBookSpreadView
            book={bookConfig}
            onClose={() => setViewMode('workstation')}
          />
        </section>
      )}

      {/* Workstation Desk Overview */}
      {viewMode === 'workstation' && (
      <>
      {/* Daily Focus Summary Snapshot Card */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-[#141822] border border-[rgba(244,238,230,0.1)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#b9b4ae] mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">Capacity</span>
            <span className="w-2 h-2 rounded-full bg-[#c87046]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#f4eee6]">
            {energyLevel} / 5
          </div>
          <span className="text-[11px] font-serif text-[#b9b4ae] mt-1 truncate">
            {SPOON_DESCRIPTIONS[energyLevel]?.title}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#141822] border border-[rgba(244,238,230,0.1)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#b9b4ae] mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">Focus Time</span>
            <Timer className="w-3.5 h-3.5 text-[#c87046]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#f4eee6]">
            {estimatedFocusMinutes}m
          </div>
          <span className="text-[11px] font-serif text-[#b9b4ae] mt-1">
            {focusActivities.length} session{focusActivities.length === 1 ? '' : 's'} logged
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#141822] border border-[rgba(244,238,230,0.1)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#b9b4ae] mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">Active Queue</span>
            <Clock className="w-3.5 h-3.5 text-[#c87046]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#f4eee6]">
            {pendingTasks.length}
          </div>
          <span className="text-[11px] font-serif text-[#b9b4ae] mt-1">
            Actions awaiting initiation
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#141822] border border-[rgba(244,238,230,0.1)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#b9b4ae] mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#c87046]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#f4eee6]">
            {completedTasks.length}
          </div>
          <span className="text-[11px] font-serif text-[#b9b4ae] mt-1">
            Micro-victories preserved
          </span>
        </div>
      </section>

      {/* Capacity & Spoon Selector */}
      <section className="p-6 md:p-8 rounded-2xl bg-[#141822] border border-[rgba(244,238,230,0.14)] shadow-library relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="label-micro text-[#c87046]">Spoon Calibration</span>
            <h2 className="text-xl font-editorial text-[#f4eee6] mt-1">What is your current capacity?</h2>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#171a24] border border-[rgba(244,238,230,0.16)] text-xs font-mono text-[#b9b4ae]">
            <span className="text-[#c87046]">Level {energyLevel}:</span>
            <span className="text-[#f4eee6] font-semibold">{SPOON_DESCRIPTIONS[energyLevel]?.title}</span>
          </div>
        </div>

        <EnergySelector
          value={energyLevel}
          onChange={(lvl) => {
            setEnergyLevel(lvl);
            addToast({ title: `Capacity calibrated to Level ${lvl}`, type: 'info' });
          }}
        />
      </section>

      {/* Primary Recommended Next Micro-Step & Task Ledger Sidebar */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 md:p-8 rounded-2xl bg-[#171a24] border border-[rgba(244,238,230,0.18)] shadow-library relative">
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(244,238,230,0.12)] mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c87046]" />
                <span className="label-micro text-[#f4eee6]">Recommended Next Action</span>
              </div>
              {isLiveAI && (
                <span className="px-2.5 py-1 rounded-full bg-[#c87046]/15 border border-[#c87046]/30 text-[#c87046] text-[10px] font-mono uppercase tracking-wider">
                  Live AI Grounded
                </span>
              )}
            </div>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <RefreshCw className="w-6 h-6 text-[#c87046] animate-spin" />
                <p className="text-xs font-mono uppercase tracking-wider text-[#b9b4ae]">
                  Retrieving strategy & calibrating next micro-step...
                </p>
              </div>
            ) : recommendedTask ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#c87046]">
                      Optimal Task for Level {energyLevel}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        toggleTaskComplete(recommendedTask.id);
                        addToast({ title: 'Task Completed', description: recommendedTask.title, type: 'success' });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10131b] hover:bg-[#1a2130] border border-[rgba(244,238,230,0.14)] text-xs font-mono text-[#b9b4ae] hover:text-[#f4eee6] transition"
                    >
                      <Check className="w-3.5 h-3.5 text-[#c87046]" />
                      <span>Mark Complete</span>
                    </button>
                  </div>
                  <h3 className="text-2xl font-editorial text-[#f4eee6] mt-1">{recommendedTask.title}</h3>
                </div>

                {recommendation?.firstStep ? (
                  <div className="p-5 rounded-xl bg-[#10131b] border border-[rgba(200,112,70,0.35)] shadow-inner">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#c87046] font-semibold">
                      Your 2-Minute Starting Step
                    </span>
                    <p className="text-lg font-editorial text-[#f4eee6] mt-2 leading-relaxed">
                      "{recommendation.firstStep}"
                    </p>
                    {recommendation.strategyUsed && (
                      <p className="text-xs text-[#b9b4ae] mt-3 pt-3 border-t border-[rgba(244,238,230,0.08)] flex items-center gap-1.5 font-mono">
                        <Sparkles className="w-3.5 h-3.5 text-[#c87046]" />
                        <span>Strategy: {recommendation.strategyUsed}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-[#b9b4ae]">
                    Take the first small chunk of this task and work on it for 5 minutes without pressure.
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href={`/timer?task=${encodeURIComponent(recommendedTask.title)}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#c87046] hover:bg-[#b56138] text-white text-xs font-mono uppercase tracking-wider font-semibold transition shadow-md shadow-[#c87046]/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Enter Focus Chamber</span>
                  </Link>

                  <Link
                    href={`/sequencer?task=${encodeURIComponent(recommendedTask.title)}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#10131b] hover:bg-[#1f2535] border border-[rgba(244,238,230,0.16)] text-[#f4eee6] text-xs font-mono uppercase tracking-wider transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#c87046]" />
                    <span>Open in AI Sequencer</span>
                  </Link>
                </div>
              </div>
            ) : (
              <EmptyState
                icon={<BookOpen className="w-8 h-8 text-[#c87046]" />}
                title="Your Reading Desk is Clear"
                description="No pending assignments in your ledger right now. You can create a new task or take a restorative break."
              />
            )}
          </div>
        </div>

        {/* Right Sidebar: Active Queue & Sanctuary Shortcut */}
        <div className="space-y-6">
          {/* Upcoming Work Card with inline complete checkboxes */}
          <div className="p-6 rounded-2xl bg-[#141822] border border-[rgba(244,238,230,0.12)] shadow-library">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(244,238,230,0.1)] mb-4">
              <span className="label-micro text-[#c87046]">Task Queue</span>
              <Link href="/tasks" className="text-xs font-mono text-[#b9b4ae] hover:text-[#f4eee6] transition">
                View All ({pendingTasks.length}) →
              </Link>
            </div>

            {pendingTasks.length > 0 ? (
              <div className="space-y-2.5">
                {pendingTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-[#171a24]/80 border border-[rgba(244,238,230,0.08)] hover:border-[rgba(244,238,230,0.2)] transition flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <button
                        type="button"
                        onClick={() => {
                          toggleTaskComplete(task.id);
                          addToast({ title: 'Task Completed', description: task.title, type: 'success' });
                        }}
                        className="w-4 h-4 rounded border border-[#8b4513] hover:bg-[#c87046]/20 transition flex items-center justify-center shrink-0 cursor-pointer"
                        title="Mark complete"
                      >
                        <span className="sr-only">Complete task</span>
                      </button>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-[#f4eee6] truncate">{task.title}</p>
                        <span className="text-[10px] font-mono text-[#b9b4ae]">
                          {task.estimatedMinutes ? `${task.estimatedMinutes} mins` : 'Flexible duration'}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#10131b] border border-[rgba(244,238,230,0.12)] text-[#c87046] shrink-0">
                      Level {task.energyRequired}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#b9b4ae] py-4 text-center">All caught up! Zero backlog pressure.</p>
            )}
          </div>

          {/* Quick Sanctuary Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#171a24] to-[#12151e] border border-[rgba(244,238,230,0.12)] shadow-library">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#c87046]/15 text-[#c87046] flex items-center justify-center">
                <Coffee className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-editorial text-[#f4eee6]">Feeling Friction?</h4>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#b9b4ae]">Rest Sanctuary</span>
              </div>
            </div>
            <p className="text-xs text-[#b9b4ae] leading-relaxed mb-4">
              Step away for 3 minutes of box breathing or calm ambient recovery. Zero penalty.
            </p>
            <Link
              href="/rest"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#10131b] hover:bg-[#1a1f2c] border border-[rgba(244,238,230,0.14)] text-xs font-mono uppercase tracking-wider text-[#f4eee6] transition"
            >
              <span>Enter Sanctuary</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#c87046]" />
            </Link>
          </div>
        </div>
      </section>
      </>
      )}
    </div>
  );
}
