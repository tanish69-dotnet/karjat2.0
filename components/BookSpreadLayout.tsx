"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { PageContent } from "@/lib/bookEditorialContent";

export function GeometricMotif({ motif, color = "#c87046" }: { motif?: string; color?: string }) {
  return (
    <div className="w-full flex items-center justify-center py-4 my-2 opacity-80">
      <svg width="140" height="48" viewBox="0 0 140 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="70" cy="24" r="16" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        <circle cx="70" cy="24" r="8" stroke={color} strokeWidth="1.2" />
        <circle cx="70" cy="24" r="2" fill={color} />
        <line x1="20" y1="24" x2="54" y2="24" stroke={color} strokeWidth="0.75" opacity="0.4" />
        <line x1="86" y1="24" x2="120" y2="24" stroke={color} strokeWidth="0.75" opacity="0.4" />
        <circle cx="20" cy="24" r="2" stroke={color} strokeWidth="0.75" />
        <circle cx="120" cy="24" r="2" stroke={color} strokeWidth="0.75" />
      </svg>
    </div>
  );
}

export function OpenBookPageLayout({
  volumeRoman,
  discipline,
  pageNumber,
  isLeft = true,
  children,
}: {
  volumeRoman: string;
  discipline: string;
  pageNumber: number;
  isLeft?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex flex-col justify-between h-full p-6 sm:p-8 md:p-10 select-text overflow-y-auto ${
        isLeft ? "md:pr-10" : "md:pl-10"
      }`}
      style={{
        background: "#f7f2ea",
        color: "#2a221b",
      }}
    >
      {/* Editorial Running Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#2a221b]/15 text-[10px] tracking-[0.2em] uppercase font-mono text-[#5c4a3d] shrink-0">
        {isLeft ? (
          <>
            <span className="font-semibold text-[#8b4513]">
              THAW · VOL {volumeRoman}
            </span>
            <span className="opacity-60 hidden sm:inline">{discipline}</span>
            <span className="font-serif italic font-normal text-xs text-[#2a221b]/80">
              {String(pageNumber).padStart(2, "0")}
            </span>
          </>
        ) : (
          <>
            <span className="font-serif italic font-normal text-xs text-[#2a221b]/80">
              {String(pageNumber).padStart(2, "0")}
            </span>
            <span className="opacity-60 hidden sm:inline">{discipline}</span>
            <span className="font-semibold text-[#8b4513]">
              THAW · VOL {volumeRoman}
            </span>
          </>
        )}
      </div>

      {/* Main Page Editorial Flow */}
      <div className="flex-1 flex flex-col justify-between py-1">{children}</div>

      {/* Editorial Footer / Colophon Rule */}
      <div className="pt-3 mt-4 border-t border-[#2a221b]/10 flex items-center justify-between text-[9px] font-mono tracking-widest text-[#7a6555] shrink-0">
        <span>{isLeft ? "· FOLIO VERSO ·" : "· FOLIO RECTO ·"}</span>
        <span className="font-serif italic text-[#8b4513]/70">
          Working Volumes Archive
        </span>
      </div>
    </div>
  );
}

export function EditorialPageArticle({
  content,
  accentColor = "#c87046",
}: {
  content: PageContent;
  accentColor?: string;
}) {
  return (
    <div className="space-y-4">
      {/* Chapter Label */}
      <div className="space-y-1">
        <div className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#8b4513] font-semibold">
          CHAPTER {content.chapterNumber}
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#1e1713] leading-tight tracking-tight">
          {content.chapterTitle}
        </h2>
        {content.subtitle && (
          <div className="text-xs sm:text-sm font-serif italic text-[#5c4a3d]">
            {content.subtitle}
          </div>
        )}
      </div>

      {/* Geometric divider */}
      <div className="w-12 h-[1px] bg-[#8b4513]/40 my-2" />

      {/* Body paragraphs */}
      <div className="space-y-2.5 text-xs sm:text-sm leading-relaxed text-[#2a221b]/90 font-serif">
        {content.bodyParagraphs.map((para, i) => (
          <p key={i} className="text-justify indent-4">
            {para}
          </p>
        ))}
      </div>

      {/* Fine-line editorial callout */}
      {content.callout && (
        <div className="p-3 my-2 rounded border border-[#8b4513]/25 bg-[#eee5d8]/60 text-[11px] sm:text-xs">
          <div className="font-mono text-[9px] uppercase tracking-widest text-[#8b4513] font-bold mb-0.5">
            {content.callout.label}
          </div>
          <div className="font-serif italic text-[#2a221b]">
            {content.callout.text}
          </div>
        </div>
      )}

      {/* Motif illustration */}
      <GeometricMotif color={accentColor} />

      {/* Key takeaway */}
      {content.keyTakeaway && (
        <div className="pt-2 border-t border-[#2a221b]/10 text-[11px] font-mono tracking-wide text-[#5c4a3d] italic">
          ✦ {content.keyTakeaway}
        </div>
      )}
    </div>
  );
}

