"use client";

import React, { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate?: string;
}

export default function CountdownTimer({
  targetDate = "2026-12-12T09:00:00",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const destination = new Date(targetDate).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = destination - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const timeBlocks = [
    { label: "Hari", value: timeLeft.days },
    { label: "Jam", value: timeLeft.hours },
    { label: "Menit", value: timeLeft.minutes },
    { label: "Detik", value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-3 md:gap-4 my-6">
      {timeBlocks.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center w-16 h-20 md:w-20 md:h-24 bg-white/70 backdrop-blur-md rounded-2xl border border-amber-200/80 shadow-md shadow-amber-900/5 transition-transform hover:-translate-y-1"
        >
          <span className="text-2xl md:text-3xl font-serif font-bold text-amber-800 tabular-nums">
            {String(item.value).padStart(2, "0")}
          </span>
          <span className="text-[10px] md:text-xs uppercase tracking-wider text-stone-500 font-medium mt-1">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
