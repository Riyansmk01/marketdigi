"use client";

import React from "react";
import { motion } from "framer-motion";

// Flying White Romantic Dove (Burung Merpati Putih 3D / Dimensi)
export function FlyingDove({
  className = "",
  direction = "right",
  delay = 0,
}: {
  className?: string;
  direction?: "left" | "right";
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ y: 0, x: 0, rotate: 0 }}
      animate={{
        y: [-8, 8, -8],
        x: direction === "right" ? [-6, 6, -6] : [6, -6, 6],
        rotate: direction === "right" ? [-2, 3, -2] : [2, -3, 2],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      className={`pointer-events-none select-none ${className}`}
    >
      <svg
        viewBox="0 0 100 80"
        className="w-full h-full drop-shadow-[0_8px_16px_rgba(244,114,182,0.35)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: direction === "left" ? "scaleX(-1)" : "none" }}
      >
        {/* Soft Wing Shadow */}
        <path
          d="M30 45 C45 20, 70 10, 85 5 C75 25, 55 42, 45 46 Z"
          fill="rgba(251, 207, 216, 0.5)"
        />
        {/* Main Upper Wing */}
        <path
          d="M25 40 C38 12, 65 3, 80 0 C68 20, 50 38, 40 42 Z"
          fill="url(#doveWingGrad)"
        />
        {/* Bird Body */}
        <path
          d="M10 50 C18 42, 32 38, 48 44 C58 48, 68 55, 78 50 C70 56, 55 60, 42 58 C28 56, 18 62, 5 65 C8 58, 8 54, 10 50 Z"
          fill="url(#doveBodyGrad)"
        />
        {/* Head & Beak with Olive Branch */}
        <circle cx="78" cy="48" r="7" fill="#FFFFFF" />
        <path d="M85 48 L93 50 L85 52 Z" fill="#F59E0B" />
        <circle cx="80" cy="47" r="1.2" fill="#881337" />
        {/* Olive / Flower twig in beak */}
        <path
          d="M90 50 Q96 46, 100 52 M94 48 Q97 45, 96 43 M97 51 Q100 50, 101 48"
          stroke="#15803D"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="97" cy="44" r="1.5" fill="#FB7185" />
        <circle cx="101" cy="49" r="1.5" fill="#F472B6" />

        {/* Lower Wing */}
        <path
          d="M32 46 C42 32, 60 28, 70 26 C62 38, 48 50, 40 52 Z"
          fill="#FFFFFF"
          opacity="0.9"
        />

        <defs>
          <linearGradient id="doveWingGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#FFF1F4" />
            <stop offset="100%" stopColor="#FCE7EB" />
          </linearGradient>
          <linearGradient id="doveBodyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#FFF5F7" />
            <stop offset="100%" stopColor="#FBCFE8" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

// 3D Dimensional Corner Floral Bouquet (Bunga Mewah Berdimensi)
export function DimensionalFloralCorner({
  position = "top-left",
  className = "",
}: {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}) {
  const isRight = position.includes("right");
  const isBottom = position.includes("bottom");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute pointer-events-none select-none z-10 w-44 h-44 sm:w-60 sm:h-60 md:w-72 md:h-72 ${
        isRight ? "right-0" : "left-0"
      } ${isBottom ? "bottom-0" : "top-0"} ${className}`}
      style={{
        transform: `${isRight ? "scaleX(-1)" : ""} ${isBottom ? "scaleY(-1)" : ""}`,
      }}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full filter drop-shadow-[0_12px_24px_rgba(244,63,94,0.18)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Layer 1 - Deep Green Leaves with dimensional shading */}
        <g opacity="0.85">
          <path
            d="M0 0 Q40 50, 60 90 Q30 75, 10 65 Z"
            fill="url(#leafGrad1)"
          />
          <path
            d="M0 0 Q60 30, 110 50 Q85 30, 65 15 Z"
            fill="url(#leafGrad2)"
          />
          <path
            d="M15 15 Q70 70, 95 120 Q65 105, 45 80 Z"
            fill="url(#leafGrad1)"
          />
          <path
            d="M30 0 Q90 40, 140 45 Q110 30, 80 15 Z"
            fill="url(#leafGrad2)"
          />
        </g>

        {/* Layer 2 - Golden Botanical Sprigs */}
        <g stroke="#EAB308" strokeWidth="1.2" strokeLinecap="round" opacity="0.65">
          <path d="M0 0 Q50 60, 90 80 M45 45 Q60 40, 70 35 M65 65 Q80 60, 88 55" />
          <circle cx="70" cy="35" r="2.5" fill="#FDE047" stroke="none" />
          <circle cx="88" cy="55" r="2.5" fill="#FDE047" stroke="none" />
          <circle cx="90" cy="80" r="3" fill="#FDE047" stroke="none" />
        </g>

        {/* Layer 3 - Large Corner Peony (Pink Blossom) */}
        <g transform="translate(15, 15)">
          {/* Outer Petals */}
          <circle cx="35" cy="35" r="34" fill="url(#peonyOuter)" opacity="0.9" />
          <ellipse cx="25" cy="45" rx="22" ry="16" fill="#FDA4AF" opacity="0.8" />
          <ellipse cx="45" cy="25" rx="16" ry="22" fill="#F472B6" opacity="0.8" />
          {/* Mid Layer Petals */}
          <circle cx="35" cy="35" r="24" fill="url(#peonyMid)" />
          <ellipse cx="38" cy="30" rx="15" ry="12" fill="#FB7185" />
          <ellipse cx="30" cy="38" rx="12" ry="15" fill="#F43F5E" />
          {/* Inner Blooming Core */}
          <circle cx="35" cy="35" r="14" fill="url(#peonyCore)" />
          <circle cx="35" cy="35" r="6" fill="#FDE047" />
          <circle cx="33" cy="34" r="2" fill="#B45309" />
          <circle cx="37" cy="36" r="1.5" fill="#B45309" />
        </g>

        {/* Layer 4 - Secondary Rose Blossom */}
        <g transform="translate(85, 20) scale(0.65)">
          <circle cx="30" cy="30" r="28" fill="url(#peonyOuter)" />
          <circle cx="30" cy="30" r="18" fill="url(#peonyMid)" />
          <circle cx="30" cy="30" r="10" fill="url(#peonyCore)" />
          <circle cx="30" cy="30" r="4" fill="#FDE047" />
        </g>

        {/* Layer 5 - Bottom Blossom */}
        <g transform="translate(20, 85) scale(0.65)">
          <circle cx="30" cy="30" r="28" fill="url(#peonyOuter)" />
          <circle cx="30" cy="30" r="18" fill="url(#peonyMid)" />
          <circle cx="30" cy="30" r="10" fill="url(#peonyCore)" />
          <circle cx="30" cy="30" r="4" fill="#FDE047" />
        </g>

        {/* Layer 6 - Floating Soft Sakura Buds */}
        <circle cx="120" cy="65" r="6" fill="#FDA4AF" opacity="0.8" />
        <circle cx="135" cy="50" r="4" fill="#FB7185" opacity="0.8" />
        <circle cx="65" cy="120" r="6" fill="#FDA4AF" opacity="0.8" />
        <circle cx="50" cy="135" r="4" fill="#FB7185" opacity="0.8" />

        <defs>
          <linearGradient id="leafGrad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="70%" stopColor="#15803D" />
            <stop offset="100%" stopColor="#14532D" />
          </linearGradient>
          <linearGradient id="leafGrad2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#16A34A" />
          </linearGradient>
          <radialGradient id="peonyOuter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDA4AF" />
            <stop offset="80%" stopColor="#FB7185" />
            <stop offset="100%" stopColor="#F43F5E" />
          </radialGradient>
          <radialGradient id="peonyMid" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FB7185" />
            <stop offset="80%" stopColor="#E11D48" />
            <stop offset="100%" stopColor="#BE185D" />
          </radialGradient>
          <radialGradient id="peonyCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#BE185D" />
            <stop offset="100%" stopColor="#881337" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

// Romantic Rose Ribbon Divider
export function FloralSectionDivider() {
  return (
    <div className="relative w-full flex items-center justify-center my-12 pointer-events-none select-none">
      <div className="w-24 sm:w-40 h-[1px] bg-gradient-to-r from-transparent via-pink-400 to-pink-500" />
      <div className="mx-4 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
        <div className="w-7 h-7 rounded-full bg-pink-100 border border-pink-300 flex items-center justify-center shadow-sm">
          <span className="text-xs text-pink-600 font-serif">🌸</span>
        </div>
        <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
      </div>
      <div className="w-24 sm:w-40 h-[1px] bg-gradient-to-r from-pink-500 via-pink-400 to-transparent" />
    </div>
  );
}
