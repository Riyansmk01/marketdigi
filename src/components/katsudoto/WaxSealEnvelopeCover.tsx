"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Sparkles, Heart } from "lucide-react";
import confetti from "canvas-confetti";

interface WaxSealEnvelopeCoverProps {
  isOpen: boolean;
  onOpen: () => void;
  guestName: string;
}

export default function WaxSealEnvelopeCover({
  isOpen,
  onOpen,
  guestName,
}: WaxSealEnvelopeCoverProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenClick = () => {
    setIsOpening(true);

    // Launch elegant golden & rose confetti burst on wax seal break
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.65 },
      colors: ["#D4AF37", "#F3E5AB", "#F43F5E", "#E6CA65"],
    });

    setTimeout(() => {
      onOpen();
    }, 900);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141210]/95 backdrop-blur-md overflow-hidden"
        >
          {/* Ambient Lighting */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.12, 0.22, 0.12],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"
          />

          {/* Main Envelope Card with 3D Depth */}
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{
              scale: isOpening ? 1.03 : 1,
              y: isOpening ? -30 : 0,
              opacity: isOpening ? 0 : 1,
            }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm sm:max-w-md mx-auto flex flex-col items-center"
          >
            {/* Outer Envelope Card */}
            <div className="relative w-full bg-[#FAF7F2] rounded-3xl p-7 md:p-9 shadow-2xl shadow-black/70 border border-amber-200/90 text-center overflow-hidden">
              {/* Subtle Double Gold Border */}
              <div className="absolute inset-2.5 rounded-2xl border border-amber-800/15 pointer-events-none" />
              <div className="absolute inset-3 rounded-2xl border border-dashed border-amber-800/10 pointer-events-none" />

              {/* Top Decorative Floral / Monogram */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="w-8 h-[1px] bg-amber-400" />
                <span className="text-[10px] tracking-[0.35em] uppercase text-amber-800/80 font-semibold">
                  The Wedding Of
                </span>
                <span className="w-8 h-[1px] bg-amber-400" />
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif text-stone-900 font-normal tracking-wide mb-1">
                Riyan &amp; Intan
              </h1>

              <p className="text-xs tracking-widest text-amber-900/70 uppercase font-light mb-5">
                Sabtu, 12 Desember 2026
              </p>

              {/* Decorative Arch Frame with Bride & Groom preview */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.4 }}
                className="relative w-28 h-36 mx-auto rounded-t-full border-2 border-amber-300/80 p-1 mb-5 shadow-inner bg-amber-50/50 flex flex-col items-center justify-center overflow-hidden"
              >
                <div
                  className="w-full h-full rounded-t-full bg-cover bg-center transition-transform duration-700 hover:scale-110"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80')",
                  }}
                />
              </motion.div>

              {/* Recipient Box (Katsudoto Signature) */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-amber-200/60 shadow-sm mb-6">
                <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">
                  Kepada Yth. Bapak/Ibu/Saudara/i:
                </p>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900 break-words">
                  {guestName || "Tamu Undangan"}
                </h2>
                <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full bg-amber-100/80 text-[10px] font-semibold text-amber-900 tracking-wider uppercase">
                  <span>Sesi 1 &bull; Akad &amp; Resepsi</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-2 italic leading-relaxed">
                  Tanpa mengurangi rasa hormat, kami bermaksud mengundang Anda untuk merayakan hari bahagia kami.
                </p>
              </div>

              {/* Wax Seal Stamp Button (Interactive trigger) */}
              <div className="flex flex-col items-center">
                <button
                  onClick={handleOpenClick}
                  className="group relative flex items-center justify-center focus:outline-none"
                  aria-label="Buka Undangan"
                >
                  {/* Animated ripple rings */}
                  <span className="absolute -inset-2.5 rounded-full bg-amber-500/25 animate-ping group-hover:bg-amber-500/35" />
                  <span className="absolute -inset-1 rounded-full bg-amber-400/20 animate-pulse" />

                  {/* Katsudoto Wax Seal Stamp */}
                  <motion.div
                    whileHover={{ scale: 1.08, rotate: 3 }}
                    whileTap={{ scale: 0.94 }}
                    className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#8C2D19] via-[#A8321D] to-[#681E10] text-amber-200 shadow-xl shadow-amber-900/30 border-2 border-amber-200/50 flex flex-col items-center justify-center"
                  >
                    <span className="text-[11px] font-serif font-bold tracking-tight text-amber-200/90 leading-none">
                      R &amp; I
                    </span>
                    <Heart className="w-3 h-3 text-amber-300 fill-amber-300 mt-0.5 animate-pulse" />
                  </motion.div>
                </button>

                {/* CTA Button Label */}
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleOpenClick}
                  className="mt-3.5 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-amber-200 text-xs font-medium tracking-wider shadow-lg shadow-black/20 transition-all"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Buka Undangan</span>
                  <Sparkles className="w-3 h-3 text-amber-400 opacity-80" />
                </motion.button>
              </div>
            </div>


          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
