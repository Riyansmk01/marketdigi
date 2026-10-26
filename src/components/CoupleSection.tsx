"use client";

import React from "react";
import MotionReveal from "@/components/ui/MotionReveal";
import { Heart } from "lucide-react";

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

export default function CoupleSection() {
  return (
    <section id="mempelai" className="py-24 px-4 md:px-8 relative overflow-hidden bg-[#FAF7F2]">
      {/* Decorative ambient background blur */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-rose-200/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Intro Verse with Scroll Fade */}
        <MotionReveal direction="up" className="mb-16">
          <p className="text-amber-700 uppercase tracking-[0.3em] text-xs font-semibold mb-2">
            Maha Suci Allah
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-stone-900 mb-4">
            Pasangan Mempelai
          </h2>
          <p className="text-stone-600 text-sm md:text-base max-w-xl mx-auto leading-relaxed italic">
            &ldquo;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.&rdquo;
          </p>
          <span className="inline-block mt-3 text-xs font-medium text-amber-800 tracking-wider">
            (QS. Ar-Rum: 21)
          </span>
        </MotionReveal>

        {/* Groom & Bride Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
          {/* Mempelai Pria */}
          <MotionReveal direction="right" delay={0.1}>
            <div className="group relative flex flex-col items-center p-8 bg-white/70 backdrop-blur-md rounded-3xl border border-amber-200/70 shadow-lg shadow-amber-900/5 hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5">
              {/* Arched Photo Frame */}
              <div className="relative w-44 h-56 md:w-52 md:h-64 rounded-t-full rounded-b-2xl overflow-hidden border-2 border-amber-300/60 p-1 mb-6 shadow-md bg-stone-100">
                <div
                  className="w-full h-full rounded-t-full rounded-b-xl bg-cover bg-center transition-transform duration-700 group-hover:scale-108"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <h3 className="text-2xl md:text-3xl font-serif text-stone-900 font-medium mb-1">
                Riyan Perdhanaputra
              </h3>
              <p className="text-xs uppercase tracking-widest text-amber-700 font-semibold mb-3">
                Mempelai Pria
              </p>
              <p className="text-xs text-stone-600 leading-relaxed max-w-xs mb-4">
                Putra pertama dari pasangan <br />
                <strong className="text-stone-800 font-medium">Bpk. Bambang Prasetyo</strong> &amp;{" "}
                <strong className="text-stone-800 font-medium">Ibu Sri Wahyuni</strong>
              </p>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-xs text-amber-900 font-medium transition-colors"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>@riyanperdhana</span>
              </a>
            </div>
          </MotionReveal>

          {/* Mempelai Wanita */}
          <MotionReveal direction="left" delay={0.2}>
            <div className="group relative flex flex-col items-center p-8 bg-white/70 backdrop-blur-md rounded-3xl border border-amber-200/70 shadow-lg shadow-amber-900/5 hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5">
              {/* Arched Photo Frame */}
              <div className="relative w-44 h-56 md:w-52 md:h-64 rounded-t-full rounded-b-2xl overflow-hidden border-2 border-amber-300/60 p-1 mb-6 shadow-md bg-stone-100">
                <div
                  className="w-full h-full rounded-t-full rounded-b-xl bg-cover bg-center transition-transform duration-700 group-hover:scale-108"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <h3 className="text-2xl md:text-3xl font-serif text-stone-900 font-medium mb-1">
                Intan Nuraini
              </h3>
              <p className="text-xs uppercase tracking-widest text-amber-700 font-semibold mb-3">
                Mempelai Wanita
              </p>
              <p className="text-xs text-stone-600 leading-relaxed max-w-xs mb-4">
                Putri kedua dari pasangan <br />
                <strong className="text-stone-800 font-medium">Bpk. Hendra Gunawan</strong> &amp;{" "}
                <strong className="text-stone-800 font-medium">Ibu Ratna Dewi</strong>
              </p>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-xs text-amber-900 font-medium transition-colors"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>@intannuraini</span>
              </a>
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
