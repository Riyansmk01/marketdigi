# Single Source of Truth (SSOT) - Marketdigi

Dokumen ini adalah referensi utama bagi AI Agent, developer, maintainer, dan contributor dalam memahami, memelihara, serta mengembangkan project **Marketdigi**. Semua perubahan harus merujuk pada dokumen ini.

---

## 1. Ringkasan Project
- **Nama project**: Marketdigi
- **Tujuan project**: Membangun marketplace produk digital yang premium, estetis, dan modern, dengan fitur multi-tenant untuk storefront seller (berbasis subdomain) dan marketplace root publik.
- **Fungsi utama**: Discovery produk (pencarian, kategori, flash sale), transaksi produk digital (berbagai tipe fulfillment seperti Akun Digital, Link Akses, OTP Service), checkout spesifik seller, manajemen pesanan & after-sales (garansi, komplain), dan operasional Seller Center.
- **Gambaran umum sistem**: Terdiri dari marketplace publik (`marketdigi.id`), storefront seller (`[seller].marketdigi.id`), dan area operasional seller (`dashboard.marketdigi.id`). Auth dipusatkan namun operasional order di-route ke storefront masing-masing seller untuk sinkronisasi stok.

## 2. Arsitektur Sistem
- **Komponen utama**: Frontend berbasis Next.js (SSR/ISR hybrid) yang melayani root marketplace, seller storefront, dan dashboard. Backend berupa core commerce API.
- **Hubungan antar komponen**:
  - Edge routing menangani wildcard subdomain.
  - Core API (Auth, Catalog, Cart, Order, After-sales) dihubungkan ke database relasional utama.
- **Dependency utama**: Next.js, Node.js (direncanakan), PostgreSQL (Database Relasional Utama), Redis (Cache), Object Storage (Aset & Gambar).
- **Integrasi eksternal**: Sistem notifikasi via Telegram/WhatsApp (terutama untuk support buyer/seller) dan Email. Payment Gateway (QRIS/Bank/E-wallet).

## 3. Struktur Folder dan File (Next.js)
*(Struktur level produksi dengan arsitektur modular)*
- `src/app/` : App Router Next.js (Root marketplace).
  - `src/app/page.tsx` : Halaman beranda dengan komponen modular.
  - `src/app/layout.tsx` : Root layout dengan pengaturan Metadata SEO (OpenGraph dinamis).
  - `src/app/globals.css` : Design System (Variabel CSS, Custom Scrollbar, Skeleton/Shimmer Loading).
- `src/components/` : Atomic UI Components.
  - `src/components/ui/` : Komponen generik seperti `Button`, `Input`, `Badge`.
  - `src/components/layout/` : Komponen kerangka halaman seperti `Navbar`, `Footer`.
  - `src/components/product/` : Komponen spesifik fitur seperti `ProductCard`.
- `src/config/` : Konfigurasi terpusat.
  - `src/config/site.ts` : Variabel situs, link statis, dan struktur navigasi.
- `src/types/` : Definisi tipe data TypeScript.
  - `src/types/index.ts` : Tipe `Product`, `User`, `CartItem`, dll.
- `src/lib/` : Utility functions (akan ditambahkan sesuai kebutuhan).
- `public/` : Aset statis.

## 4. Flow Sistem
- **Input**: User mencari produk, login email-first, checkout keranjang, dan interaksi dashboard seller.
- **Proses**: API memvalidasi auth, stok, payment intent, lalu membuat record pesanan dan item.
- **Output**: Invoice pembayaran, status pesanan real-time, dan fulfillment produk digital.
- **Error flow**: `400` payload tidak valid, `401` unauthorized, `409` stok habis/tidak sinkron, `422` verifikasi WhatsApp tertunda, `429` rate limiting.
- **Recovery flow**: Empty state informatif dengan CTA (misal: "Jelajahi produk" jika keranjang kosong). Retrying mekanisme untuk pembayaran yang gagal/pending.

## 5. Penyimpanan Data
- **Database**: PostgreSQL (Relasional) untuk `users`, `stores`, `products`, `orders`, `reviews`, `disputes`.
- **File storage**: Object Storage/CDN untuk gambar produk, banner, avatar.
- **Cache**: Redis untuk katalog populer, session login, dan rate-limiting.
- **Session**: Terpusat pada identity layer untuk memfasilitasi SSO lintas subdomain (Marketplace & Dashboard).
- **Struktur data penting**: Produk memiliki field `fulfillment_type` (Akun, Link, OTP) dan `custom_fields` (contoh: username sosmed user).

