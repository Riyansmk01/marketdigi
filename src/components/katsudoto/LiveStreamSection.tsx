import React from "react";
import { Video, ExternalLink, Play } from "lucide-react";

export default function LiveStreamSection() {
  const streamUrl = "https://youtube.com";

  return (
    <section id="streaming" className="py-20 px-4 md:px-8 bg-[#FAF7F2]">
      <div className="max-w-3xl mx-auto text-center">
        <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-3">
          <Video className="w-5 h-5" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold tracking-widest uppercase mb-2">
          <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
          <span>Live Streaming</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-serif text-stone-900 mb-3">
          Siaran Langsung Acara
        </h3>
        <p className="text-stone-600 text-xs md:text-sm max-w-md mx-auto mb-8 leading-relaxed">
          Bagi keluarga, sahabat, dan kerabat yang berhalangan hadir secara langsung, Anda tetap dapat menyaksikan momen sakral akad nikah kami melalui siaran langsung di bawah ini.
        </p>

        {/* Video Card Mockup */}
        <div className="relative rounded-3xl overflow-hidden border border-amber-200/80 shadow-lg max-w-lg mx-auto bg-stone-900 aspect-video flex flex-col items-center justify-center group">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80')",
            }}
          />

          <div className="relative z-10 flex flex-col items-center p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform mb-3">
              <Play className="w-6 h-6 ml-0.5 fill-current" />
            </div>
            <p className="text-white text-sm font-semibold tracking-wide">
              Akad Nikah Riyan &amp; Intan
            </p>
            <p className="text-amber-200/90 text-xs mt-1">
              Sabtu, 12 Desember 2026 &bull; Mulai 08.00 WIB
            </p>
          </div>
        </div>

        <div className="mt-6">
          <a
            href={streamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-amber-200 text-xs font-medium tracking-wide shadow-md transition-colors"
          >
            <span>Buka Kanal YouTube</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>
      </div>
    </section>
  );
}
