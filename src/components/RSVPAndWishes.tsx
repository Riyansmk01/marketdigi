"use client";

import React, { useState, useEffect } from "react";
import MotionReveal from "@/components/ui/MotionReveal";
import { RealisticHeaderGarland } from "@/components/ui/RealisticFloralAccent";
import { FlyingDove } from "@/components/ui/DimensionalBotanicals";
import { Send, CheckCircle2, XCircle, HelpCircle, MessageSquareHeart, Users, ThumbsUp, Sparkles } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { RSVPRecord, WishRecord } from "@/types/wedding";
import confetti from "canvas-confetti";

const initialSampleWishes: WishRecord[] = [
  {
    id: "1",
    name: "Ahmad & Siti",
    attendance: "hadir",
    message: "Selamat Riyan & Intan! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Lancar sampai hari H!",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "2",
    name: "Rizky Ramadhan",
    attendance: "hadir",
    message: "Barakallahu lakuma wa baraka alaikuma wa jama'a bainakuma fii khoir. Happy wedding bro Riyan!",
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: "3",
    name: "Nadia Utami",
    attendance: "tidak_hadir",
    message: "Selamat ya Intan cantik! Maaf belum bisa hadir langsung karena masih dinas di luar kota. Doa terbaik untuk kalian berdua!",
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "4",
    name: "Dimas & Sarah",
    attendance: "hadir",
    message: "Masya Allah akhirnya sah juga sahabatku! Semoga berkah dan bahagia selalu menaungi rumah tangga kalian.",
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
];

export default function RSVPAndWishes() {
  const [wishes, setWishes] = useState<WishRecord[]>(initialSampleWishes);
  const [filter, setFilter] = useState<"all" | "hadir" | "tidak_hadir">("all");
  const [formData, setFormData] = useState({
    name: "",
    attendance: "hadir" as "hadir" | "tidak_hadir" | "ragu",
    guests_count: 1,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadWishes() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from("rsvps")
            .select("id, name, attendance, message, created_at")
            .order("created_at", { ascending: false })
            .limit(50);

          if (!error && data && data.length > 0) {
            setWishes(data as WishRecord[]);
          }
        } catch (err) {
          console.warn("Error fetching wishes from Supabase:", err);
        }
      } else {
        const cached = localStorage.getItem("wedding_wishes_backup");
        if (cached) {
          try {
            setWishes(JSON.parse(cached));
          } catch (e) {
            console.error(e);
          }
        }
      }
    }

    loadWishes();
  }, []);

  const totalHadir = wishes.filter((w) => w.attendance === "hadir").length;
  const totalAbsen = wishes.filter((w) => w.attendance === "tidak_hadir").length;
  const totalRagu = wishes.filter((w) => w.attendance === "ragu").length;

  const filteredWishes = wishes.filter((w) => {
    if (filter === "hadir") return w.attendance === "hadir";
    if (filter === "tidak_hadir") return w.attendance === "tidak_hadir";
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMessage("Mohon masukkan nama Anda.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const newRecord = {
        name: formData.name.trim(),
        attendance: formData.attendance,
        guests_count: formData.attendance === "hadir" ? formData.guests_count : 0,
        message: formData.message.trim(),
        created_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from("rsvps").insert([newRecord]);
        if (error) throw error;
      }

      const updated = [
        {
          id: Date.now().toString(),
          ...newRecord,
        },
        ...wishes,
      ];
      setWishes(updated);
      localStorage.setItem("wedding_wishes_backup", JSON.stringify(updated.slice(0, 30)));

      // Trigger Celebration Confetti
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#F5D061", "#FB7185", "#FDA4AF", "#F43F5E"],
      });

      setSubmitSuccess(true);
      setFormData({
        name: "",
        attendance: "hadir",
        guests_count: 1,
        message: "",
      });

      setTimeout(() => setSubmitSuccess(false), 6000);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error?.message || "Gagal mengirim konfirmasi. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="py-20 sm:py-28 px-4 sm:px-6 md:px-8 bg-[#FDF6F8] relative overflow-hidden">
      {/* Background Filigree Parchment Texture */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 pointer-events-none"
        style={{ backgroundImage: "url('/images/bg-pink-filigree.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#FDF6F8]/80 via-transparent to-[#FDF6F8]/90 pointer-events-none" />

      {/* Dimensional Flying Doves */}
      <div className="absolute top-12 left-6 w-16 sm:w-24 pointer-events-none z-10 opacity-70">
        <FlyingDove direction="right" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <MotionReveal direction="up" className="text-center mb-10">
          <p className="text-pink-800 uppercase tracking-[0.3em] text-xs font-semibold mb-2">
            Konfirmasi Kehadiran &amp; Doa
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-stone-900 mb-3">
            RSVP &amp; Ucapan Selamat
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed font-light">
            Bantu kami mempersiapkan jamuan terbaik dengan mengonfirmasi kehadiran Anda di bawah ini.
          </p>
          <RealisticHeaderGarland />
        </MotionReveal>

        {/* Live Attendance Stats Counter */}
        <MotionReveal direction="up" delay={0.1} className="mb-10">
          <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto text-center">
            <div className="bg-white/95 backdrop-blur-sm p-3.5 rounded-2xl border-2 border-emerald-200 shadow-md">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-emerald-700 tabular-nums">
                {totalHadir}
              </span>
              <p className="text-[10px] sm:text-xs uppercase tracking-wider text-stone-600 font-semibold mt-0.5">
                Pasti Hadir
              </p>
            </div>
            <div className="bg-white/95 backdrop-blur-sm p-3.5 rounded-2xl border-2 border-amber-200 shadow-md">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-700 tabular-nums">
                {totalRagu}
              </span>
              <p className="text-[10px] sm:text-xs uppercase tracking-wider text-stone-600 font-semibold mt-0.5">
                Masih Ragu
              </p>
            </div>
            <div className="bg-white/95 backdrop-blur-sm p-3.5 rounded-2xl border-2 border-stone-200 shadow-md">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-stone-600 tabular-nums">
                {totalAbsen}
              </span>
              <p className="text-[10px] sm:text-xs uppercase tracking-wider text-stone-600 font-semibold mt-0.5">
                Berhalangan
              </p>
            </div>
          </div>
        </MotionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* RSVP Form */}
          <MotionReveal direction="right" delay={0.15}>
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border-2 border-pink-200 shadow-xl shadow-pink-900/10 relative overflow-hidden">
              <h3 className="text-xl font-serif text-stone-900 font-semibold mb-6 flex items-center gap-2">
                <MessageSquareHeart className="w-5 h-5 text-pink-600" />
                <span>Kirim Konfirmasi &amp; Doa</span>
              </h3>

              {submitSuccess && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                  <span>Terima kasih! Doa dan konfirmasi kehadiran Anda telah tersimpan dengan indah.</span>
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Dimas Aditya & Keluarga"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none text-base sm:text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    Konfirmasi Kehadiran *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: "hadir", label: "Hadir" },
                      { val: "ragu", label: "Ragu" },
                      { val: "tidak_hadir", label: "Absen" },
                    ].map((option) => (
                      <button
                        type="button"
                        key={option.val}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            attendance: option.val as "hadir" | "tidak_hadir" | "ragu",
                          })
                        }
                        className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                          formData.attendance === option.val
                            ? "bg-pink-700 text-white border-pink-700 shadow-sm"
                            : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.attendance === "hadir" && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                      Jumlah Tamu Hadir
                    </label>
                    <select
                      value={formData.guests_count}
                      onChange={(e) =>
                        setFormData({ ...formData, guests_count: Number(e.target.value) })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none text-base sm:text-sm bg-white"
                    >
                      <option value={1}>1 Orang</option>
                      <option value={2}>2 Orang</option>
                      <option value={3}>3 Orang</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    Ucapan &amp; Doa Restu
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tuliskan ucapan atau doa restu hangat untuk kedua mempelai..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none text-base sm:text-sm transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-700 via-rose-700 to-pink-800 hover:from-pink-800 hover:to-pink-900 text-white text-xs font-bold tracking-wider uppercase shadow-md shadow-pink-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <span>Mengirim...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Kirim Konfirmasi &amp; Doa</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </MotionReveal>

          {/* Guestbook Wishes Stream with Tabs */}
          <MotionReveal direction="left" delay={0.2}>
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border-2 border-pink-200 shadow-xl shadow-pink-900/10 flex flex-col h-[520px] relative overflow-hidden">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-stone-100">
                <h3 className="text-xl font-serif text-stone-900 font-semibold">
                  Buku Tamu &amp; Doa
                </h3>
                <span className="text-xs px-3 py-1 rounded-full bg-pink-100 text-pink-900 font-semibold border border-pink-200">
                  {wishes.length} Doa Masuk
                </span>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 mb-4">
                {[
                  { key: "all", label: "Semua" },
                  { key: "hadir", label: "Hadir" },
                  { key: "tidak_hadir", label: "Absen" },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setFilter(t.key as "all" | "hadir" | "tidak_hadir")}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                      filter === t.key
                        ? "bg-pink-700 text-white"
                        : "bg-pink-50 text-stone-600 hover:bg-pink-100"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="overflow-y-auto space-y-3.5 pr-1 flex-1">
                {filteredWishes.length === 0 ? (
                  <div className="text-center py-16 text-stone-400 text-xs">
                    Tidak ada ucapan pada kategori ini.
                  </div>
                ) : (
                  filteredWishes.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-[#FFF5F7] border border-pink-100 text-left transition-all hover:bg-pink-50"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-pink-200 text-pink-900 font-bold text-xs flex items-center justify-center uppercase shrink-0">
                            {item.name.charAt(0)}
                          </div>
                          <span className="text-sm font-semibold text-stone-900 line-clamp-1 font-serif">
                            {item.name}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium shrink-0 flex items-center gap-1 ${
                            item.attendance === "hadir"
                              ? "bg-emerald-100 text-emerald-800"
                              : item.attendance === "tidak_hadir"
                              ? "bg-stone-200 text-stone-700"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {item.attendance === "hadir" && <CheckCircle2 className="w-3 h-3" />}
                          {item.attendance === "tidak_hadir" && <XCircle className="w-3 h-3" />}
                          {item.attendance === "ragu" && <HelpCircle className="w-3 h-3" />}
                          {item.attendance === "hadir"
                            ? "Hadir"
                            : item.attendance === "tidak_hadir"
                            ? "Absen"
                            : "Ragu"}
                        </span>
                      </div>
                      {item.message && (
                        <p className="text-xs text-stone-600 leading-relaxed break-words pl-10 font-serif">
                          {item.message}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}