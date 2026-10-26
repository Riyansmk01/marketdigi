"use client";

import React from "react";
import { motion } from "framer-motion";

// Flying White Romantic Dove (Burung Merpati Putih)
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

// Realistic Botanical Corner Bouquet (Uses Transparent Watercolor Floral Artwork)
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
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute pointer-events-none select-none z-10 w-44 h-44 sm:w-60 sm:h-60 md:w-72 md:h-72 ${
        isRight ? "right-0" : "left-0"
      } ${isBottom ? "bottom-0" : "top-0"} ${className}`}
      style={{
        transform: `${isRight ? "scaleX(-1)" : ""} ${isBottom ? "scaleY(-1)" : ""}`,
      }}
    >
      <img
        src="/images/realistic-corner-transparent.png"
        alt="Botanical Flower Accent"
        className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.25)]"
      />
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
        <div className="w-7 h-7 rounded-full overflow-hidden border border-pink-300 flex items-center justify-center shadow-sm">
          <img
            src="/images/realistic-corner-transparent.png"
            alt="Rose Accent"
            className="w-full h-full object-cover scale-150"
          />
        </div>
        <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
      </div>
      <div className="w-24 sm:w-40 h-[1px] bg-gradient-to-r from-pink-500 via-pink-400 to-transparent" />
    </div>
  );
}