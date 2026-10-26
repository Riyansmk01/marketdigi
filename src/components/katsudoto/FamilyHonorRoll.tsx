"use client";

import React from "react";
import MotionReveal from "@/components/ui/MotionReveal";
import { RealisticBotanicalImageCorner, RealisticHeaderGarland } from "@/components/ui/RealisticFloralAccent";
import { Users, Heart } from "lucide-react";

export default function FamilyHonorRoll() {
  return (
    <section className="py-20 px-4 md:px-8 bg-[#FAF7F2]">
      <div className="max-w-4xl mx-auto text-center">
        <MotionReveal direction="up">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Users className="w-6 h-6" />
          </div>
          <p className="text-amber-700 uppercase tracking-[0.3em] text-xs font-semibold mb-2">
            Keluarga Besar
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-stone-900 mb-3">
            Turut Mengundang
          </h2>
          <p className="text-stone-600 text-sm max-w-md mx-auto mb-12 leading-relaxed">
            Rasa hormat dan ungkapan terima kasih yang tulus dari segenap keluarga besar kedua mempelai.
          </p>
        </MotionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* Keluarga Mempelai Pria */}
          <MotionReveal direction="right" delay={0.1}>
            <div className="bg-white rounded-3xl p-7 border border-pink-200/80 shadow-md relative overflow-hidden">
              <RealisticBotanicalImageCorner position="top-right" size="w-24 sm:w-32" className="opacity-80" />
              <span className="inline-block px-3 py-1 rounded-full bg-amber-100/90 text-amber-900 text-[10px] font-bold tracking-widest uppercase mb-4">
                Keluarga Mempelai Pria
              </span>
              <h4 className="text-lg font-serif font-bold text-stone-900 mb-3">
                Keluarga Bpk. Bambang Prasetyo &amp; Ibu Sri Wahyuni
              </h4>
              <ul className="space-y-2 text-xs text-stone-600 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>Keluarga Besar Alm. H. Soeharto &amp; Hj. Siti Aminah (Kakek &amp; Nenek)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>Bpk. Ir. Joko Prasetyo &amp; Keluarga (Paman)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>Ibu Endang Sulistyo &amp; Keluarga (Bibi)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>Serta segenap kerabat dan handai tolan</span>
                </li>
              </ul>
            </div>
          </MotionReveal>

          {/* Keluarga Mempelai Wanita */}
          <MotionReveal direction="left" delay={0.15}>
            <div className="bg-white rounded-3xl p-7 border border-pink-200/80 shadow-md relative overflow-hidden">
              <RealisticBotanicalImageCorner position="top-right" size="w-24 sm:w-32" className="opacity-80" />
              <span className="inline-block px-3 py-1 rounded-full bg-amber-100/90 text-amber-900 text-[10px] font-bold tracking-widest uppercase mb-4">
                Keluarga Mempelai Wanita
              </span>
              <h4 className="text-lg font-serif font-bold text-stone-900 mb-3">
                Keluarga Bpk. Hendra Gunawan &amp; Ibu Ratna Dewi
              </h4>
              <ul className="space-y-2 text-xs text-stone-600 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>Keluarga Besar Alm. H. Abdullah &amp; Hj. Maryam (Kakek &amp; Nenek)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>Bpk. Drs. Agus Gunawan &amp; Keluarga (Paman)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>Ibu Hj. Nurjanah &amp; Keluarga (Bibi)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
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
