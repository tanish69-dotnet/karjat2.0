"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { BookConfig, BOOK_CONFIGS, findBookByRoute } from "@/lib/books";
import { OpenBookSpreadView } from "@/components/OpenBookSpreadView";
import { BookOpen } from "lucide-react";

interface BookPortalProps {
  children: ReactNode; // The 3D shelf content (iframe wrapper)
}

interface OpenBookMessage {
  type: "thaw:open-book";
  bookId: string;
  route: string;
  title: string;
  roman: string;
  discipline: string;
  color: string;
  foil: string;
  deck: string;
}

export function BookPortal({ children }: BookPortalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();

  const [activeBook, setActiveBook] = useState<BookConfig | null>(null);
  const [phase, setPhase] = useState<"idle" | "opening" | "open" | "closing">("idle");
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detect if we landed directly on a feature route (e.g. /sequencer via URL)
  useEffect(() => {
    if (pathname === "/") return;
    const book = findBookByRoute(pathname);
    if (book && phase === "idle") {
      setActiveBook(book);
      setPhase("open");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for postMessage from the shelf iframe
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const data = event.data as OpenBookMessage;
      if (!data || data.type !== "thaw:open-book") return;

      const book = BOOK_CONFIGS.find((b) => b.id === data.bookId);
      if (!book) return;

      const enriched: BookConfig = {
        ...book,
        deck: data.deck || book.deck,
        discipline: data.discipline || book.discipline,
      };

      setActiveBook(enriched);
      setPhase("opening");

      const delay = prefersReduced ? 50 : 700;
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      closeTimerRef.current = setTimeout(() => {
        setPhase("open");
      }, delay);
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [prefersReduced]);

  const handleClose = useCallback(() => {
    setPhase("closing");
    const delay = prefersReduced ? 50 : 350;
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setPhase("idle");
      setActiveBook(null);
      if (pathname !== "/") {
        router.push("/", { scroll: false });
      }
    }, delay);
  }, [prefersReduced, router, pathname]);

  // Keyboard: Escape closes
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && phase !== "idle") handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, handleClose]);

  const isVisible = phase !== "idle";

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 3D Shelf (rendered beneath the portal) */}
      <div
        className="absolute inset-0"
        style={{
          filter: isVisible ? "brightness(0.2) blur(4px)" : "none",
          transition: "filter 500ms ease",
          pointerEvents: isVisible ? "none" : "auto",
        }}
      >
        {children}
      </div>

      {/* Book portal overlay */}
      <AnimatePresence>
        {isVisible && activeBook && (
          <motion.div
            key="portal-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 overflow-y-auto"
            style={{
              perspective: "1400px",
              background: "rgba(8, 8, 8, 0.88)",
              backdropFilter: "blur(8px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Opening 3D Flip Cover Animation */}
            {phase === "opening" && !prefersReduced && (
              <motion.div
                className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
                style={{ perspective: "1000px" }}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-[420px] h-[580px] rounded-2xl flex flex-col items-center justify-center p-8 text-center shadow-2xl border border-white/20"
                  style={{
                    background: activeBook.color,
                    transformOrigin: "left center",
                  }}
                  initial={{ rotateY: 0, scale: 0.95 }}
                  animate={{ rotateY: -110, scale: 1 }}
                  transition={{ duration: 0.65, ease: [0.2, 0.72, 0.24, 1] }}
                >
                  <span className="text-xs font-mono uppercase tracking-widest text-[#c87046] mb-3">
                    Vol. {activeBook.roman}
                  </span>
                  <h1 className="text-3xl font-serif text-[#f4eee6] mb-2">
                    {activeBook.title}
                  </h1>
                  <p className="text-xs text-[#b9b4ae] font-serif italic">
                    {activeBook.discipline}
                  </p>
                </motion.div>
              </motion.div>
            )}

            {/* The Actual Two-Page Open Book with Real Spreads */}
            <motion.div
              className="w-full max-w-6xl z-10"
              initial={
                prefersReduced
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.92, y: 30 }
              }
              animate={
                phase === "open"
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: 0.6, scale: 0.94, y: 20 }
              }
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{
                type: "spring",
                stiffness: 240,
                damping: 26,
              }}
            >
              <OpenBookSpreadView book={activeBook} onClose={handleClose} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
