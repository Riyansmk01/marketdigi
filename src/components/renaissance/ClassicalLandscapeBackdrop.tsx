"use client";

import React from "react";
import { motion } from "framer-motion";
import WhitePeacock from "./WhitePeacock";

export default function ClassicalLandscapeBackdrop({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="relative w-full min-h-[92vh] md:min-h-screen overflow-hidden bg-gradient-to-b from-[#F7EBEF] via-[#FCE7EB] to-[#F7EBEF] flex flex-col items-center justify-center">
      {/* 1. Distant Misty Mountains & Sky (Vector Layer) */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-80">
        <svg
          viewBox="0 0 1000 1200"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Soft Pink Misty Sky */}
          <rect width="1000" height="1200" fill="url(#skyGradient)" />

          {/* Far Mountain Ridges (Copperplate Engraved Toile Style) */}
          <path
            d="M0 450 Q250 320, 500 420 Q750 310, 1000 440 L1000 1200 L0 1200 Z"
            fill="url(#mountainGradFar)"
            opacity="0.65"
          />
          <path
            d="M0 560 Q220 440, 480 540 Q760 430, 1000 550 L1000 1200 L0 1200 Z"
            fill="url(#mountainGradMid)"
            opacity="0.8"
          />

          {/* Majestic Center Waterfall Streams */}
          <g opacity="0.85">
            {/* Waterfall Cliffs */}
            <path
              d="M360 720 L640 720 L680 1200 L320 1200 Z"
              fill="#881337"
              opacity="0.15"
            />
            {/* Waterfall Stream 1 (Left) */}
            <path
              d="M380 730 C375 850, 390 1000, 420 1200 C395 1200, 355 980, 365 730 Z"
              fill="url(#waterfallGrad)"
            />
            {/* Waterfall Stream 2 (Main Right) */}
            <path
              d="M560 710 C550 820, 570 1000, 610 1200 C580 1200, 520 950, 530 710 Z"
              fill="url(#waterfallGrad)"
            />
            {/* Mist at waterfall base */}
            <ellipse cx="500" cy="1150" rx="350" ry="120" fill="url(#mistGlow)" />
          </g>

          {/* Distant Flying Flock of White Doves */}
          <g opacity="0.75">
            {[
              { x: 420, y: 380, s: 0.6 },
              { x: 480, y: 360, s: 0.8 },
              { x: 540, y: 390, s: 0.65 },
              { x: 460, y: 410, s: 0.5 },
              { x: 510, y: 430, s: 0.55 },
            ].map((bird, i) => (
              <path
                key={`flock-${i}`}
                d={`M${bird.x} ${bird.y} Q${bird.x + 8 * bird.s} ${bird.y - 8 * bird.s}, ${bird.x + 16 * bird.s} ${bird.y} Q${bird.x + 24 * bird.s} ${bird.y - 8 * bird.s}, ${bird.x + 32 * bird.s} ${bird.y}`}
                stroke="#FFFFFF"
                strokeWidth={1.5 * bird.s}
                fill="none"
                strokeLinecap="round"
              />
            ))}
          </g>

          {/* Classical Roman Stone Arch Ruins - Left Column */}
          <g opacity="0.92">
            {/* Left Arch Pillar & Stones */}
            <path
              d="M0 150 Q90 140, 160 220 L160 850 L0 850 Z"
              fill="url(#stonePillar)"
              stroke="#5C1626"
              strokeWidth="1.2"
            />
            <rect x="30" y="240" width="110" height="35" rx="3" fill="#E5D5D8" stroke="#5C1626" strokeWidth="1" />
            <rect x="40" y="290" width="90" height="420" rx="4" fill="url(#stoneColumn)" stroke="#5C1626" strokeWidth="1" />
            <rect x="25" y="730" width="120" height="45" rx="3" fill="#BAA4A9" stroke="#5C1626" strokeWidth="1.2" />

            {/* Left Arch Curves Top */}
            <path
              d="M0 120 C80 110, 160 170, 200 260 C170 230, 100 170, 0 160 Z"
              fill="url(#stonePillar)"
              stroke="#5C1626"
              strokeWidth="1"
            />
          </g>

          {/* Classical Roman Stone Arch Ruins - Right Column */}
          <g opacity="0.92">
            {/* Right Arch Pillar & Stones */}
            <path
              d="M1000 150 Q910 140, 840 220 L840 850 L1000 850 Z"
              fill="url(#stonePillar)"
              stroke="#5C1626"
              strokeWidth="1.2"
            />
            <rect x="860" y="240" width="110" height="35" rx="3" fill="#E5D5D8" stroke="#5C1626" strokeWidth="1" />
            <rect x="870" y="290" width="90" height="420" rx="4" fill="url(#stoneColumn)" stroke="#5C1626" strokeWidth="1" />
            <rect x="855" y="730" width="120" height="45" rx="3" fill="#BAA4A9" stroke="#5C1626" strokeWidth="1.2" />

            {/* Right Arch Curves Top */}
            <path
              d="M1000 120 C920 110, 840 170, 800 260 C830 230, 900 170, 1000 160 Z"
              fill="url(#stonePillar)"
              stroke="#5C1626"
              strokeWidth="1"
            />
          </g>

          {/* Etched Foliage & Tree Branches (Toile de Jouy Style) */}
          <g fill="#701A28" opacity="0.6">
            {/* Left Foliage Clusters */}
            <circle cx="120" cy="180" r="45" />
            <circle cx="160" cy="150" r="55" />
            <circle cx="90" cy="130" r="40" />
            <circle cx="180" cy="220" r="50" />
            <circle cx="140" cy="550" r="45" />
            <circle cx="170" cy="620" r="55" />

            {/* Right Foliage Clusters */}
            <circle cx="880" cy="180" r="45" />
            <circle cx="840" cy="150" r="55" />
            <circle cx="910" cy="130" r="40" />
            <circle cx="820" cy="220" r="50" />
            <circle cx="860" cy="550" r="45" />
            <circle cx="830" cy="620" r="55" />
          </g>

          <defs>
            <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FCE7EB" />
              <stop offset="60%" stopColor="#FFF5F7" />
              <stop offset="100%" stopColor="#F9D4DC" />
            </linearGradient>
            <linearGradient id="mountainGradFar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E5B2BD" />
              <stop offset="100%" stopColor="#CA7D8E" />
            </linearGradient>
            <linearGradient id="mountainGradMid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#BA6678" />
              <stop offset="100%" stopColor="#8A2B3E" />
            </linearGradient>
            <linearGradient id="waterfallGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#FFF1F4" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#FBCFE8" stopOpacity="0.6" />
            </linearGradient>
            <radialGradient id="mistGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#FCE7EB" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FCE7EB" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="stonePillar" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F2E6E8" />
              <stop offset="50%" stopColor="#DFC8CC" />
              <stop offset="100%" stopColor="#BA9EA4" />
            </linearGradient>
            <linearGradient id="stoneColumn" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D5BAC0" />
              <stop offset="50%" stopColor="#F4EAEC" />
              <stop offset="100%" stopColor="#BA9EA4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 2. Left White Peacock Perched on Arch Balustrade (Exact Replica of Image 2 & 3) */}
      <div className="absolute left-2 sm:left-6 md:left-14 bottom-14 sm:bottom-20 w-24 sm:w-36 md:w-44 z-20 pointer-events-none">
        <WhitePeacock direction="right" />
      </div>

      {/* 3. Right White Peacock Perched on Arch Balustrade (Exact Replica of Image 2 & 3) */}
      <div className="absolute right-2 sm:right-6 md:right-14 bottom-14 sm:bottom-20 w-24 sm:w-36 md:w-44 z-20 pointer-events-none">
        <WhitePeacock direction="left" />
      </div>

      {/* 4. Foreground Content (Hero Card / Monogram / Titles) */}
      <div className="relative z-20 w-full flex flex-col items-center">
        {children}
      </div>
    </div>
  );
}
