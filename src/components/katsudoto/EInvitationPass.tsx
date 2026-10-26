"use client";

import React, { useRef, useState } from "react";
import MotionReveal from "@/components/ui/MotionReveal";
import { QRCodeSVG } from "qrcode.react";
import { Download, Share2, Check, ShieldCheck, Ticket } from "lucide-react";

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
    <section id="e-pass" className="py-24 px-4 md:px-8 bg-[#FAF7F2] relative">
      <div className="max-w-2xl mx-auto text-center">
        <MotionReveal direction="up">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Ticket className="w-6 h-6" />
          </div>
          <p className="text-amber-700 uppercase tracking-[0.3em] text-xs font-semibold mb-2">
            Buku Tamu Digital
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-stone-900 mb-3">
            E-Invitation &amp; QR Pass
          </h2>
          <p className="text-stone-600 text-sm max-w-md mx-auto mb-12 leading-relaxed">
            Tunjukkan QR Code di bawah ini kepada petugas penerima tamu (*Usher*) saat tiba di lokasi acara untuk registrasi dan *souvenir check-in*.
          </p>
        </MotionReveal>

        {/* E-Ticket Card (Katsudoto Style Pass) */}
        <MotionReveal direction="zoom" delay={0.15}>
          <div
            ref={cardRef}
            className="relative max-w-sm mx-auto bg-white rounded-3xl border border-amber-200/90 shadow-2xl shadow-stone-900/10 overflow-hidden text-left transition-transform hover:-translate-y-1.5 duration-500"
          >
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 p-6 text-stone-100 relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] tracking-[0.3em] uppercase text-amber-300 font-semibold">
                  Official Guest Pass
                </span>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </div>
              </div>
              <h3 className="text-2xl font-serif text-amber-100 font-medium">Riyan &amp; Intan</h3>
              <p className="text-xs text-stone-300 font-light mt-0.5">Sabtu, 12 Desember 2026</p>
            </div>

            {/* Ticket Notch Divider */}
            <div className="relative h-6 bg-white flex items-center justify-between px-4">
              <div className="w-4 h-8 bg-[#FAF7F2] rounded-r-full -ml-4 border-r border-amber-200/90" />
              <div className="flex-1 border-b border-dashed border-stone-300 mx-2" />
              <div className="w-4 h-8 bg-[#FAF7F2] rounded-l-full -mr-4 border-l border-amber-200/90" />
            </div>

            {/* Ticket Body */}
            <div className="p-6 pt-2">
              <div className="mb-5">
                <p className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
                  Nama Tamu
                </p>
                <h4 className="text-lg font-serif font-bold text-stone-900">
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
              <div className="flex flex-col items-center justify-center p-5 bg-[#FAF7F2] rounded-2xl border border-amber-200/70 mb-5">
                <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-stone-200">
                  <QRCodeSVG
                    value={qrData}
                    size={155}
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
                    className="text-[10px] font-semibold text-amber-700 hover:text-amber-900 underline"
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
