"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface ThawIntroProps {
  onComplete: () => void;
  forceShow?: boolean;
}

export function ThawIntro({ onComplete, forceShow = false }: ThawIntroProps) {
  const prefersReduced = useReducedMotion();
  const [phase, setPhase] = useState<"ambient" | "wordmark" | "book-open" | "sweep" | "handoff">("ambient");
  const [isDismissed, setIsDismissed] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // If not forced and already shown in this session, complete immediately
    if (!forceShow) {
      try {
        const seen = sessionStorage.getItem("thaw_intro_seen");
        if (seen === "true") {
          setIsDismissed(true);
          onComplete();
          return;
        }
      } catch {}
    }

    // Fast path for users who prefer reduced motion
    if (prefersReduced) {
      const timer = setTimeout(() => {
        handleFinish();
      }, 1000);
      return () => clearTimeout(timer);
    }

    // Paced continuous cinematic timeline (total ~3.6s):
    // 0ms: Ambient darkness & snowflake emblem
    // 500ms: Wordmark reveal + hairline draw
    // 1300ms: Book rises continuously and starts smooth cover rotation
    // 2200ms: Warm amber light sweeps page & "YOUR SPACE, YOUR PACE" appears
    // 2900ms: Handoff phase begins — book gracefully scales and dissolves into the 3D shelf
    // 3600ms: Handoff finishes, unmounting overlay
    const t1 = setTimeout(() => setPhase("wordmark"), 500);
    const t2 = setTimeout(() => setPhase("book-open"), 1300);
    const t3 = setTimeout(() => setPhase("sweep"), 2200);
    const t4 = setTimeout(() => setPhase("handoff"), 2900);
    const t5 = setTimeout(() => handleFinish(), 3600);

    timeoutsRef.current = [t1, t2, t3, t4, t5];

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, [forceShow, prefersReduced]);

  function handleFinish() {
    setIsDismissed(true);
    try {
      sessionStorage.setItem("thaw_intro_seen", "true");
    } catch {}
    onComplete();
  }

  if (isDismissed) return null;

  return (
    <motion.div
      key="thaw-intro-overlay"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "handoff" ? 0 : 1 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center select-none overflow-hidden pointer-events-auto"
      style={{
        background: phase === "handoff" ? "transparent" : "#080808",
      }}
    >
      {/* Ambient Deep Radial Backlight */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: phase === "handoff" ? 0 : 1,
          scale: phase === "handoff" ? 1.2 : 1,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(200, 112, 70, 0.14) 0%, rgba(14, 16, 23, 0.85) 55%, rgba(8, 8, 8, 1) 100%)",
        }}
      />

      {/* Subtle Film / Paper Grain Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(rgba(244, 238, 230, 0.15) 1px, transparent 1px)`,
          backgroundSize: "6px 6px",
        }}
      />

      {/* Skip Intro Control */}
      <div className="absolute top-6 right-6 z-30">
        <button
          type="button"
          onClick={handleFinish}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[rgba(244,238,230,0.16)] bg-[#171a24]/80 backdrop-blur-md text-xs font-mono tracking-wider uppercase text-[#b9b4ae] hover:text-[#f4eee6] hover:border-[#c87046]/60 transition duration-200 shadow-lg cursor-pointer"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-3 h-3 text-[#c87046]" />
        </button>
      </div>

      {/* Continuous Stage Container */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md px-6 min-h-[380px]">
        {/* 1. BRAND WORDMARK (Gently transitions upward into the book) */}
        <motion.div
          animate={
            phase === "ambient"
              ? { opacity: 0.4, y: 10 }
              : phase === "wordmark"
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: -24, scale: 0.96 }
          }
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`flex flex-col items-center text-center ${
            phase !== "ambient" && phase !== "wordmark" ? "pointer-events-none absolute" : ""
          }`}
        >
          {/* Emblem */}
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#c87046]/20 border border-[#c87046]/40 text-[#c87046] mb-4 shadow-lg shadow-[#c87046]/15">
            <span className="font-serif text-lg font-bold">❄</span>
          </div>

          {/* Wordmark */}
          <h1 className="text-4xl sm:text-5xl font-serif text-[#f4eee6] tracking-tight mb-2 font-normal">
            thaw
          </h1>

          {/* Burnt-Orange Rule */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: phase !== "ambient" ? 64 : 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="h-[1.5px] bg-gradient-to-r from-transparent via-[#c87046] to-transparent my-2.5"
          />

          {/* Tagline */}
          <p className="text-xs sm:text-sm font-serif italic tracking-wide text-[#b9b4ae]">
            "Make room for how you work."
          </p>
        </motion.div>

        {/* 2. PHYSICAL BOOK OPENING (Appears seamlessly as wordmark dissolves) */}
        {(phase === "book-open" || phase === "sweep" || phase === "handoff") && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            animate={
              phase === "handoff"
                ? {
                    opacity: 0,
                    scale: 1.25,
                    y: -10,
                    filter: "blur(8px)",
                  }
                : {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    filter: "blur(0px)",
                  }
            }
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center justify-center w-full"
            style={{ perspective: "1200px" }}
          >
            {/* Physical 3D Book Casing */}
            <div
              className="relative w-64 sm:w-72 h-88 sm:h-96 rounded-xl flex items-center justify-center shadow-2xl"
              style={{
                background: "linear-gradient(135deg, #182a43 0%, #15100d 100%)",
                boxShadow:
                  "0 30px 70px -10px rgba(0,0,0,0.95), 0 0 40px rgba(200, 112, 70, 0.28)",
                border: "1.5px solid rgba(200, 112, 70, 0.45)",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Spine Band */}
              <div className="absolute left-0 top-0 bottom-0 w-2.5 rounded-l-xl bg-gradient-to-r from-[#c87046] to-[#8b4513] shadow-inner" />

              {/* Left Rotating Cover (Single smooth hinge arc) */}
              <motion.div
                initial={{ rotateY: 0 }}
                animate={{ rotateY: -145 }}
                transition={{ duration: 1.15, ease: [0.2, 0.75, 0.25, 1] }}
                className="absolute inset-0 rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 text-center"
                style={{
                  background: "linear-gradient(135deg, #182a43 0%, #12151c 100%)",
                  transformOrigin: "left center",
                  transformStyle: "preserve-3d",
                  borderRight: "1px solid rgba(200, 112, 70, 0.35)",
                  boxShadow: "6px 0 24px rgba(0,0,0,0.65)",
                }}
              >
                <div className="w-8 h-8 rounded-full border border-[#c87046]/40 flex items-center justify-center text-[#c87046] mb-3">
                  ❄
                </div>
                <div className="text-xl font-serif text-[#f4eee6] mb-1">
                  Thaw
                </div>
                <div className="text-[10px] font-mono tracking-widest uppercase text-[#c87046]/90">
                  Volume I
                </div>
              </motion.div>

              {/* Right Interior Ivory Pages */}
              <div
                className="w-full h-full rounded-r-xl p-6 flex flex-col justify-between overflow-hidden relative"
                style={{
                  background: "#f7f2ea",
                  color: "#2a221b",
                }}
              >
                {/* Amber Light Sweep */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: phase === "sweep" || phase === "handoff" ? "220%" : "-100%" }}
                  transition={{ duration: 1.1, ease: "easeInOut" }}
                  className="absolute inset-0 pointer-events-none opacity-45 bg-gradient-to-r from-transparent via-[#c87046]/35 to-transparent skew-x-12"
                />

                {/* Folio Header */}
                <div className="flex items-center justify-between border-b border-[#2a221b]/15 pb-2 text-[9px] font-mono tracking-widest text-[#8b4513] uppercase">
                  <span>Thaw Library</span>
                  <span>Folio 01</span>
                </div>

                {/* Center Thought */}
                <div className="my-auto space-y-2 text-center py-4">
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="text-[9px] font-mono tracking-[0.25em] text-[#8b4513] uppercase font-bold"
                  >
                    YOUR SPACE, YOUR PACE
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.45 }}
                    className="text-lg font-serif text-[#1e1713] italic"
                  >
                    Finding your rhythm...
                  </motion.div>

                  <div className="w-8 h-[1px] bg-[#8b4513]/40 mx-auto my-2" />

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.45 }}
                    className="text-[11px] font-serif text-[#5c4a3d] leading-relaxed max-w-[200px] mx-auto"
                  >
                    An adaptive co-pilot designed to melt task paralysis with compassion.
                  </motion.p>
                </div>

                {/* Folio Footer */}
                <div className="pt-2 border-t border-[#2a221b]/10 flex items-center justify-between text-[8px] font-mono text-[#7a6555]">
                  <span>· EDITION 2026 ·</span>
                  <span>ENTERING ARCHIVE</span>
                </div>
              </div>
            </div>

            {/* Depth Floor Shadow */}
            <div className="w-48 sm:w-56 h-4 rounded-full bg-black/60 blur-md mt-4 pointer-events-none" />
          </motion.div>
        )}
      </div>

      {/* Ambient Status Label */}
      <motion.div
        animate={{
          opacity: phase === "handoff" ? 0 : 0.65,
        }}
        transition={{ duration: 0.4 }}
        className="absolute bottom-8 z-10 text-[10px] font-mono tracking-widest text-[#b9b4ae] uppercase flex items-center gap-2"
      >
        <Sparkles className="w-3 h-3 text-[#c87046] animate-pulse" />
        <span>Entering Library Universe</span>
      </motion.div>
    </motion.div>
  );
}
