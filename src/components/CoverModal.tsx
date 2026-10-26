"use client";

import React, { useEffect, useState } from "react";
import { MailOpen, Heart, Sparkles } from "lucide-react";

interface CoverModalProps {
  onOpen: () => void;
  isOpen: boolean;
}

export default function CoverModal({ onOpen, isOpen }: CoverModalProps) {
  const [guestName, setGuestName] = useState<string>("Tamu Undangan");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const to = params.get("to");
      if (to) {
        setGuestName(decodeURIComponent(to));
      }
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#2A2421] via-[#1E1917] to-[#120F0E] text-stone-100 p-4 transition-all duration-1000">
      {/* Decorative luxury backdrop glow */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Container */}
      <div className="relative max-w-md w-full bg-stone-900/60 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-8 md:p-10 text-center shadow-2xl shadow-black/60 flex flex-col items-center">
        {/* Floating Ring / Heart Emblem */}
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-400/40 flex items-center justify-center mb-6 text-amber-300 shadow-inner">
          <Heart className="w-8 h-8 fill-amber-300/30 text-amber-300 animate-pulse" />
        </div>

        <p className="text-xs uppercase tracking-[0.3em] text-amber-200/80 font-medium mb-3">
          The Wedding Celebration
        </p>

        <h1 className="text-4xl md:text-5xl font-serif text-amber-100 font-normal tracking-wide mb-2">
          Riyan &amp; Intan
        </h1>

        <p className="text-sm font-light text-stone-300 tracking-widest uppercase mb-8">
          Sabtu, 12 Desember 2026
        </p>

        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent mb-8" />

        <div className="mb-8">
          <p className="text-xs text-stone-400 uppercase tracking-widest mb-2">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </p>
          <div className="inline-block px-5 py-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-lg md:text-xl font-serif font-medium text-amber-200">
            {guestName}
          </div>
          <p className="text-xs text-stone-400 mt-3 max-w-xs mx-auto italic">
            Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir pada hari istimewa kami.
          </p>
        </div>

        <button
          onClick={onOpen}
          className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-medium shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <MailOpen className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          <span>Buka Undangan</span>
          <Sparkles className="w-4 h-4 text-stone-900 opacity-60" />
        </button>
      </div>
    </div>
  );
}
