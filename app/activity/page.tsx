'use client';

import React from 'react';
import { useThaw } from '@/lib/store';
import { Activity as ActivityIcon, CheckCircle2, Timer, Coffee, Zap, BookOpen } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

export default function ActivityPage() {
  const { activities } = useThaw();

  const getIcon = (type: string) => {
    switch (type) {
      case 'task_completed':
        return CheckCircle2;
      case 'focus_session':
        return Timer;
      case 'rest_session':
        return Coffee;
      default:
        return Zap;
    }
  };

  return (
    <div className="space-y-10 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[rgba(244,238,230,0.12)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171a24] border border-[rgba(244,238,230,0.14)] text-[#c87046] text-xs font-mono uppercase tracking-widest mb-3">
            <ActivityIcon className="w-3.5 h-3.5" />
            <span>Volume VIII · Activity Journal</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-editorial text-[#f4eee6] tracking-tight">
            The Reading Journal
          </h1>
          <p className="text-[#b9b4ae] mt-2 text-sm md:text-base max-w-xl">
            A neutral, sequential record of your focus intervals, rest check-ins, and micro-actions.
          </p>
        </div>
      </section>

      {/* Activity Timeline */}
      <div className="space-y-3">
        {activities.map((act) => {
          const Icon = getIcon(act.type);
          return (
            <div
              key={act.id}
              className="p-4 rounded-xl bg-[#171a24] border border-[rgba(244,238,230,0.1)] hover:border-[rgba(244,238,230,0.22)] shadow-library flex items-center justify-between gap-4 transition"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#10131b] border border-[rgba(244,238,230,0.12)] text-[#c87046] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-editorial text-sm font-medium text-[#f4eee6]">{act.title}</h3>
                  {act.details && <p className="text-xs text-[#b9b4ae] mt-0.5">{act.details}</p>}
                </div>
              </div>
              <span className="text-xs font-mono text-[#78736d] shrink-0">
                {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}

        {activities.length === 0 && (
          <EmptyState
            icon={<BookOpen className="w-8 h-8 text-[#c87046]" />}
            title="The Journal is Clean"
            description="Take your first small step in the reading desk or start a focus session to begin logging."
          />
        )}
      </div>
    </div>
  );
}
