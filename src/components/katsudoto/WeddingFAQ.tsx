"use client";

import React, { useState } from "react";
import MotionReveal from "@/components/ui/MotionReveal";
import { RealisticBotanicalImageCorner, RealisticHeaderGarland } from "@/components/ui/RealisticFloralAccent";
import { HelpCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Apakah diperkenankan membawa anak-anak?",
    answer:
      "Tentu saja! Kehadiran keluarga tercinta sangat kami nantikan. Namun demi kenyamanan dan kekhidmatan prosesi akad nikah, mohon untuk tetap mendampingi buah hati selama acara berlangsung.",
  },
  {
    question: "Bagaimana dengan fasilitas parkir dan valet di lokasi?",
    answer:
      "Plataran Dharmawangsa memiliki area parkir yang luas dan aman. Fasilitas Valet Service juga disediakan secara cuma-cuma (gratis) untuk seluruh tamu undangan.",
  },
  {
    question: "Bagaimana cara penggunaan E-Invitation Pass & QR Code?",
    answer:
      "Cukup tunjukkan atau tangkap layar (screenshot) kartu E-Pass ber-QR Code di halaman ini saat tiba di meja penerima tamu (usher) untuk registrasi cepat dan pengambilan souvenir.",
  },
  {
    question: "Bagaimana cara memberikan kado atau amplop digital?",
    answer:
      "Anda dapat memberikan tanda kasih secara langsung di meja resepsi, atau memanfaatkan nomor rekening bank dan alamat pengiriman kado yang tertera pada bagian 'Tanda Kasih / Amplop Digital' di website ini.",
  },
  {
    question: "Apakah ada siaran langsung bagi kerabat di luar kota?",
    answer:
      "Ya, kami menyediakan tautan Live Streaming YouTube resmi pada sesi akad nikah yang dapat diakses langsung melalui bagian 'Siaran Langsung Acara' pada website ini.",
  },
];

export default function WeddingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 md:px-8 bg-stone-100/60 border-t border-amber-200/50">
      <div className="max-w-3xl mx-auto">
        <MotionReveal direction="up" className="text-center mb-12">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <HelpCircle className="w-6 h-6" />
          </div>
          <p className="text-amber-700 uppercase tracking-[0.3em] text-xs font-semibold mb-2">
            Informasi Tambahan
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-stone-900 mb-3">
            Pertanyaan Umum (FAQ)
          </h2>
          <p className="text-stone-600 text-sm max-w-md mx-auto mb-2">
            Pertanyaan yang sering ditanyakan tamu seputar kehadiran dan rangkaian acara pernikahan.
          </p>
          <RealisticHeaderGarland />
        </MotionReveal>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <MotionReveal key={idx} direction="up" delay={idx * 0.08}>
                <div className="bg-white rounded-2xl border border-amber-200/70 shadow-sm overflow-hidden transition-colors">
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif font-medium text-stone-900 hover:text-amber-800 transition-colors"
                  >
                    <span className="text-sm md:text-base">{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-amber-700 shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-amber-800" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-5 pb-5 text-xs md:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </MotionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
