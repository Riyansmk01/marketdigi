"use client";

import React from "react";
import MotionReveal from "@/components/ui/MotionReveal";
import { RealisticHeaderGarland } from "@/components/ui/RealisticFloralAccent";
import { FlyingDove } from "@/components/ui/DimensionalBotanicals";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  );
}

export default function CoupleSectionRenaissance() {
  return (
    <section id="mempelai" className="py-20 sm:py-28 px-4 sm:px-6 md:px-8 bg-[#FDF6F8] relative overflow-hidden">
      {/* Decorative Toile Border & Wallpaper Texture */}
      <div
        className="absolute inset-0 opacity-[0.16] pointer-events-none bg-repeat bg-center"
        style={{ backgroundImage: "url('/images/bg-traditional-toile.png')", backgroundSize: "500px" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#FDF6F8]/80 via-transparent to-[#FDF6F8]/85 pointer-events-none" />

      {/* Dimensional Flying Doves */}
      <div className="absolute top-12 left-8 w-16 sm:w-24 pointer-events-none z-10 opacity-70">
        <FlyingDove direction="right" />
      </div>
      <div className="absolute top-16 right-8 w-16 sm:w-24 pointer-events-none z-10 opacity-70">
        <FlyingDove direction="left" delay={1.6} />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Intro Salutation (Exact Replica of Image 5) */}
        <MotionReveal direction="up" className="mb-12 sm:mb-16">
          <p className="text-xs sm:text-sm font-serif text-stone-700 max-w-lg mx-auto leading-relaxed px-4">
            Dengan memohon Rahmat &amp; Ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:
          </p>
          <RealisticHeaderGarland />
        </MotionReveal>

        {/* Groom & Bride Grid (Exact Replica of Image 5) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Mempelai Pria */}
          <MotionReveal direction="right" delay={0.1}>
            <div className="flex flex-col items-center p-6 sm:p-8 bg-white/85 backdrop-blur-sm rounded-[36px] border-2 border-pink-200 shadow-xl shadow-pink-900/5 relative overflow-hidden">
              {/* Oval Frame (Clean & Noble) */}
              <div className="relative mb-6">
                <div className="relative w-44 h-60 sm:w-52 sm:h-72 rounded-[100px] overflow-hidden border-2 border-amber-400/90 p-1 shadow-lg bg-stone-100 z-10">
                  <div
                    className="w-full h-full rounded-[95px] bg-cover bg-center transition-transform duration-700 hover:scale-108"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80')",
                    }}
                  />
                </div>
              </div>

              {/* Cursive Name Accent */}
              <span className="font-cursive text-5xl sm:text-6xl text-amber-800/90 leading-none mb-1">
                Riyan
              </span>

              {/* Full Formal Title */}
              <h3 className="text-xl sm:text-2xl font-serif text-stone-900 font-semibold tracking-wide mb-1">
                Riyan Perdhana Putra
              </h3>
              <p className="text-[11px] uppercase tracking-wider text-amber-800/90 font-medium mb-3">
                Teknik Informatika &bull; IT &amp; Network Specialist
              </p>

              {/* Parent Lineage */}
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xs mb-5">
                Putra Pertama dari <br />
                <strong className="text-stone-800 font-medium">Bapak Bambang Prasetyo &amp; Ibu Sri Wahyuni</strong>
              </p>

              {/* Social Buttons (LinkedIn & Instagram) */}
              <div className="flex items-center gap-3">
                <a
                  href="https://id.linkedin.com/in/riyan-perdhana-putra-0070a037b"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Riyan Perdhana Putra"
                  title="LinkedIn Riyan Perdhana Putra"
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0077B5] to-[#0A66C2] text-white flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform"
                >
                  <LinkedInIcon className="w-4 h-4" />
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Riyan"
                  title="Instagram Riyan"
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-700 via-amber-600 to-amber-500 text-white flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </MotionReveal>

          {/* Mempelai Wanita */}
          <MotionReveal direction="left" delay={0.15}>
            <div className="flex flex-col items-center p-6 sm:p-8 bg-white/85 backdrop-blur-sm rounded-[36px] border-2 border-pink-200 shadow-xl shadow-pink-900/5 relative overflow-hidden">
              {/* Oval Frame (Clean & Noble) */}
              <div className="relative mb-6">
                <div className="relative w-44 h-60 sm:w-52 sm:h-72 rounded-[100px] overflow-hidden border-2 border-amber-400/90 p-1 shadow-lg bg-stone-100 z-10">
                  <div
                    className="w-full h-full rounded-[95px] bg-cover bg-center transition-transform duration-700 hover:scale-108"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80')",
                    }}
                  />
                </div>
              </div>

              {/* Cursive Name Accent */}
              <span className="font-cursive text-5xl sm:text-6xl text-amber-800/90 leading-none mb-1">
                Intan
              </span>

              {/* Full Formal Title */}
              <h3 className="text-xl sm:text-2xl font-serif text-stone-900 font-semibold tracking-wide mb-1">
                Intan Nuraini, S.Kom.
              </h3>
              <p className="text-[11px] uppercase tracking-wider text-pink-700 font-medium mb-3">
                Sistem Informasi &bull; Creative Designer
              </p>

              {/* Parent Lineage */}
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xs mb-5">
                Putri Kedua dari <br />
                <strong className="text-stone-800 font-medium">Bapak Hendra Gunawan &amp; Ibu Ratna Dewi</strong>
              </p>

              {/* Circular Gold/Brown Instagram Button */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Intan"
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-700 via-amber-600 to-amber-500 text-white flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}