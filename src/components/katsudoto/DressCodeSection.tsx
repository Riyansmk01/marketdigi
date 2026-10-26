import React from "react";
import { Shirt, Clock3, HeartHandshake } from "lucide-react";

const colorPalette = [
  { name: "Blush Pink", color: "#FBCFE8", border: "#F472B6" },
  { name: "Dusty Rose", color: "#E11D48", border: "#BE185D" },
  { name: "Rose Gold", color: "#B76E79", border: "#9F5863" },
  { name: "Soft Ivory", color: "#FFF1F2", border: "#FECDD3" },
];

export default function DressCodeSection() {
  return (
    <section className="py-16 px-4 md:px-8 bg-pink-50/50 border-t border-b border-pink-200/50">
      <div className="max-w-3xl mx-auto text-center">
        <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center mx-auto mb-3">
          <Shirt className="w-5 h-5" />
        </div>
        <p className="text-pink-700 uppercase tracking-[0.25em] text-xs font-semibold mb-1">
          Panduan Tamu
        </p>
        <h3 className="text-2xl md:text-3xl font-serif text-stone-900 mb-2">
          Dress Code &amp; Informasi
        </h3>
        <p className="text-stone-600 text-xs md:text-sm max-w-md mx-auto mb-8">
          Untuk menyelaraskan suasana pernikahan bertema <strong>Pink Floral &amp; Romantic Blossom</strong>, tamu undangan disarankan mengenakan pakaian bertema <strong>Pastel Pink / Rose Gold / Batik</strong>.
        </p>

        {/* Color Palette Swatches */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mb-10">
          {colorPalette.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-md border-2 mb-2 transition-transform hover:scale-110"
                style={{ backgroundColor: item.color, borderColor: item.border }}
              />
              <span className="text-[11px] font-medium text-stone-700">{item.name}</span>
            </div>
          ))}
        </div>

        {/* Etiquette Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-xl mx-auto">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-pink-200/70 shadow-sm">
            <Clock3 className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-stone-900">Hadir Tepat Waktu</h5>
              <p className="text-[11px] text-stone-500 leading-relaxed mt-0.5">
                Harap hadir 15 menit sebelum rangkaian acara dimulai demi kenyamanan bersama.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-pink-200/70 shadow-sm">
            <HeartHandshake className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-stone-900">Doa &amp; Restu</h5>
              <p className="text-[11px] text-stone-500 leading-relaxed mt-0.5">
                Kehadiran dan doa restu Anda adalah anugerah terbesar bagi awal perjalanan kami.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
