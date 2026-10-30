'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useThaw, Task } from '@/lib/store';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  RefreshCw,
  Play,
  Save,
  Plus,
  Trash2,
  Edit2,
  Coffee,
  BookOpen,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnergySelector } from '@/components/ui/energy-selector';
import { useToast } from '@/components/ui/toast';
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
  aiProvider?: string | null;
  fallback?: boolean;
  error?: string;
};

const DEFAULT_STEPS: Array<{ title: string; duration: string }> = [
  { title: 'Open your assignment file and read just the instructions', duration: '2 mins' },
  { title: 'Jot down 3 bullet points of what is needed', duration: '5 mins' },
  { title: 'Write an unstructured first draft paragraph', duration: '10 mins' },
];

export default function SequencerPage() {
  const { energyLevel, setEnergyLevel, tasks, addTask, logActivity } = useThaw();
  const { addToast } = useToast();
  const router = useRouter();

  const [taskInput, setTaskInput] = useState('');
  const [availableTime, setAvailableTime] = useState('');
  const [selectedEnergy, setSelectedEnergy] = useState(energyLevel);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SequenceResult | null>(null);
  const [ragContext, setRagContext] = useState<Array<{ id: string; title: string; actionableTip: string }>>([]);
  const [isLiveAI, setIsLiveAI] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [showRAGModal, setShowRAGModal] = useState(false);
  const [viewMode, setViewMode] = useState<'book' | 'workstation'>('book');
  const bookConfig = findBookByRoute('/sequencer');

  const [stepTitles, setStepTitles] = useState<Record<string, string>>({});
  const [stepDurations, setStepDurations] = useState<Record<string, string>>({});

  useEffect(() => {
    if (result?.steps) {
      const titles: Record<string, string> = {};
      const durations: Record<string, string> = {};
      result.steps.forEach((s) => {
        titles[s.id] = s.title;
        durations[s.id] = s.duration;
      });
      setStepTitles(titles);
      setStepDurations(durations);
    }
  }, [result]);

  const handleSequence = async () => {
    if (!taskInput.trim()) {
      setError('Please describe the task or assignment you want to dissolve.');
      return;
    }

    setLoading(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch('/api/sequence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskDescription: taskInput,
          energyLevel: selectedEnergy,
          availableTime: availableTime ? parseInt(availableTime, 10) : undefined,
        }),
      });

      const data: SequenceResponse = await res.json();
      setLoading(false);

      if (data.success && data.data) {
        setResult(data.data);
        setRagContext(data.ragContext ?? []);
        setIsLiveAI(!!data.isLiveAI);
        logActivity('energy_checkin', `Dissolved task into micro-steps: "${taskInput.slice(0, 35)}..."`);
        addToast({ title: 'Task sequenced into micro-steps', type: 'success' });
      } else {
        setError(data.error || 'Unable to generate task sequence.');
      }
    } catch {
      setLoading(false);
      setError('Failed to reach sequence service. Please try again.');
    }
  };

  const handleSaveToLedger = () => {
    if (!taskInput.trim()) return;

    const stepsToSave = (result?.steps || []).map((s) => ({
      id: s.id,
      title: stepTitles[s.id] || s.title,
      duration: stepDurations[s.id] || s.duration,
      completed: false,
    }));

    addTask({
      title: taskInput,
      description: result?.strategyUsed ? `Strategy: ${result.strategyUsed}` : undefined,
      energyRequired: selectedEnergy,
      isFlexible: true,
      subtasks: stepsToSave.map((st) => ({
        id: st.id,
        title: `${st.title} (${st.duration})`,
        completed: false,
      })),
    });

    setSaved(true);
    addToast({ title: 'Saved plan to your Task Ledger', type: 'success' });
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Editorial Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[rgba(244,238,230,0.12)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171a24] border border-[rgba(244,238,230,0.14)] text-[#c87046] text-xs font-mono uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Volume II · Cognitive Sequencer</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-editorial text-[#f4eee6] tracking-tight">
            Dissolve Overwhelm
          </h1>
          <p className="text-[#b9b4ae] mt-2 text-sm md:text-base max-w-xl">
            Convert intimidating assignments into a 2-minute starting micro-action grounded in non-clinical cognitive strategies.
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
              <span>Workstation</span>
            </button>
          </div>

          {ragContext.length > 0 && (
            <button
              onClick={() => setShowRAGModal(!showRAGModal)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#171a24] border border-[rgba(244,238,230,0.14)] text-xs font-mono uppercase tracking-wider text-[#b9b4ae] hover:text-[#f4eee6] transition"
            >
              <Info className="w-3.5 h-3.5 text-[#c87046]" />
              <span>Strategy ({ragContext.length})</span>
            </button>
          )}
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

      {/* Workstation Grid View */}
      {viewMode === 'workstation' && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Form (5 cols) */}
        <section className="lg:col-span-5 p-6 md:p-8 rounded-2xl bg-[#141822] border border-[rgba(244,238,230,0.14)] shadow-library space-y-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#c87046] font-semibold mb-2">
              What are you facing right now?
            </label>
            <textarea
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="e.g. Write 5 pages of literature review on cognitive load theory for seminar tomorrow..."
              rows={4}
              className="w-full p-4 rounded-xl bg-[#10131b] border border-[rgba(244,238,230,0.14)] text-[#f4eee6] placeholder-[#78736d] text-sm focus:outline-none focus:border-[#c87046] transition resize-none font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#b9b4ae] font-semibold mb-2">
              Select Current Capacity (Spoons)
            </label>
            <EnergySelector
              value={selectedEnergy}
              onChange={setSelectedEnergy}
              className="grid-cols-5"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#b9b4ae] font-semibold mb-2">
              Available Minutes (Optional)
            </label>
            <input
              type="number"
              value={availableTime}
              onChange={(e) => setAvailableTime(e.target.value)}
              placeholder="e.g. 25"
              className="w-full p-3 rounded-xl bg-[#10131b] border border-[rgba(244,238,230,0.14)] text-[#f4eee6] placeholder-[#78736d] text-xs font-mono focus:outline-none focus:border-[#c87046] transition"
            />
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-900/20 border border-red-500/30 text-red-200 text-xs font-mono">
              {error}
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={loading}
            onClick={handleSequence}
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Adaptive Sequence</span>
          </Button>
        </section>

        {/* Right Column: Generated Strategy Notebook (7 cols) */}
        <section className="lg:col-span-7 p-6 md:p-8 rounded-2xl bg-[#171a24] border border-[rgba(244,238,230,0.18)] shadow-library flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(244,238,230,0.12)]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c87046]" />
                <span className="label-micro text-[#f4eee6]">Editorial Sequence Plan</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                {isLiveAI ? (
                  <span className="text-[#c87046] font-semibold uppercase">● Live AI Grounded</span>
                ) : (
                  <span className="text-[#b9b4ae] uppercase">● Deterministic Fallback</span>
                )}
              </div>
            </div>

            {result ? (
              <div className="space-y-6">
                {/* 2-Minute Gateway */}
                {result.firstStep && (
                  <div className="p-5 rounded-xl bg-[#10131b] border border-[#c87046]/40 shadow-inner">
                    <span className="label-micro text-[#c87046] block mb-1">
                      Immediate Micro-Action (Low Friction)
                    </span>
                    <p className="text-xl font-editorial text-[#f4eee6] leading-relaxed">
                      "{result.firstStep}"
                    </p>
                  </div>
                )}

                {/* Steps List */}
                <div className="space-y-3">
                  <span className="label-micro text-[#b9b4ae] block">Step-by-step breakdown</span>
                  {(result.steps || []).map((step, idx) => (
                    <div
                      key={step.id}
                      className="p-3.5 rounded-xl bg-[#10131b]/90 border border-[rgba(244,238,230,0.1)] hover:border-[rgba(244,238,230,0.25)] transition flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="w-6 h-6 rounded-full bg-[#171a24] text-[#c87046] font-mono text-xs flex items-center justify-center shrink-0">
                          0{idx + 1}
                        </span>
                        <input
                          type="text"
                          value={stepTitles[step.id] ?? step.title}
                          onChange={(e) =>
                            setStepTitles({ ...stepTitles, [step.id]: e.target.value })
                          }
                          className="w-full bg-transparent text-[#f4eee6] text-xs font-medium focus:outline-none focus:text-[#c87046] transition truncate"
                        />
                      </div>
                      <input
                        type="text"
                        value={stepDurations[step.id] ?? step.duration}
                        onChange={(e) =>
                          setStepDurations({ ...stepDurations, [step.id]: e.target.value })
                        }
                        className="w-20 px-2 py-1 rounded bg-[#171a24] text-[#b9b4ae] text-[11px] font-mono text-center border border-[rgba(244,238,230,0.12)] focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-16 text-center space-y-3">
                <BookOpen className="w-8 h-8 text-[rgba(244,238,230,0.2)] mx-auto" />
                <h3 className="text-base font-editorial text-[#f4eee6]">Your Strategy Notebook is Ready</h3>
                <p className="text-xs text-[#b9b4ae] max-w-sm mx-auto">
                  Enter an assignment or project on the left. The sequencer will retrieve executive function strategies to map out an effortless first step.
                </p>
              </div>
            )}
          </div>

          {/* Action Footer */}
          {result && (
            <div className="pt-6 border-t border-[rgba(244,238,230,0.12)] flex flex-wrap items-center justify-between gap-3 mt-6">
              <Button
                variant={saved ? 'ghost' : 'secondary'}
                size="md"
                onClick={handleSaveToLedger}
                disabled={saved}
              >
                <Save className="w-4 h-4 text-[#c87046]" />
                <span>{saved ? 'Saved to Ledger' : 'Save to Ledger'}</span>
              </Button>

              <Link
                href={`/timer?task=${encodeURIComponent(result.firstStep || taskInput)}&duration=${encodeURIComponent(result.steps?.[0]?.duration || '2 mins')}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#c87046] hover:bg-[#b56138] text-white text-xs font-mono uppercase tracking-wider font-semibold transition shadow-md shadow-[#c87046]/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch in Focus Chamber</span>
              </Link>
            </div>
          )}
        </section>
      </div>
      )}

      {/* Strategy Grounding Modal */}
      {showRAGModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-6">
          <div className="max-w-xl w-full p-6 rounded-2xl bg-[#171a24] border border-[rgba(244,238,230,0.18)] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(244,238,230,0.12)]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#c87046]" />
                <h3 className="text-sm font-editorial text-[#f4eee6]">Retrieved Cognitive Strategies</h3>
              </div>
              <button
                onClick={() => setShowRAGModal(false)}
                className="text-[#b9b4ae] hover:text-[#f4eee6] text-xs font-mono uppercase"
              >
                Close [ESC]
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {ragContext.map((strat) => (
                <div key={strat.id} className="p-3.5 rounded-xl bg-[#10131b] border border-[rgba(244,238,230,0.1)]">
                  <h4 className="text-xs font-editorial text-[#f4eee6] font-semibold">{strat.title}</h4>
                  <p className="text-xs text-[#b9b4ae] mt-1 leading-relaxed">{strat.actionableTip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
