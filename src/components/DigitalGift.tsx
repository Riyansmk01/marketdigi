"use client";

import React, { useState } from "react";
import MotionReveal from "@/components/ui/MotionReveal";
import { Copy, Check, Gift, CreditCard, MapPin } from "lucide-react";

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
    setTimeout(() => setCopiedIndex(null), 3000);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(giftAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 3000);
  };

  return (
    <section id="kado" className="py-24 px-4 md:px-8 bg-[#FAF7F2] relative">
      <div className="max-w-3xl mx-auto text-center">
        <MotionReveal direction="up">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Gift className="w-6 h-6" />
          </div>
          <p className="text-amber-700 uppercase tracking-[0.3em] text-xs font-semibold mb-2">
            Tanda Kasih
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-stone-900 mb-3">
            Amplop Digital &amp; Kado
          </h2>
          <p className="text-stone-600 text-sm max-w-md mx-auto mb-14 leading-relaxed">
            Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda ingin memberikan tanda kasih, kami menyediakan fitur amplop digital berikut.
          </p>
        </MotionReveal>

        {/* Bank Account Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
          {accounts.map((acc, index) => (
            <MotionReveal key={index} direction="up" delay={index * 0.1}>
              <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-lg shadow-stone-900/5 relative overflow-hidden transition-transform hover:-translate-y-1 duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold tracking-wider text-amber-900 bg-amber-100/90 px-3 py-1 rounded-lg">
                    {acc.logoText}
                  </span>
                  <CreditCard className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-xs text-stone-500 mb-1">{acc.bankName}</p>
                <div className="text-xl font-mono font-bold text-stone-900 tracking-wider mb-1">
                  {acc.accountNumber}
                </div>
                <p className="text-xs text-stone-600 mb-5">a.n {acc.holderName}</p>

                <button
                  onClick={() => handleCopyAccount(acc.accountNumber, index)}
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-200 text-xs font-medium tracking-wide transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
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

        {/* Physical Gift Address Card */}
        <MotionReveal direction="up" delay={0.2}>
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-amber-200/80 shadow-lg shadow-stone-900/5 text-left">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-5 h-5 text-amber-700 shrink-0" />
              <h4 className="font-serif font-semibold text-stone-900 text-base">
                Kirim Kado Fisik
              </h4>
            </div>
            <p className="text-xs text-stone-600 mb-4 pl-8 leading-relaxed">
              {giftAddress}
            </p>
            <div className="pl-8">
              <button
                onClick={handleCopyAddress}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-medium transition-all hover:scale-105 active:scale-95"
              >
                {copiedAddress ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Alamat Berhasil Disalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Alamat Lengkap</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
