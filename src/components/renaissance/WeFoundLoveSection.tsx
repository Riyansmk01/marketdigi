"use client";

import React from "react";
import MotionReveal from "@/components/ui/MotionReveal";
import { Heart } from "lucide-react";

export default function WeFoundLoveSection() {
  return (
    <section className="py-24 px-4 md:px-8 bg-gradient-to-b from-[#5C1626] via-[#4A0E17] to-[#5C1626] text-stone-100 relative overflow-hidden">
      {/* Soft ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl mx-auto flex flex-col items-center text-center relative z-10">
        {/* Prewedding Photo Frame with Cascading Corner Flowers (Exact Replica of Image 4) */}
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

          {/* Cascading Floral Bouquet on Top Right Corner (Exact Replica of Image 4) */}
          <div className="absolute -top-6 -right-6 sm:-top-8 sm:-right-8 w-36 h-36 sm:w-48 sm:h-48 pointer-events-none select-none z-20">
            <svg viewBox="0 0 160 160" className="w-full h-full filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]" fill="none">
              {/* Botanical leaves */}
              <path d="M70 20 Q110 30, 130 70 Q95 65, 80 40 Z" fill="#15803D" opacity="0.85" />
              <path d="M40 35 Q80 20, 110 50 Q85 55, 60 45 Z" fill="#22C55E" opacity="0.75" />
              {/* Deep Crimson & Pink Petals */}
              <circle cx="115" cy="45" r="28" fill="#881337" />
              <circle cx="115" cy="45" r="20" fill="#BE185D" />
              <circle cx="115" cy="45" r="10" fill="#E11D48" />
              <circle cx="115" cy="45" r="4" fill="#FDE047" />

              <circle cx="75" cy="40" r="22" fill="#FB7185" />
              <circle cx="75" cy="40" r="14" fill="#F43F5E" />
              <circle cx="75" cy="40" r="6" fill="#FDE047" />

              <circle cx="130" cy="85" r="20" fill="#FDA4AF" />
              <circle cx="130" cy="85" r="12" fill="#FB7185" />
              <circle cx="130" cy="85" r="5" fill="#881337" />

              <circle cx="95" cy="75" r="18" fill="#E11D48" />
              <circle cx="95" cy="75" r="10" fill="#9F1239" />
              <circle cx="95" cy="75" r="3" fill="#FDE047" />
            </svg>
          </div>
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
