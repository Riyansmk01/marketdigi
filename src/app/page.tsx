"use client";

import React, { useState, useEffect } from "react";
import WaxSealEnvelopeCover from "@/components/katsudoto/WaxSealEnvelopeCover";
import FloatingNavigation from "@/components/katsudoto/FloatingNavigation";
import EInvitationPass from "@/components/katsudoto/EInvitationPass";
import DressCodeSection from "@/components/katsudoto/DressCodeSection";
import LiveStreamSection from "@/components/katsudoto/LiveStreamSection";
import WhatsAppShareModal from "@/components/katsudoto/WhatsAppShareModal";
import VenueMapEmbed from "@/components/katsudoto/VenueMapEmbed";
import InstagramFilterSection from "@/components/katsudoto/InstagramFilterSection";
import WeddingFAQ from "@/components/katsudoto/WeddingFAQ";
import FamilyHonorRoll from "@/components/katsudoto/FamilyHonorRoll";
import AudioPlayer from "@/components/AudioPlayer";
import WeddingRingsWrapper from "@/components/canvas/WeddingRingsWrapper";
import CountdownTimer from "@/components/CountdownTimer";
import CoupleSection from "@/components/CoupleSection";
import EventDetails from "@/components/EventDetails";
import LoveStory from "@/components/LoveStory";
import GallerySection from "@/components/GallerySection";
import RSVPAndWishes from "@/components/RSVPAndWishes";
import DigitalGift from "@/components/DigitalGift";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import FallingPetals from "@/components/ui/FallingPetals";
import MotionReveal from "@/components/ui/MotionReveal";
import { Heart, Move3d } from "lucide-react";

export default function Home() {
  const [isCoverOpen, setIsCoverOpen] = useState(true);
  const [startMusic, setStartMusic] = useState(false);
  const [guestName, setGuestName] = useState("Tamu Undangan");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const to = params.get("to");
      if (to) {
        setGuestName(decodeURIComponent(to));
      }
    }
  }, []);

  const handleOpenInvitation = () => {
    setIsCoverOpen(false);
    setStartMusic(true);
  };

  return (
    <main className="min-h-screen relative overflow-x-hidden pb-20 selection:bg-amber-200 selection:text-amber-900 bg-[#FAF7F2]">
      {/* 1. Top Reading Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* 2. Floating Romantic Rose Petals & Golden Bokeh Canvas */}
      <FallingPetals />

      {/* 3. Signature Katsudoto Wax Seal & Envelope Cover */}
      <WaxSealEnvelopeCover
        isOpen={isCoverOpen}
        onOpen={handleOpenInvitation}
        guestName={guestName}
      />

      {/* 4. Vinyl Music Player (Sal Priadi - Kita Usahakan Rumah Itu) */}
      <AudioPlayer autoPlayTrigger={startMusic} />

      {/* 5. Floating Mobile Bottom Dock Navigation */}
      <FloatingNavigation />

      {/* 6. Smart WhatsApp Invitation Tool (Admin) */}
      <WhatsAppShareModal />

      {/* 7. Hero Section with 3D Rings & Countdown */}
      <section
        id="hero"
        className="relative min-h-[92vh] md:min-h-screen flex flex-col items-center justify-center text-center px-4 pt-16 pb-14 overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#FAF7F2]"
      >
        {/* Soft decorative ambient glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-200/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <MotionReveal direction="up" delay={0.1} duration={0.9}>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-stone-900 font-normal tracking-tight mb-2">
              Riyan &amp; Intan
            </h1>
          </MotionReveal>

          <MotionReveal direction="up" delay={0.2}>
            <p className="text-sm md:text-base font-light text-stone-600 tracking-widest uppercase mb-3">
              Sabtu, 12 Desember 2026 &bull; Jakarta
            </p>
          </MotionReveal>

          {/* 3D Wedding Rings Canvas */}
          <MotionReveal direction="zoom" delay={0.3} className="w-full relative flex flex-col items-center my-2">
            <WeddingRingsWrapper />
            <div className="flex items-center gap-1.5 text-[11px] text-amber-800/70 bg-amber-50/80 border border-amber-200/60 px-3 py-1 rounded-full shadow-sm mt-1">
              <Move3d className="w-3.5 h-3.5" />
              <span>Sentuh &amp; geser cincin untuk interaksi 3D</span>
            </div>
          </MotionReveal>

          {/* Countdown Timer */}
          <MotionReveal direction="up" delay={0.4}>
            <CountdownTimer targetDate="2026-12-12T09:00:00" />
          </MotionReveal>
        </div>
      </section>

      {/* 8. Couple Section */}
      <CoupleSection />

      {/* 9. Event Details (Akad & Resepsi) */}
      <EventDetails />

      {/* 10. Venue Map & Facilities Embed */}
      <VenueMapEmbed />

      {/* 11. Personal E-Invitation & QR Code Check-in Pass */}
      <EInvitationPass guestName={guestName} />

      {/* 12. Dress Code & Guest Guidelines */}
      <DressCodeSection />

      {/* 13. Love Story Timeline */}
      <LoveStory />

      {/* 14. Gallery Section with Interactive Lightbox */}
      <GallerySection />

      {/* 15. Instagram AR Wedding Filter */}
      <InstagramFilterSection />

      {/* 16. Live Stream Section */}
      <LiveStreamSection />

      {/* 17. RSVP & Live Wishes Guestbook with Stats */}
      <RSVPAndWishes />

      {/* 18. Digital Gift & Shipping Address */}
      <DigitalGift />

      {/* 19. Family Honor Roll (Turut Mengundang) */}
      <FamilyHonorRoll />

      {/* 20. Wedding FAQ Section */}
      <WeddingFAQ />

      {/* 21. Elegant Footer */}
      <footer className="py-20 px-4 text-center bg-stone-900 text-stone-300 relative border-t border-amber-500/20">
        <MotionReveal direction="up" className="max-w-md mx-auto space-y-4">
          <Heart className="w-6 h-6 text-amber-400 fill-amber-400/40 mx-auto animate-pulse" />
          <h3 className="text-2xl font-serif text-amber-100">Riyan &amp; Intan</h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            Terima kasih atas doa, restu, dan kehadiran hangat Bapak/Ibu/Saudara/i sekalian dalam momen paling membahagiakan bagi kami berdua.
          </p>
          <div className="pt-6 border-t border-stone-800 text-[11px] text-stone-500">
            The Wedding of Riyan &amp; Intan &copy; 2026
          </div>
        </MotionReveal>
      </footer>
    </main>
  );
}