## 6. Integrasi Eksternal
- **API**: Payment orchestrator, WhatsApp API untuk verifikasi seller, Telegram API untuk support.
- **Service pihak ketiga**: Cloudflare (Edge/CDN/Wildcard DNS).
- **Format komunikasi**: RESTful JSON/GraphQL.
- **Penanganan error**: Timeout handling dengan retry pattern untuk notifikasi dan payment webhook. Idempotency key diimplementasikan di semua webhook callback.

## 7. Logging dan Monitoring
- **Lokasi log**: Standar output (stdout) yang diagregasi oleh cloud provider / ELK stack.
- **Format log**: JSON terstruktur dengan context (Trace ID, User ID, Store ID, Action).
- **Log penting yang wajib dipertahankan**: Event pembayaran, perubahan stok, status pesanan (`Proses`, `Berhasil`, `Garansi Aktif`, `Dikomplain`), dan verifikasi seller.

## 8. Error Handling
- **Jenis error**: Validation Error, Authentication Error, Business Logic Error (Stok habis), Network Timeout.
- **Retry mechanism**: Exponential backoff pada HTTP request ke external API.
- **Timeout**: Set di level load balancer dan database (statement timeout max 10s).
- **Recovery process**: Tampilkan pesan ramah pengguna (bukan trace stack) dan log internal error di monitoring system.

## 9. Keamanan
- **Validasi input**: Semua input divalidasi dan di-sanitize (cegah XSS, SQLi). Custom input pada produk dikontrol tipenya.
- **Manajemen credential**: Menggunakan `.env` yang tidak dicommit. Secret dienkripsi.
- **Token handling**: HttpOnly Secure Cookies untuk JWT/Session ID. SameSite=Lax/Strict.
- **Hak akses**: Role-Based Access Control (Buyer, Seller, Support, Admin). Setiap mutasi resource divalidasi kepemilikannya (Store-aware authorization).

## 10. Deployment
- **Cara menjalankan project**: `npm run dev` untuk lokal, `npm run build` && `npm run start` untuk production.
- **Dependency**: Ditentukan di `package.json`. Node.js 18+.
- **Environment variable**: Diwajibkan mensetup `.env.local` berdasarkan template.
- **Proses update**: CI/CD pipeline (Test -> Build -> Deploy). Zero-downtime deployment.
- **Proses rollback**: Mengembalikan Git commit sebelumnya dan trigger ulang pipeline.

## 11. Checklist Sebelum Perubahan
- [ ] Pahami struktur folder terkait.
- [ ] Pahami flow dan arsitektur bisnis dari komponen yang akan diubah.
- [ ] Pastikan perubahan tidak merusak fungsi/layanan eksisting.
- [ ] Verifikasi format `.env` jika ada tambahan config.

## 12. Checklist Setelah Perubahan
- [ ] Lakukan pengujian manual (test UI/UX).
- [ ] Pastikan responsivitas, konsistensi warna (Design System), dan accessibility (A11y).
- [ ] Review Console log bebas dari error/warning.
- [ ] Perbarui SSOT ini jika terdapat penambahan fitur signifikan (arsitektur, struktur file, database).

## 13. Format Laporan Perubahan
Setiap kali AI Agent atau developer membuat PR/commit besar, cantumkan format:
* **Perubahan**: [Deskripsi singkat]
* **Alasan**: [Kenapa dirubah?]
* **Dampak**: [Komponen mana yang terpengaruh?]
* **Risiko**: [Apa yang mungkin rusak?]
* **Validasi**: [Cara testing]
* **Rollback**: [Cara undo]

## 14. Known Issues
- *(Belum ada isu signifikan. Tahap inisialisasi awal.)*

## 15. Technical Debt
- *(Belum ada hutang teknis. Semua fungsionalitas diimplementasikan dari awal.)*

## 16. Catatan Untuk AI Agent Berikutnya
- Prioritaskan stabilitas, UI premium, dan UX modern.
- Selalu konsultasi dokumen ini sebelum melakukan refactor besar atau memanipulasi flow pembayaran/checkout.
- Jika ada ragu antara implementasi versus referensi desain (Marketku), tanyakan pada User dan jangan berasumsi buta.
- Modifikasi arsitektur wajib diperbarui di dokumen `SSOT.md` ini.

---
**Prioritas Utama**
1. Jangan merusak flow yang sudah berjalan.
2. Jangan mengubah struktur tanpa alasan kuat.
3. Jangan membuat asumsi tanpa bukti dari kode.
4. Dokumentasikan semua keputusan penting.
5. Jika terdapat keraguan, tandai sebagai "Perlu Konfirmasi" dan jangan menebak.
6. SSOT harus selalu diperbarui ketika terjadi perubahan signifikan pada sistem.
