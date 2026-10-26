"use client";

import React from "react";
import MotionReveal from "@/components/ui/MotionReveal";
import { RealisticBotanicalImageCorner, RealisticHeaderGarland } from "@/components/ui/RealisticFloralAccent";
import { FlyingDove } from "@/components/ui/DimensionalBotanicals";
import { Heart, Sparkles } from "lucide-react";

interface Milestone {
  year: string;
  title: string;
  description: string;
}

const milestones: Milestone[] = [
  {
    year: "2020",
    title: "Pertama Bertemu",
    description: "Pertemuan pertama yang berawal dari sebuah seminar teknologi di Jakarta. Percakapan santai yang menjadi awal dari kisah kami.",
  },
  {
    year: "2022",
    title: "Menjalin Hubungan",
    description: "Setelah sekian lama menjadi teman diskusi dan bertukar cerita, kami memutuskan untuk saling melengkapi dan melangkah bersama.",
  },
  {
    year: "2025",
    title: "Lamaran (The Proposal)",
    description: "Di bawah gemerlap senja yang tenang, kami berjanji untuk saling setia dan melangkah ke jenjang yang lebih sakral.",
  },
  {
    year: "2026",
    title: "Hari Pernikahan",
    description: "Memulai babak baru dalam hidup kami dengan doa dan restu dari keluarga serta sahabat tercinta.",
  },
];

export default function LoveStory() {
  return (
    <section id="kisah" className="py-20 sm:py-28 px-4 sm:px-6 md:px-8 bg-[#FDF6F8] relative overflow-hidden">
      {/* Background Vintage Tapestry Texture */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none"
        style={{ backgroundImage: "url('/images/bg-traditional-toile.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#FDF6F8]/85 via-transparent to-[#FDF6F8]/90 pointer-events-none" />

      {/* Dimensional Flying Dove */}
      <div className="absolute top-12 left-6 w-16 sm:w-24 pointer-events-none z-10 opacity-70">
        <FlyingDove direction="right" />
      </div>

      <RealisticBotanicalImageCorner position="top-right" size="w-36 sm:w-52" className="opacity-80" />
      <RealisticBotanicalImageCorner position="bottom-left" size="w-36 sm:w-52" className="opacity-80" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <MotionReveal direction="up">
          <div className="w-11 h-11 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center mx-auto mb-3 border border-pink-200 shadow-inner">
            <Heart className="w-5 h-5 fill-pink-500/20" />
          </div>
          <p className="text-pink-800 uppercase tracking-[0.3em] text-xs font-semibold mb-2">
            Kisah Kami
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-stone-900 mb-3">
            Our Love Story
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto mb-12 font-light leading-relaxed">
            Setiap perjalanan cinta memiliki keindahannya tersendiri, dan inilah sepenggal kisah awal perjalanan kami.
          </p>
          <RealisticHeaderGarland />
        </MotionReveal>

        <div className="relative border-l-2 border-pink-300 ml-4 sm:ml-12 md:ml-28 pl-6 sm:pl-8 space-y-10 sm:space-y-12 text-left">
          {milestones.map((item, index) => (
            <MotionReveal
              key={index}
              direction="left"
              delay={index * 0.12}
              className="relative group"
            >
              {/* Dot with pulse halo */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-pink-500 border-4 border-[#FDF6F8] shadow-md group-hover:scale-125 transition-transform duration-300" />

              <div className="bg-white/85 backdrop-blur-sm p-5 sm:p-6 rounded-2xl border border-pink-200/90 shadow-md">
                <span className="inline-block px-3 py-0.5 rounded-full bg-pink-100 text-pink-900 text-xs font-bold tracking-wider mb-2 border border-pink-200">
                  {item.year}
                </span>
                <h3 className="text-lg sm:text-xl font-serif text-stone-900 font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}