"use client";

import React from "react";
import MotionReveal from "@/components/ui/MotionReveal";
import { RealisticHeaderGarland } from "@/components/ui/RealisticFloralAccent";
import { FlyingDove } from "@/components/ui/DimensionalBotanicals";
import { Shirt, Clock3, HeartHandshake, Sparkles } from "lucide-react";

const colorPalette = [
  { name: "Blush Pink", color: "#FBCFE8", border: "#F472B6" },
  { name: "Dusty Rose", color: "#E11D48", border: "#BE185D" },
  { name: "Rose Gold", color: "#B76E79", border: "#9F5863" },
  { name: "Soft Ivory", color: "#FFF1F2", border: "#FECDD3" },
];

export default function DressCodeSection() {
  return (
    <section className="py-20 sm:py-24 px-4 sm:px-6 md:px-8 bg-[#FFF5F7] border-t border-b border-pink-200/80 relative overflow-hidden">
      {/* Background Floral Artwork Texture */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none"
        style={{ backgroundImage: "url('/images/bg-floral-frame.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFF5F7]/85 via-transparent to-[#FFF5F7]/90 pointer-events-none" />

      {/* Dimensional Flying Dove */}
      <div className="absolute top-8 right-8 w-16 sm:w-20 pointer-events-none z-10 opacity-70">
        <FlyingDove direction="left" />
      </div>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <MotionReveal direction="up">
          <div className="w-11 h-11 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center mx-auto mb-3 border border-pink-200 shadow-inner">
            <Shirt className="w-5 h-5" />
          </div>
          <p className="text-pink-800 uppercase tracking-[0.25em] text-xs font-semibold mb-1">
            Panduan Tamu
          </p>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif text-stone-900 mb-2">
            Dress Code &amp; Informasi
          </h3>
          <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto mb-8 leading-relaxed font-light">
            Untuk menyelaraskan suasana pernikahan bertema <strong>Pink Floral &amp; Romantic Blossom</strong>, tamu undangan disarankan mengenakan pakaian bernuansa <strong>Pastel Pink / Rose Gold / Batik Modern</strong>.
          </p>
          <RealisticHeaderGarland />
        </MotionReveal>

        {/* Color Palette Swatches */}
        <MotionReveal direction="zoom" delay={0.15}>
          <div className="flex items-center justify-center gap-3 sm:gap-6 mb-10 flex-wrap">
            {colorPalette.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg border-2 mb-2 transition-transform hover:scale-110 cursor-pointer"
                  style={{ backgroundColor: item.color, borderColor: item.border }}
                />
                <span className="text-[11px] sm:text-xs font-medium text-stone-700">{item.name}</span>
              </div>
            ))}
          </div>
        </MotionReveal>

        {/* Etiquette Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-xl mx-auto">
          <MotionReveal direction="right" delay={0.2}>
            <div className="flex items-start gap-3 p-4 sm:p-5 rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-pink-200/90 shadow-md">
              <Clock3 className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs sm:text-sm font-bold text-stone-900 font-serif">Hadir Tepat Waktu</h5>
                <p className="text-[11px] sm:text-xs text-stone-600 leading-relaxed mt-0.5">
                  Harap hadir 15 menit sebelum rangkaian acara dimulai demi kenyamanan dan kekhidmatan bersama.
                </p>
              </div>
            </div>
          </MotionReveal>

          <MotionReveal direction="left" delay={0.25}>
            <div className="flex items-start gap-3 p-4 sm:p-5 rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-pink-200/90 shadow-md">
              <HeartHandshake className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs sm:text-sm font-bold text-stone-900 font-serif">Doa &amp; Restu</h5>
                <p className="text-[11px] sm:text-xs text-stone-600 leading-relaxed mt-0.5">
                  Kehadiran dan doa restu Anda adalah anugerah terbesar bagi awal perjalanan rumah tangga kami.
                </p>
              </div>
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}