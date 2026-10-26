"use client";

import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Disc3, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AudioPlayerProps {
  autoPlayTrigger?: boolean;
}

export default function AudioPlayer({ autoPlayTrigger = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Official song: Sal Priadi - Kita Usahakan Rumah Itu
    const audio = new Audio("/audio/sal-priadi-kita-usahakan-rumah-itu.mp3");
    audio.loop = true;
    audio.volume = 0.6;
    audioRef.current = audio;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.pause();
      audio.src = "";
    };
  }, []);

  useEffect(() => {
    if (autoPlayTrigger && audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.warn("Autoplay was prevented by browser policy:", err);
      });
    }
  }, [autoPlayTrigger]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((e) => console.log("Play error:", e));
    }
  };

  return (
    <div className="fixed top-5 right-5 z-40">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={togglePlay}
        aria-label="Toggle Background Music"
        className="group relative flex items-center gap-2.5 pl-2 pr-3.5 py-1.5 rounded-full bg-stone-900/90 backdrop-blur-md text-amber-300 shadow-2xl border border-amber-400/40 transition-all duration-300"
      >
        {/* Spinning Vinyl Record Disc */}
        <div className="relative w-8 h-8 rounded-full bg-stone-950 border border-amber-400/60 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
          <Disc3
            className={`w-6 h-6 text-amber-300 transition-transform ${
              isPlaying ? "animate-spin" : ""
            }`}
            style={{ animationDuration: "3.5s" }}
          />
          <div className="absolute w-2 h-2 rounded-full bg-amber-400" />
        </div>

        {/* Song Info & Equalizer Indicator */}
        <div className="flex flex-col text-left max-w-[130px] sm:max-w-[160px] overflow-hidden">
          <div className="flex items-center gap-1.5">
            {isPlaying ? (
              <div className="flex items-end gap-0.5 h-2.5 shrink-0">
                <span className="w-0.5 h-2.5 bg-amber-400 rounded-full animate-pulse" />
                <span className="w-0.5 h-1.5 bg-amber-300 rounded-full animate-bounce" />
                <span className="w-0.5 h-3 bg-amber-400 rounded-full animate-pulse delay-75" />
              </div>
            ) : (
              <VolumeX className="w-3 h-3 text-stone-400 shrink-0" />
            )}
            <span className="text-[10px] font-bold text-amber-200 tracking-wider uppercase truncate">
              {isPlaying ? "Memutar Lagu" : "Musik Jeda"}
            </span>
          </div>

          <span className="text-[9px] text-stone-300 truncate font-light">
            Sal Priadi &bull; Kita Usahakan Rumah Itu
          </span>
        </div>
      </motion.button>
    </div>
  );
}
