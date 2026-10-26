"use client";

import React, { useState } from "react";
import { Share2, Send, Copy, Check, X, MessageCircle } from "lucide-react";

export default function WhatsAppShareModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://riyan-intan.wedding";
  const formattedTo = encodeURIComponent(guestName.trim() || "Tamu Undangan");
  const invitationLink = `${baseUrl}/?to=${formattedTo}`;

  const messageTemplate = `Kepada Yth.
Bapak/Ibu/Saudara/i *${guestName.trim() || "Tamu Undangan"}*
Di Tempat

_Assalamu’alaikum Warahmatullahi Wabarakatuh_

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:

💍 *Riyan Perdhanaputra & Intan Nuraini*
🗓️ *Sabtu, 12 Desember 2026*
📍 *Plataran Dharmawangsa, Jakarta Selatan*

Untuk detail informasi acara, lokasi, konfirmasi kehadiran (RSVP), serta E-Invitation Pass dapat diakses melalui tautan berikut:
👉 ${invitationLink}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu.

Terima kasih.
_Wassalamu’alaikum Warahmatullahi Wabarakatuh_

Salam hangat,
*Riyan & Intan*`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSendWA = () => {
    let cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "62" + cleanPhone.slice(1);
    }
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageTemplate)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(messageTemplate)}`;
    window.open(url, "_blank");
  };

  return (
    <>
      {/* Floating Trigger Button for Bride/Groom */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 left-6 z-40 flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl text-xs font-semibold tracking-wide transition-transform hover:scale-105 active:scale-95 border border-emerald-400/40"
        title="Smart WhatsApp Share Katsudoto"
      >
        <MessageCircle className="w-4 h-4 fill-white" />
        <span className="hidden sm:inline">Kirim WhatsApp</span>
      </button>

      {/* Modal dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Smart WhatsApp Invitation
                </h3>
                <p className="text-xs text-stone-500">
                  Fitur sebar undangan otomatis ala Katsudoto
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Nama Tamu Yang Dituju *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Dimas Aditya & Partner"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Nomor WhatsApp Tamu (Opsional)
                </label>
                <input
                  type="tel"
                  placeholder="0812xxxxxxxx (kosongkan jika ingin pilih kontak langsung di WA)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Preview Pesan WhatsApp
                </label>
                <pre className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 text-xs font-sans whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {messageTemplate}
                </pre>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleSendWA}
                className="w-full sm:flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-emerald-900/10 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Buka &amp; Kirim via WhatsApp</span>
              </button>

              <button
                onClick={handleCopy}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Pesan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
