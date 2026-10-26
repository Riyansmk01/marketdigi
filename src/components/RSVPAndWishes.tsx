"use client";

import React, { useState, useEffect } from "react";
import MotionReveal from "@/components/ui/MotionReveal";
import { Send, CheckCircle2, XCircle, HelpCircle, MessageSquareHeart } from "lucide-react";
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
];

export default function RSVPAndWishes() {
  const [wishes, setWishes] = useState<WishRecord[]>(initialSampleWishes);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMessage("Mohon masukkan nama Anda.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const newEntry: RSVPRecord = {
        name: formData.name.trim(),
        attendance: formData.attendance,
        guests_count: Number(formData.guests_count),
        message: formData.message.trim(),
      };

      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from("rsvps")
          .insert([newEntry])
          .select();

        if (error) throw error;

        if (data && data[0]) {
          setWishes((prev) => [data[0] as WishRecord, ...prev]);
        }
      } else {
        // Fallback local mock state
        const mockCreated: WishRecord = {
          id: String(Date.now()),
          name: newEntry.name,
          attendance: newEntry.attendance,
          message: newEntry.message || "",
          created_at: new Date().toISOString(),
        };
        const updated = [mockCreated, ...wishes];
        setWishes(updated);
        localStorage.setItem("wedding_wishes_backup", JSON.stringify(updated));
      }

      // Trigger Celebration Confetti!
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#D4AF37", "#10B981", "#F59E0B", "#F43F5E"],
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
    <section id="rsvp" className="py-24 px-4 md:px-8 bg-stone-100/60 relative">
      <div className="max-w-4xl mx-auto">
        <MotionReveal direction="up" className="text-center mb-14">
          <p className="text-amber-700 uppercase tracking-[0.3em] text-xs font-semibold mb-2">
            Konfirmasi Kehadiran &amp; Doa
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-stone-900 mb-3">
            RSVP &amp; Ucapan Selamat
          </h2>
          <p className="text-stone-600 text-sm max-w-lg mx-auto">
            Bantu kami mempersiapkan jamuan terbaik dengan mengonfirmasi kehadiran Anda di bawah ini.
          </p>
        </MotionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* RSVP Form */}
          <MotionReveal direction="right" delay={0.1}>
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-amber-200/80 shadow-lg shadow-stone-900/5">
              <h3 className="text-xl font-serif text-stone-900 font-semibold mb-6 flex items-center gap-2">
                <MessageSquareHeart className="w-5 h-5 text-amber-600" />
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
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm transition-all"
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
                            ? "bg-amber-600 text-white border-amber-600 shadow-sm"
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
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm bg-white"
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
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-semibold tracking-wider uppercase shadow-md shadow-amber-900/15 transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
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

          {/* Guestbook Wishes Stream */}
          <MotionReveal direction="left" delay={0.2}>
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-amber-200/80 shadow-lg shadow-stone-900/5 flex flex-col h-[520px]">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
                <h3 className="text-xl font-serif text-stone-900 font-semibold">
                  Buku Tamu &amp; Doa
                </h3>
                <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-medium">
                  {wishes.length} Ucapan
                </span>
              </div>

              <div className="overflow-y-auto space-y-4 pr-1 flex-1">
                {wishes.length === 0 ? (
                  <div className="text-center py-16 text-stone-400 text-sm">
                    Belum ada ucapan. Jadilah yang pertama memberikan doa restu!
                  </div>
                ) : (
                  wishes.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-[#FAF7F2] border border-amber-100/90 text-left transition-all hover:bg-amber-50/60"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center uppercase shrink-0">
                            {item.name.charAt(0)}
                          </div>
                          <span className="text-sm font-semibold text-stone-900 line-clamp-1">
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
                        <p className="text-xs text-stone-600 leading-relaxed break-words pl-10">
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
