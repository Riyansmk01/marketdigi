"use client";

import React from "react";
import MotionReveal from "@/components/ui/MotionReveal";
import WeddingRingsWrapper from "@/components/canvas/WeddingRingsWrapper";
import CountdownTimer from "@/components/CountdownTimer";
import WhitePeacock from "./WhitePeacock";
import { motion } from "framer-motion";
import { Move3d } from "lucide-react";

export default function RenaissanceHero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-16 overflow-hidden bg-[#FCE7EB]"
    >
      {/* 1. Authentic Vintage Toile de Jouy & Renaissance Landscape Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-[0.98] contrast-[1.02]"
        style={{ backgroundImage: "url('/images/vintage-toile-bg.jpg')" }}
      />
      {/* Soft romantic pink mist overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FCE7EB]/30 via-transparent to-[#FCE7EB]/50 pointer-events-none" />

      {/* 2. Left White Peacock Perched on Arch (Exact Replica of Image 2 & 3) */}
      <div className="absolute left-1 sm:left-4 md:left-12 bottom-6 sm:bottom-12 w-28 sm:w-36 md:w-48 z-20 pointer-events-none">
        <WhitePeacock direction="right" />
      </div>

      {/* 3. Right White Peacock Perched on Arch (Exact Replica of Image 2 & 3) */}
      <div className="absolute right-1 sm:right-4 md:right-12 bottom-6 sm:bottom-12 w-28 sm:w-36 md:w-48 z-20 pointer-events-none">
        <WhitePeacock direction="left" />
      </div>

      {/* 4. Center Vignette Arch Card (Exact Replica of Image 3) */}
      <div className="relative z-20 max-w-md w-full mx-auto flex flex-col items-center">
        <MotionReveal direction="zoom" duration={0.9}>
          <div className="relative w-full rounded-[40px] bg-gradient-to-b from-[#701A28]/85 via-[#5C1626]/85 to-[#4A0E17]/90 backdrop-blur-md p-8 sm:p-10 shadow-2xl shadow-stone-950/60 border border-amber-300/30 text-center flex flex-col items-center overflow-hidden">
            {/* Subtle Inner Gold Foil Border */}
            <div className="absolute inset-2.5 rounded-[32px] border border-amber-200/20 pointer-events-none" />

            {/* Interlocking Monogram (Exact Replica of 'MU' in Image 3 -> 'RI') */}
            <div className="relative mb-6 select-none flex items-center justify-center">
              <span className="font-serif text-6xl sm:text-7xl font-light text-transparent bg-clip-text bg-gradient-to-b from-[#FDE047] via-[#E6CA65] to-[#B45309] tracking-tighter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                R
              </span>
              <span className="font-serif text-6xl sm:text-7xl font-light text-transparent bg-clip-text bg-gradient-to-b from-[#FDE047] via-[#E6CA65] to-[#B45309] -ml-4 tracking-tighter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                I
              </span>
            </div>

            {/* Section Tag */}
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.35em] text-pink-200/90 font-medium mb-3">
              THE WEDDING OF
            </p>

            {/* Couple Names */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-amber-100 font-normal tracking-wide mb-2">
              RIYAN &amp; INTAN
            </h1>

            {/* Wedding Date */}
            <p className="text-sm font-light text-pink-200/80 tracking-[0.3em] uppercase mb-6">
              12 . 12 . 2026
            </p>

            {/* 3D Wedding Floral & Rings in Hero */}
            <div className="w-full relative flex flex-col items-center mb-4">
              <WeddingRingsWrapper />
              <div className="flex items-center gap-1.5 text-[10px] text-amber-200/90 bg-black/40 backdrop-blur-sm border border-amber-400/25 px-3 py-0.5 rounded-full shadow-sm">
                <Move3d className="w-3 h-3 text-amber-300" />
                <span>Geser bunga &amp; cincin 3D</span>
              </div>
            </div>

            {/* Countdown Timer in Hero */}
            <div className="w-full mb-6">
              <CountdownTimer targetDate="2026-12-12T09:00:00" />
            </div>

            {/* Signature Scroll Capsule Indicator (Exact Replica of Image 3 '( | )') */}
            <div className="flex flex-col items-center">
              <div className="w-6 h-11 rounded-full border-2 border-amber-200/60 flex items-start justify-center p-1.5 shadow-md">
                <motion.div
                  animate={{ y: [0, 16, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1.5 h-3 bg-amber-300 rounded-full"
                />
              </div>
              <span className="text-[9px] uppercase tracking-widest text-pink-200/70 mt-2 font-light">
                Gulir ke Bawah
              </span>
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
