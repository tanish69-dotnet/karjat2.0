"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

export interface LiquidNavItem {
  href: string;
  label: string;
  roman?: string;
  icon: LucideIcon;
  badge?: string;
}

interface LiquidGlassNavbarProps {
  items: LiquidNavItem[];
  className?: string;
}

export function LiquidGlassNavbar({ items, className = "" }: LiquidGlassNavbarProps) {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const activeIndex = items.findIndex((item) => item.href === pathname);

  useEffect(() => {
    if (!navRef.current) return;
    const nav = navRef.current;
    const links = nav.querySelectorAll<HTMLAnchorElement>("a[data-nav-item]");

    if (activeIndex >= 0 && links[activeIndex]) {
      const activeEl = links[activeIndex];
      const navRect = nav.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();

      setIndicatorStyle({
        left: elRect.left - navRect.left,
        width: elRect.width,
        opacity: 1,
      });
    } else {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [pathname, activeIndex, items]);

  return (
    <div
      ref={navRef}
      className={`relative inline-flex items-center gap-0.5 p-1 rounded-full whitespace-nowrap ${className}`}
      style={{
        background: "linear-gradient(180deg, rgba(23, 26, 36, 0.78) 0%, rgba(14, 16, 23, 0.9) 100%)",
        backdropFilter: "blur(24px) saturate(190%)",
        WebkitBackdropFilter: "blur(24px) saturate(190%)",
        border: "1px solid rgba(244, 238, 230, 0.14)",
        boxShadow:
          "0 14px 40px -4px rgba(0, 0, 0, 0.7), 0 4px 12px rgba(0, 0, 0, 0.45), inset 0 1px 0 0 rgba(244, 238, 230, 0.16)",
      }}
    >
      {/* Liquid Glass Gliding Highlight Indicator */}
      <div
        className="absolute top-1 bottom-1 left-0 rounded-full pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.25,1)]"
        style={{
          transform: `translate3d(${indicatorStyle.left}px, 0, 0)`,
          width: `${indicatorStyle.width}px`,
          opacity: indicatorStyle.opacity,
          willChange: "transform, width, opacity",
          background:
            "linear-gradient(180deg, rgba(200, 112, 70, 0.95) 0%, rgba(165, 80, 42, 0.95) 100%)",
          boxShadow:
            "0 4px 18px rgba(200, 112, 70, 0.45), 0 1px 3px rgba(0,0,0,0.5), inset 0 1px 1px 0 rgba(255, 255, 255, 0.45), inset 0 -1px 2px 0 rgba(0, 0, 0, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.22)",
        }}
      >
        {/* Liquid reflection sheen */}
        <div
          className="absolute inset-x-2 top-0.5 h-[38%] rounded-full opacity-60 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0) 100%)",
          }}
        />
      </div>

      {/* Nav items */}
      {items.map((item, idx) => {
        const isActive = activeIndex === idx;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            data-nav-item
            className={`relative z-10 flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium tracking-normal transition-all duration-200 select-none ${
              isActive
                ? "text-[#fffaf3] font-semibold"
                : "text-[#b9b4ae] hover:text-[#f4eee6] hover:bg-white/[0.04]"
            }`}
          >
            <Icon
              className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
                isActive ? "text-white scale-110" : "text-[#c87046]/80"
              }`}
            />
            <span className="whitespace-nowrap">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
