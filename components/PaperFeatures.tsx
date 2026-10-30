"use client";

import React, { useState, useEffect } from "react";
import { useThaw } from "@/lib/store";
import {
  Heart,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
} from "lucide-react";

// ─── 1. ENERGY CHECK-IN ───────────────────────────────────────────────────────
export function PaperEnergyFeature() {
  const { energyLevel, setEnergyLevel, logActivity } = useThaw();

  const DESCRIPTIONS: Record<number, { title: string; rec: string; tone: string }> = {
    1: {
      title: "Preservation & Shelter",
      rec: "Permit yourself to rest. Do not initiate 5-spoon tasks. Step into the Rest Sanctuary.",
      tone: "Gentle survival baseline.",
    },
    2: {
      title: "Low Capacity / Maintenance",
      rec: "Gentle maintenance only: answer short notes, organise workspace, take regular pauses.",
      tone: "Low friction preservation.",
    },
    3: {
      title: "Steady Equilibrium",
      rec: "Standard focus blocks. Tackle routine reading or moderate coursework with clear bounds.",
      tone: "Predictable, balanced flow.",
    },
    4: {
      title: "Creative Depth",
      rec: "High bandwidth. Ideal for essay drafts, complex synthesis, and deep literature architecture.",
      tone: "Expansive creative capacity.",
    },
    5: {
      title: "Hyper-Capacity Sprint",
      rec: "Rare peak stamina. Deep focus sprints, ambitious projects. Remember to drink water.",
      tone: "Peak flow state.",
    },
  };

  const active = DESCRIPTIONS[energyLevel] || DESCRIPTIONS[3];

  function handleSelect(lvl: number) {
    setEnergyLevel(lvl);
    logActivity("energy_checkin", `Calibrated to Level ${lvl}`, active.title);
  }

  return (
    <div className="space-y-4 text-[#2a221b]">
      <div className="text-center pb-2">
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8b4513] font-semibold mb-1">
          Active Daily Capacity
        </div>
        <div className="text-3xl font-serif text-[#1e1713] font-bold">
          {energyLevel} of 5 Spoons
        </div>
        <div className="text-xs font-serif italic text-[#5c4a3d]">
          {active.tone}
        </div>
      </div>

      {/* 5-Spoon Interactive Continuum */}
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => handleSelect(lvl)}
            className={`p-2.5 rounded-lg border text-center transition flex flex-col items-center justify-center gap-1 ${
              energyLevel === lvl
                ? "bg-[#8b4513] text-[#f7f2ea] border-[#8b4513] shadow-md scale-105"
                : "bg-[#eee5d8] text-[#5c4a3d] border-[#8b4513]/20 hover:bg-[#8b4513]/10"
            }`}
          >
            <span className="text-sm font-mono font-bold">{lvl}</span>
            <span className="text-[9px] font-mono tracking-wider uppercase opacity-80">
              {lvl === 1 ? "Low" : lvl === 5 ? "High" : "Spoon"}
            </span>
          </button>
        ))}
      </div>

      {/* Adaptive Recommendation Card */}
      <div className="p-4 rounded border border-[#8b4513]/25 bg-[#eee5d8]/70 space-y-2 text-xs">
        <div className="font-mono text-[10px] uppercase tracking-wider text-[#8b4513] font-bold flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5" />
          <span>Adaptive Recommendation</span>
        </div>
        <div className="font-serif text-sm font-semibold text-[#1e1713]">
          {active.title}
        </div>
        <p className="font-serif text-xs leading-relaxed text-[#2a221b]/90">
          {active.rec}
        </p>
      </div>

      <div className="text-[10px] font-mono text-[#7a6555] text-center italic">
        ✦ Calibrating energy reshuffles task priority across all volumes.
      </div>
    </div>
  );
}

