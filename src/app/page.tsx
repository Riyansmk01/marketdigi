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
import InteractiveRoseFlower from "@/components/canvas/InteractiveRoseFlower";
import EventDetails from "@/components/EventDetails";
import LoveStory from "@/components/LoveStory";
import GallerySection from "@/components/GallerySection";
import RSVPAndWishes from "@/components/RSVPAndWishes";
import DigitalGift from "@/components/DigitalGift";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import FallingPetals from "@/components/ui/FallingPetals";
import MotionReveal from "@/components/ui/MotionReveal";
import RenaissanceHero from "@/components/renaissance/RenaissanceHero";
import WeFoundLoveSection from "@/components/renaissance/WeFoundLoveSection";
import CoupleSectionRenaissance from "@/components/renaissance/CoupleSectionRenaissance";
import { FloralSectionDivider } from "@/components/ui/DimensionalBotanicals";
import { RealisticBotanicalImageCorner } from "@/components/ui/RealisticFloralAccent";
import { Heart } from "lucide-react";

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
    <main className="min-h-screen relative overflow-x-hidden pb-24 selection:bg-pink-200 selection:text-pink-900 bg-[#FDF6F8]">
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

      {/* 5. Floating Mobile Bottom Dock Navigation (iOS Safe Area Ready) */}
      <FloatingNavigation />

      {/* 6. Smart WhatsApp Invitation Tool (Admin) */}
      <WhatsAppShareModal />

      {/* 7. Renaissance & Vintage Toile Hero */}
      <RenaissanceHero />

      {/* 8. We Found Love Section */}
      <WeFoundLoveSection />

      {/* 9. Couple Section with Oval Frames & Florals */}
      <CoupleSectionRenaissance />

      {/* 10. 3D Blooming Rose Feature Spotlight with Roman Rose Colonnade Arch */}
      <section className="py-20 px-4 sm:px-6 md:px-8 text-center bg-gradient-to-b from-[#FFF5F7] via-white to-[#FFF5F7] border-t border-b border-pink-200/80 relative overflow-hidden">
        {/* Subtle Toile & Filigree Background Ambience */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 pointer-events-none"
          style={{ backgroundImage: "url('/images/bg-floral-frame.png')" }}
        />
        <div className="max-w-xl mx-auto relative z-10">
          <MotionReveal direction="up">
            <p className="text-xs uppercase tracking-[0.25em] text-pink-700 font-semibold mb-1">
              Simbol Cinta Abadi
            </p>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif text-stone-900 mb-2">
              Mawar Merah Muda Berdimensi 3D
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-2 font-light">
              Melambangkan rasa syukur, kelembutan hati, dan janji suci kami untuk saling menjaga selamanya.
            </p>
            <InteractiveRoseFlower />
            <span className="text-[11px] text-pink-800/80 italic font-serif block mt-2">
              * Putar bunga mawar 3D untuk mengagumi setiap helai kelopaknya dari segala sudut
            </span>
          </MotionReveal>
        </div>
      </section>

      {/* 11. Event Details (Akad & Resepsi with Luxury Ballroom Backdrop) */}
      <EventDetails />

      {/* 12. Venue Map & Facilities Embed */}
      <VenueMapEmbed />

      {/* 13. Personal E-Invitation & QR Code Check-in Pass */}
      <EInvitationPass guestName={guestName} />

      {/* 14. Dress Code & Guest Guidelines */}
      <DressCodeSection />

      {/* Floral Divider */}
      <FloralSectionDivider />

      {/* 15. Love Story Timeline */}
      <LoveStory />

      {/* 16. Gallery Section (12 Curated Photos + Category Filter) */}
      <GallerySection />

      {/* 17. Instagram AR Wedding Filter */}
      <InstagramFilterSection />

      {/* 18. Live Stream Section */}
      <LiveStreamSection />

      {/* 19. RSVP & Live Wishes Guestbook with Stats */}
      <RSVPAndWishes />

      {/* 20. Digital Gift & Shipping Address */}
      <DigitalGift />

      {/* 21. Family Honor Roll (Turut Mengundang with Indonesian Architecture Tapestry) */}
      <FamilyHonorRoll />

      {/* 22. Wedding FAQ Section */}
      <WeddingFAQ />

      {/* 23. Elegant Footer */}
      <footer className="py-20 px-4 sm:px-6 text-center bg-[#3B0713] text-pink-100 relative border-t border-pink-500/20 overflow-hidden">
        {/* Subtle Background Filigree Texture in Footer */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 pointer-events-none"
          style={{ backgroundImage: "url('/images/bg-pink-filigree.png')" }}
        />
        <RealisticBotanicalImageCorner position="top-left" size="w-32 sm:w-44" className="opacity-70" />
        <RealisticBotanicalImageCorner position="bottom-right" size="w-32 sm:w-44" className="opacity-70" />

        <MotionReveal direction="up" className="max-w-md mx-auto space-y-4 relative z-10">
          <Heart className="w-6 h-6 text-pink-400 fill-pink-400/40 mx-auto animate-pulse" />
          <h3 className="text-2xl sm:text-3xl font-serif text-amber-100">Riyan &amp; Intan</h3>
          <p className="text-xs sm:text-sm text-pink-200/80 leading-relaxed font-light">
            Terima kasih atas doa, restu, dan kehadiran hangat Bapak/Ibu/Saudara/i sekalian dalam momen paling membahagiakan bagi kami berdua.
          </p>
          <div className="pt-6 border-t border-pink-900/60 text-[11px] sm:text-xs text-pink-300/60 font-serif">
            The Wedding of Riyan &amp; Intan &copy; 2026 &bull; All Rights Reserved
          </div>
        </MotionReveal>
      </footer>
    </main>
  );
}