"use client";

import React from "react";
import MotionReveal from "@/components/ui/MotionReveal";

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
    <section id="kisah" className="py-24 px-4 md:px-8 bg-[#FAF7F2] relative">
      <div className="max-w-3xl mx-auto text-center">
        <MotionReveal direction="up">
          <p className="text-amber-700 uppercase tracking-[0.3em] text-xs font-semibold mb-2">
            Kisah Kami
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-stone-900 mb-14">
            Our Love Story
          </h2>
        </MotionReveal>

        <div className="relative border-l-2 border-amber-300/60 ml-4 md:ml-32 pl-6 md:pl-8 space-y-12 text-left">
          {milestones.map((item, index) => (
            <MotionReveal
              key={index}
              direction="left"
              delay={index * 0.12}
              className="relative group"
            >
              {/* Dot with pulse halo */}
              <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-amber-400 border-4 border-[#FAF7F2] shadow-sm group-hover:scale-125 transition-transform duration-300" />

              <span className="inline-block px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold tracking-wider mb-2">
                {item.year}
              </span>
              <h3 className="text-xl font-serif text-stone-900 font-semibold mb-1.5">
                {item.title}
              </h3>
              <p className="text-xs md:text-sm text-stone-600 leading-relaxed max-w-lg">
                {item.description}
              </p>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
