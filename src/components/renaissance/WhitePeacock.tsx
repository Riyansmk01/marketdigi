"use client";

import React from "react";
import { motion } from "framer-motion";

export default function WhitePeacock({
  direction = "right",
  className = "",
}: {
  direction?: "left" | "right";
  className?: string;
}) {
  const isLeft = direction === "left";

  return (
    <motion.div
      animate={{
        y: [-4, 4, -4],
        rotate: isLeft ? [0, 1.5, 0] : [0, -1.5, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`relative select-none pointer-events-none ${className}`}
      style={{ transform: isLeft ? "scaleX(-1)" : "none" }}
    >
      <svg
        viewBox="0 0 160 260"
        className="w-full h-full filter drop-shadow-[0_10px_20px_rgba(74,14,23,0.35)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Long Cascading Tail Feathers */}
        <g opacity="0.95">
          {/* Main plume curves */}
          <path
            d="M50 140 C40 180, 20 220, 10 260 C25 240, 45 200, 60 160 Z"
            fill="url(#tailGrad1)"
          />
          <path
            d="M60 145 C55 190, 40 235, 25 260 C40 235, 60 195, 70 165 Z"
            fill="url(#tailGrad2)"
          />
          <path
            d="M70 150 C70 195, 60 240, 45 260 C60 235, 78 190, 80 160 Z"
            fill="url(#tailGrad1)"
          />
          {/* Peacock eye feathers in white & gold */}
          {[
            { cx: 35, cy: 190, r: 7 },
            { cx: 25, cy: 230, r: 6.5 },
            { cx: 50, cy: 210, r: 7 },
            { cx: 40, cy: 245, r: 6 },
            { cx: 62, cy: 180, r: 6.5 },
          ].map((eye, i) => (
            <g key={`eye-${i}`}>
              <ellipse
                cx={eye.cx}
                cy={eye.cy}
                rx={eye.r * 1.3}
                ry={eye.r * 0.9}
                fill="#FFF1F4"
                stroke="#FCD34D"
                strokeWidth="1.2"
              />
              <circle cx={eye.cx} cy={eye.cy} r={eye.r * 0.55} fill="#FB7185" />
              <circle cx={eye.cx} cy={eye.cy} r={eye.r * 0.25} fill="#701A28" />
            </g>
          ))}
        </g>

        {/* Perching Stone / Balustrade */}
        <path
          d="M30 175 L120 175 L110 200 L20 200 Z"
          fill="url(#stoneGrad)"
          stroke="#5C1626"
          strokeWidth="0.8"
          opacity="0.85"
        />

        {/* Body of the White Peacock */}
        <path
          d="M60 160 C50 140, 48 105, 62 80 C68 68, 78 55, 88 40 C95 30, 105 24, 114 26 C120 28, 122 36, 116 45 C108 58, 98 75, 96 95 C94 115, 98 135, 90 155 C82 170, 68 170, 60 160 Z"
          fill="url(#peacockBody)"
        />

        {/* Folded Wing Detail */}
        <path
          d="M68 95 C62 115, 64 140, 78 155 C74 140, 72 120, 78 102 Z"
          fill="#FFF5F7"
          opacity="0.8"
        />
        <path
          d="M74 105 C70 122, 72 142, 85 152 C80 138, 78 122, 84 108 Z"
          fill="#FCE7EB"
          opacity="0.9"
        />

        {/* Graceful S-Curved Neck & Head */}
        <path
          d="M86 42 C94 28, 104 22, 114 25 C122 28, 124 38, 115 48 C106 60, 95 80, 92 100 L84 96 C86 78, 94 60, 86 42 Z"
          fill="#FFFFFF"
        />
        <circle cx="114" cy="27" r="7.5" fill="#FFFFFF" />

        {/* Beak with Gold Accent */}
        <path d="M121 27 L132 30 L121 32 Z" fill="#F59E0B" />
        <circle cx="116" cy="26" r="1.3" fill="#4A0E17" />

        {/* Regal Golden Crown Crest (Mahkota Merak) */}
        <g stroke="#FCD34D" strokeWidth="1.2" strokeLinecap="round">
          <line x1="114" y1="20" x2="110" y2="7" />
          <line x1="115" y1="20" x2="116" y2="5" />
          <line x1="116" y1="20" x2="122" y2="8" />
          <circle cx="110" cy="7" r="2.2" fill="#F59E0B" stroke="none" />
          <circle cx="116" cy="5" r="2.5" fill="#E11D48" stroke="none" />
          <circle cx="122" cy="8" r="2.2" fill="#F59E0B" stroke="none" />
        </g>

        {/* Delicate Pink Rose Flower at base of perch */}
        <g transform="translate(68, 160) scale(0.45)">
          <circle cx="20" cy="20" r="18" fill="#FB7185" />
          <circle cx="20" cy="20" r="12" fill="#E11D48" />
          <circle cx="20" cy="20" r="6" fill="#881337" />
          <circle cx="20" cy="20" r="2" fill="#FDE047" />
        </g>

        <defs>
          <linearGradient id="peacockBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#FFF1F4" />
            <stop offset="100%" stopColor="#FCE7EB" />
          </linearGradient>
          <linearGradient id="tailGrad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#FFF1F4" />
            <stop offset="100%" stopColor="#FBCFE8" />
          </linearGradient>
          <linearGradient id="tailGrad2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF5F7" />
            <stop offset="60%" stopColor="#FCE7EB" />
            <stop offset="100%" stopColor="#F9A8D4" />
          </linearGradient>
          <linearGradient id="stoneGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E5D5D8" />
            <stop offset="100%" stopColor="#BAA4A9" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
