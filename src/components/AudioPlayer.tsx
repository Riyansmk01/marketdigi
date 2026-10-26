"use client";

import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Disc3 } from "lucide-react";
import { motion } from "framer-motion";

interface AudioPlayerProps {
  autoPlayTrigger?: boolean;
}

// Gentle romantic acoustic chord progression (D - F#m - G - A)
const MELODY_NOTES = [
  // D Major
  293.66, 369.99, 440.0, 587.33,
  // F# Minor
  369.99, 440.0, 554.37, 739.99,
  // G Major
  392.0, 493.88, 587.33, 783.99,
  // A Major
  440.0, 554.37, 659.25, 880.0,
];

export default function AudioPlayer({ autoPlayTrigger = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const noteIndexRef = useRef(0);
  const customAudioRef = useRef<HTMLAudioElement | null>(null);

  // Play a soft bell/music-box chime tone
  const playTone = (freq: number) => {
    if (!audioCtxRef.current || audioCtxRef.current.state !== "running") return;
    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 2.3);
    } catch {
      // Audio node cleanup safe
    }
  };

  const startChimeMelody = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }

    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }

    if (timerRef.current) clearInterval(timerRef.current);

    noteIndexRef.current = 0;
    playTone(MELODY_NOTES[0]);

    timerRef.current = setInterval(() => {
      noteIndexRef.current = (noteIndexRef.current + 1) % MELODY_NOTES.length;
      playTone(MELODY_NOTES[noteIndexRef.current]);
    }, 650);

    setIsPlaying(true);
  };

  const stopMusic = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (customAudioRef.current) {
      customAudioRef.current.pause();
    }
    setIsPlaying(false);
  };

  const startMusic = () => {
    // Check if custom audio file exists first
    const customAudio = new Audio("/audio/wedding.mp3");
    customAudio
      .play()
      .then(() => {
        customAudio.loop = true;
        customAudio.volume = 0.5;
        customAudioRef.current = customAudio;
        setIsPlaying(true);
      })
      .catch(() => {
        // Fallback to soothing acoustic chime music box
        startChimeMelody();
      });
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  };

  useEffect(() => {
    if (autoPlayTrigger && !isPlaying) {
      startMusic();
    }
  }, [autoPlayTrigger]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="fixed top-6 right-6 z-40">
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={togglePlay}
        aria-label="Toggle Background Music"
        className="group relative flex items-center gap-2 pl-2 pr-3.5 py-1.5 rounded-full bg-stone-900/85 backdrop-blur-md text-amber-300 shadow-xl border border-amber-400/40 transition-all duration-300"
      >
        {/* Spinning Vinyl Record */}
        <div className="relative w-8 h-8 rounded-full bg-stone-950 border border-amber-400/60 flex items-center justify-center overflow-hidden">
          <Disc3
            className={`w-6 h-6 text-amber-300 transition-transform ${
              isPlaying ? "animate-spin" : ""
            }`}
            style={{ animationDuration: "3s" }}
          />
          <div className="absolute w-2 h-2 rounded-full bg-amber-400" />
        </div>

        {/* Music Soundwave animation or status */}
        <div className="flex items-center gap-1.5">
          {isPlaying ? (
            <div className="flex items-end gap-0.5 h-3">
              <span className="w-0.5 h-3 bg-amber-400 rounded-full animate-pulse" />
              <span className="w-0.5 h-2 bg-amber-300 rounded-full animate-bounce" />
              <span className="w-0.5 h-3.5 bg-amber-400 rounded-full animate-pulse delay-75" />
            </div>
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-stone-400" />
          )}
          <span className="text-[11px] font-medium tracking-wider text-amber-200 uppercase">
            {isPlaying ? "Music" : "Mute"}
          </span>
        </div>
      </motion.button>
    </div>
  );
}
