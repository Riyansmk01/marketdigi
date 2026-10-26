# 💍 Wedding Web - Katsudoto Edition (Next.js, Three.js & Supabase)

Web undangan pernikahan modern yang mereplikasi estetika dan fitur unggulan dari **[Katsudoto.id](https://katsudoto.id)**, digabungkan dengan visual interaktif 3D (*Three.js*) serta backend *real-time* (*Supabase*).

---

## 🌟 Fitur Khas Katsudoto yang Sudah Diimplementasikan

1. **Cover Amplop & Segel Lilin (*Wax Seal Cover*)**
   - Animasi amplop vintage dengan segel lilin timbul monogram (*Wax Seal Stamp* `R & D`).
   - Sapaan nama tamu personal secara otomatis melalui parameter URL (`?to=Nama+Tamu`).
   - Transisi buka amplop mulus sekaligus mengaktifkan musik latar otomatis.

2. **E-Invitation Pass & QR Code Check-In (Fitur Juara Katsudoto)**
   - Setiap tamu otomatis memiliki kartu pass undangan digital unik (*Official Guest Pass*).
   - Menghasilkan **QR Code asli** (`qrcode.react`) untuk *check-in* cepat di lokasi acara oleh petugas penerima tamu (*usher*).
   - Menampilkan kode verifikasi unik, sesi acara, serta kuota kursi tamu.

3. **Floating Bottom Dock Navigation (Navigasi Khas Katsudoto)**
   - Navigasi melayang di bagian bawah layar (*mobile-friendly dock*) dengan deteksi posisi scroll otomatis:
     - 🏠 Cover
     - 💑 Mempelai
     - 📅 Acara
     - 🎟️ E-Pass
     - 🖼️ Galeri
     - 💌 RSVP & Doa
     - 🎁 Kado

4. **Smart WhatsApp Invitation Share Tool**
   - Tombol mengambang di pojok kiri bawah khusus untuk mempelai membagikan undangan.
   - Masukkan nama tamu dan nomor WhatsApp, sistem akan otomatis meracik pesan undangan santun lengkap dengan tautan personal `?to=...`, dan membuka aplikasi WhatsApp dalam satu klik.

5. **Visual 3D Interaktif (Three.js / React Three Fiber)**
   - Sepasang cincin emas pernikahan 3D dengan permata solitaire yang dapat disentuh dan diputar oleh tamu undangan.

6. **Panduan Tamu & Rekomendasi Dress Code**
   - Pilihan palet warna pakaian (*Champagne, Terracotta, Sage Green, Deep Mocha*) agar busana tamu selaras dengan dekorasi acara.

7. **Siaran Langsung Acara (Live Streaming)**
   - Akses siaran langsung YouTube untuk keluarga atau rekan yang berada di luar kota/luar negeri.

8. **RSVP & Live Guestbook (Supabase)**
   - Konfirmasi kehadiran dan ucapan doa restu yang tersimpan langsung ke database Supabase (dengan cadangan *localStorage*).

9. **Amplop Digital (Cashless Angpao)**
   - Salin nomor rekening BCA & Mandiri dalam satu klik serta alamat pengiriman kado fisik.

---

## 🚀 Cara Menjalankan Project

```bash
# 1. Jalankan server lokal
npm run dev
```

Buka di browser:
* Halaman Umum: **[http://localhost:3000](http://localhost:3000)**
* Undangan Personal Tamu: **[http://localhost:3000/?to=Bapak+Budi+Santoso+%26+Keluarga](http://localhost:3000/?to=Bapak+Budi+Santoso+%26+Keluarga)**

---

## 💾 Menghubungkan Supabase (Opsional)

1. Buat project di [Supabase.com](https://supabase.com).
2. Salin isi skrip SQL dari [`supabase/schema.sql`](supabase/schema.sql) dan jalankan di **SQL Editor** Supabase.
3. Buat file `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh......
   ```
4. Restart dev server (`npm run dev`).