// ─── 2. FOCUS TIMER ───────────────────────────────────────────────────────────
export function PaperTimerFeature() {
  const { logActivity } = useThaw();
  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      logActivity("focus_session", "Completed Focus Session", `${minutes} minutes interval`);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsLeft, minutes, logActivity]);

  function setPreset(m: number) {
    setIsRunning(false);
    setMinutes(m);
    setSecondsLeft(m * 60);
  }

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const progress = 1 - secondsLeft / (minutes * 60);

  return (
    <div className="space-y-4 text-[#2a221b] text-center">
      {/* Interval Selector */}
      <div className="flex items-center justify-center gap-2">
        {[10, 25, 50].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setPreset(m)}
            className={`px-3 py-1 rounded text-xs font-mono transition ${
              minutes === m && !isRunning
                ? "bg-[#8b4513] text-[#f7f2ea] shadow-sm font-bold"
                : "bg-[#eee5d8] text-[#5c4a3d] hover:bg-[#8b4513]/15"
            }`}
          >
            {m} min
          </button>
        ))}
      </div>

      {/* SVG Circular Dial */}
      <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="44"
            className="stroke-[#8b4513]/20"
            strokeWidth="5"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="44"
            className="stroke-[#8b4513] transition-all duration-500"
            strokeWidth="5"
            strokeDasharray={276.46}
            strokeDashoffset={276.46 * (1 - progress)}
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-mono font-bold text-[#1e1713] tracking-tighter">
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </div>
          <div className="text-[9px] font-mono uppercase tracking-widest text-[#7a6555]">
            {isRunning ? "Focusing" : "Paused"}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => setIsRunning(!isRunning)}
          className="px-5 py-2 rounded-full bg-[#8b4513] hover:bg-[#72360e] text-[#f7f2ea] font-mono text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-sm"
        >
          {isRunning ? (
            <>
              <Pause className="w-3.5 h-3.5" /> Pause
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" /> Begin Focus
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => setPreset(minutes)}
          className="p-2 rounded-full bg-[#eee5d8] text-[#5c4a3d] hover:bg-[#8b4513]/15 transition"
          title="Reset interval"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-[10px] font-mono text-[#7a6555] italic">
        ✦ Wall-clock precision. No sirens or harsh alarms upon completion.
      </p>
    </div>
  );
}

