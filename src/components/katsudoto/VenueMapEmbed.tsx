"use client";

import React from "react";
import MotionReveal from "@/components/ui/MotionReveal";
import { RealisticHeaderGarland } from "@/components/ui/RealisticFloralAccent";
import { MapPin, Navigation, Car, Heart, Shield, Compass } from "lucide-react";

const facilities = [
  { icon: Car, label: "Area Parkir Luas & Valet Gratis" },
  { icon: Heart, label: "Musholla Nyaman & Ber-AC" },
  { icon: Shield, label: "Protokol Kebersihan & Keamanan" },
  { icon: Compass, label: "Akses Kursi Roda (Ramah Lansia)" },
];

export default function VenueMapEmbed() {
  const googleMapsUrl = "https://maps.google.com/?q=Plataran+Dharmawangsa+Jakarta";
  const wazeUrl = "https://waze.com/ul?q=Plataran+Dharmawangsa+Jakarta";

  return (
    <section className="py-20 px-4 md:px-8 bg-stone-100/60 relative">
      <div className="max-w-4xl mx-auto text-center">
        <MotionReveal direction="up">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Navigation className="w-6 h-6" />
          </div>
          <p className="text-amber-700 uppercase tracking-[0.3em] text-xs font-semibold mb-2">
            Lokasi Acara
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-stone-900 mb-3">
            Peta &amp; Akses Venue
          </h2>
          <p className="text-stone-600 text-sm max-w-lg mx-auto mb-10 leading-relaxed">
            Acara diselenggarakan di <strong>Plataran Dharmawangsa</strong>, berlokasi strategis di Kebayoran Baru, Jakarta Selatan.
          </p>
        </MotionReveal>

        {/* Embedded Interactive Map Card */}
        <MotionReveal direction="zoom" delay={0.15}>
          <div className="bg-white rounded-3xl p-4 md:p-6 border border-pink-200/80 shadow-xl shadow-pink-900/5 mb-8 relative overflow-hidden">
            <div className="w-full h-80 md:h-96 rounded-2xl overflow-hidden border border-stone-200 shadow-inner relative">
              <iframe
                title="Peta Lokasi Plataran Dharmawangsa"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.1979313271704!2d106.79720457499047!3d-6.237684093750567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f1406857cb37%3A0x64cf517406c19a97!2sPlataran%20Dharmawangsa!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full filter saturate-[1.1]"
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-amber-200 text-xs font-medium tracking-wide shadow-md transition-all hover:scale-105 active:scale-95"
              >
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Buka di Google Maps</span>
              </a>

              <a
                href={wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-semibold tracking-wide shadow-md transition-all hover:scale-105 active:scale-95"
              >
                <Navigation className="w-4 h-4" />
                <span>Petunjuk Arah via Waze</span>
              </a>
            </div>
          </div>
        </MotionReveal>

        {/* Facilities & Amenities */}
        <MotionReveal direction="up" delay={0.2}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
            {facilities.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-white border border-amber-200/60 shadow-sm"
                >
                  <Icon className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="text-[11px] font-medium text-stone-700 leading-snug">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
