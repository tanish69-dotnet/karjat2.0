'use client';

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useThaw } from '@/lib/store';
import {
  LayoutDashboard,
  CheckSquare,
  Sparkles,
  Timer,
  Coffee,
  Calendar,
  Activity as ActivityIcon,
  Settings,
  Shield,
  BarChart3,
  Menu,
  X,
  ChevronLeft,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tasks', label: 'My Tasks', icon: CheckSquare },
  { href: '/sequencer', label: 'AI Sequencer', icon: Sparkles },
  { href: '/timer', label: 'Focus Timer', icon: Timer },
  { href: '/rest', label: 'Rest Mode', icon: Coffee },
  { href: '/planner', label: 'Weekly Planner', icon: Calendar },
  { href: '/shelf', label: '3D Volumes', icon: Sparkles },
  { href: '/activity', label: 'Activity', icon: ActivityIcon },
  { href: '/insights', label: 'Insights', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  const pathname = usePathname();
  const { energyLevel } = useThaw();

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-thaw-950/90 backdrop-blur-md border-r border-thaw-800/50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Main navigation"
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center justify-between px-6 border-b border-thaw-800/50">
            <Link href="/dashboard" className="flex items-center gap-2 text-white font-serif text-xl tracking-wide">
              <span className="w-6 h-6 rounded-full bg-sage-500/30 flex items-center justify-center text-sage-200 text-xs">
                â„
              </span>
              Thaw
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg text-thaw-300 hover:text-white hover:bg-thaw-800"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition ${
                    isActive
                      ? 'bg-sage-500/15 border border-sage-500/30 text-sage-200 font-medium'
                      : 'text-thaw-300 hover:text-white hover:bg-thaw-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-sage-400 group-hover:text-sage-300 transition" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-thaw-800/50">
            <div className="flex items-center gap-3 px-2 py-3 rounded-xl bg-thaw-900/60 border border-thaw-800/40">
              <span className="text-amber-300">🥄</span>
              <div>
                <p className="text-xs text-sage-300 uppercase tracking-wider font-semibold">Energy</p>
                <p className="text-sm font-medium text-white">{energyLevel}/5 Spoons</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

export function Header({ onMenuToggle }: { onMenuToggle: () => void }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-thaw-950/80 border-b border-thaw-800/50 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg text-thaw-300 hover:text-white hover:bg-thaw-800 md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2 text-white font-serif text-xl tracking-wide md:ml-2">
          <span className="w-6 h-6 rounded-full bg-sage-500/30 flex items-center justify-center text-sage-200 text-xs">
            â„
          </span>
          Thaw
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
        <span className="text-xs text-sage-300 uppercase tracking-wider font-semibold">Live</span>
      </div>
    </header>
  );
}
