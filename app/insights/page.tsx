'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useThaw } from '@/lib/store';
import { BarChart3, Clock, Coffee, CheckCircle2, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { OpenBookSpreadView } from '@/components/OpenBookSpreadView';
import { findBookByRoute } from '@/lib/books';

export default function InsightsPage() {
  const { tasks, activities, energyLevel } = useThaw();
  const [viewMode, setViewMode] = useState<'workstation' | 'book'>('workstation');
  const bookConfig = findBookByRoute('/insights');

  const completed = tasks.filter((t) => t.completed);
  const pending = tasks.filter((t) => !t.completed);
  const focusSessions = activities.filter((a) => a.type === 'focus_session').length;
  const restSessions = activities.filter((a) => a.type === 'rest_session').length;
  const totalMinutes = completed.reduce((s, t) => s + (t.estimatedMinutes ?? 0), 0);

  const days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toDateString();
    const count = activities.filter(
      (a) => a.type === 'task_completed' && new Date(a.timestamp).toDateString() === key
    ).length;
    return { label: d.toLocaleDateString('en', { weekday: 'short' }), count, date: key };
  });
  const maxCount = Math.max(1, ...days.map((d) => d.count));

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[rgba(244,238,230,0.12)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171a24] border border-[rgba(244,238,230,0.14)] text-[#c87046] text-xs font-mono uppercase tracking-widest mb-3">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Volume VII · Reflection Archive</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-editorial text-[#f4eee6] tracking-tight">
            Gentle Insights
          </h1>
          <p className="text-[#b9b4ae] mt-2 text-sm md:text-base max-w-xl">
            A neutral, compassion-based record of momentum. No broken streaks, no shaming labels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Dual Experience Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-[#10131b] border border-[rgba(244,238,230,0.14)] shadow-md">
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
              <span>Archive Data</span>
            </button>
          </div>

          <Link
            href="/dashboard"
            className="hidden sm:inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c87046] hover:text-[#f4eee6] transition"
          >
            <span>To Reading Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Book Spread View (Default Physical-Looking Pages) */}
      {viewMode === 'book' && bookConfig && (
        <section className="py-2">
          <OpenBookSpreadView
            book={bookConfig}
            onClose={() => setViewMode('workstation')}
          />
        </section>
      )}

      {/* Workstation Data View */}
      {viewMode === 'workstation' && (
      <>

      {/* Real Metric Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#171a24] border border-[rgba(244,238,230,0.12)] shadow-library">
          <span className="label-micro text-[#c87046]">Completed Tasks</span>
          <p className="text-3xl font-editorial text-[#f4eee6] mt-2">{completed.length}</p>
          <span className="text-[10px] font-mono text-[#b9b4ae]">{pending.length} pending in ledger</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#171a24] border border-[rgba(244,238,230,0.12)] shadow-library">
          <span className="label-micro text-[#c87046]">Focus Minutes</span>
          <p className="text-3xl font-editorial text-[#f4eee6] mt-2">{totalMinutes}m</p>
          <span className="text-[10px] font-mono text-[#b9b4ae]">From completed tasks</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#171a24] border border-[rgba(244,238,230,0.12)] shadow-library">
          <span className="label-micro text-[#c87046]">Focus Intervals</span>
          <p className="text-3xl font-editorial text-[#f4eee6] mt-2">{focusSessions}</p>
          <span className="text-[10px] font-mono text-[#b9b4ae]">Sessions started</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#171a24] border border-[rgba(244,238,230,0.12)] shadow-library">
          <span className="label-micro text-[#c87046]">Rest Recoveries</span>
          <p className="text-3xl font-editorial text-[#f4eee6] mt-2">{restSessions}</p>
          <span className="text-[10px] font-mono text-[#b9b4ae]">Guilt-free sessions</span>
        </div>
      </div>

      {/* Weekly Rhythm Histogram */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#141822] border border-[rgba(244,238,230,0.14)] shadow-library">
        <h3 className="text-lg font-editorial text-[#f4eee6] mb-6">Completions by Day</h3>
        <div className="flex items-end gap-3 h-44">
          {days.map((d, i) => {
            const heightPct = Math.max(8, (d.count / maxCount) * 100);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div
                  style={{ height: `${heightPct}%` }}
                  className={`w-full rounded-t-lg transition-all ${
                    d.count > 0 ? 'bg-[#c87046]' : 'bg-[#171a24] border border-[rgba(244,238,230,0.06)]'
                  }`}
                />
                <span className="text-[11px] font-mono text-[#b9b4ae] uppercase">{d.label}</span>
              </div>
            );
          })}
        </div>
      </div>
      </>
      )}
    </div>
  );
}
