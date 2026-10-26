"use client";

import React, { useState } from "react";
import MotionReveal from "@/components/ui/MotionReveal";
import { Camera, X, ChevronLeft, ChevronRight, Maximize2, Heart, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface PhotoItem {
  id: number;
  url: string;
  caption: string;
  category: "prewedding" | "sakral" | "kebersamaan";
}

const photoCollection: PhotoItem[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    caption: "Senyuman Hangat di Awal Cerita",
    category: "prewedding",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    caption: "Ikrar Suci & Kesetiaan",
    category: "sakral",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
    caption: "Melangkah Bersama Menuju Masa Depan",
    category: "prewedding",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80",
    caption: "Cinta Dalam Kebersamaan",
    category: "kebersamaan",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80",
    caption: "Harmoni Alam & Senandung Cinta",
    category: "prewedding",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
    caption: "Janji Suci di Bawah Naungan Langit",
    category: "sakral",
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80",
    caption: "Tatapan Penuh Makna & Keteduhan",
    category: "prewedding",
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80",
    caption: "Dua Jiwa Satu Tujuan",
    category: "kebersamaan",
  },
  {
    id: 9,
    url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80",
    caption: "Buket Bunga Kasih Sayang",
    category: "sakral",
  },
  {
    id: 10,
    url: "https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80",
    caption: "Genggaman Erat Seumur Hidup",
    category: "kebersamaan",
  },
  {
    id: 11,
    url: "https://images.unsplash.com/photo-1509927083803-4bd519298ac4?auto=format&fit=crop&w=1200&q=80",
    caption: "Tawa Riang Bersama Pasangan",
    category: "prewedding",
  },
  {
    id: 12,
    url: "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1200&q=80",
    caption: "Kisah Kita Usahakan Rumah Itu",
    category: "kebersamaan",
  },
];

export default function GallerySection() {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredPhotos = photoCollection.filter((item) => {
    if (activeCategory === "all") return true;
    return item.category === activeCategory;
  });

  const openLightbox = (index: number) => setSelectedPhotoIndex(index);
  const closeLightbox = () => setSelectedPhotoIndex(null);

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
    }
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex + 1) % filteredPhotos.length);
    }
  };

  return (
    <section id="galeri" className="py-24 px-4 md:px-8 bg-pink-50/40 relative">
      <div className="max-w-6xl mx-auto text-center">
        <MotionReveal direction="up">
          <div className="w-12 h-12 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Camera className="w-6 h-6" />
          </div>
          <p className="text-pink-700 uppercase tracking-[0.3em] text-xs font-semibold mb-2">
            Galeri Kenangan
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-stone-900 mb-4">
            Our Precious Moments
          </h2>
          <p className="text-stone-600 text-sm max-w-md mx-auto mb-8">
            Setiap detik kebersamaan adalah untaian doa dan syukur yang kami abadikan dalam harmoni cinta.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {[
              { id: "all", label: "Semua Foto" },
              { id: "prewedding", label: "Pre-Wedding" },
              { id: "sakral", label: "Momen Sakral" },
              { id: "kebersamaan", label: "Kebersamaan" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeCategory === cat.id
                    ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-900/15 scale-105"
                    : "bg-white text-stone-600 hover:bg-pink-100/70 border border-pink-200/60"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </MotionReveal>

        {/* 12-Photo Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
          {filteredPhotos.map((item, index) => (
            <MotionReveal
              key={item.id}
              direction="up"
              delay={index * 0.05}
              className="group relative h-64 sm:h-72 md:h-80 rounded-2xl md:rounded-3xl overflow-hidden shadow-md border border-pink-200/80 cursor-pointer bg-stone-200 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-pink-900/10"
              onClick={() => openLightbox(index)}
            >
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${item.url}')` }}
              />
              {/* Overlay with zoom icon */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-900/25 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-4 text-left">
                <div className="self-end p-2 rounded-full bg-white/25 backdrop-blur-md text-white shadow-sm">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-pink-300 font-semibold block mb-0.5">
                    Foto #{item.id}
                  </span>
                  <p className="text-xs text-white font-serif font-medium line-clamp-2">
                    {item.caption}
                  </p>
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
              className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
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
                src={filteredPhotos[selectedPhotoIndex].url}
                alt={filteredPhotos[selectedPhotoIndex].caption}
                className="max-h-[75vh] w-auto rounded-2xl object-contain shadow-2xl border border-white/20"
              />
              <p className="text-white text-sm font-serif mt-4 tracking-wide text-center">
                {filteredPhotos[selectedPhotoIndex].caption}
              </p>
              <span className="text-xs text-pink-300 mt-1">
                {selectedPhotoIndex + 1} dari {filteredPhotos.length}
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
