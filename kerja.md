# Instruksi Pembuatan Single Source of Truth (SSOT)

Buatkan Single Source of Truth (SSOT) yang lengkap dan detail untuk project ini berdasarkan kondisi kode dan struktur yang ada saat ini.

## Tujuan

SSOT ini akan menjadi referensi utama bagi AI Agent, developer, maintainer, dan contributor dalam memahami, memelihara, serta mengembangkan project.

Tujuan utama SSOT adalah:

* Menjaga konsistensi pengembangan.
* Mencegah perubahan yang merusak sistem yang sudah berjalan.
* Mengurangi asumsi yang tidak berdasarkan fakta.
* Menjadikan dokumentasi sebagai sumber kebenaran utama project.

---

## Aturan Wajib Untuk AI Agent

### Bahasa

* Seluruh komunikasi, analisis, dokumentasi, laporan, dan penjelasan wajib menggunakan Bahasa Indonesia.
* Nama file, fungsi, class, variabel, API, database, dan identifier lain yang sudah ada tidak boleh diterjemahkan atau diganti tanpa alasan yang jelas.
* Istilah teknis boleh menggunakan Bahasa Inggris jika merupakan istilah standar industri.

### Prinsip Kerja

Sebelum melakukan perubahan:

1. Pahami struktur project terlebih dahulu.
2. Pahami flow bisnis yang sudah berjalan.
3. Pahami hubungan antar modul.
4. Identifikasi dampak perubahan.
5. Dokumentasikan seluruh temuan penting.

AI Agent wajib mengutamakan:

* Stabilitas sistem.
* Keterbacaan kode.
* Kompatibilitas dengan implementasi yang sudah ada.
* Dokumentasi yang jelas.

---

## Larangan

AI Agent tidak boleh:

* Mengubah arsitektur tanpa alasan yang kuat.
* Mengubah flow utama tanpa analisis dampak.
* Menghapus fitur tanpa justifikasi.
* Menghapus logging penting.
* Menghapus validasi penting.
* Mengubah format data tanpa dokumentasi.
* Melakukan refactor besar hanya karena preferensi pribadi.
* Membuat asumsi terhadap behavior sistem yang belum dipastikan.

---

## Aturan Perubahan

Jika perubahan diperlukan, AI Agent wajib menjelaskan:

### Perubahan

Apa yang diubah.

### Alasan

Mengapa perubahan diperlukan.

### Dampak

Bagian sistem yang terdampak.

### Risiko

Potensi masalah yang dapat muncul.

### Validasi

Cara memastikan perubahan berjalan dengan benar.

### Rollback

Cara mengembalikan sistem ke kondisi sebelumnya.

---

## Struktur SSOT Yang Wajib Dibuat

### 1. Ringkasan Project

* Nama project
* Tujuan project
* Fungsi utama
* Gambaran umum sistem

### 2. Arsitektur Sistem

* Komponen utama
* Hubungan antar komponen
* Dependency utama
* Integrasi eksternal

### 3. Struktur Folder dan File

Untuk setiap folder dan file:

* Fungsi
* Tanggung jawab
* Ketergantungan
* Catatan penting

### 4. Flow Sistem

* Input
* Proses
* Output
* Error flow
* Recovery flow

### 5. Penyimpanan Data

* Database
* File storage
* Cache
* Session
* Struktur data penting

### 6. Integrasi Eksternal

* API
* Service pihak ketiga
* Format komunikasi
* Penanganan error

### 7. Logging dan Monitoring

* Lokasi log
* Format log
* Log penting yang wajib dipertahankan

### 8. Error Handling

* Jenis error
* Retry mechanism
* Timeout
* Recovery process

### 9. Keamanan

* Validasi input
* Manajemen credential
* Token handling
* Hak akses

### 10. Deployment

* Cara menjalankan project
* Dependency
* Environment variable
* Proses update
* Proses rollback

### 11. Checklist Sebelum Perubahan

### 12. Checklist Setelah Perubahan

### 13. Format Laporan Perubahan

### 14. Known Issues

### 15. Technical Debt

### 16. Catatan Untuk AI Agent Berikutnya

---

## Prioritas Utama

1. Jangan merusak flow yang sudah berjalan.
2. Jangan mengubah struktur tanpa alasan kuat.
3. Jangan membuat asumsi tanpa bukti dari kode.
4. Dokumentasikan semua keputusan penting.
5. Jika terdapat keraguan, tandai sebagai "Perlu Konfirmasi" dan jangan menebak.
6. SSOT harus selalu diperbarui ketika terjadi perubahan signifikan pada sistem.

## Aturan Final

Jika terjadi konflik antara:

* Kode program
* Dokumentasi
* SSOT

Maka AI Agent wajib:

1. Mengidentifikasi konflik.
2. Menjelaskan konflik tersebut.
3. Memberikan rekomendasi.
4. Meminta konfirmasi sebelum melakukan perubahan yang berisiko.