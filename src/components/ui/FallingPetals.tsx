"use client";

import React, { useEffect, useRef } from "react";

interface Petal {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
}

const pinkPetalColors = [
  "rgba(251, 113, 133, 0.65)", // Rose Pink 400
  "rgba(244, 114, 182, 0.6)",  // Blossom Pink 400
  "rgba(253, 164, 175, 0.7)",  // Soft Pastel Pink 300
  "rgba(254, 205, 211, 0.65)", // Sakura Blush Pink 200
  "rgba(225, 29, 72, 0.45)",   // Deep Crimson Petal
  "rgba(251, 191, 36, 0.4)",   // Golden Stamen Particle
];

export default function FallingPetals() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const petalCount = window.innerWidth < 768 ? 25 : 45;
    const petals: Petal[] = Array.from({ length: petalCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 9 + 6,
      speedX: (Math.random() - 0.5) * 0.8 + 0.35,
      speedY: Math.random() * 1.0 + 0.5,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 1.8,
      opacity: Math.random() * 0.55 + 0.35,
      color: pinkPetalColors[Math.floor(Math.random() * pinkPetalColors.length)],
    }));

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.65, p.size, Math.PI / 4, 0, 2 * Math.PI);
      ctx.fillStyle = p.color;
      ctx.shadowColor = "rgba(244, 63, 94, 0.25)";
      ctx.shadowBlur = 5;
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        p.y += p.speedY;
        p.x += Math.sin(p.y * 0.006) * 0.9 + p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        drawPetal(p);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 opacity-75"
      aria-hidden="true"
    />
  );
}
