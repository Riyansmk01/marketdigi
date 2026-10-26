"use client";

import dynamic from "next/dynamic";
import React from "react";
import { Move3d, Sparkles } from "lucide-react";
import { FlyingDove } from "@/components/ui/DimensionalBotanicals";

const SingleRoseScene = dynamic(() => import("./SingleRoseScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center min-h-[300px]">
      <div className="w-12 h-12 rounded-full border-2 border-pink-400 border-t-transparent animate-spin" />
      <span className="text-xs text-pink-800 font-serif mt-3 tracking-wider">
        Memuat Mawar 3D Berdimensi...
      </span>
    </div>
  ),
});

export default function InteractiveRoseFlower() {
  return (
    <div className="relative w-full max-w-lg mx-auto my-6 flex flex-col items-center">
      {/* Classical Roman Stone Arch Colonnade with Climbing Roses Framing */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] max-h-[460px] rounded-[36px] overflow-hidden shadow-2xl shadow-pink-950/20 border-2 border-pink-300/70 bg-gradient-to-b from-pink-50 via-white to-pink-100 flex items-center justify-center">
        {/* Background Roman Rose Colonnade Artwork */}
        <div
          className="absolute inset-0 bg-contain bg-center bg-no-repeat pointer-events-none filter brightness-100 contrast-[1.02]"
          style={{ backgroundImage: "url('/images/arch-rose-colonnade.png')" }}
        />

        {/* Soft Ambient Radial Light in the Arch Aperture */}
        <div className="absolute inset-0 bg-radial from-white/70 via-pink-100/20 to-transparent pointer-events-none" />

        {/* Flying White Doves around the Arch */}
        <div className="absolute top-4 left-4 w-16 sm:w-20 pointer-events-none z-10 opacity-80">
          <FlyingDove direction="right" />
        </div>
        <div className="absolute top-4 right-4 w-16 sm:w-20 pointer-events-none z-10 opacity-80">
          <FlyingDove direction="left" delay={1.2} />
        </div>

        {/* Interactive 3D Blooming Rose Floating inside the Arch */}
        <div className="relative w-full h-full z-20 touch-pan-y">
          <SingleRoseScene />
        </div>

        {/* Floating Instruction Badge */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-pink-300 shadow-md text-[10px] sm:text-xs font-medium text-pink-900">
            <Move3d className="w-3.5 h-3.5 text-pink-600 animate-pulse" />
            <span>Sentuh &amp; Putar Mawar 3D</span>
            <Sparkles className="w-3 h-3 text-amber-500" />
          </div>
        </div>
      </div>
    </div>
  );
}