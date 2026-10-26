"use client";

import dynamic from "next/dynamic";
import React from "react";

const WeddingRingsScene = dynamic(() => import("./WeddingRingsScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-2 border-amber-300/30 animate-ping" />
        <div className="absolute inset-2 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
      </div>
      <p className="mt-4 text-xs tracking-widest uppercase text-amber-600/70 font-serif">
        Memuat Visual 3D...
      </p>
    </div>
  ),
});

export default function WeddingRingsWrapper() {
  return (
    <div className="w-full h-[320px] md:h-[420px] relative">
      <WeddingRingsScene />
    </div>
  );
}
