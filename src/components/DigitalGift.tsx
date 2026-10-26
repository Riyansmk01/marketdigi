"use client";

import React, { useState } from "react";
import MotionReveal from "@/components/ui/MotionReveal";
import { RealisticBotanicalImageCorner, RealisticHeaderGarland } from "@/components/ui/RealisticFloralAccent";
import { FlyingDove } from "@/components/ui/DimensionalBotanicals";
import { Copy, Check, Gift, CreditCard, MapPin, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

interface BankAccount {
  bankName: string;
  accountNumber: string;
  holderName: string;
  logoText: string;
}

const accounts: BankAccount[] = [
  {
    bankName: "Bank Central Asia (BCA)",
    accountNumber: "8830192841",
    holderName: "Intan Nuraini",
    logoText: "BCA",
  },
  {
    bankName: "Bank Mandiri",
    accountNumber: "1370018293041",
    holderName: "Riyan Perdhanaputra",
    logoText: "MANDIRI",
  },
];

export default function DigitalGift() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const giftAddress =
    "Jl. Kemang Raya No. 45B, Mampang Prapatan, Jakarta Selatan 12730 (Penerima: Intan Nuraini / Riyan Perdhanaputra - 0812-3456-7890)";

  const handleCopyAccount = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);

    // Micro confetti on copy
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#F5D061", "#FB7185", "#FDA4AF"],
    });

    setTimeout(() => setCopiedIndex(null), 3000);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(giftAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 3000);
  };

  return (
    <section id="kado" className="py-20 sm:py-28 px-4 sm:px-6 md:px-8 bg-[#FDF6F8] relative overflow-hidden">
      {/* 1. Filigree Parchment Background Texture */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-35 pointer-events-none"
        style={{ backgroundImage: "url('/images/bg-pink-filigree.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#FDF6F8]/80 via-transparent to-[#FDF6F8]/85 pointer-events-none" />

      {/* Dimensional Flying Doves */}
      <div className="absolute top-12 left-8 w-16 sm:w-24 pointer-events-none z-10 opacity-70">
        <FlyingDove direction="right" />
      </div>

      {/* Realistic Botanical Corners */}
      <RealisticBotanicalImageCorner position="top-right" size="w-36 sm:w-56" className="opacity-80" />
      <RealisticBotanicalImageCorner position="bottom-left" size="w-36 sm:w-56" className="opacity-80" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <MotionReveal direction="up">
          <div className="w-12 h-12 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center mx-auto mb-3 shadow-inner border border-pink-200">
            <Gift className="w-6 h-6" />
          </div>
          <p className="text-pink-800 uppercase tracking-[0.3em] text-xs font-semibold mb-2">
            Tanda Kasih
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-stone-900 mb-3">
            Amplop Digital &amp; Kado
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto mb-10 leading-relaxed font-light">
            Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda ingin memberikan tanda kasih, kami menyediakan fitur amplop digital berikut.
          </p>
          <RealisticHeaderGarland />
        </MotionReveal>

        {/* Bank Account Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
          {accounts.map((acc, index) => (
            <MotionReveal key={index} direction="up" delay={index * 0.1}>
              <div
                className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-7 border-2 border-pink-200 shadow-xl shadow-pink-900/10 relative overflow-hidden transition-transform hover:-translate-y-1 duration-300"
                style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), url('/images/bg-pink-filigree.png')", backgroundSize: "cover" }}
              >
                <RealisticBotanicalImageCorner position="top-right" size="w-20 sm:w-28" className="opacity-70" />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold tracking-wider text-pink-900 bg-pink-100 px-3 py-1 rounded-lg border border-pink-200">
                    {acc.logoText}
                  </span>
                  <CreditCard className="w-5 h-5 text-pink-600" />
                </div>
                <p className="text-xs text-stone-500 mb-1">{acc.bankName}</p>
                <div className="text-xl sm:text-2xl font-mono font-bold text-stone-900 tracking-wider mb-1">
                  {acc.accountNumber}
                </div>
                <p className="text-xs text-stone-600 mb-5">a.n {acc.holderName}</p>

                <button
                  onClick={() => handleCopyAccount(acc.accountNumber, index)}
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-200 text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] border border-amber-300/30 shadow-md"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Nomor Rekening Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Salin Nomor Rekening</span>
                    </>
                  )}
                </button>
              </div>
            </MotionReveal>
          ))}
        </div>

        {/* Physical Gift / Delivery Address Card */}
        <MotionReveal direction="up" delay={0.25}>
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-7 border-2 border-pink-200 shadow-xl shadow-pink-900/10 text-left relative overflow-hidden">
            <RealisticBotanicalImageCorner position="top-right" size="w-24 sm:w-32" className="opacity-70" />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <h4 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                Kirim Kado Fisik / Parsel
              </h4>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4 bg-pink-50/70 p-4 rounded-2xl border border-pink-200/80 font-serif">
              {giftAddress}
            </p>

            <button
              onClick={handleCopyAddress}
              className="py-2.5 px-5 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-900 text-xs font-semibold tracking-wide transition-all inline-flex items-center gap-2 border border-pink-300 active:scale-95 shadow-sm"
            >
              {copiedAddress ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Alamat Berhasil Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-pink-700" />
                  <span>Salin Alamat Lengkap</span>
                </>
              )}
            </button>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}