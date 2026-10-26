"use client";

import dynamic from "next/dynamic";
import React from "react";

const PinkFloralScene = dynamic(() => import("./PinkFloralScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-2 border-pink-300/40 animate-ping" />
        <div className="absolute inset-2 rounded-full border-2 border-pink-500 border-t-transparent animate-spin" />
      </div>
      <p className="mt-4 text-xs tracking-widest uppercase text-pink-700/80 font-serif">
        Memuat Bunga 3D...
      </p>
    </div>
  ),
});

export default function WeddingRingsWrapper() {
  return (
    <div className="w-full h-[360px] md:h-[460px] relative">
      <PinkFloralScene />
    </div>
  );
}
