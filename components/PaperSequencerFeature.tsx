"use client";

import React, { useState } from "react";
import { useThaw } from "@/lib/store";
import {
  Sparkles,
  Loader2,
  BookmarkPlus,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export function PaperSequencerFeature() {
  const { energyLevel, addTask, logActivity } = useThaw();
  const [taskInput, setTaskInput] = useState("");
  const [spoons, setSpoons] = useState(energyLevel);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    acknowledgment: string;
    firstStep: string;
    steps: Array<{ id: string; title: string; duration: string; isEasiest?: boolean }>;
    strategyUsed: string;
  } | null>(null);

  async function handleSequence(e: React.FormEvent) {
    e.preventDefault();
    if (!taskInput.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/sequence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskDescription: taskInput,
          energyLevel: spoons,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setResult(data.data);
        logActivity(
          "energy_checkin",
          "Sequenced Task",
          `Decomposed: ${taskInput.slice(0, 40)}`
        );
      } else {
        throw new Error(data.error || "Failed to sequence task");
      }
    } catch {
      // Deterministic fallback
      setResult({
        acknowledgment: "Your goal is meaningful. Let's make starting virtually weightless.",
        firstStep: `Open your workspace and set a 2-minute timer for: ${taskInput.slice(0, 30)}...`,
        steps: [
          { id: "1", title: "Open workspace and arrange notes", duration: "2 mins", isEasiest: true },
          { id: "2", title: "Write or review three raw bullet points", duration: "5 mins" },
          { id: "3", title: "Take a sip of water and pause without guilt", duration: "2 mins" },
        ],
        strategyUsed: "two-minute-initiation",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleSaveToLedger(stepTitle: string) {
    addTask({
      title: stepTitle,
      description: `Synthesized from: ${taskInput}`,
      energyRequired: 1,
      estimatedMinutes: 5,
      isFlexible: true,
    });
    logActivity("task_completed", "Added Micro-Step", stepTitle);
  }

  return (
    <div className="space-y-4 text-[#2a221b]">
      {/* Task Input Form */}
      <form onSubmit={handleSequence} className="space-y-3">
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8b4513] font-semibold">
            Assignment or Intimidating Objective
          </label>
          <textarea
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="e.g. Write 500-word literature synthesis on cognitive load for Friday seminar..."
            rows={3}
            className="w-full p-2.5 rounded border border-[#8b4513]/30 bg-[#eee5d8]/50 text-xs sm:text-sm font-serif text-[#1e1713] placeholder-[#7a6555]/60 focus:outline-none focus:border-[#8b4513] focus:ring-1 focus:ring-[#8b4513]"
          />
        </div>

        {/* Spoon Calibration */}
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#5c4a3d]">
            Capacity (Spoons):
          </span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSpoons(lvl)}
                className={`w-6 h-6 rounded-full text-xs font-mono transition flex items-center justify-center ${
                  spoons === lvl
                    ? "bg-[#8b4513] text-[#f7f2ea] shadow-sm"
                    : "bg-[#eee5d8] text-[#5c4a3d] hover:bg-[#8b4513]/20"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !taskInput.trim()}
          className="w-full py-2 px-3 rounded bg-[#8b4513] hover:bg-[#72360e] disabled:opacity-50 text-[#f7f2ea] font-mono text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Sequencing Strategies…</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate 2-Minute Micro-Steps</span>
            </>
          )}
        </button>
      </form>

      {/* Generated Sequence Output */}
      {result && (
        <div className="pt-3 border-t border-[#8b4513]/20 space-y-3">
          <div className="p-2.5 rounded bg-[#ebdccb]/60 border border-[#8b4513]/20 text-xs">
            <div className="font-mono text-[9px] uppercase tracking-wider text-[#8b4513] font-bold mb-0.5">
              Initiation Step (Under 2 Minutes)
            </div>
            <div className="font-serif italic text-sm text-[#1e1713]">
              "{result.firstStep}"
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#5c4a3d]">
              Sequenced Steps ({result.steps.length})
            </div>
            {result.steps.map((st, idx) => (
              <div
                key={st.id || idx}
                className="flex items-center justify-between p-2 rounded bg-[#eee5d8]/70 border border-[#8b4513]/15 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <span className="font-mono text-[10px] text-[#8b4513] font-bold">
                    {idx + 1}.
                  </span>
                  <span className="font-serif truncate text-[#2a221b]">
                    {st.title}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] font-mono text-[#7a6555]">
                    {st.duration}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSaveToLedger(st.title)}
                    title="Save to Task Ledger"
                    className="p-1 rounded hover:bg-[#8b4513]/15 text-[#8b4513]"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-[#7a6555]">
            <span>Strategy: {result.strategyUsed}</span>
            <Link
              href="/timer"
              className="text-[#8b4513] font-bold underline flex items-center gap-1"
            >
              Start Focus Chamber <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
