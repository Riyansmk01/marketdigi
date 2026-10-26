"use client";

import React from "react";
import MotionReveal from "@/components/ui/MotionReveal";
import { RealisticHeaderGarland } from "@/components/ui/RealisticFloralAccent";
import { FlyingDove } from "@/components/ui/DimensionalBotanicals";
import { Calendar, Clock, MapPin, ExternalLink, Sparkles } from "lucide-react";

export default function EventDetails() {
  const googleMapsUrl = "https://maps.google.com/?q=Plataran+Dharmawangsa+Jakarta";

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+of+Riyan+%26+Intan&dates=20261212T080000Z/20261212T140000Z&details=Undangan+Pernikahan+Riyan+dan+Intan&location=Plataran+Dharmawangsa,+Jakarta`;

  return (
    <section id="acara" className="py-20 sm:py-28 px-4 sm:px-6 md:px-8 relative overflow-hidden bg-[#2A050E]">
      {/* 1. Grand Luxury Pelaminan & Ballroom Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-[0.85] contrast-[1.05]"
        style={{ backgroundImage: "url('/images/bg-pelaminan-luxury.png')" }}
      />
      {/* Romantic Wine & Rose Gradient Overlay for perfect readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2A050E]/85 via-[#4A0E17]/80 to-[#2A050E]/90 pointer-events-none" />

      {/* Dimensional Flying Doves */}
      <div className="absolute top-10 right-8 w-20 sm:w-28 pointer-events-none z-10 opacity-75">
        <FlyingDove direction="left" />
      </div>
      <div className="absolute bottom-16 left-6 w-16 sm:w-24 pointer-events-none z-10 opacity-70">
        <FlyingDove direction="right" delay={2} />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <MotionReveal direction="up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-semibold uppercase tracking-[0.25em] mb-3 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Save The Date</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-amber-100 mb-3 drop-shadow-md">
            Waktu &amp; Tempat Acara
          </h2>
          <p className="text-pink-100/90 text-xs sm:text-sm max-w-lg mx-auto mb-4 leading-relaxed font-light px-2">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.
          </p>
          <RealisticHeaderGarland />
        </MotionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
          {/* Akad Nikah Card */}
          <MotionReveal direction="up" delay={0.1}>
            <div className="h-full bg-[#FFF5F7]/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-amber-300/60 shadow-2xl shadow-black/50 relative overflow-hidden text-left flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
              <div>
                <div className="inline-block px-3.5 py-1 rounded-full bg-pink-100 text-pink-900 text-xs font-bold uppercase tracking-wider mb-5 border border-pink-200">
                  Akad Nikah
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif text-stone-900 mb-6">Sabtu, 12 Desember 2026</h3>

                <div className="space-y-4 text-stone-700 text-sm mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-stone-500 block">Waktu Pelaksanaan</span>
                      <strong className="font-serif text-stone-900 text-base">Pukul 08.00 - 10.00 WIB</strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-stone-500 block">Lokasi Akad</span>
                      <strong className="text-stone-900 block font-serif text-base">Plataran Dharmawangsa</strong>
                      <span className="text-xs text-stone-600 block leading-snug mt-0.5">
                        Jl. Dharmawangsa Raya No.6, Kebayoran Baru, Jakarta Selatan
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-pink-900 italic border-t border-pink-200/80 pt-4 font-serif">
                * Khusus keluarga dan kerabat inti
              </p>
            </div>
          </MotionReveal>

          {/* Resepsi Pernikahan Card */}
          <MotionReveal direction="up" delay={0.2}>
            <div className="h-full bg-[#FFF5F7]/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-amber-300/60 shadow-2xl shadow-black/50 relative overflow-hidden text-left flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
              <div>
                <div className="inline-block px-3.5 py-1 rounded-full bg-pink-100 text-pink-900 text-xs font-bold uppercase tracking-wider mb-5 border border-pink-200">
                  Resepsi Pernikahan
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif text-stone-900 mb-6">Sabtu, 12 Desember 2026</h3>

                <div className="space-y-4 text-stone-700 text-sm mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-stone-500 block">Waktu Pelaksanaan</span>
                      <strong className="font-serif text-stone-900 text-base">Pukul 11.00 - 14.00 WIB</strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-stone-500 block">Lokasi Resepsi</span>
                      <strong className="text-stone-900 block font-serif text-base">Grand Ballroom Plataran</strong>
                      <span className="text-xs text-stone-600 block leading-snug mt-0.5">
                        Jl. Dharmawangsa Raya No.6, Kebayoran Baru, Jakarta Selatan
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-pink-900 italic border-t border-pink-200/80 pt-4 font-serif">
                * Sesi ramah tamah dan jamuan makan siang
              </p>
            </div>
          </MotionReveal>
        </div>

        {/* Action Buttons */}
        <MotionReveal direction="zoom" delay={0.3}>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full bg-stone-900 hover:bg-stone-800 text-amber-200 text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-xl hover:scale-105 active:scale-95 border border-amber-300/40"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Petunjuk Lokasi (Google Maps)</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-stone-950 text-xs sm:text-sm font-bold tracking-wide transition-all shadow-xl hover:scale-105 active:scale-95 border border-amber-200/50"
            >
              <Calendar className="w-4 h-4 text-stone-950" />
              <span>Simpan ke Google Calendar</span>
            </a>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}