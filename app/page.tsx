"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CompleteShelfLandingPage } from "@/components/threeui/CompleteShelfLandingPage";
import { BookPortal } from "@/components/BookPortal";
import { ThawIntro } from "@/components/ThawIntro";
import {
  Sparkles,
  ArrowRight,
  Heart,
  Coffee,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";

const FEATURES = [
  {
    title: "Check in gently",
    body: "Start with a 1-5 spoon energy scale. Recommendations adapt to your actual capacity, not idealized expectations.",
    icon: Heart,
  },
  {
    title: "Melt overwhelm",
    body: "The AI task sequencer breaks intimidating academic work into a 2-minute starting step, grounded in retrieved cognitive strategies.",
    icon: Sparkles,
  },
  {
    title: "Rest without guilt",
    body: "Rest is a first-class citizen. Step into a calm sanctuary with guided breathing whenever you need to recharge.",
    icon: Coffee,
  },
];

export default function LandingPage() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("thaw_intro_seen") === "true") {
        setShowIntro(false);
      }
    } catch {}
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#080808] text-[#f4eee6] overflow-x-hidden">
      {/* Cinematic Book-Opening Intro Sequence */}
      {showIntro && (
        <ThawIntro onComplete={() => setShowIntro(false)} />
      )}

      {/* SECTION 1: 3D HERO - Book Portal wraps the interactive shelf */}
      <BookPortal>
        <section className="relative w-full h-screen overflow-hidden flex flex-col justify-between">
          {/* Floating Top Navigation */}
          <nav className="absolute top-5 left-6 right-6 z-20 flex items-center justify-between pointer-events-auto">
            <Link
              href="/"
              className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#171a24]/80 backdrop-blur-md border border-[rgba(244,238,230,0.18)] text-[#f4eee6] font-serif text-lg tracking-wide hover:border-[rgba(244,238,230,0.36)] transition shadow-lg"
            >
              <span className="w-6 h-6 rounded-full bg-[#c87046]/20 text-[#c87046] flex items-center justify-center text-xs">
                ❄
              </span>
              <span>Thaw</span>
            </Link>

            <div className="flex items-center gap-3">
              <a
                href="#about"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-[#b9b4ae] hover:text-[#f4eee6] transition"
              >
                <span>Features &amp; Philosophy</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </a>

              <Link
                href="/sequencer"
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-[#b9b4ae] hover:text-[#f4eee6] bg-[#171a24]/60 backdrop-blur-md border border-[rgba(244,238,230,0.14)] hover:border-[#c87046]/50 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#c87046]" />
                <span>AI Sequencer</span>
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#c87046] hover:bg-[#b56138] text-white font-medium text-xs tracking-wider uppercase transition shadow-lg shadow-[#c87046]/25"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Launch App</span>
              </Link>
            </div>
          </nav>

          {/* 3D Shelf Canvas Frame */}
          <div className="absolute inset-0 z-0">
            <CompleteShelfLandingPage
              headingFont="iowan-old-style"
              bodyFont="inter"
              headingWeight="400"
              bodyWeight="400"
              primaryColor="#c87046"
              headingSize={60}
              bodySize={12}
              headingLetterSpacing={-0.055}
              className="w-full h-full"
            />
          </div>
        </section>
      </BookPortal>

      {/* SECTION 2: PHILOSOPHY & CAPABILITIES */}
      <section id="about" className="py-24 px-6 md:px-12 bg-[#10131b] border-t border-[rgba(244,238,230,0.12)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#171a24] border border-[rgba(244,238,230,0.14)] text-[#c87046] text-xs font-mono uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Executive Function Co-Pilot</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-[#f4eee6] mb-6 tracking-tight">
              Productivity that meets you where you are.
            </h2>
            <p className="text-[#b9b4ae] text-base md:text-lg leading-relaxed">
              Standard productivity apps assume endless stamina and penalize missed streaks. Thaw adapts to your current spoon level, sequences work into 2-minute micro-actions, and treats rest as an essential tool.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="p-8 rounded-2xl bg-[#171a24]/60 border border-[rgba(244,238,230,0.12)] hover:border-[rgba(200,112,70,0.4)] transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#c87046]/10 text-[#c87046] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-serif text-[#f4eee6] mb-3">{f.title}</h3>
                    <p className="text-sm text-[#b9b4ae] leading-relaxed">{f.body}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Nav Footer */}
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-[#171a24] to-[#1c2230] border border-[rgba(244,238,230,0.14)] flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-xl font-serif text-[#f4eee6] mb-1">Ready to find your next step?</h4>
              <p className="text-sm text-[#b9b4ae]">Everything is saved locally on your device with complete privacy.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-full bg-[#c87046] hover:bg-[#b56138] text-white font-medium text-sm transition shadow-lg shadow-[#c87046]/20 flex items-center gap-2"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
