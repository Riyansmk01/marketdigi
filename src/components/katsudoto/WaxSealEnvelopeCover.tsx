"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Sparkles, Heart } from "lucide-react";
import { FlyingDove } from "@/components/ui/DimensionalBotanicals";
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

    // Launch elegant romantic pink & gold confetti burst
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.65 },
      colors: ["#FB7185", "#F472B6", "#FDA4AF", "#F5D061", "#E11D48"],
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
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1a0a10]/95 backdrop-blur-md overflow-y-auto min-h-[100dvh]"
        >
          {/* Ambient Filigree Texture Background */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none bg-cover bg-center"
            style={{ backgroundImage: "url('/images/bg-pink-filigree.png')" }}
          />

          {/* Flying Dove Accents */}
          <div className="absolute top-6 left-6 w-16 sm:w-24 pointer-events-none z-10 opacity-70">
            <FlyingDove direction="right" />
          </div>
          <div className="absolute bottom-10 right-6 w-16 sm:w-24 pointer-events-none z-10 opacity-70">
            <FlyingDove direction="left" delay={1.5} />
          </div>

          {/* Ambient Pink Glow */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 sm:w-96 h-80 sm:h-96 bg-pink-500/25 rounded-full blur-3xl pointer-events-none"
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
            className="relative w-full max-w-sm sm:max-w-md mx-auto my-auto flex flex-col items-center"
          >
            {/* Outer Envelope Card with Authentic Filigree Texture */}
            <div
              className="relative w-full bg-[#FFF5F7] rounded-3xl p-6 sm:p-9 shadow-2xl shadow-black/80 border border-pink-300/80 text-center overflow-hidden bg-cover bg-center"
              style={{ backgroundImage: "linear-gradient(rgba(255,245,247,0.92), rgba(255,245,247,0.95)), url('/images/bg-pink-filigree.png')" }}
            >
              {/* Subtle Double Pink/Gold Border */}
              <div className="absolute inset-2.5 rounded-2xl border border-pink-700/20 pointer-events-none" />
              <div className="absolute inset-3 rounded-2xl border border-dashed border-amber-600/30 pointer-events-none" />

              {/* Top Monogram */}
              <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
                <span className="w-6 sm:w-8 h-[1px] bg-pink-400" />
                <span className="text-[10px] tracking-[0.35em] uppercase text-pink-800 font-semibold">
                  The Wedding Of
                </span>
                <span className="w-6 sm:w-8 h-[1px] bg-pink-400" />
              </div>

              <h1 className="text-2xl sm:text-4xl font-serif text-stone-900 font-normal tracking-wide mb-1">
                Riyan &amp; Intan
              </h1>

              <p className="text-[11px] sm:text-xs tracking-widest text-pink-800/80 uppercase font-light mb-4 sm:mb-5">
                Sabtu, 12 Desember 2026
              </p>

              {/* Decorative Arch Frame with Bride & Groom preview */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.4 }}
                className="relative w-24 h-32 sm:w-28 sm:h-36 mx-auto rounded-t-full border-2 border-pink-400/80 p-1 mb-4 sm:mb-5 shadow-inner bg-pink-100/50 flex flex-col items-center justify-center overflow-hidden"
              >
                <div
                  className="w-full h-full rounded-t-full bg-cover bg-center transition-transform duration-700 hover:scale-110"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80')",
                  }}
                />
              </motion.div>

              {/* Recipient Box */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3.5 sm:p-4 border border-pink-200/90 shadow-sm mb-5 sm:mb-6">
                <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-stone-500 mb-1">
                  Kepada Yth. Bapak/Ibu/Saudara/i:
                </p>
                <h2 className="text-base sm:text-xl font-serif font-bold text-stone-900 break-words px-1">
                  {guestName || "Tamu Undangan"}
                </h2>
                <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full bg-pink-100 text-[10px] font-semibold text-pink-900 tracking-wider uppercase">
                  <span>Sesi 1 &bull; Akad &amp; Resepsi</span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-stone-600 mt-2 italic leading-relaxed">
                  Tanpa mengurangi rasa hormat, kami bermaksud mengundang Anda untuk merayakan hari bahagia kami.
                </p>
              </div>

              {/* Pink Wax Seal Stamp Button */}
              <div className="flex flex-col items-center">
                <button
                  onClick={handleOpenClick}
                  className="group relative flex items-center justify-center focus:outline-none mb-3"
                  aria-label="Buka Undangan"
                >
                  {/* Animated ripple rings */}
                  <span className="absolute -inset-3 rounded-full bg-pink-500/25 animate-ping group-hover:bg-pink-500/40" />
                  <span className="absolute -inset-1.5 rounded-full bg-amber-400/30 animate-pulse" />

                  {/* Romantic Burgundy & Gold Wax Seal Stamp */}
                  <motion.div
                    whileHover={{ scale: 1.08, rotate: 3 }}
                    whileTap={{ scale: 0.94 }}
                    className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#BE185D] via-[#881337] to-[#4A0E17] text-amber-100 shadow-2xl shadow-pink-950/60 border-2 border-amber-300/80 flex flex-col items-center justify-center cursor-pointer p-1"
                  >
                    {/* Inner gold embossed ring */}
                    <div className="w-full h-full rounded-full border border-dashed border-amber-300/40 flex flex-col items-center justify-center bg-black/10">
                      <span className="font-cursive text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-200 to-amber-400 leading-none drop-shadow">
                        r &amp; i
                      </span>
                      <Heart className="w-2.5 h-2.5 text-pink-300 fill-pink-300 mt-0.5 animate-pulse" />
                    </div>
                  </motion.div>
                </button>

                {/* Ultra-Luxury CTA Button (Buka Undangan) */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleOpenClick}
                  className="group relative overflow-hidden inline-flex items-center gap-3 px-8 sm:px-10 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-[#2A050E] via-[#4A0E17] to-[#2A050E] text-amber-100 shadow-[0_10px_28px_rgba(74,14,23,0.45)] hover:shadow-[0_12px_36px_rgba(217,119,6,0.45)] transition-all duration-300 border-2 border-amber-300/80 cursor-pointer"
                >
                  {/* Moving Shimmer Reflection */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

                  {/* Golden Envelope Badge */}
                  <div className="w-6 h-6 rounded-full bg-amber-400/20 border border-amber-300/50 flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5 text-amber-300 group-hover:scale-110 transition-transform" />
                  </div>

                  {/* Luxurious Foil Lettering */}
                  <span className="text-xs sm:text-sm font-serif font-bold tracking-[0.25em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-[#FDE68A] to-amber-300 drop-shadow">
                    Buka Undangan
                  </span>

                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}