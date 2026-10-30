'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useThaw } from '@/lib/store';
import { Calendar, RefreshCw, Sparkles, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { rebalanceWeek, DAYS } from '@/lib/scheduler';
import { useToast } from '@/components/ui/toast';
import { OpenBookSpreadView } from '@/components/OpenBookSpreadView';
import { findBookByRoute } from '@/lib/books';

export default function PlannerPage() {
  const { tasks, updateTask, energyLevel, logActivity } = useThaw();
  const { addToast } = useToast();

  const pendingTasks = tasks.filter((t) => !t.completed);
  const [proposal, setProposal] = useState<ReturnType<typeof rebalanceWeek> | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [applied, setApplied] = useState(false);
  const [viewMode, setViewMode] = useState<'workstation' | 'book'>('workstation');
  const bookConfig = findBookByRoute('/planner');

  useEffect(() => {
    setProposal(rebalanceWeek(pendingTasks, energyLevel));
  }, [pendingTasks, energyLevel]);

  const handleRebalance = () => {
    setReviewing(true);
    setApplied(false);
    setProposal(rebalanceWeek(pendingTasks, energyLevel));
  };

  const handleApply = () => {
    if (!proposal) return;
    proposal.scheduled.forEach((item) => {
      updateTask(item.task.id, {
        deadline: item.dayLabel,
        estimatedMinutes: item.task.estimatedMinutes,
        energyRequired: item.task.energyRequired,
        isFlexible: true,
      });
    });
    setApplied(true);
    setReviewing(false);
    logActivity('task_completed', 'Balanced workload across upcoming days');
    addToast({ title: 'Schedule synchronized to current capacity', type: 'success' });
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[rgba(244,238,230,0.12)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171a24] border border-[rgba(244,238,230,0.14)] text-[#c87046] text-xs font-mono uppercase tracking-widest mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>Volume VI · Weekly Atlas</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-editorial text-[#f4eee6] tracking-tight">
            Capacity-Aware Planning
          </h1>
          <p className="text-[#b9b4ae] mt-2 text-sm md:text-base max-w-xl">
            Distribute commitments without over-borrowing from future spoons. Workload dynamically flexes around energy reality.
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
              <span>Weekly Grid</span>
            </button>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setViewMode('workstation');
              handleRebalance();
            }}
            disabled={reviewing}
          >
            <RefreshCw className={`w-4 h-4 ${reviewing ? 'animate-spin' : ''}`} />
            <span>Rebalance My Week</span>
          </Button>
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

      {/* Workstation Weekly Atlas View */}
      {viewMode === 'workstation' && (
      <>

      {/* Review Box if proposal active */}
      {reviewing && proposal && (
        <div className="p-6 rounded-2xl bg-[#141822] border border-[#c87046]/40 shadow-library space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(244,238,230,0.1)]">
            <span className="label-micro text-[#c87046]">Rebalance Proposal Ready</span>
            <span className="text-xs font-mono text-[#b9b4ae]">{proposal.scheduled.length} tasks paced</span>
          </div>
          <p className="text-xs text-[#b9b4ae] leading-relaxed">
            Tasks have been redistributed according to your current energy level ({energyLevel} spoons). Review and confirm to update your ledger.
          </p>
          <div className="flex gap-3 pt-2">
            <Button variant="primary" size="sm" onClick={handleApply}>
              Confirm & Apply Schedule
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setReviewing(false)}>
              Discard
            </Button>
          </div>
        </div>
      )}

      {/* Weekly Grid Days */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {DAYS.slice(0, 7).map((day, idx) => {
          const dayItems = (proposal?.scheduled || []).filter((s) => s.dayLabel === day || (idx === 0 && s.dayLabel === 'Today'));
          return (
            <div
              key={day}
              className="p-5 rounded-2xl bg-[#171a24] border border-[rgba(244,238,230,0.12)] hover:border-[rgba(244,238,230,0.22)] shadow-library flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[rgba(244,238,230,0.08)] mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#c87046] font-semibold">{day}</span>
                  <span className="text-[10px] font-mono text-[#b9b4ae]">{dayItems.length} items</span>
                </div>

                <div className="space-y-2">
                  {dayItems.length > 0 ? (
                    dayItems.map((item) => (
                      <div
                        key={item.task.id}
                        className="p-2.5 rounded-xl bg-[#10131b] border border-[rgba(244,238,230,0.08)] text-xs"
                      >
                        <p className="font-medium text-[#f4eee6] truncate">{item.task.title}</p>
                        <span className="text-[10px] font-mono text-[#c87046]">
                          {item.task.estimatedMinutes ? `${item.task.estimatedMinutes}m` : 'Flexible'} · Level {item.task.energyRequired ?? 3}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] font-mono text-[#78736d] py-6 text-center">Unallocated space</p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-[rgba(244,238,230,0.06)] text-[10px] font-mono text-[#78736d] text-center">
                Protected buffer
              </div>
            </div>
          );
        })}
      </div>
      </>
      )}
    </div>
  );
}
