'use client';

import React, { useState } from 'react';
import { useThaw } from '@/lib/store';
import { Shield, Trash2, Sliders, Sparkles, RefreshCw, Download, EyeOff, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

export default function SettingsPage() {
  const {
    clearAllData,
    reducedMotion,
    setReducedMotion,
    isDemoMode,
    setIsDemoMode,
    tasks,
    activities,
  } = useThaw();
  const { addToast } = useToast();

  const [cleared, setCleared] = useState(false);
  const [exported, setExported] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleExport = () => {
    const data = {
      tasks,
      activities,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thaw-data-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
    addToast({ title: 'Data archive downloaded to local disk', type: 'success' });
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      clearAllData();
      setDeleteConfirm(false);
      addToast({ title: 'All personal records cleared', type: 'info' });
    } else {
      setDeleteConfirm(true);
      setTimeout(() => setDeleteConfirm(false), 3500);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[rgba(244,238,230,0.12)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171a24] border border-[rgba(244,238,230,0.14)] text-[#c87046] text-xs font-mono uppercase tracking-widest mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>Volume IX · Library Controls</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-editorial text-[#f4eee6] tracking-tight">
            Preferences & Privacy
          </h1>
          <p className="text-[#b9b4ae] mt-2 text-sm md:text-base max-w-xl">
            Thaw stores your data directly in browser localStorage. Nothing leaves your machine without your explicit invocation.
          </p>
        </div>
      </section>

      {/* Local-First Storage & Data Controls */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#141822] border border-[rgba(244,238,230,0.14)] shadow-library space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-[rgba(244,238,230,0.1)]">
          <div className="w-9 h-9 rounded-full bg-[#10131b] border border-[rgba(244,238,230,0.12)] text-[#c87046] flex items-center justify-center">
            <EyeOff className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-editorial text-base text-[#f4eee6]">Local-First Architecture</h3>
            <p className="text-xs text-[#b9b4ae]">Zero telemetry. Zero centralized tracking.</p>
          </div>
        </div>

        <p className="text-xs text-[#b9b4ae] leading-relaxed">
          Your tasks, spoon calibrations, and focus intervals reside exclusively in your local browser profile. You can export a full JSON ledger backup or erase all local state at any time.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Button variant="secondary" size="md" onClick={handleExport}>
            <Download className="w-4 h-4 text-[#c87046]" />
            <span>{exported ? 'Archive Exported' : 'Export JSON Ledger'}</span>
          </Button>

          <Button
            variant="danger"
            size="md"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4" />
            <span>{deleteConfirm ? 'Confirm Clear All Data?' : 'Clear Local Data'}</span>
          </Button>
        </div>
      </div>

      {/* Interface Accessibility Options */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#171a24] border border-[rgba(244,238,230,0.14)] shadow-library space-y-6">
        <h3 className="font-editorial text-base text-[#f4eee6]">Motion & Visual Comfort</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#f4eee6]">Reduced Motion Pacing</p>
            <p className="text-xs text-[#b9b4ae]">Mute ambient breathing pulses and large 3D scene shifts.</p>
          </div>
          <button
            onClick={() => setReducedMotion(!reducedMotion)}
            className={`w-12 h-6 rounded-full transition-colors relative border ${
              reducedMotion ? 'bg-[#c87046] border-[#c87046]' : 'bg-[#10131b] border-[rgba(244,238,230,0.2)]'
            }`}
          >
            <span
              className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                reducedMotion ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
