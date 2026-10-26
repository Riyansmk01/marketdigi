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
  const isRight = position.includes("right");
  const isBottom = position.includes("bottom");

  // Original image corner is TOP-LEFT.
  // To place in top-right, flip horizontally: scaleX(-1).
  // To place in bottom-left, flip vertically: scaleY(-1).
  // To place in bottom-right, flip both: scaleX(-1) scaleY(-1).
  const transform = `scale(${scale}) ${isRight ? "scaleX(-1)" : "scaleX(1)"} ${isBottom ? "scaleY(-1)" : "scaleY(1)"}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute pointer-events-none select-none z-20 w-32 h-32 sm:w-44 sm:h-44 md:w-52 md:h-52 ${
        isRight ? "-right-2 sm:-right-3" : "-left-2 sm:-left-3"
      } ${isBottom ? "-bottom-2 sm:-bottom-3" : "-top-2 sm:-top-3"} ${className}`}
      style={{
        transform,
        transformOrigin: `${isRight ? "right" : "left"} ${isBottom ? "bottom" : "top"}`,
      }}
    >
      <img
        src="/images/realistic-corner-transparent.png"
        alt="Realistic Botanical Corner Flower"
        className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)]"
      />
    </motion.div>
  );
}

// Photorealistic Botanical Image Corner for Sections and Cards
export function RealisticBotanicalImageCorner({
  position = "top-right",
  className = "",
  size = "w-32 sm:w-40 md:w-48",
}: {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  className?: string;
  size?: string;
}) {
  const isRight = position.includes("right");
  const isBottom = position.includes("bottom");

  const transform = `${isRight ? "scaleX(-1)" : "scaleX(1)"} ${isBottom ? "scaleY(-1)" : "scaleY(1)"}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute pointer-events-none select-none z-20 ${size} aspect-square ${
        isRight ? "-right-2 sm:-right-3" : "-left-2 sm:-left-3"
      } ${isBottom ? "-bottom-2 sm:-bottom-3" : "-top-2 sm:-top-3"} ${className}`}
      style={{
        transform,
        transformOrigin: `${isRight ? "right" : "left"} ${isBottom ? "bottom" : "top"}`,
      }}
    >
      <img
        src="/images/realistic-corner-transparent.png"
        alt="Realistic Botanical Flower"
        className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.2)]"
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