"use client";

import React from "react";
import MotionReveal from "@/components/ui/MotionReveal";
import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react";

export default function EventDetails() {
  const googleMapsUrl = "https://maps.google.com/?q=Plataran+Dharmawangsa+Jakarta";

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+of+Riyan+%26+Intan&dates=20261212T080000Z/20261212T140000Z&details=Undangan+Pernikahan+Riyan+dan+Intan&location=Plataran+Dharmawangsa,+Jakarta`;

  return (
    <section id="acara" className="py-24 px-4 md:px-8 bg-stone-100/70 relative">
      <div className="max-w-4xl mx-auto text-center">
        <MotionReveal direction="up">
          <p className="text-amber-700 uppercase tracking-[0.3em] text-xs font-semibold mb-2">
            Save The Date
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-stone-900 mb-4">
            Waktu &amp; Tempat Acara
          </h2>
          <p className="text-stone-600 text-sm max-w-lg mx-auto mb-14">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.
          </p>
        </MotionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Akad Nikah */}
          <MotionReveal direction="up" delay={0.1}>
            <div className="h-full bg-white rounded-3xl p-8 border border-amber-200/80 shadow-lg shadow-stone-900/5 relative overflow-hidden text-left flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-28 h-28 bg-amber-100/60 rounded-bl-full pointer-events-none" />
              <div>
                <div className="inline-block px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-5">
                  Akad Nikah
                </div>
                <h3 className="text-2xl font-serif text-stone-900 mb-6">Sabtu, 12 Desember 2026</h3>

                <div className="space-y-3.5 text-stone-600 text-sm mb-6">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                    <span className="font-medium text-stone-800">Pukul 08.00 - 10.00 WIB</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-stone-800 block">Plataran Dharmawangsa</strong>
                      <span className="text-xs text-stone-500">Jl. Dharmawangsa Raya No.6, Kebayoran Baru, Jakarta Selatan</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-amber-800/80 italic border-t border-stone-100 pt-4">
                * Khusus keluarga dan kerabat inti
              </p>
            </div>
          </MotionReveal>

          {/* Resepsi */}
          <MotionReveal direction="up" delay={0.2}>
            <div className="h-full bg-white rounded-3xl p-8 border border-amber-200/80 shadow-lg shadow-stone-900/5 relative overflow-hidden text-left flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-28 h-28 bg-amber-100/60 rounded-bl-full pointer-events-none" />
              <div>
                <div className="inline-block px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-5">
                  Resepsi Pernikahan
                </div>
                <h3 className="text-2xl font-serif text-stone-900 mb-6">Sabtu, 12 Desember 2026</h3>

                <div className="space-y-3.5 text-stone-600 text-sm mb-6">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                    <span className="font-medium text-stone-800">Pukul 11.00 - 14.00 WIB</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-stone-800 block">Grand Ballroom Plataran</strong>
                      <span className="text-xs text-stone-500">Jl. Dharmawangsa Raya No.6, Kebayoran Baru, Jakarta Selatan</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-amber-800/80 italic border-t border-stone-100 pt-4">
                * Sesi ramah tamah dan jamuan makan siang
              </p>
            </div>
          </MotionReveal>
        </div>

        {/* Action Buttons */}
        <MotionReveal direction="zoom" delay={0.3}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-stone-900 hover:bg-stone-800 text-amber-200 text-xs font-medium tracking-wide transition-all shadow-md hover:scale-105 active:scale-95"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Petunjuk Lokasi (Google Maps)</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 text-xs font-semibold tracking-wide transition-all shadow-md hover:scale-105 active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>Simpan ke Google Calendar</span>
            </a>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
