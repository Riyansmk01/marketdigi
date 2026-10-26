"use client";

import React from "react";
import MotionReveal from "@/components/ui/MotionReveal";
import { RealisticCornerBouquet } from "@/components/ui/RealisticFloralAccent";
import { Heart } from "lucide-react";

export default function WeFoundLoveSection() {
  return (
    <section className="py-24 px-4 md:px-8 bg-gradient-to-b from-[#5C1626] via-[#4A0E17] to-[#5C1626] text-stone-100 relative overflow-hidden">
      {/* Soft ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Realistic Corner Florals */}
      <RealisticCornerBouquet position="top-left" scale={0.8} className="opacity-75" />
      <RealisticCornerBouquet position="bottom-right" scale={0.8} className="opacity-75" />

      <div className="max-w-xl mx-auto flex flex-col items-center text-center relative z-10">
        {/* Prewedding Photo Frame with Cascading Realistic Corner Flowers (Exact Replica of Image 4) */}
        <MotionReveal direction="zoom" duration={0.9} className="relative mb-10 w-full max-w-sm sm:max-w-md">
          {/* Main Photo Card */}
          <div className="relative rounded-[32px] overflow-hidden border-2 border-amber-300/30 shadow-2xl shadow-black/60 bg-stone-900 aspect-[3/4] flex items-center justify-center">
            <div
              className="w-full h-full bg-cover bg-center filter brightness-95 contrast-[1.02] transition-transform duration-700 hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=80')",
              }}
            />
            {/* Subtle vintage vignette shading */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-stone-950/20 pointer-events-none" />
          </div>

          {/* Cascading Realistic Floral Bouquet on Top Right Corner (Exact Replica of Image 4) */}
          <RealisticCornerBouquet position="top-right" scale={1.1} />
        </MotionReveal>

        {/* Section Headline (Exact Replica of Image 4) */}
        <MotionReveal direction="up" delay={0.2}>
          <h2 className="text-3xl sm:text-4xl font-serif text-amber-100 tracking-[0.25em] uppercase font-normal mb-5 drop-shadow-md">
            WE FOUND LOVE
          </h2>
        </MotionReveal>

        {/* Indonesian Wedding Quote (Exact Replica of Image 4) */}
        <MotionReveal direction="up" delay={0.3}>
          <p className="font-serif italic text-pink-100/90 text-sm sm:text-base md:text-lg max-w-md mx-auto leading-relaxed px-4">
            &ldquo;Sesungguhnya tidak ada laki laki dan perempuan yang sempurna, tetapi kesempurnaan diciptakan apabila keduanya saling menutupi kekurangan.&rdquo;
          </p>
        </MotionReveal>
      </div>
    </section>
  );
}
