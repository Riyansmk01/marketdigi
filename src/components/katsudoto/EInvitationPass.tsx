"use client";

import React, { useRef, useState } from "react";
import MotionReveal from "@/components/ui/MotionReveal";
import { RealisticBotanicalImageCorner, RealisticHeaderGarland } from "@/components/ui/RealisticFloralAccent";
import { FlyingDove } from "@/components/ui/DimensionalBotanicals";
import { QRCodeSVG } from "qrcode.react";
import { Download, Share2, Check, ShieldCheck, Ticket, Sparkles } from "lucide-react";

interface EInvitationPassProps {
  guestName: string;
}

export default function EInvitationPass({ guestName }: EInvitationPassProps) {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const codeSuffix = (guestName || "TAMU")
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 100)
    .toString()
    .slice(-4);
  const passId = `KTS-RI-2026-${codeSuffix}`;

  const qrData = JSON.stringify({
    event: "The Wedding of Riyan & Intan",
    id: passId,
    guest: guestName || "Tamu Undangan",
    session: "Sesi 1 (08.00 - 14.00 WIB)",
    pax: 2,
    verified: true,
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(passId);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section id="e-pass" className="py-20 sm:py-28 px-4 sm:px-6 md:px-8 bg-[#FAF2F4] relative overflow-hidden">
      {/* 1. Floral Frame Background Artwork */}
      <div
        className="absolute inset-0 bg-contain sm:bg-cover bg-center bg-no-repeat opacity-40 pointer-events-none"
        style={{ backgroundImage: "url('/images/bg-floral-frame.png')" }}
      />
      {/* Soft gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF2F4]/80 via-transparent to-[#FAF2F4]/85 pointer-events-none" />

      {/* Dimensional Flying Doves */}
      <div className="absolute top-12 left-6 w-16 sm:w-24 pointer-events-none z-10 opacity-75">
        <FlyingDove direction="right" />
      </div>
      <div className="absolute top-24 right-6 w-16 sm:w-24 pointer-events-none z-10 opacity-75">
        <FlyingDove direction="left" delay={1.4} />
      </div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <MotionReveal direction="up">
          <div className="w-12 h-12 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center mx-auto mb-3 shadow-inner border border-pink-200">
            <Ticket className="w-6 h-6" />
          </div>
          <p className="text-pink-800 uppercase tracking-[0.3em] text-xs font-semibold mb-2">
            Buku Tamu Digital
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-stone-900 mb-3">
            E-Invitation &amp; QR Pass
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto mb-10 sm:mb-12 leading-relaxed">
            Tunjukkan QR Code di bawah ini kepada petugas penerima tamu (*Usher*) saat tiba di lokasi acara untuk registrasi dan *souvenir check-in*.
          </p>
          <RealisticHeaderGarland />
        </MotionReveal>

        {/* E-Ticket Card (Katsudoto Style Pass) */}
        <MotionReveal direction="zoom" delay={0.15}>
          <div
            ref={cardRef}
            className="relative max-w-sm sm:max-w-md mx-auto bg-white rounded-3xl border-2 border-pink-300 shadow-2xl shadow-pink-900/15 overflow-hidden text-left transition-transform hover:-translate-y-1.5 duration-500"
          >
            <RealisticBotanicalImageCorner position="top-right" size="w-28 sm:w-36" className="opacity-90" />
            <RealisticBotanicalImageCorner position="bottom-left" size="w-28 sm:w-36" className="opacity-90" />

            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-stone-900 via-[#3B0713] to-stone-900 p-6 text-stone-100 relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] tracking-[0.3em] uppercase text-amber-300 font-semibold">
                  Official Guest Pass
                </span>
                <div className="flex items-center gap-1 text-[11px] text-emerald-300 bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </div>
              </div>
              <h3 className="text-2xl font-serif text-amber-100 font-medium">Riyan &amp; Intan</h3>
              <p className="text-xs text-pink-200/90 font-light mt-0.5">Sabtu, 12 Desember 2026</p>
            </div>

            {/* Ticket Notch Divider */}
            <div className="relative h-6 bg-white flex items-center justify-between px-4">
              <div className="w-4 h-8 bg-[#FAF2F4] rounded-r-full -ml-4 border-r border-pink-300" />
              <div className="flex-1 border-b border-dashed border-stone-300 mx-2" />
              <div className="w-4 h-8 bg-[#FAF2F4] rounded-l-full -mr-4 border-l border-pink-300" />
            </div>

            {/* Ticket Body */}
            <div className="p-6 pt-2">
              <div className="mb-5">
                <p className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
                  Nama Tamu
                </p>
                <h4 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
                  {guestName || "Tamu Undangan"}
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs mb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
                    Sesi Acara
                  </p>
                  <p className="font-semibold text-stone-800">Sesi 1 (Akad &amp; Resepsi)</p>
                  <p className="text-[11px] text-stone-500">08.00 - 14.00 WIB</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
                    Alokasi Kursi
                  </p>
                  <p className="font-semibold text-stone-800">Maks. 2 Tamu</p>
                  <p className="text-[11px] text-stone-500">Free Souvenir Coupon</p>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center p-5 bg-[#FFF5F7] rounded-2xl border border-pink-200 mb-5 shadow-inner">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-pink-200">
                  <QRCodeSVG
                    value={qrData}
                    size={160}
                    level="M"
                    fgColor="#1C1917"
                    bgColor="#FFFFFF"
                  />
                </div>
                <div className="flex items-center gap-2 mt-3.5 text-stone-600">
                  <span className="font-mono text-xs font-semibold tracking-wider text-stone-800">
                    {passId}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="text-[11px] font-semibold text-pink-700 hover:text-pink-900 underline"
                    title="Salin Kode Pass"
                  >
                    {copied ? "Tersalin!" : "Salin"}
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-center text-stone-500 italic leading-relaxed">
                * Harap tangkap layar (screenshot) halaman ini atau simpan barcode untuk ditunjukkan saat check-in di meja penerima tamu.
              </p>
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}