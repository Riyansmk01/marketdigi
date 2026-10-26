"use client";

import React from "react";
import { motion } from "framer-motion";

// Realistic Image-Based Botanical Rose Corner (Using generated photorealistic watercolor artwork)
export function RealisticBotanicalImageCorner({
  position = "top-right",
  className = "",
  size = "w-40 sm:w-52 md:w-60",
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
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute pointer-events-none select-none z-20 ${size} aspect-square ${
        isLeft ? "-left-4 sm:-left-6" : "-right-4 sm:-right-6"
      } ${isBottom ? "-bottom-4 sm:-bottom-6" : "-top-4 sm:-top-6"} ${className}`}
      style={{
        transform: `${isLeft ? "scaleX(-1)" : ""} ${isBottom ? "scaleY(-1)" : ""}`,
      }}
    >
      <img
        src="/images/realistic-rose-corner.jpg"
        alt="Botanical Flower Accent"
        className="w-full h-full object-contain mix-blend-multiply filter drop-shadow-[0_8px_16px_rgba(112,26,40,0.25)]"
      />
    </motion.div>
  );
}

// Vector Realistic Corner Bouquet (Crisp fallback & multi-layer floral decoration)
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
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute pointer-events-none select-none z-20 w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 ${
        isLeft ? "-left-4 sm:-left-6" : "-right-4 sm:-right-6"
      } ${isBottom ? "-bottom-4 sm:-bottom-6" : "-top-4 sm:-top-6"} ${className}`}
      style={{
        transform: `scale(${scale}) ${isLeft ? "scaleX(-1)" : ""} ${isBottom ? "scaleY(-1)" : ""}`,
      }}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full filter drop-shadow-[0_12px_24px_rgba(74,14,23,0.38)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Deep Green Botanical Leaves with Leaf Veins */}
        <g opacity="0.95">
          <path
            d="M90 30 Q145 25, 175 75 Q130 85, 105 55 Z"
            fill="url(#realLeafGrad1)"
            stroke="#14532D"
            strokeWidth="0.8"
          />
          <path d="M100 40 Q135 48, 165 70" stroke="#4ADE80" strokeWidth="0.75" strokeLinecap="round" opacity="0.7" />

          <path
            d="M60 50 Q110 30, 150 65 Q115 80, 80 65 Z"
            fill="url(#realLeafGrad2)"
            stroke="#166534"
            strokeWidth="0.8"
          />

          <path
            d="M120 70 Q160 85, 180 135 Q135 130, 115 100 Z"
            fill="url(#realLeafGrad1)"
            stroke="#14532D"
            strokeWidth="0.8"
          />
        </g>

        {/* Golden Herb Sprigs & Berry Seeds */}
        <g stroke="#EAB308" strokeWidth="1.2" strokeLinecap="round" opacity="0.75">
          <path d="M70 20 Q120 20, 155 45 M115 28 Q130 18, 140 12 M135 38 Q155 30, 165 24" />
          <circle cx="140" cy="12" r="3" fill="#FDE047" stroke="none" />
          <circle cx="165" cy="24" r="3.5" fill="#FACC15" stroke="none" />
          <circle cx="155" cy="45" r="3" fill="#FDE047" stroke="none" />
        </g>

        {/* Main Realistic Blooming Dark Crimson Peony / Rose */}
        <g transform="translate(75, 45)">
          <ellipse cx="45" cy="45" rx="42" ry="38" fill="url(#realRoseDark)" opacity="0.95" />
          <path
            d="M10 45 C10 15, 80 15, 80 45 C80 75, 10 75, 10 45 Z"
            fill="url(#realRoseMid)"
            opacity="0.9"
          />
          <path
            d="M20 38 C25 18, 68 18, 72 38 C75 58, 18 58, 20 38 Z"
            fill="url(#realRoseCrimson)"
          />
          <path
            d="M30 48 C20 30, 70 24, 62 48 C55 68, 38 65, 30 48 Z"
            fill="url(#realRoseBlush)"
          />
          <path
            d="M34 40 C36 28, 54 28, 56 40 C58 52, 32 52, 34 40 Z"
            fill="url(#realRoseCore)"
          />
          <path
            d="M38 43 C40 34, 50 34, 52 43 C54 50, 36 50, 38 43 Z"
            fill="#5C1626"
          />
          <circle cx="45" cy="44" r="4.5" fill="#FDE047" />
          <circle cx="43" cy="43" r="1.5" fill="#78350F" />
          <circle cx="47" cy="45" r="1.2" fill="#78350F" />
        </g>

        {/* Secondary Realistic Dusty Rose Flower */}
        <g transform="translate(18, 65) scale(0.72)">
          <ellipse cx="40" cy="40" rx="36" ry="32" fill="url(#realRoseCrimson)" />
          <circle cx="40" cy="40" r="26" fill="url(#realRoseBlush)" />
          <circle cx="40" cy="40" r="16" fill="url(#realRoseCore)" />
          <circle cx="40" cy="40" r="6" fill="#FDE047" />
        </g>

        {/* Tertiary Blossom */}
        <g transform="translate(110, 105) scale(0.65)">
          <ellipse cx="35" cy="35" rx="30" ry="26" fill="url(#realRoseBlush)" />
          <circle cx="35" cy="35" r="18" fill="url(#realRoseCrimson)" />
          <circle cx="35" cy="35" r="10" fill="url(#realRoseCore)" />
          <circle cx="35" cy="35" r="4" fill="#FDE047" />
        </g>

        {/* Baby Pink Sakura Accent Buds */}
        <circle cx="35" cy="40" r="7" fill="#FDA4AF" />
        <circle cx="45" cy="25" r="5" fill="#FB7185" />
        <circle cx="155" cy="130" r="7" fill="#FDA4AF" />
        <circle cx="170" cy="115" r="5" fill="#FB7185" />

        <defs>
          <linearGradient id="realLeafGrad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#15803D" />
            <stop offset="60%" stopColor="#166534" />
            <stop offset="100%" stopColor="#052E16" />
          </linearGradient>
          <linearGradient id="realLeafGrad2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="60%" stopColor="#15803D" />
            <stop offset="100%" stopColor="#14532D" />
          </linearGradient>

          <radialGradient id="realRoseDark" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#881337" />
            <stop offset="70%" stopColor="#5C1626" />
            <stop offset="100%" stopColor="#3B0713" />
          </radialGradient>
          <radialGradient id="realRoseMid" cx="45%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#BE185D" />
            <stop offset="65%" stopColor="#9F1239" />
            <stop offset="100%" stopColor="#5C1626" />
          </radialGradient>
          <radialGradient id="realRoseCrimson" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#E11D48" />
            <stop offset="70%" stopColor="#BE185D" />
            <stop offset="100%" stopColor="#881337" />
          </radialGradient>
          <radialGradient id="realRoseBlush" cx="45%" cy="35%" r="55%">
            <stop offset="0%" stopColor="#FDA4AF" />
            <stop offset="60%" stopColor="#FB7185" />
            <stop offset="100%" stopColor="#E11D48" />
          </radialGradient>
          <radialGradient id="realRoseCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#9F1239" />
            <stop offset="70%" stopColor="#5C1626" />
            <stop offset="100%" stopColor="#4A0E17" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

// Realistic Floral Header Garland
export function RealisticHeaderGarland({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full flex items-center justify-center my-6 pointer-events-none select-none ${className}`}>
      <div className="w-16 sm:w-28 h-[1px] bg-gradient-to-r from-transparent via-[#BE185D]/60 to-[#881337]" />
      <div className="mx-3 flex items-center gap-2">
        <svg viewBox="0 0 120 40" className="w-24 sm:w-32 h-8 filter drop-shadow-sm" fill="none">
          <path d="M10 20 Q60 12, 110 20" stroke="#166534" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M25 18 Q35 10, 40 8 M75 18 Q85 10, 90 8" stroke="#22C55E" strokeWidth="1" strokeLinecap="round" />
          <ellipse cx="40" cy="8" rx="4" ry="2.5" fill="#15803D" />
          <ellipse cx="90" cy="8" rx="4" ry="2.5" fill="#15803D" />

          <circle cx="60" cy="20" r="14" fill="#881337" />
          <circle cx="60" cy="20" r="10" fill="#BE185D" />
          <circle cx="60" cy="20" r="6" fill="#FB7185" />
          <circle cx="60" cy="20" r="2" fill="#FDE047" />

          <circle cx="35" cy="20" r="8" fill="#E11D48" />
          <circle cx="35" cy="20" r="5" fill="#FDA4AF" />

          <circle cx="85" cy="20" r="8" fill="#E11D48" />
          <circle cx="85" cy="20" r="5" fill="#FDA4AF" />
        </svg>
      </div>
      <div className="w-16 sm:w-28 h-[1px] bg-gradient-to-r from-[#881337] via-[#BE185D]/60 to-transparent" />
    </div>
  );
}
