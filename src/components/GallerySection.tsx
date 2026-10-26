"use client";

import React, { useState } from "react";
import MotionReveal from "@/components/ui/MotionReveal";
import { Camera, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const photos = [
  {
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    caption: "Momen Bahagia Bersama",
  },
  {
    url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    caption: "Senyuman Hangat & Doa",
  },
  {
    url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
    caption: "Langkah Menuju Hari Bahagia",
  },
  {
    url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80",
    caption: "Janji Suci & Kesetiaan",
  },
  {
    url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80",
    caption: "Harmoni Cinta yang Abadi",
  },
  {
    url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
    caption: "Menatap Masa Depan",
  },
];

export default function GallerySection() {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedPhotoIndex(index);
  const closeLightbox = () => setSelectedPhotoIndex(null);

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex - 1 + photos.length) % photos.length);
    }
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex + 1) % photos.length);
    }
  };

  return (
    <section id="galeri" className="py-24 px-4 md:px-8 bg-stone-100/70 relative">
      <div className="max-w-5xl mx-auto text-center">
        <MotionReveal direction="up">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Camera className="w-6 h-6" />
          </div>
          <p className="text-amber-700 uppercase tracking-[0.3em] text-xs font-semibold mb-2">
            Galeri Kenangan
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-stone-900 mb-4">
            Our Precious Moments
          </h2>
          <p className="text-stone-600 text-sm max-w-md mx-auto mb-14">
            Setiap detik kebersamaan adalah untaian doa dan syukur yang kami abadikan dalam harmoni cinta.
          </p>
        </MotionReveal>

        {/* Responsive Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {photos.map((item, index) => (
            <MotionReveal
              key={index}
              direction="up"
              delay={index * 0.08}
              className="group relative h-80 rounded-3xl overflow-hidden shadow-md border border-amber-200/60 cursor-pointer bg-stone-200"
              onClick={() => openLightbox(index)}
            >
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${item.url}')` }}
              />
              {/* Overlay with zoom icon */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-5 text-left">
                <div className="self-end p-2 rounded-full bg-white/20 backdrop-blur-md text-white">
                  <Maximize2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-amber-300 font-semibold mb-0.5">
                    Memori #{index + 1}
                  </p>
                  <p className="text-sm text-white font-serif font-medium">{item.caption}</p>
                </div>
              </div>
            </MotionReveal>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Tutup Galeri"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Previous Button */}
            <button
              onClick={prevPhoto}
              className="absolute left-4 md:left-8 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
              aria-label="Foto Sebelumnya"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Lightbox Content */}
            <motion.div
              key={selectedPhotoIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl max-h-[85vh] flex flex-col items-center"
            >
              <img
                src={photos[selectedPhotoIndex].url}
                alt={photos[selectedPhotoIndex].caption}
                className="max-h-[75vh] w-auto rounded-2xl object-contain shadow-2xl border border-white/20"
              />
              <p className="text-white text-sm font-serif mt-4 tracking-wide text-center">
                {photos[selectedPhotoIndex].caption}
              </p>
              <span className="text-xs text-stone-400 mt-1">
                {selectedPhotoIndex + 1} dari {photos.length}
              </span>
            </motion.div>

            {/* Next Button */}
            <button
              onClick={nextPhoto}
              className="absolute right-4 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
              aria-label="Foto Berikutnya"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
