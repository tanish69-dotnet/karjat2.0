'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Compass, 
  LayoutDashboard, 
  CheckSquare, 
  Sparkles, 
  Timer, 
  Coffee, 
  Calendar, 
  Activity as ActivityIcon, 
  Settings,
  Shield,
  BarChart3
} from 'lucide-react';
import { useThaw } from '@/lib/store';

export function Navbar() {
  const pathname = usePathname();
  const { energyLevel } = useThaw();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/tasks', label: 'My Tasks', icon: CheckSquare },
    { href: '/sequencer', label: 'AI Sequencer', icon: Sparkles },
    { href: '/timer', label: 'Focus Timer', icon: Timer },
    { href: '/rest', label: 'Rest Mode', icon: Coffee },
    { href: '/planner', label: 'Planner', icon: Calendar },
    { href: '/activity', label: 'Activity', icon: ActivityIcon },
    { href: '/insights', label: 'Insights', icon: BarChart3 },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  if (pathname === '/') {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-thaw-900/40 border-b border-thaw-700/30 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white font-serif text-2xl tracking-wide">
          <span className="w-8 h-8 rounded-full bg-sage-500/30 flex items-center justify-center text-sage-200">❄</span>
          Thaw
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="px-5 py-2 rounded-full bg-sage-500 text-thaw-950 font-medium hover:bg-sage-400 transition shadow-lg shadow-sage-900/20">
            Open App
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-thaw-950/80 border-b border-thaw-800/50 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-white font-serif text-xl tracking-wide">
          <span className="w-7 h-7 rounded-full bg-sage-500/30 flex items-center justify-center text-sage-200 text-sm">❄</span>
          Thaw
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition ${
                  isActive 
                    ? 'bg-thaw-800 text-sage-200 font-medium border border-thaw-700/50' 
                    : 'text-thaw-300 hover:text-white hover:bg-thaw-900/50'
                }`}
              >
                <Icon className="w-4 h-4 text-sage-400" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Spoon Energy indicator */}
        <Link href="/dashboard" className="flex items-center gap-2 bg-thaw-900/80 border border-thaw-700/40 px-3 py-1.5 rounded-full text-xs text-sage-200 hover:border-sage-500/50 transition" title="Current Energy Level">
          <span className="text-amber-300">🥄</span>
          <span className="font-semibold">{energyLevel}/5 Spoons</span>
        </Link>
      </div>
    </header>
  );
}
