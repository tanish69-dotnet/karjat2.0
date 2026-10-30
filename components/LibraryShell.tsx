"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useThaw } from "@/lib/store";
import {
  LayoutDashboard,
  Sparkles,
  Timer,
  Coffee,
  CheckSquare,
  Calendar,
  BarChart3,
  Activity,
  Settings,
  BookOpen,
  Menu,
  X,
} from "lucide-react";
import { LiquidGlassNavbar } from "@/components/ui/liquid-glass-navbar";

export const LIBRARY_VOLUMES = [
  { href: "/dashboard", label: "Reading Desk", roman: "I", discipline: "Capacity Check-in", icon: LayoutDashboard },
  { href: "/sequencer", label: "AI Sequencer", roman: "II", discipline: "Intelligent Micro-steps", icon: Sparkles },
  { href: "/timer", label: "Focus Chamber", roman: "III", discipline: "Virtual Body Doubling", icon: Timer },
  { href: "/rest", label: "Rest Sanctuary", roman: "IV", discipline: "Guilt-Free Recovery", icon: Coffee },
  { href: "/tasks", label: "Task Ledger", roman: "V", discipline: "Low-Pressure Registry", icon: CheckSquare },
  { href: "/planner", label: "Weekly Atlas", roman: "VI", discipline: "Capacity Balancing", icon: Calendar },
  { href: "/insights", label: "Reflection Archive", roman: "VII", discipline: "Self-Knowledge", icon: BarChart3 },
  { href: "/activity", label: "Activity Journal", roman: "VIII", discipline: "Session Log", icon: Activity },
  { href: "/settings", label: "Library Controls", roman: "IX", discipline: "Preferences & Privacy", icon: Settings },
];

export function LibraryHeader() {
  const pathname = usePathname();
  const { energyLevel } = useThaw();
  const [menuOpen, setMenuOpen] = useState(false);

  const activeVolume = LIBRARY_VOLUMES.find((v) => v.href === pathname);

  return (
    <header className="sticky top-0 z-50 w-full px-3 sm:px-6 py-3.5 pointer-events-none">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-2 sm:gap-4 pointer-events-auto">
        {/* Left: Brand Pill & Volume Tag */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-xl border border-[rgba(244,238,230,0.14)] hover:border-[#c87046]/50 transition shadow-lg group"
            style={{
              background: "linear-gradient(180deg, rgba(23, 26, 36, 0.78) 0%, rgba(14, 16, 23, 0.9) 100%)",
            }}
            title="Return to 3D Bookshelf"
          >
            <span className="w-5 h-5 rounded-full bg-[#c87046]/20 text-[#c87046] flex items-center justify-center text-xs group-hover:scale-110 transition-transform font-bold">
              ❄
            </span>
            <span className="font-editorial text-sm font-medium tracking-wide text-[#f4eee6]">
              Thaw
            </span>
          </Link>

          {activeVolume && (
            <div className="hidden 2xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md bg-[#10131b]/60 border border-[rgba(244,238,230,0.08)] text-xs font-mono text-[#b9b4ae]">
              <span className="text-[#c87046] uppercase font-semibold">
                Vol {activeVolume.roman}
              </span>
              <span className="text-[rgba(244,238,230,0.25)]">·</span>
              <span className="text-[#f4eee6] font-medium">{activeVolume.label}</span>
            </div>
          )}
        </div>

        {/* Center: Premium Floating Liquid Glass Navbar */}
        <nav className="hidden lg:flex items-center justify-center min-w-0">
          <LiquidGlassNavbar items={LIBRARY_VOLUMES.slice(0, 7)} />
        </nav>

        {/* Right: 3D Shelf Action & Live Spoon Indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/"
            className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#c87046]/35 text-[#c87046] text-xs font-mono uppercase tracking-wider backdrop-blur-md bg-[#171a24]/60 hover:bg-[#c87046]/15 hover:border-[#c87046] transition shadow-md whitespace-nowrap"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>3D Shelf</span>
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-xl border border-[rgba(244,238,230,0.14)] text-xs text-[#b9b4ae] hover:border-[rgba(244,238,230,0.3)] transition shadow-lg whitespace-nowrap"
            style={{
              background: "linear-gradient(180deg, rgba(23, 26, 36, 0.78) 0%, rgba(14, 16, 23, 0.9) 100%)",
            }}
            title="Current Energy Capacity"
          >
            <span className="w-2 h-2 rounded-full bg-[#c87046] animate-pulse" />
            <span className="font-mono text-[#f4eee6] font-semibold">
              {energyLevel} / 5
            </span>
            <span className="hidden sm:inline text-[10px] uppercase tracking-wider text-[#b9b4ae]">
              Spoons
            </span>
          </Link>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-full bg-[#171a24]/80 backdrop-blur-md border border-[rgba(244,238,230,0.14)] text-[#f4eee6] lg:hidden hover:border-[#c87046] transition"
            aria-label="Toggle Navigation"
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Fluid Liquid Capsule) */}
      {menuOpen && (
        <div
          className="lg:hidden mt-3 p-3 rounded-2xl border border-[rgba(244,238,230,0.15)] shadow-2xl grid grid-cols-2 gap-2 pointer-events-auto backdrop-blur-2xl"
          style={{
            background: "linear-gradient(180deg, rgba(23, 26, 36, 0.95) 0%, rgba(14, 16, 23, 0.98) 100%)",
          }}
        >
          {LIBRARY_VOLUMES.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition select-none ${
                  isActive
                    ? "bg-[#c87046] text-white font-semibold shadow-md shadow-[#c87046]/40"
                    : "bg-white/[0.03] text-[#b9b4ae] hover:text-[#f4eee6] hover:bg-white/[0.08]"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}

export function LibraryShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  if (isHomepage) {
    return <main className="w-full min-h-screen bg-[#080808]">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-[#080808] text-[#f4eee6] flex flex-col selection:bg-[#c87046]/30 selection:text-white">
      <LibraryHeader />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-6 animate-fade-in">
        {children}
      </main>
    </div>
  );
}
