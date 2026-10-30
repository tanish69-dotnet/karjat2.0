"use client";

import Link from "next/link";
import { CompleteShelfLandingPage } from "@/components/threeui/CompleteShelfLandingPage";
import { ArrowLeft, Compass, LayoutDashboard, Sparkles } from "lucide-react";

export default function ShelfPage() {
  return (
    <div className="relative w-full h-screen bg-[#080808] overflow-hidden flex flex-col">
      {/* Floating Header Bar */}
      <header className="absolute top-4 left-6 right-6 z-20 flex items-center justify-between pointer-events-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-[#b9b4ae] bg-[#171a24]/80 backdrop-blur-md border border-[rgba(244,238,230,0.18)] hover:text-[#f4eee6] hover:border-[rgba(244,238,230,0.36)] transition-all shadow-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#c87046]" />
          <span>Back to Thaw</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-[#f4eee6] bg-[#c87046]/90 hover:bg-[#c87046] backdrop-blur-md transition-all shadow-lg shadow-[#c87046]/20"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Workspace</span>
          </Link>
        </div>
      </header>

      {/* CompleteShelfLandingPage Three.js Canvas Frame */}
      <main className="w-full h-full relative">
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
      </main>
    </div>
  );
}

