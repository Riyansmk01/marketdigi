"use client";

import React, { useState, useEffect } from "react";
import { Home, Heart, Calendar, Ticket, Image, MessageSquareHeart, Gift } from "lucide-react";

const navItems = [
  { id: "hero", label: "Cover", icon: Home, href: "#hero" },
  { id: "mempelai", label: "Mempelai", icon: Heart, href: "#mempelai" },
  { id: "acara", label: "Acara", icon: Calendar, href: "#acara" },
  { id: "e-pass", label: "E-Pass", icon: Ticket, href: "#e-pass" },
  { id: "galeri", label: "Galeri", icon: Image, href: "#galeri" },
  { id: "rsvp", label: "RSVP", icon: MessageSquareHeart, href: "#rsvp" },
  { id: "kado", label: "Kado", icon: Gift, href: "#kado" },
];

export default function FloatingNavigation() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      aria-label="Floating Mobile Navigation"
      className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-40 max-w-[95vw] sm:max-w-md w-full px-2"
    >
      <div className="flex items-center justify-between bg-stone-900/90 backdrop-blur-xl border border-pink-400/30 px-2.5 sm:px-3 py-2 rounded-full shadow-2xl shadow-black/50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <a
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-1.5 sm:px-2 rounded-full transition-all duration-300 ${
                isActive
                  ? "text-pink-300 bg-pink-500/25 scale-105"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Icon className="w-3.5 sm:w-4 h-3.5 sm:h-4 mb-0.5" />
              <span className="text-[8px] sm:text-[9px] font-medium tracking-tight whitespace-nowrap">
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}