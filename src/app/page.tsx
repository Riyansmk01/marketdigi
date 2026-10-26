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
import InteractiveRoseFlower from "@/components/canvas/InteractiveRoseFlower";
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
import { Heart, Move3d, Sparkles } from "lucide-react";

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
    <main className="min-h-screen relative overflow-x-hidden pb-20 selection:bg-pink-200 selection:text-pink-900 bg-[#FDF8F9]">
      {/* 1. Top Reading Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* 2. Floating Romantic Pink Rose Petals & Sakura Bokeh Canvas */}
      <FallingPetals />

      {/* 3. Signature Romantic Pink Wax Seal & Envelope Cover */}
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

      {/* 7. Hero Section with 3D Pink Flowers Bouquet & Rings */}
      <section
        id="hero"
        className="relative min-h-[92vh] md:min-h-screen flex flex-col items-center justify-center text-center px-4 pt-16 pb-14 overflow-hidden bg-gradient-to-b from-[#FFF5F7] via-[#FDF8F9] to-[#FDF8F9]"
      >
        {/* Soft decorative romantic pink ambient glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-pink-300/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <MotionReveal direction="up" delay={0.1} duration={0.9}>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-stone-900 font-normal tracking-tight mb-2">
              Riyan &amp; Intan
            </h1>
          </MotionReveal>

          <MotionReveal direction="up" delay={0.2}>
            <p className="text-sm md:text-base font-light text-pink-900/80 tracking-widest uppercase mb-3">
              Sabtu, 12 Desember 2026 &bull; Jakarta
            </p>
          </MotionReveal>

          {/* 3D Pink Flowers Bouquet & Rings Canvas */}
          <MotionReveal direction="zoom" delay={0.3} className="w-full relative flex flex-col items-center my-2">
            <WeddingRingsWrapper />
            <div className="flex items-center gap-1.5 text-[11px] text-pink-800 bg-pink-100/90 border border-pink-200/80 px-3.5 py-1 rounded-full shadow-sm mt-1">
              <Move3d className="w-3.5 h-3.5 text-pink-600" />
              <span>Sentuh &amp; geser buket bunga 3D untuk interaksi</span>
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

      {/* 9. Second 3D Pink Flower Spotlight Feature */}
      <section className="py-10 px-4 text-center bg-gradient-to-r from-pink-50/50 via-white to-pink-50/50 border-t border-b border-pink-100">
        <MotionReveal direction="up" className="max-w-md mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-pink-700 font-semibold mb-1">
            Simbol Cinta Abadi
          </p>
          <h3 className="text-xl md:text-2xl font-serif text-stone-900 mb-2">
            Mawar Merah Muda 3D
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed mb-1">
            Melambangkan rasa syukur, kelembutan, dan janji suci kami untuk saling menjaga.
          </p>
          <InteractiveRoseFlower />
          <span className="text-[10px] text-pink-700/80 italic">
            * Putar kembang mawar untuk melihat setiap kelopaknya
          </span>
        </MotionReveal>
      </section>

      {/* 10. Event Details (Akad & Resepsi) */}
      <EventDetails />

      {/* 11. Venue Map & Facilities Embed */}
      <VenueMapEmbed />

      {/* 12. Personal E-Invitation & QR Code Check-in Pass */}
      <EInvitationPass guestName={guestName} />

      {/* 13. Dress Code & Guest Guidelines */}
      <DressCodeSection />

      {/* 14. Love Story Timeline */}
      <LoveStory />

      {/* 15. Gallery Section with Interactive Lightbox */}
      <GallerySection />

      {/* 16. Instagram AR Wedding Filter */}
      <InstagramFilterSection />

      {/* 17. Live Stream Section */}
      <LiveStreamSection />

      {/* 18. RSVP & Live Wishes Guestbook with Stats */}
      <RSVPAndWishes />

      {/* 19. Digital Gift & Shipping Address */}
      <DigitalGift />

      {/* 20. Family Honor Roll (Turut Mengundang) */}
      <FamilyHonorRoll />

      {/* 21. Wedding FAQ Section */}
      <WeddingFAQ />

      {/* 22. Elegant Footer */}
      <footer className="py-20 px-4 text-center bg-stone-900 text-stone-300 relative border-t border-pink-500/20">
        <MotionReveal direction="up" className="max-w-md mx-auto space-y-4">
          <Heart className="w-6 h-6 text-pink-400 fill-pink-400/40 mx-auto animate-pulse" />
          <h3 className="text-2xl font-serif text-pink-100">Riyan &amp; Intan</h3>
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
