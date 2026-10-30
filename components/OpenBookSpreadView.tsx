"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, BookOpen } from "lucide-react";
import { BookConfig } from "@/lib/books";
import { getBookEditorial } from "@/lib/bookEditorialContent";
import {
  OpenBookPageLayout,
  EditorialPageArticle,
} from "@/components/BookSpreadLayout";
import { PaperSequencerFeature } from "@/components/PaperSequencerFeature";
import {
  PaperEnergyFeature,
  PaperTimerFeature,
  PaperRestFeature,
  PaperTasksFeature,
  PaperPlannerFeature,
  PaperInsightsFeature,
} from "@/components/PaperFeatures";

interface OpenBookSpreadViewProps {
  book: BookConfig;
  onClose: () => void;
}

export function OpenBookSpreadView({ book, onClose }: OpenBookSpreadViewProps) {
  const editorial = getBookEditorial(book.id);
  const [spreadIndex, setSpreadIndex] = useState(0); // 0 to 4 (5 spreads total)
  const totalSpreads = editorial.spreads.length;

  const currentSpread = editorial.spreads[spreadIndex];
  const accentColor = book.foil || "#c87046";

  function handlePrev() {
    setSpreadIndex((i) => Math.max(0, i - 1));
  }

  function handleNext() {
    setSpreadIndex((i) => Math.min(totalSpreads - 1, i + 1));
  }

  // Determine which live feature to render on Spread 5 (Page 05 recto)
  function renderLiveFeature() {
    switch (book.id) {
      case "thaw-sequencer":
        return <PaperSequencerFeature />;
      case "thaw-energy":
        return <PaperEnergyFeature />;
      case "thaw-timer":
        return <PaperTimerFeature />;
      case "thaw-rest":
        return <PaperRestFeature />;
      case "thaw-tasks":
        return <PaperTasksFeature />;
      case "thaw-planner":
        return <PaperPlannerFeature />;
      case "thaw-insights":
        return <PaperInsightsFeature />;
      default:
        return <PaperSequencerFeature />;
    }
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto my-auto flex flex-col items-center justify-center p-2 sm:p-4 select-none">
      {/* Physical Leather/Cloth Bound Hardcover Wrapper */}
      <div
        className="relative w-full rounded-2xl p-2 sm:p-3 shadow-2xl transition-all"
        style={{
          background: `linear-gradient(135deg, ${book.color} 0%, #15100d 100%)`,
          boxShadow: `0 30px 90px rgba(0,0,0,0.8), 0 0 40px ${accentColor}25`,
          border: `1.5px solid ${accentColor}40`,
        }}
      >
        {/* Subtle cloth embossing / foil edge trim */}
        <div className="absolute inset-1 rounded-xl border border-white/5 pointer-events-none" />

        {/* Top Control Bar floating inside the book casing */}
        <div className="flex items-center justify-between px-3 py-2 text-xs font-mono text-[#f4eee6]/80 border-b border-white/10 mb-2">
          <div className="flex items-center gap-2">
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-serif"
              style={{ background: `${accentColor}30`, color: accentColor }}
            >
              {book.roman}
            </span>
            <span className="font-serif tracking-wide text-sm text-[#f4eee6]">
              {book.title}
            </span>
            <span className="text-[10px] text-white/40 hidden sm:inline">
              · {book.discipline}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-[11px] tracking-wider uppercase font-mono text-[#f4eee6]/70">
              Spread {spreadIndex + 1} of {totalSpreads}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[#f4eee6] transition text-xs font-mono"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Close Volume</span>
            </button>
          </div>
        </div>

        {/* The Open Book Paper Surface (Two Ivory Pages + Central Gutter) */}
        <div
          className="relative w-full min-h-[580px] max-h-[82vh] rounded-lg overflow-hidden flex flex-col md:flex-row shadow-inner"
          style={{
            background: "#f7f2ea",
          }}
        >
          {/* Subtle paper grain texture simulation */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply"
            style={{
              backgroundImage: `radial-gradient(#2a221b 0.75px, transparent 0.75px)`,
              backgroundSize: "8px 8px",
            }}
          />

          {/* LEFT PAGE (Verso) */}
          <div className="flex-1 min-w-0 border-b md:border-b-0 md:border-r border-[#2a221b]/20 relative z-10 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={`left-${spreadIndex}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.25 }}
                className="h-full"
              >
                <OpenBookPageLayout
                  volumeRoman={book.roman}
                  discipline={book.discipline}
                  pageNumber={spreadIndex * 2 + 1}
                  isLeft={true}
                >
                  <EditorialPageArticle
                    content={currentSpread.left}
                    accentColor={accentColor}
                  />
                </OpenBookPageLayout>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* CENTRAL BOOK GUTTER (Shadow & Spine Fold) */}
          <div className="hidden md:block w-8 shrink-0 relative pointer-events-none z-20">
            {/* Deep shadow in spine fold */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/40 to-black/25" />
            {/* Center stitched crease */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-black/40" />
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-[#8b4513]/30" />
          </div>

          {/* RIGHT PAGE (Recto) */}
          <div className="flex-1 min-w-0 relative z-10 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={`right-${spreadIndex}`}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.25 }}
                className="h-full"
              >
                <OpenBookPageLayout
                  volumeRoman={book.roman}
                  discipline={book.discipline}
                  pageNumber={spreadIndex * 2 + 2}
                  isLeft={false}
                >
                  {"isInteractiveLiveFeature" in currentSpread.right ? (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#8b4513] font-semibold">
                          PAGE 05 · ACTIVE WORKSPACE
                        </div>
                        <h2 className="text-xl sm:text-2xl font-serif text-[#1e1713] leading-tight font-bold">
                          {currentSpread.right.featureTitle}
                        </h2>
                        <div className="text-xs font-serif italic text-[#5c4a3d]">
                          {currentSpread.right.featureSubtitle}
                        </div>
                      </div>
                      <div className="w-12 h-[1px] bg-[#8b4513]/40 my-2" />
                      {/* Live Feature Embedded directly on paper */}
                      <div className="pt-1">{renderLiveFeature()}</div>
                    </div>
                  ) : (
                    <EditorialPageArticle
                      content={currentSpread.right}
                      accentColor={accentColor}
                    />
                  )}
                </OpenBookPageLayout>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Pagination & Spread Turner */}
        <div className="flex items-center justify-between px-3 py-2.5 mt-2 text-xs font-mono text-[#f4eee6]">
          <button
            type="button"
            onClick={handlePrev}
            disabled={spreadIndex === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Spread</span>
          </button>

          {/* Spread Jump Dots */}
          <div className="flex items-center gap-2">
            {editorial.spreads.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSpreadIndex(idx)}
                className={`transition-all rounded-full flex items-center justify-center text-[10px] ${
                  spreadIndex === idx
                    ? "w-6 h-6 bg-[#c87046] text-white font-bold"
                    : "w-4 h-4 bg-white/20 text-white/70 hover:bg-white/40"
                }`}
                title={`Jump to Spread 0${idx + 1}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={spreadIndex === totalSpreads - 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition"
          >
            <span>
              {spreadIndex === totalSpreads - 2 ? "Go to Live Feature" : "Next Spread"}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

