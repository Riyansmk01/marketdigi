"use client";

import dynamic from "next/dynamic";
import React from "react";

const SingleRoseScene = dynamic(() => import("./SingleRoseScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-pink-400 border-t-transparent animate-spin" />
      <span className="text-[11px] text-pink-700/80 font-serif mt-3 tracking-wider">
        Memuat Mawar 3D...
      </span>
    </div>
  ),
});

export default function InteractiveRoseFlower() {
  return (
    <div className="w-full h-64 md:h-72 relative my-4">
      <SingleRoseScene />
    </div>
  );
}
