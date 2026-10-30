'use client';

import React, { useState, useCallback } from 'react';
import { useThaw, Task, Subtask } from '@/lib/store';
import {
  CheckSquare,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Clock,
  Zap,
  Edit2,
  Search,
  Filter,
  ChevronRight,
  BookOpen,
  Check,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { useToast } from '@/components/ui/toast';
import { OpenBookSpreadView } from '@/components/OpenBookSpreadView';
import { findBookByRoute } from '@/lib/books';

const DEADLINE_OPTIONS = ['Today', 'Tomorrow', 'In 2 days', 'This week', 'Flexible'];

export default function TasksPage() {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
  } = useThaw();
  const { addToast } = useToast();

  const [showAdd, setShowAdd] = useState(false);
  const [viewMode, setViewMode] = useState<'book' | 'workstation'>('book');
  const bookConfig = findBookByRoute('/tasks');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [sort, setSort] = useState<'deadline' | 'energy' | 'duration' | 'created'>('deadline');

  const [form, setForm] = useState({
    title: '',
    description: '',
    deadline: 'Today' as string,
    estimatedMinutes: 20,
    energyRequired: 3,
    isFlexible: true,
  });

  const filteredTasks = useCallback(() => {
    let list = [...tasks];
    const q = search.toLowerCase();
    list = list.filter((t) => t.title.toLowerCase().includes(q) || (t.description ?? '').toLowerCase().includes(q));
    if (filter === 'pending') list = list.filter((t) => !t.completed);
    if (filter === 'completed') list = list.filter((t) => t.completed);
    list.sort((a, b) => {
      if (sort === 'deadline') {
        const ad = a.deadline ?? 'zzz';
        const bd = b.deadline ?? 'zzz';
        return ad.localeCompare(bd);
      }
      if (sort === 'energy') return (a.energyRequired ?? 3) - (b.energyRequired ?? 3);
      if (sort === 'duration') return (a.estimatedMinutes ?? 15) - (b.estimatedMinutes ?? 15);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return list;
  }, [tasks, search, filter, sort]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    addTask({
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      deadline: form.deadline,
      estimatedMinutes: form.estimatedMinutes,
      energyRequired: form.energyRequired,
      isFlexible: form.isFlexible,
    });
    setForm({ title: '', description: '', deadline: 'Today', estimatedMinutes: 20, energyRequired: 3, isFlexible: true });
    setShowAdd(false);
    addToast({ title: 'New task recorded in your ledger', type: 'success' });
  };

  const taskList = filteredTasks();

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[rgba(244,238,230,0.12)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171a24] border border-[rgba(244,238,230,0.14)] text-[#c87046] text-xs font-mono uppercase tracking-widest mb-3">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Volume V · Task Ledger</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-editorial text-[#f4eee6] tracking-tight">
            The Task Ledger
          </h1>
          <p className="text-[#b9b4ae] mt-2 text-sm md:text-base max-w-xl">
            A low-pressure, zero-shame catalog of commitments. Reorganize and calibrate freely without overdue alarms.
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
              <span>Full Ledger</span>
            </button>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setViewMode('workstation');
              setShowAdd(!showAdd);
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Record New Task</span>
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

      {/* Workstation Ledger View */}
      {viewMode === 'workstation' && (
      <>

      {/* Add Task Drawer */}
      {showAdd && (
        <form
          onSubmit={handleCreate}
          className="p-6 md:p-8 rounded-2xl bg-[#141822] border border-[rgba(200,112,70,0.35)] shadow-library space-y-5"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(244,238,230,0.1)]">
            <span className="label-micro text-[#c87046]">Draft New Entry</span>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="text-xs font-mono text-[#b9b4ae] hover:text-[#f4eee6]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#b9b4ae] mb-1.5">
                Task Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Read Chapter 4 of Philosophy of Mind..."
                className="w-full p-3.5 rounded-xl bg-[#10131b] border border-[rgba(244,238,230,0.14)] text-[#f4eee6] text-sm focus:outline-none focus:border-[#c87046]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#b9b4ae] mb-1.5">
                Target Horizon
              </label>
              <select
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="w-full p-3 rounded-xl bg-[#10131b] border border-[rgba(244,238,230,0.14)] text-[#f4eee6] text-xs font-mono focus:outline-none focus:border-[#c87046]"
              >
                {DEADLINE_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#b9b4ae] mb-1.5">
                Energy Spoons Required (1-5)
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={form.energyRequired}
                onChange={(e) => setForm({ ...form, energyRequired: parseInt(e.target.value, 10) || 1 })}
                className="w-full p-3 rounded-xl bg-[#10131b] border border-[rgba(244,238,230,0.14)] text-[#f4eee6] text-xs font-mono focus:outline-none focus:border-[#c87046]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button type="submit" variant="primary" size="md">
              Save Entry
            </Button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#141822] border border-[rgba(244,238,230,0.12)]">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#b9b4ae] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ledger entries..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#10131b] border border-[rgba(244,238,230,0.1)] text-[#f4eee6] placeholder-[#78736d] text-xs focus:outline-none focus:border-[#c87046]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="inline-flex rounded-lg bg-[#10131b] p-1 border border-[rgba(244,238,230,0.1)]">
            {(['all', 'pending', 'completed'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                className={`px-3 py-1 rounded text-xs font-mono uppercase tracking-wider transition ${
                  filter === mode
                    ? 'bg-[#c87046] text-white font-semibold'
                    : 'text-[#b9b4ae] hover:text-[#f4eee6]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {taskList.length > 0 ? (
          taskList.map((task) => (
            <div
              key={task.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                task.completed
                  ? 'bg-[#10131b]/60 border-[rgba(244,238,230,0.06)] opacity-60'
                  : 'bg-[#171a24] border-[rgba(244,238,230,0.14)] hover:border-[rgba(200,112,70,0.4)] shadow-library'
              }`}
            >
              <div className="flex items-start gap-4 min-w-0 flex-1">
                <button
                  onClick={() => toggleTaskComplete(task.id)}
                  className={`w-6 h-6 rounded-lg border mt-0.5 flex items-center justify-center transition-all shrink-0 ${
                    task.completed
                      ? 'bg-[#c87046] border-[#c87046] text-white'
                      : 'border-[rgba(244,238,230,0.25)] hover:border-[#c87046]'
                  }`}
                  aria-label="Toggle Complete"
                >
                  {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div className="min-w-0">
                  <h3
                    className={`text-base font-editorial transition ${
                      task.completed ? 'line-through text-[#b9b4ae]' : 'text-[#f4eee6]'
                    }`}
                  >
                    {task.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono text-[#b9b4ae]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#c87046]" />
                      <span>{task.deadline || 'Flexible'}</span>
                    </span>
                    <span>·</span>
                    <span className="text-[#c87046]">Level {task.energyRequired ?? 3} Spoons</span>
                    {task.estimatedMinutes && (
                      <>
                        <span>·</span>
                        <span>{task.estimatedMinutes} mins</span>
                      </>
                    )}
                  </div>

                  {/* Subtasks rendering */}
                  {task.subtasks && task.subtasks.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[rgba(244,238,230,0.08)] space-y-1.5">
                      {task.subtasks.map((st) => (
                        <div
                          key={st.id}
                          onClick={() => toggleSubtask(task.id, st.id)}
                          className="flex items-center gap-2 text-xs text-[#b9b4ae] cursor-pointer hover:text-[#f4eee6]"
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[8px] ${
                              st.completed ? 'bg-[#c87046] border-[#c87046] text-white' : 'border-[rgba(244,238,230,0.3)]'
                            }`}
                          >
                            {st.completed && '✓'}
                          </span>
                          <span className={st.completed ? 'line-through opacity-70' : ''}>{st.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Task Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/sequencer?task=${encodeURIComponent(task.title)}`}
                  className="p-2 rounded-lg bg-[#10131b] border border-[rgba(244,238,230,0.12)] text-[#b9b4ae] hover:text-[#c87046] transition"
                  title="Break down in AI Sequencer"
                >
                  <Sparkles className="w-4 h-4" />
                </Link>

                <Link
                  href={`/timer?task=${encodeURIComponent(task.title)}`}
                  className="p-2 rounded-lg bg-[#10131b] border border-[rgba(244,238,230,0.12)] text-[#b9b4ae] hover:text-[#f4eee6] transition"
                  title="Focus on this task"
                >
                  <Clock className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 rounded-lg bg-[#10131b] border border-[rgba(244,238,230,0.12)] text-[#b9b4ae] hover:text-red-400 transition"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            icon={<BookOpen className="w-8 h-8 text-[#c87046]" />}
            title="No Matching Ledger Entries"
            description="Your current filter has no items. Record a task above or switch filters."
          />
        )}
      </div>
      </>
      )}
    </div>
  );
}
