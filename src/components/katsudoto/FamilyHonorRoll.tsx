"use client";

import React from "react";
import MotionReveal from "@/components/ui/MotionReveal";
import { RealisticBotanicalImageCorner, RealisticHeaderGarland } from "@/components/ui/RealisticFloralAccent";
import { FlyingDove } from "@/components/ui/DimensionalBotanicals";
import { Users, Heart, Sparkles } from "lucide-react";

export default function FamilyHonorRoll() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 md:px-8 bg-[#FDF6F8] relative overflow-hidden">
      {/* 1. Indonesian Traditional Architecture Toile Tapestry Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 pointer-events-none filter contrast-105"
        style={{ backgroundImage: "url('/images/bg-traditional-toile.png')" }}
      />
      {/* Subtle vignette shading */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FDF6F8]/80 via-transparent to-[#FDF6F8]/90 pointer-events-none" />

      {/* Dimensional Flying Doves */}
      <div className="absolute top-10 right-10 w-20 sm:w-28 pointer-events-none z-10 opacity-70">
        <FlyingDove direction="left" />
      </div>

      {/* Realistic Botanical Corners */}
      <RealisticBotanicalImageCorner position="top-left" size="w-36 sm:w-52" className="opacity-80" />
      <RealisticBotanicalImageCorner position="bottom-right" size="w-36 sm:w-52" className="opacity-80" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <MotionReveal direction="up">
          <div className="w-12 h-12 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center mx-auto mb-3 shadow-inner border border-pink-200">
            <Users className="w-6 h-6" />
          </div>
          <p className="text-pink-800 uppercase tracking-[0.3em] text-xs font-semibold mb-2">
            Keluarga Besar
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-stone-900 mb-3">
            Turut Mengundang
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto mb-10 leading-relaxed font-light">
            Rasa hormat dan ungkapan terima kasih yang tulus dari segenap keluarga besar kedua mempelai.
          </p>
          <RealisticHeaderGarland />
        </MotionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-left">
          {/* Keluarga Mempelai Pria */}
          <MotionReveal direction="right" delay={0.1}>
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border-2 border-pink-200/90 shadow-xl shadow-pink-900/5 relative overflow-hidden transition-transform duration-300 hover:-translate-y-1">
              <RealisticBotanicalImageCorner position="top-right" size="w-24 sm:w-32" className="opacity-85" />
              <span className="inline-block px-3.5 py-1 rounded-full bg-pink-100 text-pink-900 text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-4 border border-pink-200">
                Keluarga Mempelai Pria
              </span>
              <h4 className="text-lg sm:text-xl font-serif font-bold text-stone-900 mb-4">
                Keluarga Bpk. Bambang Prasetyo &amp; Ibu Sri Wahyuni
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-pink-500 mt-1.5 shrink-0" />
                  <span>Keluarga Besar Alm. H. Soeharto &amp; Hj. Siti Aminah (Kakek &amp; Nenek)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-pink-500 mt-1.5 shrink-0" />
                  <span>Bpk. Ir. Joko Prasetyo &amp; Keluarga (Paman)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-pink-500 mt-1.5 shrink-0" />
                  <span>Ibu Endang Sulistyo &amp; Keluarga (Bibi)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-pink-500 mt-1.5 shrink-0" />
                  <span>Serta segenap kerabat dan handai tolan</span>
                </li>
              </ul>
            </div>
          </MotionReveal>

          {/* Keluarga Mempelai Wanita */}
          <MotionReveal direction="left" delay={0.15}>
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border-2 border-pink-200/90 shadow-xl shadow-pink-900/5 relative overflow-hidden transition-transform duration-300 hover:-translate-y-1">
              <RealisticBotanicalImageCorner position="top-right" size="w-24 sm:w-32" className="opacity-85" />
              <span className="inline-block px-3.5 py-1 rounded-full bg-pink-100 text-pink-900 text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-4 border border-pink-200">
                Keluarga Mempelai Wanita
              </span>
              <h4 className="text-lg sm:text-xl font-serif font-bold text-stone-900 mb-4">
                Keluarga Bpk. Hendra Gunawan &amp; Ibu Ratna Dewi
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-pink-500 mt-1.5 shrink-0" />
                  <span>Keluarga Besar Alm. H. Abdullah &amp; Hj. Maryam (Kakek &amp; Nenek)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-pink-500 mt-1.5 shrink-0" />
                  <span>Bpk. Drs. Agus Gunawan &amp; Keluarga (Paman)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-pink-500 mt-1.5 shrink-0" />
                  <span>Ibu Hj. Nurjanah &amp; Keluarga (Bibi)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-pink-500 mt-1.5 shrink-0" />
                  <span>Serta segenap kerabat dan handai tolan</span>
                </li>
              </ul>
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}