"use client";

import React from "react";
import { motion } from "framer-motion";

// Photorealistic Watercolor Botanical Corner Bouquet (Exact Artwork from User Image 3)
export function RealisticCornerBouquet({
  position = "top-right",
  className = "",
  scale = 1,
}: {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  className?: string;
  scale?: number;
}) {
  const isLeft = position.includes("left");
  const isBottom = position.includes("bottom");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute pointer-events-none select-none z-20 w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 ${
        isLeft ? "-left-4 sm:-left-6" : "-right-4 sm:-right-6"
      } ${isBottom ? "-bottom-4 sm:-bottom-6" : "-top-4 sm:-top-6"} ${className}`}
      style={{
        transform: `scale(${scale}) ${isLeft ? "scaleX(-1)" : ""} ${isBottom ? "scaleY(-1)" : ""}`,
      }}
    >
      <img
        src="/images/realistic-corner-transparent.png"
        alt="Realistic Botanical Corner Flower"
        className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
      />
    </motion.div>
  );
}

// Photorealistic Botanical Image Corner for Sections and Cards
export function RealisticBotanicalImageCorner({
  position = "top-right",
  className = "",
  size = "w-36 sm:w-48 md:w-56",
}: {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  className?: string;
  size?: string;
}) {
  const isLeft = position.includes("left");
  const isBottom = position.includes("bottom");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute pointer-events-none select-none z-20 ${size} aspect-square ${
        isLeft ? "-left-4 sm:-left-6" : "-right-4 sm:-right-6"
      } ${isBottom ? "-bottom-4 sm:-bottom-6" : "-top-4 sm:-top-6"} ${className}`}
      style={{
        transform: `${isLeft ? "scaleX(-1)" : ""} ${isBottom ? "scaleY(-1)" : ""}`,
      }}
    >
      <img
        src="/images/realistic-corner-transparent.png"
        alt="Realistic Botanical Flower"
        className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.22)]"
      />
    </motion.div>
  );
}

// Elegant Botanical Header Garland & Divider (No cartoonish circles)
export function RealisticHeaderGarland({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full flex items-center justify-center my-6 pointer-events-none select-none ${className}`}>
      {/* Left gold filigree line */}
      <div className="w-16 sm:w-28 h-[1px] bg-gradient-to-r from-transparent via-[#BE185D]/60 to-[#881337]" />
      
      {/* Center realistic flower motif */}
      <div className="mx-3.5 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm border border-pink-200">
          <img
            src="/images/realistic-corner-transparent.png"
            alt="Flower Accent"
            className="w-full h-full object-cover scale-150"
          />
        </div>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
      </div>

      {/* Right gold filigree line */}
      <div className="w-16 sm:w-28 h-[1px] bg-gradient-to-r from-[#881337] via-[#BE185D]/60 to-transparent" />
    </div>
  );
}