// ─── 3. REST SANCTUARY ────────────────────────────────────────────────────────
export function PaperRestFeature() {
  const [phase, setPhase] = useState<"Inhale" | "Hold (Full)" | "Exhale" | "Hold (Empty)">("Inhale");
  const [seconds, setSeconds] = useState(4);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setPhase((current) => {
            if (current === "Inhale") return "Hold (Full)";
            if (current === "Hold (Full)") return "Exhale";
            if (current === "Exhale") return "Hold (Empty)";
            return "Inhale";
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4 text-[#2a221b] text-center">
      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8b4513] font-semibold">
        Box Breathing Rhythm (4-4-4-4)
      </div>

      {/* Breathing Sphere */}
      <div className="relative w-36 h-36 mx-auto flex items-center justify-center my-4">
        <div
          className={`w-28 h-28 rounded-full bg-[#8b4513]/15 border-2 border-[#8b4513]/50 flex items-center justify-center transition-all duration-1000 ease-in-out ${
            phase === "Inhale"
              ? "scale-125 bg-[#8b4513]/25"
              : phase === "Hold (Full)"
              ? "scale-125 bg-[#8b4513]/30"
              : phase === "Exhale"
              ? "scale-90 bg-[#8b4513]/10"
              : "scale-90 bg-[#8b4513]/5"
          }`}
        >
          <div className="text-center">
            <div className="text-lg font-serif font-bold text-[#1e1713]">
              {phase}
            </div>
            <div className="text-sm font-mono text-[#8b4513]">
              {seconds}s
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 rounded bg-[#eee5d8]/70 border border-[#8b4513]/20 text-xs text-left space-y-1">
        <div className="font-mono text-[10px] uppercase tracking-wider text-[#8b4513] font-bold">
          Zero-Shame Sanctuary
        </div>
        <p className="font-serif text-[11px] leading-relaxed text-[#2a221b]">
          Rest whenever you need. No streaks are broken. Your body is recovering cognitive reserves.
        </p>
      </div>

      <div className="text-[10px] font-mono text-[#7a6555] italic">
        ✦ Step away whenever you feel ready. There are no exit restrictions.
      </div>
    </div>
  );
}

// ─── 4. TASK LEDGER ───────────────────────────────────────────────────────────
export function PaperTasksFeature() {
  const { tasks, addTask, toggleTaskComplete, deleteTask, energyLevel } = useThaw();
  const [newTitle, setNewTitle] = useState("");
  const [filterSpoons, setFilterSpoons] = useState<number | null>(null);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTask({
      title: newTitle.trim(),
      energyRequired: energyLevel,
      estimatedMinutes: 15,
      isFlexible: true,
    });
    setNewTitle("");
  }

  const visibleTasks = filterSpoons
    ? tasks.filter((t) => t.energyRequired <= filterSpoons)
    : tasks;

  return (
    <div className="space-y-3 text-[#2a221b]">
      {/* Quick Add Form */}
      <form onSubmit={handleCreate} className="flex gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New micro-task (e.g. Read 2 pages of Chapter 3)..."
          className="flex-1 p-2 rounded border border-[#8b4513]/30 bg-[#eee5d8]/50 text-xs font-serif text-[#1e1713] placeholder-[#7a6555]/60 focus:outline-none focus:border-[#8b4513]"
        />
        <button
          type="submit"
          disabled={!newTitle.trim()}
          className="px-3 py-2 rounded bg-[#8b4513] text-[#f7f2ea] hover:bg-[#72360e] disabled:opacity-50 text-xs font-mono uppercase tracking-wider flex items-center gap-1 shadow-sm shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </form>

      {/* Filter by spoons */}
      <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-[#5c4a3d]">
        <span>Filter by Capacity:</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setFilterSpoons(null)}
            className={`px-1.5 py-0.5 rounded ${
              filterSpoons === null ? "bg-[#8b4513] text-[#f7f2ea]" : "hover:bg-[#8b4513]/10"
            }`}
          >
            All
          </button>
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilterSpoons(s)}
              className={`px-1.5 py-0.5 rounded ${
                filterSpoons === s ? "bg-[#8b4513] text-[#f7f2ea]" : "hover:bg-[#8b4513]/10"
              }`}
            >
              ≤{s}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
        {visibleTasks.length === 0 ? (
          <div className="py-6 text-center text-xs font-serif italic text-[#7a6555]">
            No tasks registered in this capacity envelope.
          </div>
        ) : (
          visibleTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-2 rounded bg-[#eee5d8]/70 border border-[#8b4513]/15 text-xs hover:border-[#8b4513]/30 transition"
            >
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskComplete(task.id)}
                  className="rounded border-[#8b4513] text-[#8b4513] focus:ring-[#8b4513] cursor-pointer"
                />
                <span
                  className={`font-serif truncate text-xs ${
                    task.completed
                      ? "line-through text-[#7a6555] opacity-60"
                      : "text-[#1e1713]"
                  }`}
                >
                  {task.title}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono text-[#8b4513] bg-[#8b4513]/10 px-1 rounded">
                  {task.energyRequired} sp
                </span>
                <button
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  className="text-[#7a6555] hover:text-red-700"
                  title="Remove task"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="text-[10px] font-mono text-[#7a6555] text-right italic pt-1">
        ✦ Zero overdue flags. Items wait patiently for your capacity.
      </div>
    </div>
  );
}

// ─── 5. ADAPTIVE PLANNER ──────────────────────────────────────────────────────
export function PaperPlannerFeature() {
  const { tasks, logActivity } = useThaw();

  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  function handleRebalance() {
    logActivity("energy_checkin", "Rebalanced Week", "Algorithmic load redistributed");
  }

  return (
    <div className="space-y-3 text-[#2a221b]">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8b4513] font-semibold">
          7-Day Capacity Horizon
        </div>
        <button
          type="button"
          onClick={handleRebalance}
          className="px-2.5 py-1 rounded bg-[#8b4513] text-[#f7f2ea] hover:bg-[#72360e] text-[10px] font-mono uppercase tracking-wider shadow-sm transition"
        >
          Rebalance Week
        </button>
      </div>

      {/* 7-Day Matrix */}
      <div className="grid grid-cols-7 gap-1 pt-1">
        {DAYS.map((day, i) => {
          const dayTasks = tasks.filter((_, idx) => idx % 7 === i);
          const totalSpoons = dayTasks.reduce((acc, t) => acc + (t.energyRequired || 1), 0);
          const isHigh = totalSpoons > 5;

          return (
            <div
              key={day}
              className={`p-1.5 rounded border text-center flex flex-col justify-between min-h-[90px] ${
                isHigh
                  ? "bg-[#ebdccb] border-[#8b4513]/40"
                  : "bg-[#eee5d8]/60 border-[#8b4513]/15"
              }`}
            >
              <div className="text-[10px] font-mono font-bold text-[#8b4513]">
                {day}
              </div>
              <div className="text-[11px] font-serif font-bold text-[#1e1713]">
                {totalSpoons} sp
              </div>
              <div className="text-[9px] font-mono text-[#7a6555]">
                {dayTasks.length} {dayTasks.length === 1 ? "act" : "acts"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-2.5 rounded bg-[#eee5d8]/70 border border-[#8b4513]/20 text-xs">
        <div className="font-mono text-[9px] uppercase tracking-wider text-[#8b4513] font-bold mb-0.5">
          Equilibrium Indicator
        </div>
        <p className="font-serif text-[11px] leading-relaxed text-[#2a221b]">
          Total planned spoons: {tasks.reduce((a, t) => a + (t.energyRequired || 1), 0)} sp across {tasks.length} items. Keep daily totals under 5 to prevent overload.
        </p>
      </div>

      <div className="text-[10px] font-mono text-[#7a6555] italic text-center">
        ✦ One-click rebalance smooths spikes across lighter days.
      </div>
    </div>
  );
}

// ─── 6. GENTLE INSIGHTS ───────────────────────────────────────────────────────
export function PaperInsightsFeature() {
  const { tasks, activities, energyLevel } = useThaw();

  const completed = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-3 text-[#2a221b]">
      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8b4513] font-semibold">
        Curiosity-Driven Analytics
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2.5 rounded bg-[#eee5d8]/70 border border-[#8b4513]/20">
          <div className="text-xl font-mono font-bold text-[#1e1713]">
            {completed}
          </div>
          <div className="text-[9px] font-mono uppercase text-[#7a6555]">
            Completed
          </div>
        </div>
        <div className="p-2.5 rounded bg-[#eee5d8]/70 border border-[#8b4513]/20">
          <div className="text-xl font-mono font-bold text-[#1e1713]">
            {energyLevel}/5
          </div>
          <div className="text-[9px] font-mono uppercase text-[#7a6555]">
            Spoons
          </div>
        </div>
        <div className="p-2.5 rounded bg-[#eee5d8]/70 border border-[#8b4513]/20">
          <div className="text-xl font-mono font-bold text-[#1e1713]">
            {activities.length}
          </div>
          <div className="text-[9px] font-mono uppercase text-[#7a6555]">
            Events
          </div>
        </div>
      </div>

      {/* Reflection Note */}
      <div className="p-3 rounded bg-[#ebdccb]/60 border border-[#8b4513]/20 text-xs space-y-1">
        <div className="font-mono text-[9px] uppercase tracking-wider text-[#8b4513] font-bold">
          Reflective Pattern Mirror
        </div>
        <p className="font-serif text-[11px] leading-relaxed text-[#2a221b]">
          Your steady progress is logged exclusively on this device. No scores, no broken streaks, no judgment. A record of showing up when you could.
        </p>
      </div>

      <div className="text-[10px] font-mono text-[#7a6555] italic text-center">
        ✦ Observed without criticism to foster sustainable daily habits.
      </div>
    </div>
  );
}
