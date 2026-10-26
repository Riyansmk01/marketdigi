"use client";

import React from "react";
import MotionReveal from "@/components/ui/MotionReveal";
import { Sparkles, Camera, Share2 } from "lucide-react";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function InstagramFilterSection() {
  const filterUrl = "https://instagram.com/ar/preview";

  return (
    <section className="py-20 px-4 md:px-8 bg-[#FAF7F2] relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        <MotionReveal direction="up">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-200 via-rose-200 to-amber-100 text-stone-800 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Camera className="w-6 h-6 text-amber-900" />
          </div>
          <p className="text-amber-700 uppercase tracking-[0.3em] text-xs font-semibold mb-2">
            Instagram Effect
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-stone-900 mb-3">
            Wedding Filter Instagram
          </h2>
          <p className="text-stone-600 text-sm max-w-md mx-auto mb-10 leading-relaxed">
            Abadikan dan bagikan momen kebahagiaan Anda bersama kami di Instagram menggunakan filter AR khusus pernikahan <strong>Riyan &amp; Intan</strong>.
          </p>
        </MotionReveal>

        {/* Card Mockup */}
        <MotionReveal direction="zoom" delay={0.15}>
          <div className="relative max-w-sm mx-auto bg-gradient-to-b from-stone-900 to-stone-950 rounded-3xl p-6 md:p-8 text-stone-100 shadow-2xl border border-amber-500/30 flex flex-col items-center">
            {/* Phone Screen Mockup */}
            <div className="relative w-48 h-64 rounded-2xl overflow-hidden border-2 border-amber-300/40 shadow-inner mb-6 flex flex-col justify-between p-3">
              <div
                className="absolute inset-0 bg-cover bg-center filter brightness-95"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

              {/* AR Overlay badge */}
              <div className="relative z-10 flex items-center justify-between text-[10px] text-amber-200 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-400/30">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Riyan &amp; Intan Tone
                </span>
                <span>✨ 60fps</span>
              </div>

              {/* Bottom Hashtags on screen */}
              <div className="relative z-10 text-left">
                <p className="text-xs font-serif text-amber-200">#RiyanIntanStory</p>
                <p className="text-[10px] text-stone-300">#KitaUsahakanRumahItu</p>
              </div>
            </div>

            {/* Official Hashtags Pill */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6 text-xs">
              <span className="px-3 py-1 rounded-full bg-stone-800 text-amber-300 border border-stone-700">
                #RiyanIntanWedding
              </span>
              <span className="px-3 py-1 rounded-full bg-stone-800 text-amber-300 border border-stone-700">
                #KitaUsahakanRumahItu
              </span>
            </div>

            <p className="text-xs text-stone-400 text-center mb-6 leading-relaxed">
              Tag akun kami <strong className="text-amber-200 font-medium">@riyanperdhana</strong> &amp;{" "}
              <strong className="text-amber-200 font-medium">@intannuraini</strong> agar kami dapat me-repost momen bahagia Anda!
            </p>

            <a
              href={filterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>Buka Filter di Instagram</span>
            </a>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
