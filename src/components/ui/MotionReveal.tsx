"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface MotionRevealProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "zoom" | "fade";
  delay?: number;
  duration?: number;
  className?: string;
}

export default function MotionReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.8,
  className = "",
  ...rest
}: MotionRevealProps) {
  const getInitial = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: 45 };
      case "down":
        return { opacity: 0, y: -45 };
      case "left":
        return { opacity: 0, x: 50 };
      case "right":
        return { opacity: 0, x: -50 };
      case "zoom":
        return { opacity: 0, scale: 0.92 };
      case "fade":
      default:
        return { opacity: 0 };
    }
  };

  const getAnimate = () => {
    switch (direction) {
      case "zoom":
        return { opacity: 1, scale: 1 };
      case "up":
      case "down":
        return { opacity: 1, y: 0 };
      case "left":
      case "right":
        return { opacity: 1, x: 0 };
      case "fade":
      default:
        return { opacity: 1 };
    }
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={getAnimate()}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Smooth luxury cubic-bezier
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
